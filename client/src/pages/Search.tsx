import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Search as SearchIcon, X, Mic, MapPin, Wrench, Zap, Droplets, Hammer, Paintbrush, HardHat, Car, Sparkles, Briefcase, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import JobCard from '@/components/JobCard';
import { useJobs } from '@/hooks/useJobs';

const workTypes = [
  { id: 'mason', name: 'मेसन', english: 'Mason', icon: Wrench, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { id: 'electrician', name: 'बिजली वाला', english: 'Electrician', icon: Zap, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { id: 'plumber', name: 'नल वाला', english: 'Plumber', icon: Droplets, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'carpenter', name: 'बढ़ई', english: 'Carpenter', icon: Hammer, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 'painter', name: 'रंगाई', english: 'Painter', icon: Paintbrush, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 'helper', name: 'मददगार', english: 'Helper', icon: HardHat, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  { id: 'driver', name: 'ड्राइवर', english: 'Driver', icon: Car, color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400' },
  { id: 'cleaner', name: 'सफाई', english: 'Cleaner', icon: Sparkles, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
];

export default function Search() {
  const [, navigate] = useLocation();
  const [searchText, setSearchText] = useState('');
  const [selectedWorkType, setSelectedWorkType] = useState('');
  const { data: jobs = [] } = useJobs();

  const filteredJobs = jobs.filter(job => {
    if (selectedWorkType && job.workType !== selectedWorkType) return false;
    if (searchText && !job.location.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const handleWorkTypeSelect = (workType: string) => {
    setSelectedWorkType(selectedWorkType === workType ? '' : workType);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">काम खोजें</h1>
            <p className="text-sm text-primary-foreground/80">Find Work</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-5 space-y-6">
        {/* Voice Search */}
        <div className="text-center">
          <Button
            size="lg"
            className="h-20 w-20 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-lg mb-3"
            onClick={() => console.log('Voice search activated')}
            data-testid="button-voice-search"
          >
            <Mic className="w-10 h-10" />
          </Button>
          <p className="text-base font-semibold">बोलकर खोजें</p>
          <p className="text-sm text-muted-foreground">Speak to Search</p>
        </div>

        {/* Location Search */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-destructive" />
            <div>
              <p className="text-sm font-semibold">जगह का नाम लिखें</p>
              <p className="text-xs text-muted-foreground">Enter Location</p>
            </div>
          </div>
          <div className="relative">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="जैसे: अंधेरी, मुंबई"
              className="h-14 text-lg pl-4 pr-12 rounded-xl"
              data-testid="input-location-search"
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Work Type Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">किस तरह का काम?</p>
              <p className="text-xs text-muted-foreground">What type of work?</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {workTypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = selectedWorkType === type.id;
              
              return (
                <Button
                  key={type.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-16 justify-start gap-3 rounded-xl ${
                    isSelected ? '' : 'hover-elevate'
                  }`}
                  onClick={() => handleWorkTypeSelect(type.id)}
                  data-testid={`filter-${type.id}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-primary-foreground/20' : type.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold">{type.name}</div>
                    <div className="text-xs opacity-70">{type.english}</div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Clear Filter */}
          {selectedWorkType && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedWorkType('')}
                className="text-muted-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                साफ करें • Clear Filter
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{filteredJobs.length}</p>
            <p className="text-sm text-muted-foreground">काम मिले • Jobs Found</p>
          </CardContent>
        </Card>

        {/* Job Results */}
        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.workType}
                employer="Employer"
                location={job.location}
                distance="Nearby"
                wageType={job.wageType as 'daily' | 'hourly' | 'fixed'}
                wage={job.wage.toString()}
                skills={job.skills || []}
                postedTime="Today"
                headcount={job.headcount || undefined}
                status={job.status}
              />
            ))
          ) : (
            <Card className="text-center p-8">
              <CardContent className="space-y-4">
                <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg font-semibold">कोई काम नहीं मिला</p>
                  <p className="text-sm text-muted-foreground">No jobs found</p>
                </div>
                <Button
                  onClick={() => {
                    setSearchText('');
                    setSelectedWorkType('');
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  फिर से खोजें • Reset Search
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
