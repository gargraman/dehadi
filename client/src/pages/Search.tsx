import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Search as SearchIcon, X, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import JobCard from '@/components/JobCard';
import { useJobs } from '@/hooks/useJobs';

// Work types with emojis for simple selection
const workTypes = [
  { id: 'mason', name: '🧱 मेसन', english: 'Mason' },
  { id: 'electrician', name: '⚡ बिजली वाला', english: 'Electrician' },
  { id: 'plumber', name: '🔧 नल वाला', english: 'Plumber' },
  { id: 'carpenter', name: '🔨 बढ़ई', english: 'Carpenter' },
  { id: 'painter', name: '🎨 रंगाई', english: 'Painter' },
  { id: 'helper', name: '🤝 मददगार', english: 'Helper' },
  { id: 'driver', name: '🚗 ड्राइवर', english: 'Driver' },
  { id: 'cleaner', name: '✨ सफाई', english: 'Cleaner' },
];

export default function Search() {
  const [, navigate] = useLocation();
  const [searchText, setSearchText] = useState('');
  const [selectedWorkType, setSelectedWorkType] = useState('');
  const { data: jobs = [] } = useJobs();

  // Simple filtering - no complex logic
  const filteredJobs = jobs.filter(job => {
    if (selectedWorkType && job.workType !== selectedWorkType) return false;
    if (searchText && !job.location.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const handleWorkTypeSelect = (workType: string) => {
    if (selectedWorkType === workType) {
      setSelectedWorkType(''); // Deselect if clicking same type
    } else {
      setSelectedWorkType(workType);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Simplified Header */}
      <header className="bg-blue-500 text-white px-4 py-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold">🔍 काम खोजें</h1>
            <p className="text-blue-100">Find Work</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-8">
        {/* Voice Search Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="h-20 w-20 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-xl mb-4"
            onClick={() => console.log('Voice search activated')}
          >
            <Mic size={40} />
          </Button>
          <p className="text-lg font-semibold text-gray-700">🎤 बोलकर खोजें</p>
          <p className="text-sm text-gray-500">Speak to Search</p>
        </div>

        {/* Simple Text Search */}
        <div>
          <p className="text-lg font-semibold text-gray-800 mb-3">📍 जगह का नाम लिखें</p>
          <p className="text-sm text-gray-600 mb-4">Enter Location Name</p>
          <div className="relative">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="जैसे: अंधेरी, मुंबई"
              className="h-16 text-xl pl-4 pr-12 rounded-2xl border-4 border-gray-300 focus:border-blue-500"
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X size={24} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Work Type Selection */}
        <div>
          <p className="text-lg font-semibold text-gray-800 mb-3">💼 किस तरह का काम?</p>
          <p className="text-sm text-gray-600 mb-4">What type of work?</p>
          <div className="grid grid-cols-2 gap-3">
            {workTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedWorkType === type.id ? "default" : "outline"}
                className={`h-20 text-left p-4 rounded-2xl border-2 transition-all ${
                  selectedWorkType === type.id
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onClick={() => handleWorkTypeSelect(type.id)}
              >
                <div>
                  <div className="text-lg font-bold">{type.name}</div>
                  <div className="text-sm opacity-75">{type.english}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Clear Filter */}
          {selectedWorkType && (
            <div className="text-center mt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedWorkType('')}
                className="px-6 py-3 rounded-xl"
              >
                🗑️ साफ करें (Clear)
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-center bg-green-50 p-4 rounded-2xl">
          <p className="text-2xl font-bold text-green-800">{filteredJobs.length}</p>
          <p className="text-lg text-green-700">काम मिले</p>
          <p className="text-sm text-green-600">Jobs Found</p>
        </div>

        {/* Job Results */}
        <div className="space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.workType}
                employer="काम देने वाला"
                location={job.location}
                distance="पास में"
                wageType={job.wageType as 'daily' | 'hourly' | 'fixed'}
                wage={job.wage.toString()}
                skills={job.skills || []}
                postedTime="आज"
                headcount={job.headcount || undefined}
                status={job.status}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-8xl mb-4">😔</div>
              <p className="text-2xl font-semibold text-gray-700 mb-2">कोई काम नहीं मिला</p>
              <p className="text-lg text-gray-500 mb-6">No work found</p>
              <Button
                onClick={() => {
                  setSearchText('');
                  setSelectedWorkType('');
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg rounded-xl"
              >
                🔄 फिर से खोजें
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
