const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// CAST VOTE ROUTE
router.post('/cast', async (req, res) => {
  // Support both old format (userId, candidateId, position) and new format (userId, electionId, encryptedVote)
  const { userId, candidateId, position, electionId, encryptedVote } = req.body;

  try {
    let actualCandidateId = candidateId;
    let actualPosition = position;

    // If using new format (electionId), we need to find the candidate
    if (electionId && !candidateId) {
      // Find the candidate by election and encrypted vote data
      // For now, we'll need candidateId from the client - this needs to be fixed in the client
      return res.status(400).json({ error: "candidateId is required" });
    }

    // If we have electionId, we should fetch the position from the election
    if (electionId && !position) {
      const { data: election, error: electionError } = await supabase
        .from('elections')
        .select('title')
        .eq('id', electionId)
        .single();

      if (electionError) throw electionError;
      actualPosition = election.title;
    }

    // 1. Try to record the vote in the 'votes' table
    // The database has a rule: "One User, One Vote per Position/Election"
    // If they already voted, this will fail automatically.
    const voteData = {
      voter_id: userId,
      candidate_id: actualCandidateId,
      position: actualPosition || electionId
    };

    const { data, error: voteError } = await supabase
      .from('votes')
      .insert([voteData]);

    // If error says "duplicate key", it means they already voted
    if (voteError) {
      if (voteError.code === '23505') { // Postgres code for duplicate
        return res.status(400).json({ error: "You have already voted for this position!" });
      }
      throw voteError;
    }

    // 2. If vote was successful, increase the Candidate's vote count
    // Fetch current count
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('vote_count')
      .eq('id', actualCandidateId)
      .single();

    if (candidateError) {
      console.error('Error fetching candidate:', candidateError);
      // Don't fail the vote if we can't update count, but log it
    } else {
      // Update count
      const newCount = (candidate.vote_count || 0) + 1;
      
      await supabase
        .from('candidates')
        .update({ vote_count: newCount })
        .eq('id', actualCandidateId);
    }

    res.status(200).json({ message: "Vote cast successfully!" });

  } catch (err) {
    console.error('Vote casting error:', err);
    res.status(500).json({ error: "Server Error casting vote: " + err.message });
  }
});

// GET VOTE RESULTS FOR AN ELECTION
router.get('/results/:electionId', async (req, res) => {
  const { electionId } = req.params;

  try {
    // Get the election
    const { data: election, error: electionError } = await supabase
      .from('elections')
      .select('*')
      .eq('id', electionId)
      .single();

    if (electionError) {
      return res.status(404).json({ error: 'Election not found' });
    }

    // Get all candidates for this election
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select(`
        *,
        profiles:user_id ( username, flat_number )
      `)
      .eq('election_id', electionId)
      .eq('status', 'approved');

    if (candidatesError) throw candidatesError;

    // Build results object in format expected by client: { "Candidate Name": voteCount }
    const results = {};
    
    candidates.forEach(candidate => {
      const candidateName = candidate.profiles?.username || 'Unknown';
      results[candidateName] = candidate.vote_count || 0;
    });

    res.json(results);

  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;