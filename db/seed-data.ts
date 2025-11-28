import { InsertUser, InsertJob, InsertPayment, InsertJobApplication, InsertMessage } from '../shared/schema';
import bcrypt from 'bcryptjs';

const DEFAULT_PASSWORD = 'test123';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export const indianNames = {
  male: [
    'Rajesh Kumar', 'Suresh Patel', 'Amit Sharma', 'Vijay Singh', 'Ramesh Gupta',
    'Manoj Yadav', 'Ashok Kumar', 'Dinesh Verma', 'Santosh Kumar', 'Prakash Joshi',
    'Ravi Kumar', 'Mukesh Sharma', 'Anil Tiwari', 'Sanjay Das', 'Rakesh Mehta'
  ],
  female: [
    'Sunita Devi', 'Rekha Sharma', 'Anita Patel', 'Kavita Singh', 'Meena Gupta',
    'Pooja Yadav', 'Radha Kumar', 'Geeta Verma', 'Savita Devi', 'Asha Joshi'
  ],
  employer: [
    'Arjun Malhotra', 'Priya Kapoor', 'Rohan Builders', 'Sharma Construction',
    'Mehta Contractors', 'Singh & Sons', 'Modern Homes Ltd', 'City Developers',
    'Kumar Associates', 'Elite Construction'
  ],
  ngo: [
    'Jan Seva Foundation', 'Rozgar Kendra', 'Skill India Center', 'Worker Welfare Trust'
  ],
  admin: [
    'Admin User', 'System Admin'
  ]
};

export const indianCities = [
  { name: 'Mumbai, Maharashtra', lat: '19.0760', lng: '72.8777' },
  { name: 'Delhi NCR', lat: '28.7041', lng: '77.1025' },
  { name: 'Bangalore, Karnataka', lat: '12.9716', lng: '77.5946' },
  { name: 'Hyderabad, Telangana', lat: '17.3850', lng: '78.4867' },
  { name: 'Chennai, Tamil Nadu', lat: '13.0827', lng: '80.2707' },
  { name: 'Kolkata, West Bengal', lat: '22.5726', lng: '88.3639' },
  { name: 'Pune, Maharashtra', lat: '18.5204', lng: '73.8567' },
  { name: 'Ahmedabad, Gujarat', lat: '23.0225', lng: '72.5714' },
  { name: 'Jaipur, Rajasthan', lat: '26.9124', lng: '75.7873' },
  { name: 'Lucknow, UP', lat: '26.8467', lng: '80.9462' }
];

export const workTypes = {
  mason: { title: 'Mason', titleHi: 'राजमिस्त्री', skills: ['bricklaying', 'plastering', 'tiling'] },
  carpenter: { title: 'Carpenter', titleHi: 'बढ़ई', skills: ['furniture', 'woodwork', 'finishing'] },
  electrician: { title: 'Electrician', titleHi: 'इलेक्ट्रीशियन', skills: ['wiring', 'electrical_fitting', 'repair'] },
  plumber: { title: 'Plumber', titleHi: 'प्लंबर', skills: ['pipe_fitting', 'drainage', 'water_supply'] },
  painter: { title: 'Painter', titleHi: 'पेंटर', skills: ['interior', 'exterior', 'waterproofing'] },
  welder: { title: 'Welder', titleHi: 'वेल्डर', skills: ['arc_welding', 'gas_welding', 'fabrication'] },
  helper: { title: 'Helper', titleHi: 'हेल्पर', skills: ['general_labor', 'loading', 'cleaning'] },
  driver: { title: 'Driver', titleHi: 'ड्राइवर', skills: ['driving', 'loading', 'delivery'] },
  cleaner: { title: 'Cleaner', titleHi: 'सफाईकर्मी', skills: ['cleaning', 'housekeeping', 'sanitization'] },
  cook: { title: 'Cook', titleHi: 'रसोइया', skills: ['cooking', 'catering', 'kitchen_management'] },
  security: { title: 'Security', titleHi: 'सुरक्षा', skills: ['guarding', 'surveillance', 'patrol'] }
};

