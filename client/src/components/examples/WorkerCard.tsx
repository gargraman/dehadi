import WorkerCard from '../WorkerCard';

export default function WorkerCardExample() {
  return (
    <div className="p-4 space-y-4">
      <WorkerCard
        id="1"
        name="Ramesh Kumar"
        isVerified={true}
        rating={4.8}
        reviewCount={45}
        experience="8 years exp"
        skills={['Mason', 'Plastering', 'Brick Work']}
        location="Andheri, Mumbai"
        distance="1.2 km"
        dailyRate="900"
        availability="available"
      />
      <WorkerCard
        id="2"
        name="Suresh Patel"
        photoUrl="/placeholder-worker.jpg"
        isVerified={true}
        rating={4.6}
        reviewCount={32}
        experience="5 years exp"
        skills={['Electrician', 'Wiring', 'Panel Work', 'Troubleshooting']}
        location="Powai, Mumbai"
        distance="3.5 km"
        dailyRate="1100"
        hourlyRate="150"
        availability="busy"
      />
    </div>
  );
}
