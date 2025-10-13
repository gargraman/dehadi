import { InsertUser, InsertJob, InsertPayment } from '../shared/schema';

// Realistic Indian names
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
    'Arjun Malhotra', 'Priya Enterprises', 'Rohan Builders', 'Sharma Construction',
    'Mehta Contractors', 'Singh & Sons', 'Modern Homes Ltd', 'City Developers',
    'Kumar Associates', 'Elite Construction'
  ]
};

// Indian cities with coordinates
export const indianCities = [
  { name: 'Mumbai', lat: '19.0760', lng: '72.8777' },
  { name: 'Delhi', lat: '28.7041', lng: '77.1025' },
  { name: 'Bangalore', lat: '12.9716', lng: '77.5946' },
  { name: 'Hyderabad', lat: '17.3850', lng: '78.4867' },
  { name: 'Chennai', lat: '13.0827', lng: '80.2707' },
  { name: 'Kolkata', lat: '22.5726', lng: '88.3639' },
  { name: 'Pune', lat: '18.5204', lng: '73.8567' },
  { name: 'Ahmedabad', lat: '23.0225', lng: '72.5714' },
  { name: 'Jaipur', lat: '26.9124', lng: '75.7873' },
  { name: 'Lucknow', lat: '26.8467', lng: '80.9462' }
];

// Work types and skills
export const workTypes = {
  mason: { title: 'Mason', skills: ['bricklaying', 'plastering', 'tiling'] },
  carpenter: { title: 'Carpenter', skills: ['furniture', 'woodwork', 'finishing'] },
  electrician: { title: 'Electrician', skills: ['wiring', 'electrical_fitting', 'repair'] },
  plumber: { title: 'Plumber', skills: ['pipe_fitting', 'drainage', 'water_supply'] },
  painter: { title: 'Painter', skills: ['interior', 'exterior', 'waterproofing'] },
  welder: { title: 'Welder', skills: ['arc_welding', 'gas_welding', 'fabrication'] },
  helper: { title: 'Helper', skills: ['general_labor', 'loading', 'cleaning'] }
};

// Generate worker users
export function generateWorkers(count: number): Omit<InsertUser, 'id' | 'createdAt'>[] {
  const workers: Omit<InsertUser, 'id' | 'createdAt'>[] = [];
  const workTypeKeys = Object.keys(workTypes);
  
  for (let i = 0; i < count; i++) {
    const isMale = i % 2 === 0;
    const names = isMale ? indianNames.male : indianNames.female;
    const name = names[i % names.length];
    const city = indianCities[i % indianCities.length];
    const workType = workTypeKeys[i % workTypeKeys.length];
    const skills = workTypes[workType as keyof typeof workTypes].skills;
    
    workers.push({
      username: name.toLowerCase().replace(/\s+/g, '_') + (i + 1),
      password: 'test123', // In real app, this would be hashed
      role: 'worker',
      language: i % 3 === 0 ? 'hi' : (i % 3 === 1 ? 'mr' : 'en'),
      location: city.name,
      skills,
      aadhar: `${1000 + i}${2000 + i}${3000 + i}` // Mock Aadhar format
    });
  }
  
  return workers;
}

// Generate employer users
export function generateEmployers(count: number): Omit<InsertUser, 'id' | 'createdAt'>[] {
  const employers: Omit<InsertUser, 'id' | 'createdAt'>[] = [];
  
  for (let i = 0; i < count; i++) {
    const name = indianNames.employer[i % indianNames.employer.length];
    const city = indianCities[i % indianCities.length];
    
    employers.push({
      username: name.toLowerCase().replace(/\s+/g, '_') + (i + 1),
      password: 'test123',
      role: 'employer',
      language: 'en',
      location: city.name,
      skills: [],
      aadhar: null
    });
  }
  
  return employers;
}

