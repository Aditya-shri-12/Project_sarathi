# Test Utilities for Supabase

These test scripts help you test your API endpoints after switching to Supabase. They are **NOT required** for your application to run - they're just helpful utilities.

## Prerequisites

1. Make sure your server is running: `npm start` (or `nodemon index.js`)
2. Make sure your `.env` file has the correct Supabase credentials
3. These scripts use Node.js `fetch()` - requires Node.js 18+ (or install `node-fetch` for older versions)

## Available Test Scripts

### 1. `test-register.js`
Test user registration endpoint.
```bash
node test-register.js
```
- Creates a new user in Supabase
- Tests `/api/auth/register` endpoint

### 2. `test-login.js`
Test user login endpoint.
```bash
node test-login.js
```
- Logs in with email and password
- Tests `/api/auth/login` endpoint
- **Update the email/password in the file** before running

### 3. `test-admin-login.js`
Test admin login endpoint.
```bash
node test-admin-login.js
```
- Logs in as admin (requires admin role in database)
- Tests `/api/auth/admin-login` endpoint
- **Update the email/password in the file** before running

### 4. `test-signup-flow.js`
Test complete signup and login flow.
```bash
node test-signup-flow.js
```
- Registers a new user
- Immediately tries to log in
- Good for testing the complete authentication flow

### 5. `test-create-election.js`
Test election creation.
```bash
node test-create-election.js
```
- Creates a new election with candidates
- Tests `/api/elections/create` endpoint
- Returns election ID for use in other tests

### 6. `test-get-elections.js`
Get all elections from database.
```bash
node test-get-elections.js
```
- Fetches all elections
- Tests `/api/elections/all` endpoint
- **Use this to get election IDs** for other tests

### 7. `test-cast-vote.js`
Test voting functionality.
```bash
node test-cast-vote.js
```
- Casts a vote for a candidate
- Tests `/api/vote/cast` endpoint
- **Update the UUIDs in the file** before running:
  1. Run `test-get-elections.js` to get election IDs
  2. Check Supabase dashboard for candidate and user IDs
  3. Update the variables in the file

### 8. `test-get-results.js`
Get vote results for an election.
```bash
node test-get-results.js
```
- Fetches vote results for a specific election
- Tests `/api/vote/results/:electionId` endpoint
- **Update the election ID** in the file before running

## Quick Test Flow

1. **Register a user:**
   ```bash
   node test-register.js
   ```

2. **Get elections:**
   ```bash
   node test-get-elections.js
   ```

3. **Create an election:**
   ```bash
   node test-create-election.js
   ```

4. **Cast a vote** (update IDs first):
   ```bash
   node test-cast-vote.js
   ```

5. **View results** (update election ID first):
   ```bash
   node test-get-results.js
   ```

## Important Notes

- ⚠️ These scripts use **UUIDs** (not MongoDB ObjectIds) since you're using Supabase
- 📧 Login uses **email** (not username) - this is how Supabase Auth works
- 🔐 Make sure your `.env` file has correct Supabase credentials
- 🗑️ These files are safe to delete - they don't affect your running application

## Troubleshooting

**Error: "fetch is not defined"**
- You need Node.js 18+ or install `node-fetch`: `npm install node-fetch`
- Then add `const fetch = require('node-fetch')` at the top of test files

**Error: "Invalid credentials"**
- Check that the user exists in Supabase
- Verify email/password are correct
- For admin login, ensure user has `role = 'admin'` in profiles table

**Error: "Election not found"**
- Make sure you're using correct UUID format
- Run `test-get-elections.js` to see valid election IDs

