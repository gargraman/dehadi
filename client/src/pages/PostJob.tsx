import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, IndianRupee, MapPin, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Simple work types with emojis
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

export default function PostJob() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Super simple form state - no complex validation
  const [workType, setWorkType] = useState('');
  const [location, setLocation] = useState('');
  const [wage, setWage] = useState('');
  const [headcount, setHeadcount] = useState('1');
  const [description, setDescription] = useState('');

  const postJobMutation = useMutation({
    mutationFn: async () => {
      // Basic validation
      if (!workType || !location || !wage) {
        throw new Error('कृपया सभी जानकारी भरें (Please fill all information)');
      }

      // Get employer ID from auth (simplified)
      const employerId = 'temp-employer-id'; // TODO: Get from auth context

      return await apiRequest('POST', '/api/jobs', {
        employerId,
        workType,
        title: `${workTypes.find(t => t.id === workType)?.english} Required`,
        description: description || `${workTypes.find(t => t.id === workType)?.english} needed in ${location}`,
        location,
        wageType: 'daily',
        wage: parseInt(wage),
        headcount: parseInt(headcount),
      });
    },
    onSuccess: () => {
      toast({
        title: '✅ काम का इश्तिहार पोस्ट हो गया!',
        description: 'अब मजदूर आपके काम के लिए अप्लाई कर सकेंगे।',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      navigate('/');
    },
    onError: (error) => {
      toast({
        title: '❌ पोस्ट नहीं हुआ',
        description: error instanceof Error ? error.message : 'कुछ गड़बड़ी हुई। फिर से कोशिश करें।',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = () => {
    postJobMutation.mutate();
  };

  const isFormValid = workType && location && wage && parseInt(wage) >= 100;

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Simple Header */}
      <header className="bg-orange-500 text-white px-4 py-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20"
            data-testid="button-back"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold">📝 काम का इश्तिहार दें</h1>
            <p className="text-orange-100">Post Your Work</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-8 space-y-8">
        {/* Work Type Selection */}
        <div>
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">💼</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">किस तरह का काम है?</h2>
            <p className="text-lg text-gray-600">What type of work?</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {workTypes.map((type) => (
              <Button
                key={type.id}
                variant={workType === type.id ? "default" : "outline"}
                className={`h-20 text-left p-4 rounded-2xl border-2 transition-all ${
                  workType === type.id
                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg'
                    : 'border-gray-300 hover:border-orange-400'
                }`}
                onClick={() => setWorkType(type.id)}
              >
                <div>
                  <div className="text-lg font-bold">{type.name}</div>
                  <div className="text-sm opacity-75">{type.english}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">📍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">काम कहाँ है?</h2>
            <p className="text-lg text-gray-600">Where is the work?</p>
          </div>

          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="जैसे: अंधेरी पश्चिम, मुंबई"
            className="h-16 text-xl text-center rounded-2xl border-4 border-gray-300 focus:border-orange-500"
            data-testid="input-location"
          />

          {location && (
            <div className="mt-4 text-center bg-green-50 p-4 rounded-2xl">
              <div className="flex items-center justify-center gap-2">
                <MapPin size={24} className="text-green-500" />
                <span className="text-lg font-semibold text-green-800">{location}</span>
              </div>
            </div>
          )}
        </div>

        {/* Wage */}
        <div>
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">💰</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">रोज कितने पैसे देंगे?</h2>
            <p className="text-lg text-gray-600">Daily wage amount?</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <IndianRupee size={32} className="text-green-500" />
              <Input
                value={wage}
                onChange={(e) => setWage(e.target.value)}
                type="number"
                min="100"
                max="5000"
                step="50"
                placeholder="500"
                className="h-20 text-4xl font-bold text-center w-40 rounded-2xl border-4 border-green-300 focus:border-green-500"
                data-testid="input-wage"
              />
              <span className="text-2xl text-gray-600">/दिन</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[300, 500, 800, 1000, 1500, 2000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setWage(amount.toString())}
                  className={`p-4 rounded-xl border-2 text-lg font-semibold ${
                    wage === amount.toString() ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-400'
                  }`}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* People Count */}
        <div>
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">👥</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">कितने लोग चाहिए?</h2>
            <p className="text-lg text-gray-600">How many people needed?</p>
          </div>

          <div className="text-center">
            <div className="mb-6">
              <Input
                value={headcount}
                onChange={(e) => setHeadcount(e.target.value)}
                type="number"
                min="1"
                max="20"
                className="h-20 text-4xl font-bold text-center w-32 mx-auto rounded-2xl border-4 border-blue-300 focus:border-blue-500"
                data-testid="input-headcount"
              />
              <p className="text-lg text-gray-600 mt-2">लोग चाहिए</p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 8, 10].map((count) => (
                <Button
                  key={count}
                  variant="outline"
                  onClick={() => setHeadcount(count.toString())}
                  className={`p-4 rounded-xl border-2 text-lg font-semibold ${
                    headcount === count.toString() ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {count}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Description */}
        <div>
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">और कुछ बताना चाहते हैं?</h2>
            <p className="text-lg text-gray-600">Any other details? (Optional)</p>
          </div>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="जैसे: सुबह 8 बजे से शुरू, खाना मिलेगा..."
            className="h-24 text-lg rounded-2xl border-2 border-gray-300 focus:border-orange-500"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!isFormValid || postJobMutation.isPending}
            className="w-full h-24 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-2xl rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-post-job"
          >
            {postJobMutation.isPending ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <div className="text-xl font-bold">पोस्ट हो रहा है...</div>
                <div className="text-sm opacity-90">Posting...</div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Plus size={48} />
                <div className="text-2xl font-bold">✅ काम का इश्तिहार पोस्ट करें</div>
                <div className="text-sm opacity-90">Post Your Job</div>
              </div>
            )}
          </Button>

          {!isFormValid && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
              <p className="text-yellow-800">
                ⚠️ कृपया सभी जरूरी जानकारी भरें
              </p>
              <p className="text-sm text-yellow-600">
                Please fill all required information
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
