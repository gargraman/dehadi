// Database client configuration supporting both Replit's built-in Postgres and Supabase
import * as schema from "@shared/schema";
import { drizzle } from 'drizzle-orm/node-postgres';
import { createRequire } from 'module';

// Prefer Supabase if configured, otherwise fall back to Replit's built-in database
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  const errorMsg = `No database connection configured.

To fix this, either:
1. Configure Supabase: Add SUPABASE_DATABASE_URL to your secrets
2. Use Replit's built-in database: Click Tools > Database > Add Database

The DATABASE_URL or SUPABASE_DATABASE_URL will be used to connect.`;
  
  console.error(errorMsg);
  throw new Error("Database URL must be set. Did you forget to configure a database?");
}

// Detect which database we're connecting to for logging
const isSupabase = databaseUrl.includes('supabase.co');
const dbProvider = isSupabase ? 'Supabase' : 'Replit/Local';

let pool: any;
let db: any;

async function init() {
  const require = createRequire(import.meta.url);
  const pgMod: any = require('pg');
  const PoolCtor = pgMod.Pool;
  if (!PoolCtor) throw new Error('pg Pool export not found');
  
  // Supabase requires SSL for connections
  const poolConfig: any = {
    connectionString: databaseUrl,
  };
  
  // Add SSL configuration for Supabase (required) or other cloud providers
  if (isSupabase || databaseUrl.includes('neon.tech')) {
    poolConfig.ssl = {
      rejectUnauthorized: false // Required for Supabase connection
    };
  }
  
  pool = new PoolCtor(poolConfig);
  db = drizzle(pool, { schema });
  
  console.log(`Database connected: ${dbProvider}`);
}

export const ready = init();
export { pool, db };
