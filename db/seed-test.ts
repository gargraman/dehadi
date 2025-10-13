import { testDb, cleanupDatabase, closeDatabase } from '../tests/setup/test-db';
import { users, jobs, payments } from '../shared/schema';
import { generateWorkers, generateEmployers, generateJobs, generatePayments } from './seed-data';

// Small dataset for fast tests
export async function seedTestData() {
  console.log('Seeding test database...');
  
  // Clean existing data
  await cleanupDatabase();
  
  // Generate and insert workers
  const workerData = generateWorkers(5);
  const insertedWorkers = await testDb.insert(users).values(workerData).returning();
  console.log(`✓ Inserted ${insertedWorkers.length} workers`);
  
  // Generate and insert employers
  const employerData = generateEmployers(3);
  const insertedEmployers = await testDb.insert(users).values(employerData).returning();
  console.log(`✓ Inserted ${insertedEmployers.length} employers`);
  
  // Generate and insert jobs
  const employerIds = insertedEmployers.map(e => e.id);
  const jobData = generateJobs(10, employerIds);
  const insertedJobs = await testDb.insert(jobs).values(jobData).returning();
  console.log(`✓ Inserted ${insertedJobs.length} jobs`);
  
  // Generate and insert payments
  const workerIds = insertedWorkers.map(w => w.id);
  const jobIds = insertedJobs.map(j => j.id);
  const paymentData = generatePayments(5, jobIds, employerIds, workerIds);
  const insertedPayments = await testDb.insert(payments).values(paymentData).returning();
  console.log(`✓ Inserted ${insertedPayments.length} payments`);
  
  console.log('✓ Test database seeded successfully');
  
  return {
    workers: insertedWorkers,
    employers: insertedEmployers,
    jobs: insertedJobs,
    payments: insertedPayments
  };
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTestData()
    .then(() => {
      console.log('Seeding completed');
      return closeDatabase();
    })
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
