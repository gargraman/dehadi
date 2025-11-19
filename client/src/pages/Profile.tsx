import { useState } from 'react';
import { useAuth } from '@/lib/auth';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Hammer, Zap, Droplets, Wrench, Paintbrush, HandHelping, Car, Sparkles, ChefHat, Shield, Loader2, Pencil, BadgeCheck, Star, Briefcase, MapPin, Globe, Moon, LogOut, CreditCard, MapPinned } from 'lucide-react';

// Mock additional profile data that would come from other endpoints
const mockStats = {
  rating: 4.8,
  reviewCount: 45,
  completedJobs: 127,
  experience: '8 years',
  dailyRate: '900',
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
  { icon: Pencil, label: 'Edit Profile', action: 'edit' },
  { icon: Briefcase, label: 'Work History', action: 'history' },
  { icon: Star, label: 'Reviews & Ratings', action: 'reviews' },
  { icon: Moon, label: 'Dark Mode', action: 'darkmode', hasToggle: true },
  { icon: LogOut, label: 'Logout', action: 'logout', isDanger: true },
];

export default function Profile() {
  const { user, logout, isLoading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editField, setEditField] = useState<'location' | 'skills' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error if no user data
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <Alert variant="destructive">
              <AlertDescription>
                Unable to load profile data. Please try logging in again.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Normalize skills to use skill IDs
  const normalizeSkills = (skills: string[] | null): string[] => {
    if (!skills || skills.length === 0) return [];

    return skills
      .map(skill => {
        // If already an ID (lowercase), return as-is
        const foundSkill = skillCategories.find(s => s.id === skill.toLowerCase());
        if (foundSkill) return foundSkill.id;

        // Try to map skill name to ID (case-insensitive)
        const matchingSkill = skillCategories.find(
          s => s.name.toLowerCase() === skill.toLowerCase()
        );
        return matchingSkill?.id;
      })
      .filter((skill): skill is string => skill !== undefined);
  };

  const userSkills = normalizeSkills(user.skills);

  const handleMenuAction = (action: string) => {
    if (action === 'darkmode') {
      setDarkMode(!darkMode);
      document.documentElement.classList.toggle('dark');
    } else if (action === 'logout') {
      logout();
    } else {
      console.log('Menu action:', action);
    }
  };

  const handleEditClick = (field: 'location' | 'skills', currentValue: string | string[]) => {
    setEditField(field);
    if (field === 'skills') {
      setSelectedSkills(currentValue as string[]);
    } else {
      setEditValue(currentValue as string);
    }
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    // Note: In a real app, this would make an API call to update the user profile
    // For now, we'll just close the dialog and show a message that the feature is coming soon
    console.log('Profile update would be sent to API:', {
      field: editField,
      value: editField === 'skills' ? selectedSkills : editValue
    });
    setEditDialogOpen(false);
    setEditField(null);
    setEditValue('');
    setSelectedSkills([]);
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

  const getUserInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
                    {getUserInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                {/* For now, showing verified for all users - in real app this would be based on verification status */}
                <div className="absolute -bottom-1 -right-1 bg-chart-3 rounded-full p-1">
                  <BadgeCheck size={20} className="text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{user.fullName}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{user.phone}</p>
                    <Badge variant="outline" className="mt-1 capitalize">
                      {user.role}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-edit-profile">
                    <Pencil size={18} />
                  </Button>
                </div>

                {/* Only show worker stats for workers */}
                {user.role === 'worker' && (
                  <>
                    <div className="flex items-center gap-1 mt-2">
                      <Star size={18} className="text-chart-5 fill-chart-5" />
                      <span className="font-semibold text-foreground">{mockStats.rating}</span>
                      <span className="text-sm text-muted-foreground">({mockStats.reviewCount} reviews)</span>
                    </div>
                  </>
                )}

                {user.location && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <MapPin size={16} />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills - only show for workers */}
            {user.role === 'worker' && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Skills</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick('skills', userSkills)}
                    data-testid="button-edit-skills"
                  >
                    <Pencil size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userSkills.length > 0 ? (
                    userSkills.map((skillId) => {
                      const skill = skillCategories.find(s => s.id === skillId);
                      if (!skill) return null;
                      const Icon = skill.icon;
                      return (
                        <Badge key={skillId} variant="secondary" className="gap-1">
                          <Icon className={`w-3 h-3 ${skill.color}`} />
                          <span>{skill.name}</span>
                        </Badge>
                      );
                    }).filter(Boolean)
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills added yet</p>
                  )}
                </div>
              </div>
            )}

            {/* Stats - only show for workers */}
            {user.role === 'worker' && (
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{mockStats.completedJobs}</p>
                  <p className="text-xs text-muted-foreground mt-1">Jobs Done</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{mockStats.experience}</p>
                  <p className="text-xs text-muted-foreground mt-1">Experience</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">₹{mockStats.dailyRate}</p>
                  <p className="text-xs text-muted-foreground mt-1">Daily Rate</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <div className="px-4 pb-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Language */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Language</p>
                  <p className="text-sm font-medium text-foreground">
                    {getLanguageName(user.language)}
                  </p>
                </div>
              </div>
              {/* Language editing disabled for now - would need API endpoint */}
              <div className="w-10" />
            </div>

            {/* Location */}
            {user.location && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground">{user.location}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick('location', user.location || '')}
                  data-testid="button-edit-location"
                >
                  <Pencil size={18} />
                </Button>
              </div>
            )}

            {/* Username */}
            <div className="flex items-center p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Username</p>
                  <p className="text-sm font-medium text-foreground">
                    {user.username}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <Icon size={24} />
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
              Edit {editField === 'location' ? 'Location' : editField === 'skills' ? 'Skills' : 'Profile'}
            </DialogTitle>
            <DialogDescription>
              Update your {editField === 'location' ? 'current location' : editField === 'skills' ? 'work skills' : 'profile information'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
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
                  <MapPinned size={20} className="mr-2" />
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

            {/* Show note about API integration */}
            <Alert>
              <AlertDescription>
                Profile updates will be available once the API endpoints are implemented.
              </AlertDescription>
            </Alert>
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
                  : !editValue.trim()
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