const jobDescriptions = {
  mason: [
    { title: 'Experienced Mason for House Construction', desc: 'Need skilled mason for residential construction. Must know bricklaying and plastering.' },
    { title: 'Tiling Work for Bathroom Renovation', desc: 'Looking for mason for bathroom and kitchen tiling work. Quality work expected.' },
    { title: 'Compound Wall Construction', desc: 'Need mason for constructing boundary wall. Material will be provided.' }
  ],
  carpenter: [
    { title: 'Furniture Making for New Home', desc: 'Need carpenter for making wardrobes, kitchen cabinets and beds.' },
    { title: 'Door and Window Installation', desc: 'Installing wooden doors and window frames. Experience required.' },
    { title: 'Office Partition Work', desc: 'Wooden partition and desk installation for office space.' }
  ],
  electrician: [
    { title: 'Complete House Wiring', desc: 'New house electrical wiring work. Must have experience with modern switchboards.' },
    { title: 'AC Installation Work', desc: 'Split AC installation for residential building. 5 units to install.' },
    { title: 'Electrical Repair Work', desc: 'Fixing electrical issues in old building. Safety experience required.' }
  ],
  plumber: [
    { title: 'Bathroom Plumbing Work', desc: 'Complete bathroom fitting including WC, basin and shower installation.' },
    { title: 'Water Tank Connection', desc: 'Connecting overhead tank to main supply. Pipe fitting work.' },
    { title: 'Drainage System Repair', desc: 'Fixing blocked drainage and leakage issues in apartment.' }
  ],
  painter: [
    { title: 'Interior Painting - 3BHK', desc: 'Complete interior painting for 3BHK flat. Asian Paints will be provided.' },
    { title: 'Exterior Wall Painting', desc: 'Building exterior painting work. Weatherproof coating required.' },
    { title: 'Waterproofing Work', desc: 'Terrace and bathroom waterproofing with painting.' }
  ],
  welder: [
    { title: 'Iron Gate Fabrication', desc: 'Making decorative iron gate for house entrance.' },
    { title: 'Window Grill Work', desc: 'Safety grills for windows. 10 windows to cover.' },
    { title: 'Staircase Railing', desc: 'MS railing for staircase. Measurement on site.' }
  ],
  helper: [
    { title: 'Construction Site Helper', desc: 'General labor work at construction site. Loading and mixing.' },
    { title: 'Moving and Loading Work', desc: 'Shifting household items. Need strong workers.' },
    { title: 'Event Setup Helper', desc: 'Setting up chairs, tables and decorations for wedding.' }
  ],
  driver: [
    { title: 'Delivery Driver Needed', desc: 'Local delivery driver for e-commerce packages. Bike required.' },
    { title: 'Office Cab Driver', desc: 'Regular office commute driver. Morning and evening trips.' },
    { title: 'Truck Driver for Transport', desc: 'Heavy vehicle driver for material transport.' }
  ],
  cleaner: [
    { title: 'House Cleaning Work', desc: 'Deep cleaning for 2BHK apartment before shifting.' },
    { title: 'Office Cleaning Staff', desc: 'Daily cleaning for office premises. Morning shift.' },
    { title: 'Post-Construction Cleaning', desc: 'Thorough cleaning after renovation work.' }
  ],
  cook: [
    { title: 'Home Cook Needed', desc: 'Daily cooking for family of 4. North Indian cuisine.' },
    { title: 'Party Catering Work', desc: 'Cooking for birthday party. 50 guests expected.' },
    { title: 'Mess Cook Required', desc: 'Cooking for hostel mess. Lunch and dinner.' }
  ],
  security: [
    { title: 'Night Security Guard', desc: 'Night shift security for residential society.' },
    { title: 'Factory Security', desc: 'Round-the-clock security for industrial unit.' },
    { title: 'Event Security Staff', desc: 'Security for corporate event. 2 days work.' }
  ]
};

