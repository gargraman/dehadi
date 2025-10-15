-- ============================================================================
-- HireConnect - PostgreSQL Database Initialization
-- ============================================================================
-- This script runs automatically when PostgreSQL container first starts
-- It sets up the database with required extensions and configurations
-- ============================================================================

-- Enable required PostgreSQL extensions
-- These are commonly used extensions for web applications

-- UUID support for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Case-insensitive text support
CREATE EXTENSION IF NOT EXISTS "citext";

-- PostGIS for geospatial queries (if needed for location-based features)
-- Uncomment if you need geospatial functionality
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- pg_trgm for fuzzy text search and similarity matching
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ----------------------------------------------------------------------------
-- Create test database (for running tests in isolation)
-- ----------------------------------------------------------------------------
SELECT 'CREATE DATABASE dehadi_db_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dehadi_db_test')\gexec

-- Grant permissions to the dehadi user
GRANT ALL PRIVILEGES ON DATABASE dehadi_db_test TO dehadi;

-- ----------------------------------------------------------------------------
-- Performance Tuning for Development
-- ----------------------------------------------------------------------------
-- These settings are optimized for local development
-- Adjust for production based on your hardware and requirements

-- Increase shared memory (helps with query performance)
-- ALTER SYSTEM SET shared_buffers = '256MB';

-- Increase work memory (helps with sorting and joins)
-- ALTER SYSTEM SET work_mem = '16MB';

-- Increase maintenance work memory (helps with vacuum, index creation)
-- ALTER SYSTEM SET maintenance_work_mem = '128MB';

-- Enable query logging for debugging (disable in production)
-- ALTER SYSTEM SET log_statement = 'all';
-- ALTER SYSTEM SET log_duration = 'on';

-- ----------------------------------------------------------------------------
-- Helpful Functions for Development
-- ----------------------------------------------------------------------------

-- Function to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ----------------------------------------------------------------------------
-- Database Initialization Complete
-- ----------------------------------------------------------------------------

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE '✓ Database initialization complete';
    RAISE NOTICE '✓ Extensions enabled: uuid-ossp, citext, pg_trgm';
    RAISE NOTICE '✓ Test database created: dehadi_db_test';
    RAISE NOTICE '✓ Ready for Drizzle ORM migrations';
END $$;
