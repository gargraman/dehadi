import JobCard from '../JobCard';

export default function JobCardExample() {
  return (
    <div className="p-4 space-y-4">
      <JobCard
        id="1"
        title="Mason (Brick, Block, Plaster)"
        employer="ABC Construction Pvt Ltd"
        location="Andheri West, Mumbai"
        distance="2.3 km away"
        wageType="daily"
        wage="850"
        skills={['Brick Laying', 'Plastering', 'Block Work']}
        postedTime="2 hours ago"
        headcount={3}
      />
      <JobCard
        id="2"
        title="Electrician"
        employer="Metro Builders"
        location="Powai, Mumbai"
        distance="5.1 km away"
        wageType="daily"
        wage="1200"
        skills={['Wiring', 'Panel Installation', 'Troubleshooting', 'Safety Certified']}
        postedTime="1 day ago"
      />
    </div>
  );
}
