import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Eye, EyeOff, User, Building, Heart } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface RegisterRequest {
  username: string;
  password: string;
  role: 'worker' | 'employer' | 'ngo';
  fullName: string;
  phone: string;
  language?: string;
  location?: string;
  skills?: string;
  aadhar?: string;
}

interface RegisterResponse {
  id: string;
  username: string;
  fullName: string;
  role: string;
  language: string;
}

const roleOptions = [
  {
    value: 'worker' as const,
    label: 'Worker',
    description: 'Looking for daily wage work',
    icon: User,
  },
  {
    value: 'employer' as const,
    label: 'Employer',
    description: 'Hiring workers for projects',
    icon: Building,
  },
  {
    value: 'ngo' as const,
    label: 'NGO',
    description: 'Supporting worker welfare',
    icon: Heart,
  },
];

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
];

export default function Register() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '' as 'worker' | 'employer' | 'ngo' | '',
    fullName: '',
    phone: '',
    language: 'en',
    location: '',
    skills: '',
    aadhar: ''
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest): Promise<RegisterResponse> => {
      const res = await apiRequest('POST', '/api/auth/register', data);
      return res.json();
    },
    onSuccess: (data) => {
      console.log('Registration successful:', data);
      // Automatically redirect to login
      setLocation('/login');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) return;

    const submitData: RegisterRequest = {
      username: formData.username.trim(),
      password: formData.password,
      role: formData.role,
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      language: formData.language,
      location: formData.location.trim() || undefined,
      skills: formData.skills.trim() || undefined,
      aadhar: formData.aadhar.trim() || undefined
    };

    registerMutation.mutate(submitData);
  };

  const isFormValid = () => {
    return (
      formData.username.trim() &&
      formData.password.length >= 6 &&
      formData.role &&
      formData.fullName.trim() &&
      formData.phone.trim().length >= 10
    );
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleRoleChange = (role: 'worker' | 'employer' | 'ngo') => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleLanguageChange = (language: string) => {
    setFormData(prev => ({ ...prev, language }));
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 10);
  };

  const formatAadhar = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 12);
    return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const selectedRole = roleOptions.find(r => r.value === formData.role);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground">Join Dehadi to connect with opportunities</p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label>I am a</Label>
                <div className="grid grid-cols-1 gap-2">
                  {roleOptions.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => handleRoleChange(role.value)}
                        className={`p-3 rounded-lg border-2 text-left transition-all hover-elevate ${
                          formData.role === role.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-card'
                        }`}
                        data-testid={`role-${role.value}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${
                            formData.role === role.value ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                          <div>
                            <div className={`font-medium ${
                              formData.role === role.value ? 'text-primary' : 'text-foreground'
                            }`}>
                              {role.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {role.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  className="h-12 text-base"
                  required
                  data-testid="input-fullname"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                  className="h-12 text-base"
                  required
                  maxLength={10}
                  data-testid="input-phone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  className="h-12 text-base"
                  required
                  autoComplete="username"
                  data-testid="input-username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className="h-12 text-base pr-10"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="toggle-password-visibility"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <Select value={formData.language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="h-12" data-testid="select-language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span>{lang.native} ({lang.name})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, Area, State"
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  className="h-12 text-base"
                  data-testid="input-location"
                />
              </div>

              {/* Role-specific fields */}
              {formData.role === 'worker' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Textarea
                      id="skills"
                      placeholder="e.g., Mason, Electrician, Plumber"
                      value={formData.skills}
                      onChange={handleInputChange('skills')}
                      className="min-h-20 text-base"
                      data-testid="input-skills"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aadhar">Aadhar Number (Optional)</Label>
                    <Input
                      id="aadhar"
                      type="text"
                      placeholder="XXXX XXXX XXXX"
                      value={formatAadhar(formData.aadhar)}
                      onChange={(e) => setFormData(prev => ({ ...prev, aadhar: e.target.value.replace(/\s/g, '') }))}
                      className="h-12 text-base tracking-wider font-mono"
                      maxLength={14}
                      data-testid="input-aadhar"
                    />
                  </div>
                </>
              )}

              {/* Error Display */}
              {registerMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription data-testid="register-error">
                    {registerMutation.error instanceof Error
                      ? registerMutation.error.message.includes('409:')
                        ? 'Username already taken. Please choose a different one.'
                        : 'Registration failed. Please check your details and try again.'
                      : 'Registration failed. Please try again.'
                    }
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12"
                disabled={registerMutation.isPending || !isFormValid()}
                data-testid="button-register"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={() => setLocation('/login')}
              className="text-primary hover:text-primary/80 font-medium"
              data-testid="link-login"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}