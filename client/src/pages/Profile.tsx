import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Edit, 
  Verified, 
  Star, 
  Work, 
  LocationOn,
  Language,
  Brightness4,
  ExitToApp,
  CreditCard,
  MyLocation
} from '@mui/icons-material';
import { Hammer, Zap, Droplets, Wrench, Paintbrush, HandHelping, Car, Sparkles, ChefHat, Shield } from 'lucide-react';

const mockUserProfile = {
  name: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  location: 'Andheri West, Mumbai',
  isVerified: true,
  rating: 4.8,
  reviewCount: 45,
  completedJobs: 127,
  experience: '8 years',
  skills: ['Mason', 'Plastering', 'Brick Work', 'Block Work'],
  dailyRate: '900',
  languages: ['Hindi', 'Marathi', 'English'],
};

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

const skillCategories = [
  { id: 'mason', name: 'Mason', icon: Hammer, color: 'text-orange-500' },
  { id: 'electrician', name: 'Electrician', icon: Zap, color: 'text-yellow-500' },
  { id: 'plumber', name: 'Plumber', icon: Droplets, color: 'text-blue-500' },
  { id: 'carpenter', name: 'Carpenter', icon: Wrench, color: 'text-amber-600' },
  { id: 'painter', name: 'Painter', icon: Paintbrush, color: 'text-purple-500' },
  { id: 'helper', name: 'Helper/Labor', icon: HandHelping, color: 'text-green-500' },
  { id: 'driver', name: 'Driver', icon: Car, color: 'text-red-500' },
  { id: 'cleaner', name: 'Cleaner', icon: Sparkles, color: 'text-cyan-500' },
  { id: 'cook', name: 'Cook', icon: ChefHat, color: 'text-pink-500' },
  { id: 'security', name: 'Security', icon: Shield, color: 'text-indigo-500' },
];

const menuItems = [
  { icon: Edit, label: 'Edit Profile', action: 'edit' },
  { icon: Work, label: 'Work History', action: 'history' },
  { icon: Star, label: 'Reviews & Ratings', action: 'reviews' },
  { icon: Brightness4, label: 'Dark Mode', action: 'darkmode', hasToggle: true },
  { icon: ExitToApp, label: 'Logout', action: 'logout', isDanger: true },
];

interface OnboardingData {
  language: string;
  location: string;
  skills?: string[];
  aadhar: string;
  completedAt: string;
}

