import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, Smartphone, Lock, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface LoginResponse {
  user: {
    id: string;
    username: string;
    role: string;
  };
  message: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const loginMutation = useMutation({
    mutationFn: async (data: typeof formData): Promise<LoginResponse> => {
      const res = await apiRequest('POST', '/api/auth/login', data);
      return res.json();
    },
    onSuccess: async (data) => {
      console.log('Login successful:', data);
      // Invalidate and refetch the auth query to update authentication state
      // Use refetchQueries to actually wait for the data to be fetched
      await queryClient.refetchQueries({ queryKey: ['/api/auth/me'] });
      
      if (data.user.role === 'employer') {
        setLocation('/dashboard');
      } else {
        setLocation('/');
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username.trim() && formData.password.trim()) {
      loginMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">नमस्ते!</h1>
          <h2 className="text-xl text-muted-foreground">Welcome Back</h2>
          <p className="text-sm text-muted-foreground">
            अपनी जानकारी भरें • Enter your details
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">फोन नंबर या नाम</p>
                    <p className="text-xs text-muted-foreground">Phone or Username</p>
                  </div>
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="जैसे: 9876543210 या राम"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  className="h-14 text-lg rounded-xl"
                  required
                  autoComplete="username"
                  data-testid="input-username"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold">पासवर्ड</p>
                    <p className="text-xs text-muted-foreground">Password</p>
                  </div>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="अपना पासवर्ड डालें"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className="h-14 text-lg rounded-xl pr-14"
                    required
                    autoComplete="current-password"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="toggle-password-visibility"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {loginMutation.isError && (
                <Card className="bg-destructive/10 border-destructive/20" data-testid="login-error">
                  <CardContent className="p-4 text-center">
                    <p className="text-base font-semibold text-destructive mb-1">लॉगिन नहीं हुआ</p>
                    <p className="text-sm text-destructive/80">
                      {loginMutation.error instanceof Error && loginMutation.error.message.includes('401:')
                        ? 'गलत नंबर या पासवर्ड। Wrong number or password.'
                        : 'कुछ गड़बड़ी हुई। Something went wrong.'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold rounded-xl"
                disabled={loginMutation.isPending || !formData.username.trim() || !formData.password.trim()}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    अंदर आ रहे हैं...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    अंदर आएं • Sign In
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Register Link */}
        <Card className="bg-muted/50">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              पहली बार आए हैं? • First time here?
            </p>
            <Button
              variant="outline"
              onClick={() => setLocation('/register')}
              className="h-12 px-6 rounded-xl"
              data-testid="link-register"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              नया खाता बनाएं • Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
