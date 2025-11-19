import { useState } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

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

export default function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [open, setOpen] = useState(false);

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    setOpen(false);
    console.log('Language changed to:', code);
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-10 w-10"
          data-testid="button-language-switcher"
        >
          <Globe size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl">Select Language / भाषा चुनें</SheetTitle>
          <SheetDescription>
            Choose your preferred language for the app
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3 mt-6">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`p-4 rounded-lg border-2 transition-all hover-elevate active-elevate-2 ${
                selectedLanguage === lang.code
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card'
              }`}
              data-testid={`language-option-${lang.code}`}
            >
              <div className="text-2xl mb-1">{lang.native}</div>
              <div className={`text-sm ${
                selectedLanguage === lang.code ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}>
                {lang.name}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Current: <span className="font-semibold text-foreground">{currentLanguage?.native}</span>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
