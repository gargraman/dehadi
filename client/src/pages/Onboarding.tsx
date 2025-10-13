import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MyLocation, ArrowForward, Check } from '@mui/icons-material';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [aadharNumber, setAadharNumber] = useState('');

  const handleLocateMe = () => {
    setIsLocating(true);
    // Simulate getting location
    setTimeout(() => {
      setCurrentLocation('Andheri West, Mumbai, Maharashtra');
      setIsLocating(false);
    }, 1500);
  };

  const handleLanguageNext = () => {
    if (selectedLanguage) {
      setStep(2);
    }
  };

  const handleLocationNext = () => {
    if (currentLocation) {
      setStep(3);
    }
  };

  const handleComplete = () => {
    if (aadharNumber.length === 12) {
      // Save onboarding data
      const onboardingData = {
        language: selectedLanguage,
        location: currentLocation,
        aadhar: aadharNumber,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
      console.log('Onboarding completed:', onboardingData);
      setLocation('/');
    }
  };

  const formatAadhar = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 12);
    return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-foreground">Welcome to Dehadi</h1>
            <span className="text-sm text-muted-foreground">Step {step} of 3</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        {/* Step 1: Language Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Language</CardTitle>
                <CardDescription>अपनी भाषा चुनें / Select your preferred language</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`p-4 rounded-lg border-2 transition-all hover-elevate active-elevate-2 ${
                        selectedLanguage === lang.code
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card'
                      }`}
                      data-testid={`language-${lang.code}`}
                    >
                      <div className="text-xl mb-1">{lang.native}</div>
                      <div className={`text-xs ${
                        selectedLanguage === lang.code ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`}>
                        {lang.name}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleLanguageNext}
              disabled={!selectedLanguage}
              className="w-full min-h-12"
              data-testid="button-language-next"
            >
              Continue
              <ArrowForward sx={{ fontSize: 20 }} className="ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Location</CardTitle>
                <CardDescription>We'll show you nearby job opportunities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="location">Enter your location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="City, Area, State"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    className="mt-2 h-12 text-base"
                    data-testid="input-location"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleLocateMe}
                  disabled={isLocating}
                  className="w-full min-h-12"
                  data-testid="button-use-current-location"
                >
                  <MyLocation sx={{ fontSize: 20 }} className="mr-2" />
                  {isLocating ? 'Getting location...' : 'Use Current Location'}
                </Button>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 min-h-12"
                data-testid="button-location-back"
              >
                Back
              </Button>
              <Button
                onClick={handleLocationNext}
                disabled={!currentLocation}
                className="flex-1 min-h-12"
                data-testid="button-location-next"
              >
                Continue
                <ArrowForward sx={{ fontSize: 20 }} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Aadhar Verification */}
        {step === 3 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Verify Your Identity</CardTitle>
                <CardDescription>Enter your Aadhar number for verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="aadhar">Aadhar Number</Label>
                  <Input
                    id="aadhar"
                    type="text"
                    placeholder="XXXX XXXX XXXX"
                    value={formatAadhar(aadharNumber)}
                    onChange={(e) => setAadharNumber(e.target.value.replace(/\s/g, ''))}
                    className="mt-2 h-12 text-base tracking-wider font-mono"
                    data-testid="input-aadhar"
                    maxLength={14}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Your Aadhar information is secure and encrypted
                  </p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-foreground mb-2">Why we need this?</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Verify your identity</li>
                    <li>• Build trust with employers</li>
                    <li>• Comply with labor regulations</li>
                    <li>• Access government schemes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1 min-h-12"
                data-testid="button-aadhar-back"
              >
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={aadharNumber.length !== 12}
                className="flex-1 min-h-12"
                data-testid="button-complete-onboarding"
              >
                Complete Setup
                <Check sx={{ fontSize: 20 }} className="ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