export interface SeedUser extends Omit<InsertUser, 'id' | 'createdAt'> {
  seedId: string;
}

export async function generateWorkers(count: number): Promise<SeedUser[]> {
  const workers: SeedUser[] = [];
  const workTypeKeys = Object.keys(workTypes);
  const passwordHash = await hashPassword(DEFAULT_PASSWORD);
  const languages = ['en', 'hi', 'mr', 'gu', 'bn', 'te', 'ta'];
  
  for (let i = 0; i < count; i++) {
    const isMale = i % 3 !== 2;
    const names = isMale ? indianNames.male : indianNames.female;
    const name = names[i % names.length];
    const city = indianCities[i % indianCities.length];
    const workType = workTypeKeys[i % workTypeKeys.length];
    const skills = workTypes[workType as keyof typeof workTypes].skills;
    const phone = `98${String(i + 10).padStart(8, '0')}`;
    
    workers.push({
      seedId: `worker-${i + 1}`,
      username: name.toLowerCase().replace(/\s+/g, '_') + (i + 1),
      passwordHash,
      fullName: name,
      phone,
      role: 'worker',
      language: languages[i % languages.length],
      location: city.name,
      skills: [workType, ...skills.slice(0, 2)],
      aadhar: `${String(1000 + i).padStart(4, '0')} ${String(2000 + i).padStart(4, '0')} ${String(3000 + i).padStart(4, '0')}`
    });
  }
  
  return workers;
}

export async function generateEmployers(count: number): Promise<SeedUser[]> {
  const employers: SeedUser[] = [];
  const passwordHash = await hashPassword(DEFAULT_PASSWORD);
  
  for (let i = 0; i < count; i++) {
    const name = indianNames.employer[i % indianNames.employer.length];
    const city = indianCities[i % indianCities.length];
    const phone = `99${String(i + 10).padStart(8, '0')}`;
    
    employers.push({
      seedId: `employer-${i + 1}`,
      username: name.toLowerCase().replace(/\s+/g, '_').replace(/[&]/g, 'and') + (i + 1),
      passwordHash,
      fullName: name,
      phone,
      role: 'employer',
      language: 'en',
      location: city.name,
      skills: null,
      aadhar: null
    });
  }
  
  return employers;
}

export async function generateNGOPartners(count: number): Promise<SeedUser[]> {
  const ngoPartners: SeedUser[] = [];
  const passwordHash = await hashPassword(DEFAULT_PASSWORD);
  
  for (let i = 0; i < count; i++) {
    const name = indianNames.ngo[i % indianNames.ngo.length];
    const city = indianCities[i % indianCities.length];
    const phone = `97${String(i + 10).padStart(8, '0')}`;
    
    ngoPartners.push({
      seedId: `ngo-${i + 1}`,
      username: name.toLowerCase().replace(/\s+/g, '_') + (i + 1),
      passwordHash,
      fullName: name,
      phone,
      role: 'ngo',
      language: 'hi',
      location: city.name,
      skills: null,
      aadhar: null
    });
  }
  
  return ngoPartners;
}

export async function generateAdmins(): Promise<SeedUser[]> {
  const passwordHash = await hashPassword(DEFAULT_PASSWORD);
  
  return [
    {
      seedId: 'admin-1',
      username: 'admin',
      passwordHash,
      fullName: 'Platform Admin',
      phone: '9000000001',
      role: 'admin',
      language: 'en',
      location: 'Mumbai, Maharashtra',
      skills: null,
      aadhar: null
    },
    {
      seedId: 'admin-2',
      username: 'superadmin',
      passwordHash,
      fullName: 'Super Admin',
      phone: '9000000002',
      role: 'admin',
      language: 'en',
      location: 'Delhi NCR',
      skills: null,
      aadhar: null
    }
  ];
}

