import { db, ready } from '../server/db';
import { users, jobs, jobApplications, messages, payments } from '../shared/schema';
import { generateAllSeedData, AllSeedData, testCredentials } from './seed-data';
import { eq, sql } from 'drizzle-orm';
import { logger } from '../server/lib/logger';

interface IdMap {
  users: Map<string, string>;
  jobs: Map<string, string>;
}

async function checkIfSeeded(): Promise<boolean> {
  try {
    const result = await db.select({ count: sql<number>`count(*)` }).from(users);
    const count = Number(result[0]?.count || 0);
    return count > 0;
  } catch (error) {
    return false;
  }
}

async function insertUsers(seedData: AllSeedData, idMap: IdMap): Promise<void> {
  const allUsers = [
    ...seedData.admins,
    ...seedData.ngoPartners,
    ...seedData.employers,
    ...seedData.workers
  ];

  for (const seedUser of allUsers) {
    const { seedId, ...userData } = seedUser;
    
    try {
      const existing = await db.select().from(users).where(eq(users.username, userData.username)).limit(1);
      
      if (existing.length > 0) {
        idMap.users.set(seedId, existing[0].id);
      } else {
        const [inserted] = await db.insert(users).values(userData).returning();
        idMap.users.set(seedId, inserted.id);
      }
    } catch (error) {
      logger.warn(`Failed to insert user ${userData.username}`, { error });
    }
  }
}

async function insertJobs(seedData: AllSeedData, idMap: IdMap): Promise<void> {
  for (const seedJob of seedData.jobs) {
    const { seedId, seedEmployerId, seedAssignedWorkerId, ...jobData } = seedJob;
    
    const employerId = idMap.users.get(seedEmployerId);
    if (!employerId) continue;
    
    const assignedWorkerId = seedAssignedWorkerId ? idMap.users.get(seedAssignedWorkerId) : null;
    
    try {
      const [inserted] = await db.insert(jobs).values({
        ...jobData,
        employerId,
        assignedWorkerId
      }).returning();
      
      idMap.jobs.set(seedId, inserted.id);
    } catch (error) {
      logger.warn(`Failed to insert job ${jobData.title}`, { error });
    }
  }
}

async function insertApplications(seedData: AllSeedData, idMap: IdMap): Promise<void> {
  for (const seedApp of seedData.applications) {
    const { seedId, seedJobId, seedWorkerId, ...appData } = seedApp;
    
    const jobId = idMap.jobs.get(seedJobId);
    const workerId = idMap.users.get(seedWorkerId);
    
    if (!jobId || !workerId) continue;
    
    try {
      await db.insert(jobApplications).values({
        ...appData,
        jobId,
        workerId
      });
    } catch (error) {
      logger.warn(`Failed to insert application`, { error });
    }
  }
}

async function insertMessages(seedData: AllSeedData, idMap: IdMap): Promise<void> {
  for (const seedMsg of seedData.messages) {
    const { seedId, seedSenderId, seedReceiverId, seedJobId, ...msgData } = seedMsg;
    
    const senderId = idMap.users.get(seedSenderId);
    const receiverId = idMap.users.get(seedReceiverId);
    const jobId = seedJobId ? idMap.jobs.get(seedJobId) : null;
    
    if (!senderId || !receiverId) continue;
    
    try {
      await db.insert(messages).values({
        ...msgData,
        senderId,
        receiverId,
        jobId
      });
    } catch (error) {
      logger.warn(`Failed to insert message`, { error });
    }
  }
}

async function insertPayments(seedData: AllSeedData, idMap: IdMap): Promise<void> {
  for (const seedPayment of seedData.payments) {
    const { seedId, seedJobId, seedEmployerId, seedWorkerId, paidAt, ...paymentData } = seedPayment;
    
    const jobId = idMap.jobs.get(seedJobId);
    const employerId = idMap.users.get(seedEmployerId);
    const workerId = idMap.users.get(seedWorkerId);
    
    if (!jobId || !employerId || !workerId) continue;
    
    try {
      await db.insert(payments).values({
        ...paymentData,
        jobId,
        employerId,
        workerId
      });
    } catch (error) {
      logger.warn(`Failed to insert payment`, { error });
    }
  }
}

export async function seed(): Promise<void> {
  await ready;
  
  const isSeeded = await checkIfSeeded();
  
  if (isSeeded) {
    logger.info('Database already seeded, skipping...');
    return;
  }
  
  logger.info('Starting database seeding...');
  
  try {
    const seedData = await generateAllSeedData();
    
    const idMap: IdMap = {
      users: new Map(),
      jobs: new Map()
    };
    
    await insertUsers(seedData, idMap);
    logger.info(`Seeded ${idMap.users.size} users`);
    
    await insertJobs(seedData, idMap);
    logger.info(`Seeded ${idMap.jobs.size} jobs`);
    
    await insertApplications(seedData, idMap);
    logger.info(`Seeded job applications`);
    
    await insertMessages(seedData, idMap);
    logger.info(`Seeded messages`);
    
    await insertPayments(seedData, idMap);
    logger.info(`Seeded payments`);
    
    logger.info('Database seeding completed successfully!');
    logger.info(`Test credentials:
  Worker: ${testCredentials.worker.username} / ${testCredentials.worker.password}
  Employer: ${testCredentials.employer.username} / ${testCredentials.employer.password}
  NGO: ${testCredentials.ngo.username} / ${testCredentials.ngo.password}
  Admin: ${testCredentials.admin.username} / ${testCredentials.admin.password}`);
    
  } catch (error) {
    logger.error('Database seeding failed', { error });
    throw error;
  }
}

export async function reseed(): Promise<void> {
  await ready;
  
  logger.info('Clearing existing data for reseed...');
  
  try {
    await db.delete(payments);
    await db.delete(messages);
    await db.delete(jobApplications);
    await db.delete(jobs);
    await db.delete(users);
    
    logger.info('Existing data cleared');
    
    await seed();
  } catch (error) {
    logger.error('Reseed failed', { error });
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const forceReseed = process.argv.includes('--force');
  
  (forceReseed ? reseed() : seed())
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
