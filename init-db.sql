-- Database initialization script for Dehadi.co.in
-- This script runs when the PostgreSQL container is first created

-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone to IST (India Standard Time)
SET timezone = 'Asia/Kolkata';

-- Note: Tables will be created by Drizzle ORM migrations
-- This file is for extensions and initial configuration only