export interface SeedJob extends Omit<InsertJob, 'id' | 'createdAt'> {
  seedId: string;
  seedEmployerId: string;
  seedAssignedWorkerId?: string;
}

export function generateJobs(
  count: number,
  employerSeedIds: string[],
  workerSeedIds: string[]
): SeedJob[] {
  const jobs: SeedJob[] = [];
  const workTypeKeys = Object.keys(workTypes);
  const statuses = ['open', 'open', 'open', 'in_progress', 'awaiting_payment', 'paid', 'completed', 'cancelled'];
  const wageTypes = ['daily', 'daily', 'hourly', 'fixed'];
  
  for (let i = 0; i < count; i++) {
    const employerSeedId = employerSeedIds[i % employerSeedIds.length];
    const city = indianCities[i % indianCities.length];
    const workType = workTypeKeys[i % workTypeKeys.length] as keyof typeof workTypes;
    const workTypeData = workTypes[workType];
    const jobTemplates = jobDescriptions[workType] || jobDescriptions.helper;
    const template = jobTemplates[i % jobTemplates.length];
    const status = statuses[i % statuses.length];
    const wageType = wageTypes[i % wageTypes.length];
    
    const baseWage = wageType === 'hourly' ? 100 + (i % 5) * 25 : 
                     wageType === 'fixed' ? 5000 + (i % 10) * 1000 :
                     500 + (i % 10) * 100;
    
    const needsWorker = ['in_progress', 'awaiting_payment', 'paid', 'completed'].includes(status);
    const assignedWorkerSeedId = needsWorker ? workerSeedIds[i % workerSeedIds.length] : undefined;
    
    const daysAgo = i % 14;
    const startedDaysAgo = daysAgo - 2;
    const completedDaysAgo = daysAgo - 5;
    
    jobs.push({
      seedId: `job-${i + 1}`,
      seedEmployerId: employerSeedId,
      seedAssignedWorkerId: assignedWorkerSeedId,
      employerId: '', // Will be filled with actual ID
      title: template.title,
      description: template.desc,
      workType,
      location: city.name,
      locationLat: city.lat,
      locationLng: city.lng,
      wageType,
      wage: baseWage,
      headcount: (i % 3) + 1,
      skills: workTypeData.skills,
      status,
      assignedWorkerId: null, // Will be filled with actual ID if needed
      startedAt: needsWorker ? new Date(Date.now() - startedDaysAgo * 86400000) : null,
      completedAt: ['awaiting_payment', 'paid', 'completed'].includes(status)
        ? new Date(Date.now() - completedDaysAgo * 86400000)
        : null
    });
  }
  
  return jobs;
}

export interface SeedJobApplication extends Omit<InsertJobApplication, 'id' | 'createdAt'> {
  seedId: string;
  seedJobId: string;
  seedWorkerId: string;
}

export function generateJobApplications(
  seedJobs: SeedJob[],
  workerSeedIds: string[]
): SeedJobApplication[] {
  const applications: SeedJobApplication[] = [];
  const applicationStatuses = ['pending', 'pending', 'accepted', 'rejected', 'withdrawn'];
  const messages = [
    'I am interested in this job. I have 5 years of experience.',
    'Sir, I can do this work. Please consider my application.',
    'I am available immediately. My daily rate is negotiable.',
    'I have done similar work before. Check my profile for references.',
    'I can start from tomorrow. Please contact me.',
    'Experienced worker available. Quality work guaranteed.'
  ];
  
  let appIndex = 0;
  
  for (const job of seedJobs) {
    const jobStatus = job.status || 'open';
    if (jobStatus === 'cancelled') continue;
    
    const numApplicants = jobStatus === 'open' ? 3 : 
                          ['in_progress', 'awaiting_payment', 'paid', 'completed'].includes(jobStatus) ? 2 : 1;
    
    for (let i = 0; i < numApplicants; i++) {
      const workerSeedId = workerSeedIds[(appIndex + i) % workerSeedIds.length];
      
      if (workerSeedId === job.seedAssignedWorkerId && i > 0) continue;
      
      let status: string;
      if (job.seedAssignedWorkerId === workerSeedId) {
        status = 'accepted';
      } else if (jobStatus === 'open') {
        status = applicationStatuses[appIndex % applicationStatuses.length];
      } else {
        status = 'rejected';
      }
      
      applications.push({
        seedId: `application-${appIndex + 1}`,
        seedJobId: job.seedId,
        seedWorkerId: workerSeedId,
        jobId: '', // Will be filled with actual ID
        workerId: '', // Will be filled with actual ID
        status,
        message: messages[appIndex % messages.length]
      });
      
      appIndex++;
    }
  }
  
  return applications;
}

