-- Migration script to update users table for Replit Auth compatibility

-- First, create a backup of the existing users table (safety measure)
CREATE TABLE users_backup AS SELECT * FROM users;

-- Add new columns needed for Replit Auth
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR;

-- Make columns nullable that should be optional with Replit Auth
ALTER TABLE users ALTER COLUMN name DROP NOT NULL;
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Create sessions table if it doesn't exist (for connect-pg-simple)
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);