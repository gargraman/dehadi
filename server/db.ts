// Dynamic database client selection: use native pg driver for local Postgres (docker),
// fall back to Neon serverless driver only if the URL appears to target Neon.
import * as schema from "@shared/schema";
import { drizzle } from 'drizzle-orm/node-postgres';
import { createRequire } from 'module';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

// Direct pg Pool usage suits local dockerized Postgres; Neon/serverless can be added later if needed.
let pool: any;
let db: any;

async function init() {
  // Use createRequire to load CommonJS pg inside ESM context reliably
  const require = createRequire(import.meta.url);
  const pgMod: any = require('pg');
  const PoolCtor = pgMod.Pool;
  if (!PoolCtor) throw new Error('pg Pool export not found');
  pool = new PoolCtor({ connectionString: databaseUrl });
  db = drizzle(pool, { schema });
}

export const ready = init();
export { pool, db };