export interface SeedMessage extends Omit<InsertMessage, 'id' | 'createdAt'> {
  seedId: string;
  seedSenderId: string;
  seedReceiverId: string;
  seedJobId?: string;
}

export function generateMessages(
  seedJobs: SeedJob[],
  workerSeedIds: string[],
  employerSeedIds: string[]
): SeedMessage[] {
  const messages: SeedMessage[] = [];
  const conversationTemplates = [
    [
      { from: 'employer', text: 'Hello, are you available for the work?' },
      { from: 'worker', text: 'Yes sir, I am available. When should I start?' },
      { from: 'employer', text: 'Can you come tomorrow at 9 AM?' },
      { from: 'worker', text: 'Sure, I will be there. Please share the address.' }
    ],
    [
      { from: 'employer', text: 'I saw your profile. Do you have experience with this type of work?' },
      { from: 'worker', text: 'Ji haan, I have 5 years experience. I can show previous work photos.' },
      { from: 'employer', text: 'Good. What is your daily rate?' },
      { from: 'worker', text: 'My rate is 800 rupees per day. Lunch should be provided.' }
    ],
    [
      { from: 'worker', text: 'Sir, work is completed. Please check and confirm.' },
      { from: 'employer', text: 'Good work. I am satisfied. Will make payment now.' },
      { from: 'worker', text: 'Thank you sir. Please share review on the app.' }
    ]
  ];
  
  let msgIndex = 0;
  const activeJobs = seedJobs.filter(j => {
    const status = j.status || 'open';
    return ['in_progress', 'awaiting_payment', 'paid', 'completed'].includes(status);
  });
  
  for (let i = 0; i < Math.min(activeJobs.length, 5); i++) {
    const job = activeJobs[i];
    const template = conversationTemplates[i % conversationTemplates.length];
    const employerSeedId = job.seedEmployerId;
    const workerSeedId = job.seedAssignedWorkerId || workerSeedIds[i % workerSeedIds.length];
    
    for (let j = 0; j < template.length; j++) {
      const msg = template[j];
      const isFromEmployer = msg.from === 'employer';
      
      messages.push({
        seedId: `message-${msgIndex + 1}`,
        seedSenderId: isFromEmployer ? employerSeedId : workerSeedId,
        seedReceiverId: isFromEmployer ? workerSeedId : employerSeedId,
        seedJobId: job.seedId,
        senderId: '', // Will be filled with actual ID
        receiverId: '', // Will be filled with actual ID
        jobId: '', // Will be filled with actual ID
        content: msg.text,
        isRead: j < template.length - 1
      });
      
      msgIndex++;
    }
  }
  
  for (let i = 0; i < 3; i++) {
    const workerSeedId = workerSeedIds[i % workerSeedIds.length];
    const employerSeedId = employerSeedIds[(i + 2) % employerSeedIds.length];
    
    messages.push({
      seedId: `message-${msgIndex + 1}`,
      seedSenderId: workerSeedId,
      seedReceiverId: employerSeedId,
      senderId: '',
      receiverId: '',
      jobId: null,
      content: 'Sir, do you have any work available? I am looking for job.',
      isRead: false
    });
    msgIndex++;
    
    messages.push({
      seedId: `message-${msgIndex + 1}`,
      seedSenderId: employerSeedId,
      seedReceiverId: workerSeedId,
      senderId: '',
      receiverId: '',
      jobId: null,
      content: 'I will let you know when I have work. Keep checking the app.',
      isRead: true
    });
    msgIndex++;
  }
  
  return messages;
}

