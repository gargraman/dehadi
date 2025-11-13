import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

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
    onSuccess: (data) => {
      console.log('Login successful:', data);
      // Redirect based on role
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your Dehadi account</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  className="h-12 text-base"
                  required
                  autoComplete="username"
                  data-testid="input-username"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className="h-12 text-base pr-10"
                    required
                    autoComplete="current-password"
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

              {/* Error Display */}
              {loginMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription data-testid="login-error">
                    {loginMutation.error instanceof Error
                      ? loginMutation.error.message.includes('401:')
                        ? 'Invalid username or password. Please try again.'
                        : 'Login failed. Please try again.'
                      : 'Login failed. Please try again.'
                    }
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12"
                disabled={loginMutation.isPending || !formData.username.trim() || !formData.password.trim()}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={() => setLocation('/register')}
              className="text-primary hover:text-primary/80 font-medium"
              data-testid="link-register"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}