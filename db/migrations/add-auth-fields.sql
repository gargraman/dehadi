-- Migration: Add authentication fields to users table
-- This migration renames password to password_hash and adds fullName and phone fields

-- Step 1: Add new columns (allow null initially)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Step 2: Migrate data from password to password_hash (if password exists)
UPDATE users SET password_hash = password WHERE password_hash IS NULL AND password IS NOT NULL;

-- Step 3: Set default values for new fields (for existing records)
UPDATE users SET full_name = username WHERE full_name IS NULL;
UPDATE users SET phone = '0000000000' WHERE phone IS NULL;

-- Step 4: Make new columns NOT NULL
ALTER TABLE users
ALTER COLUMN password_hash SET NOT NULL,
ALTER COLUMN full_name SET NOT NULL,
ALTER COLUMN phone SET NOT NULL;

-- Step 5: Drop old password column (if it exists)
ALTER TABLE users DROP COLUMN IF EXISTS password;

-- Step 6: Create session table for express-session
CREATE TABLE IF NOT EXISTS "session" (
  "sid" VARCHAR NOT NULL COLLATE "default",
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- Create index on expire column for cleanup queries
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- Display migration results
SELECT 'Migration completed successfully' AS status;
SELECT COUNT(*) as user_count FROM users;