export default function Profile() {
  const [darkMode, setDarkMode] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editField, setEditField] = useState<'language' | 'location' | 'skills' | 'aadhar' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  // Normalize legacy skill data to new ID format
  const normalizeSkills = (skills: string[] | undefined): string[] => {
    if (!skills || skills.length === 0) return [];
    
    return skills
      .map(skill => {
        // If already an ID (lowercase), return as-is
        if (skillCategories.find(s => s.id === skill)) {
          return skill;
        }
        // Try to map legacy skill name to new ID (case-insensitive)
        const matchingSkill = skillCategories.find(
          s => s.name.toLowerCase() === skill.toLowerCase() || 
               s.id === skill.toLowerCase()
        );
        return matchingSkill?.id;
      })
      .filter((skill): skill is string => skill !== undefined);
  };

  useEffect(() => {
    const data = localStorage.getItem('onboardingData');
    if (data) {
      const parsedData = JSON.parse(data);
      
      // Normalize skills if present
      if (parsedData.skills) {
        const normalizedSkills = normalizeSkills(parsedData.skills);
        if (JSON.stringify(normalizedSkills) !== JSON.stringify(parsedData.skills)) {
          // Update localStorage with normalized data
          const updatedData = { ...parsedData, skills: normalizedSkills };
          localStorage.setItem('onboardingData', JSON.stringify(updatedData));
          setOnboardingData(updatedData);
        } else {
          setOnboardingData(parsedData);
        }
      } else {
        setOnboardingData(parsedData);
      }
    }
  }, []);

  const handleMenuAction = (action: string) => {
    if (action === 'darkmode') {
      setDarkMode(!darkMode);
      document.documentElement.classList.toggle('dark');
    }
    console.log('Menu action:', action);
  };

  const handleEditClick = (field: 'language' | 'location' | 'skills' | 'aadhar', currentValue: string | string[]) => {
    setEditField(field);
    if (field === 'skills') {
      setSelectedSkills(currentValue as string[]);
    } else {
      setEditValue(currentValue as string);
    }
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (onboardingData && editField) {
      const updatedData = {
        ...onboardingData,
        [editField]: editField === 'skills' ? selectedSkills : editValue,
      };
      localStorage.setItem('onboardingData', JSON.stringify(updatedData));
      setOnboardingData(updatedData);
      setEditDialogOpen(false);
      setEditField(null);
      setEditValue('');
      setSelectedSkills([]);
    }
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    setTimeout(() => {
      setEditValue('Andheri West, Mumbai, Maharashtra');
      setIsLocating(false);
    }, 1500);
  };

  const formatAadhar = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 12);
    return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const maskAadhar = (aadhar: string) => {
    if (!aadhar) return '';
    return `XXXX XXXX ${aadhar.slice(-4)}`;
  };

  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code);
    return lang ? `${lang.native} (${lang.name})` : code;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-3">
        <h1 className="text-xl font-bold text-foreground">Profile</h1>
      </header>

      {/* Profile Section */}
      <div className="p-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    RK
                  </AvatarFallback>
                </Avatar>
                {mockUserProfile.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-chart-3 rounded-full p-1">
                    <Verified sx={{ fontSize: 20, color: 'white' }} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{mockUserProfile.name}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{mockUserProfile.phone}</p>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-edit-profile">
                    <Edit sx={{ fontSize: 18 }} />
                  </Button>
                </div>

                <div className="flex items-center gap-1 mt-2">
                  <Star sx={{ fontSize: 18, color: 'hsl(var(--chart-5))' }} />
                  <span className="font-semibold text-foreground">{mockUserProfile.rating}</span>
                  <span className="text-sm text-muted-foreground">({mockUserProfile.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <LocationOn sx={{ fontSize: 16 }} />
                  <span>{mockUserProfile.location}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {mockUserProfile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{mockUserProfile.completedJobs}</p>
                <p className="text-xs text-muted-foreground mt-1">Jobs Done</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{mockUserProfile.experience}</p>
                <p className="text-xs text-muted-foreground mt-1">Experience</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">₹{mockUserProfile.dailyRate}</p>
                <p className="text-xs text-muted-foreground mt-1">Daily Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Information */}
      {onboardingData ? (
        <div className="px-4 pb-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Language */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Language sx={{ fontSize: 20 }} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Language</p>
                    <p className="text-sm font-medium text-foreground">
                      {getLanguageName(onboardingData.language)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick('language', onboardingData.language)}
                  data-testid="button-edit-language"
                >
                  <Edit sx={{ fontSize: 18 }} />
                </Button>
              </div>

              {/* Location */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <LocationOn sx={{ fontSize: 20 }} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground">{onboardingData.location}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick('location', onboardingData.location)}
                  data-testid="button-edit-location"
                >
                  <Edit sx={{ fontSize: 18 }} />
                </Button>
              </div>

              {/* Skills */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Work sx={{ fontSize: 20 }} className="text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Skills</p>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-8">
                    {(() => {
                      const skills = (onboardingData.skills || [])
                        .map((skillId) => {
                          const skill = skillCategories.find(s => s.id === skillId);
                          if (!skill) return null;
                          const Icon = skill.icon;
                          return (
                            <Badge key={skillId} variant="secondary" className="gap-1">
                              <Icon className={`w-3 h-3 ${skill.color}`} />
                              <span>{skill.name}</span>
                            </Badge>
                          );
                        })
                        .filter(badge => badge !== null);
                      
                      return skills.length > 0 ? skills : (
                        <p className="text-sm text-muted-foreground">No skills added yet</p>
                      );
                    })()}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick('skills', onboardingData.skills || [])}
                  data-testid="button-edit-skills"
                >
                  <Edit sx={{ fontSize: 18 }} />
                </Button>
              </div>

              {/* Aadhar */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <CreditCard sx={{ fontSize: 20 }} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Aadhar Number</p>
                    <p className="text-sm font-medium text-foreground font-mono">
                      {maskAadhar(onboardingData.aadhar)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick('aadhar', onboardingData.aadhar)}
                  data-testid="button-edit-aadhar"
                >
                  <Edit sx={{ fontSize: 18 }} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="px-4 pb-4">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-3">Complete onboarding to set up your profile</p>
              <Button
                onClick={() => window.location.href = '/onboarding'}
                data-testid="button-start-onboarding"
              >
                Complete Setup
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Menu Items */}
      <div className="px-4 pb-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.action}
              onClick={() => handleMenuAction(item.action)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover-elevate active-elevate-2 transition-colors ${
                item.isDanger ? 'text-destructive' : 'text-foreground'
              }`}
              data-testid={`menu-${item.action}`}
            >
              <Icon sx={{ fontSize: 24 }} />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.hasToggle && (
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-primary' : 'bg-muted'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-5' : 'translate-x-0.5'
                  } mt-0.5`} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit {editField === 'language' ? 'Language' : editField === 'location' ? 'Location' : editField === 'skills' ? 'Skills' : 'Aadhar Number'}
            </DialogTitle>
            <DialogDescription>
              Update your {editField === 'language' ? 'preferred language' : editField === 'location' ? 'current location' : editField === 'skills' ? 'work skills' : 'Aadhar information'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {editField === 'language' && (
              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setEditValue(lang.code)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      editValue === lang.code
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card'
                    }`}
                    data-testid={`edit-language-${lang.code}`}
                  >
                    <div className="text-base mb-0.5">{lang.native}</div>
                    <div className={`text-xs ${
                      editValue === lang.code ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}>
                      {lang.name}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {editField === 'location' && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    type="text"
                    placeholder="City, Area, State"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="mt-2"
                    data-testid="input-edit-location"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={handleLocateMe}
                  disabled={isLocating}
                  className="w-full"
                  data-testid="button-edit-use-location"
                >
                  <MyLocation sx={{ fontSize: 20 }} className="mr-2" />
                  {isLocating ? 'Getting location...' : 'Use Current Location'}
                </Button>
              </div>
            )}

            {editField === 'skills' && (
              <div>
                <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                  {skillCategories.map((skill) => {
                    const Icon = skill.icon;
                    const isSelected = selectedSkills.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        onClick={() => {
                          setSelectedSkills(prev => 
                            prev.includes(skill.id) 
                              ? prev.filter(id => id !== skill.id)
                              : [...prev, skill.id]
                          );
                        }}
                        className={`p-3 rounded-lg border-2 transition-all hover-elevate active-elevate-2 ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-card'
                        }`}
                        data-testid={`edit-skill-${skill.id}`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className={`p-2 rounded-full ${
                            isSelected ? 'bg-primary/20' : 'bg-muted'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              isSelected ? 'text-primary' : skill.color
                            }`} />
                          </div>
                          <span className={`text-sm font-medium text-center ${
                            isSelected ? 'text-primary' : 'text-foreground'
                          }`}>
                            {skill.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedSkills.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-3">
                    {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}

            {editField === 'aadhar' && (
              <div>
                <Label htmlFor="edit-aadhar">Aadhar Number</Label>
                <Input
                  id="edit-aadhar"
                  type="text"
                  placeholder="XXXX XXXX XXXX"
                  value={formatAadhar(editValue)}
                  onChange={(e) => setEditValue(e.target.value.replace(/\s/g, ''))}
                  className="mt-2 tracking-wider font-mono"
                  data-testid="input-edit-aadhar"
                  maxLength={14}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Your Aadhar information is secure and encrypted
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              data-testid="button-cancel-edit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={
                editField === 'skills' 
                  ? selectedSkills.length === 0
                  : !editValue || (editField === 'aadhar' && editValue.length !== 12)
              }
              data-testid="button-save-edit"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