// Job descriptions by work type
const jobDescriptions = {
  mason: [
    'Need experienced mason for residential construction work',
    'Bricklaying and plastering work for new house construction',
    'Tiling work required for bathroom and kitchen renovation'
  ],
  carpenter: [
    'Furniture assembly and installation needed',
    'Door and window frame installation work',
    'Custom woodwork for interior decoration'
  ],
  electrician: [
    'Electrical wiring for new apartment',
    'AC installation and electrical fitting work',
    'Electrical repair and maintenance needed'
  ],
  plumber: [
    'Bathroom plumbing installation required',
    'Water pipeline repair and maintenance',
    'Complete plumbing work for new construction'
  ],
  painter: [
    'Interior painting work for 2BHK apartment',
    'Exterior wall painting needed',
    'Waterproofing and painting service required'
  ],
  welder: [
    'Metal gate fabrication and welding',
    'Iron grill work needed for windows',
    'Welding repair work for industrial equipment'
  ],
  helper: [
    'General labor needed for construction site',
    'Loading and unloading work required',
    'Cleaning and maintenance helper needed'
  ]
};

// Generate jobs
export function generateJobs(
  count: number,
  employerIds: string[]
): Omit<InsertJob, 'id' | 'createdAt'>[] {
  const jobs: Omit<InsertJob, 'id' | 'createdAt'>[] = [];
  const workTypeKeys = Object.keys(workTypes);
  const statuses = ['open', 'in_progress', 'awaiting_payment', 'paid', 'completed'];
  
  for (let i = 0; i < count; i++) {
    const employerId = employerIds[i % employerIds.length];
    const city = indianCities[i % indianCities.length];
    const workType = workTypeKeys[i % workTypeKeys.length];
    const workTypeData = workTypes[workType as keyof typeof workTypes];
    const descriptions = jobDescriptions[workType as keyof typeof jobDescriptions];
    const status = statuses[i % statuses.length];
    
    const job: Omit<InsertJob, 'id' | 'createdAt'> = {
      employerId,
      title: `${workTypeData.title} Needed in ${city.name}`,
      description: descriptions[i % descriptions.length],
      workType,
      location: city.name,
      locationLat: city.lat,
      locationLng: city.lng,
      wageType: i % 3 === 0 ? 'hourly' : 'daily',
      wage: 500 + (i % 10) * 100, // ₹500 to ₹1400
      headcount: (i % 3) + 1,
      skills: workTypeData.skills,
      status,
      assignedWorkerId: status !== 'open' ? employerId : null, // Simplified for seed
      startedAt: status !== 'open' ? new Date(Date.now() - 86400000 * (i % 7)) : null,
      completedAt: ['awaiting_payment', 'paid', 'completed'].includes(status)
        ? new Date(Date.now() - 43200000 * (i % 5))
        : null
    };
    
    jobs.push(job);
  }
  
  return jobs;
}

// Generate payments
export function generatePayments(
  count: number,
  jobIds: string[],
  employerIds: string[],
  workerIds: string[]
): Omit<InsertPayment, 'id' | 'createdAt' | 'paidAt'>[] {
  const payments: Omit<InsertPayment, 'id' | 'createdAt' | 'paidAt'>[] = [];
  const paymentMethods = ['upi', 'card', 'bank_transfer'];
  const statuses = ['completed', 'pending', 'processing'];
  
  for (let i = 0; i < count; i++) {
    payments.push({
      jobId: jobIds[i % jobIds.length],
      employerId: employerIds[i % employerIds.length],
      workerId: workerIds[i % workerIds.length],
      amount: (500 + (i % 10) * 100) * 100, // Convert to paise
      currency: 'INR',
      status: statuses[i % statuses.length],
      paymentMethod: paymentMethods[i % paymentMethods.length],
      razorpayOrderId: `order_${Math.random().toString(36).substr(2, 9)}`,
      razorpayPaymentId: `pay_${Math.random().toString(36).substr(2, 9)}`,
      razorpaySignature: null,
      failureReason: null
    });
  }
  
  return payments;
}
