-- SQL script to create the enquiries table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name TEXT NOT NULL,
  committee_head TEXT NOT NULL,
  city TEXT,
  state TEXT,
  contact_number TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries(email);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);

-- Add a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON enquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE enquiries IS 'Stores organization enquiry submissions';
COMMENT ON COLUMN enquiries.status IS 'Status: pending, contacted, approved, or rejected';