export interface SeedPayment extends Omit<InsertPayment, 'id' | 'createdAt' | 'paidAt'> {
  seedId: string;
  seedJobId: string;
  seedEmployerId: string;
  seedWorkerId: string;
  paidAt?: Date | null;
}

export function generatePayments(seedJobs: SeedJob[]): SeedPayment[] {
  const payments: SeedPayment[] = [];
  const paymentMethods = ['upi', 'upi', 'card', 'bank_transfer', 'razorpay'];
  
  const payableJobs = seedJobs.filter(j => {
    const status = j.status || 'open';
    return ['awaiting_payment', 'paid', 'completed'].includes(status);
  });
  
  for (let i = 0; i < payableJobs.length; i++) {
    const job = payableJobs[i];
    const jobStatus = job.status || 'open';
    const workerSeedId = job.seedAssignedWorkerId!;
    
    let paymentStatus: string;
    let paidAt: Date | null = null;
    
    if (jobStatus === 'awaiting_payment') {
      paymentStatus = 'pending';
    } else if (jobStatus === 'paid' || jobStatus === 'completed') {
      paymentStatus = 'completed';
      paidAt = new Date(Date.now() - (i % 5) * 86400000);
    } else {
      paymentStatus = 'pending';
    }
    
    const amount = job.wage * (job.headcount || 1) * (job.wageType === 'fixed' ? 1 : 3);
    
    payments.push({
      seedId: `payment-${i + 1}`,
      seedJobId: job.seedId,
      seedEmployerId: job.seedEmployerId,
      seedWorkerId: workerSeedId,
      jobId: '', // Will be filled with actual ID
      employerId: '', // Will be filled with actual ID
      workerId: '', // Will be filled with actual ID
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      status: paymentStatus,
      paymentMethod: paymentMethods[i % paymentMethods.length],
      razorpayOrderId: `order_seed_${i + 1}_${Date.now()}`,
      razorpayPaymentId: paymentStatus === 'completed' ? `pay_seed_${i + 1}_${Date.now()}` : null,
      razorpaySignature: paymentStatus === 'completed' ? `sig_seed_${i + 1}` : null,
      failureReason: null,
      paidAt
    });
  }
  
  return payments;
}

export interface AllSeedData {
  workers: SeedUser[];
  employers: SeedUser[];
  ngoPartners: SeedUser[];
  admins: SeedUser[];
  jobs: SeedJob[];
  applications: SeedJobApplication[];
  messages: SeedMessage[];
  payments: SeedPayment[];
}

export async function generateAllSeedData(): Promise<AllSeedData> {
  const workers = await generateWorkers(15);
  const employers = await generateEmployers(8);
  const ngoPartners = await generateNGOPartners(3);
  const admins = await generateAdmins();
  
  const workerSeedIds = workers.map(w => w.seedId);
  const employerSeedIds = employers.map(e => e.seedId);
  
  const jobs = generateJobs(25, employerSeedIds, workerSeedIds);
  const applications = generateJobApplications(jobs, workerSeedIds);
  const messages = generateMessages(jobs, workerSeedIds, employerSeedIds);
  const payments = generatePayments(jobs);
  
  return {
    workers,
    employers,
    ngoPartners,
    admins,
    jobs,
    applications,
    messages,
    payments
  };
}

export const testCredentials = {
  worker: { username: 'rajesh_kumar1', password: DEFAULT_PASSWORD },
  employer: { username: 'arjun_malhotra1', password: DEFAULT_PASSWORD },
  ngo: { username: 'jan_seva_foundation1', password: DEFAULT_PASSWORD },
  admin: { username: 'admin', password: DEFAULT_PASSWORD }
};
