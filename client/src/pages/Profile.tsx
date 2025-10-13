import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Verified, 
  Star, 
  Work, 
  LocationOn,
  Language,
  Brightness4,
  ExitToApp
} from '@mui/icons-material';

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

const menuItems = [
  { icon: Edit, label: 'Edit Profile', action: 'edit' },
  { icon: Work, label: 'Work History', action: 'history' },
  { icon: Star, label: 'Reviews & Ratings', action: 'reviews' },
  { icon: Language, label: 'Language', action: 'language' },
  { icon: Brightness4, label: 'Dark Mode', action: 'darkmode', hasToggle: true },
  { icon: ExitToApp, label: 'Logout', action: 'logout', isDanger: true },
];

export default function Profile() {
  const [darkMode, setDarkMode] = useState(false);

  const handleMenuAction = (action: string) => {
    if (action === 'darkmode') {
      setDarkMode(!darkMode);
      document.documentElement.classList.toggle('dark');
    }
    console.log('Menu action:', action);
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
    </div>
  );
}
