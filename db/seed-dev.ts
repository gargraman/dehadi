import { db } from '../server/db';
import { users, jobs, payments } from '../shared/schema';
import { generateWorkers, generateEmployers, generateJobs, generatePayments } from './seed-data';
import { sql } from 'drizzle-orm';

// Larger dataset for development
export async function seedDevData() {
  console.log('Seeding development database...');
  
  // Clean existing data
  console.log('Cleaning existing data...');
  await db.delete(payments);
  await db.delete(jobs);
  await db.delete(users);
  
  // Generate and insert workers
  const workerData = generateWorkers(20);
  const insertedWorkers = await db.insert(users).values(workerData).returning();
  console.log(`✓ Inserted ${insertedWorkers.length} workers`);
  
  // Generate and insert employers
  const employerData = generateEmployers(10);
  const insertedEmployers = await db.insert(users).values(employerData).returning();
  console.log(`✓ Inserted ${insertedEmployers.length} employers`);
  
  // Generate and insert jobs
  const employerIds = insertedEmployers.map(e => e.id);
  const jobData = generateJobs(30, employerIds);
  const insertedJobs = await db.insert(jobs).values(jobData).returning();
  console.log(`✓ Inserted ${insertedJobs.length} jobs`);
  
  // Generate and insert payments
  const workerIds = insertedWorkers.map(w => w.id);
  const jobIds = insertedJobs.map(j => j.id);
  const paymentData = generatePayments(15, jobIds, employerIds, workerIds);
  const insertedPayments = await db.insert(payments).values(paymentData).returning();
  console.log(`✓ Inserted ${insertedPayments.length} payments`);
  
  console.log('✓ Development database seeded successfully');
  console.log(`
Summary:
- Workers: ${insertedWorkers.length}
- Employers: ${insertedEmployers.length}
- Jobs: ${insertedJobs.length}
- Payments: ${insertedPayments.length}
  `);
  
  return {
    workers: insertedWorkers,
    employers: insertedEmployers,
    jobs: insertedJobs,
    payments: insertedPayments
  };
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDevData()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
