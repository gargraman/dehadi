import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, EyeOff, User, Lock } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Friendly Welcome */}
        <div className="text-center space-y-4">
          <div className="text-8xl mb-4">🙏</div>
          <h1 className="text-4xl font-bold text-gray-800">नमस्ते!</h1>
          <h2 className="text-2xl text-gray-600">Welcome Back</h2>
          <p className="text-lg text-gray-500">अपनी जानकारी भरें / Enter your details</p>
        </div>

        {/* Simple Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field - Bigger and Friendlier */}
          <div>
            <div className="text-center mb-3">
              <User size={32} className="text-blue-500 mx-auto" />
              <p className="text-xl font-semibold text-gray-800">📱 फोन नंबर या नाम</p>
              <p className="text-sm text-gray-600">Phone or Username</p>
            </div>
            <Input
              id="username"
              type="text"
              placeholder="जैसे: 9876543210 या राम शर्मा"
              value={formData.username}
              onChange={handleInputChange('username')}
              className="h-16 text-xl text-center rounded-2xl border-4 border-blue-300 focus:border-blue-500"
              required
              autoComplete="username"
              data-testid="input-username"
            />
          </div>

          {/* Password Field - Bigger and Friendlier */}
          <div>
            <div className="text-center mb-3">
              <Lock size={32} className="text-green-500 mx-auto" />
              <p className="text-xl font-semibold text-gray-800">🔒 पासवर्ड</p>
              <p className="text-sm text-gray-600">Password</p>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="अपना पासवर्ड डालें"
                value={formData.password}
                onChange={handleInputChange('password')}
                className="h-16 text-xl text-center rounded-2xl border-4 border-green-300 focus:border-green-500 pr-16"
                required
                autoComplete="current-password"
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2"
                data-testid="toggle-password-visibility"
              >
                {showPassword ? (
                  <EyeOff size={28} className="text-gray-500" />
                ) : (
                  <Eye size={28} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Error Display - Friendly */}
          {loginMutation.isError && (
            <div className="text-center bg-red-50 border-4 border-red-200 p-6 rounded-2xl" data-testid="login-error">
              <div className="text-4xl mb-2">😔</div>
              <p className="text-xl font-semibold text-red-800 mb-2">लॉगिन नहीं हुआ</p>
              <p className="text-lg text-red-700">
                {loginMutation.error instanceof Error && loginMutation.error.message.includes('401:')
                  ? 'गलत नंबर या पासवर्ड है। फिर से कोशिश करें।'
                  : 'कुछ गड़बड़ी हुई। फिर से कोशिश करें।'
                }
              </p>
            </div>
          )}

          {/* Submit Button - Giant and Obvious */}
          <Button
            type="submit"
            className="w-full h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-2xl rounded-3xl disabled:opacity-50"
            disabled={loginMutation.isPending || !formData.username.trim() || !formData.password.trim()}
            data-testid="button-login"
          >
            {loginMutation.isPending ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <div className="text-xl font-bold">अंदर आ रहे हैं...</div>
                <div className="text-sm opacity-90">Signing in...</div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl">🚪</div>
                <div className="text-2xl font-bold">अंदर आएं</div>
                <div className="text-sm opacity-90">Sign In</div>
              </div>
            )}
          </Button>
        </form>

        {/* Register Link - Friendly */}
        <div className="text-center bg-blue-50 p-6 rounded-2xl">
          <p className="text-lg text-gray-700 mb-3">
            🤔 पहली बार आए हैं?
          </p>
          <p className="text-sm text-gray-600 mb-4">First time here?</p>
          <Button
            variant="outline"
            onClick={() => setLocation('/register')}
            className="border-4 border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-2xl"
            data-testid="link-register"
          >
            📝 नया खाता बनाएं
          </Button>
        </div>
      </div>
    </div>
  );
}