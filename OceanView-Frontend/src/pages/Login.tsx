import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { postUser, login as storeLogin, clearRedirectUrl, AuthUser } from '../utils/auth';
import { useAuth } from '../utils/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth(); // 🔑 Set context user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectUrl = new URLSearchParams(location.search).get('redirect');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await postUser('login', { email, password });

      if (data.status === 'success') {
        // Build user object
        const user: AuthUser = {
          id: data.userId || 0,
          name: data.fullName,
          email,
          role: data.role,
        };

        // Save in localStorage and context
        storeLogin(user);
        setUser(user); // 🔑 Important for ProtectedRoute

        toast.success(`Welcome back, ${user.name}`);

        // Determine redirect
        const destination =
          redirectUrl ||
          (user.role === 'ADMIN'
            ? '/admin/dashboard'
            : user.role === 'STAFF'
            ? '/staff/dashboard'
            : '/customer');

        clearRedirectUrl();
        navigate(destination, { replace: true });
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Resort Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ocean-deep/60 backdrop-blur-[2px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-white mb-2">Ocean View Resort</h1>
          <p className="text-ocean-100">Experience luxury at its finest</p>
          {redirectUrl && (
            <p className="text-sm text-yellow-300 mt-2">Please login to continue booking</p>
          )}
        </div>

        <Card className="bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end mt-1">
              <a href="#" className="text-xs text-ocean-DEFAULT hover:underline">
                Forgot password?
              </a>
            </div>

            <Button className="w-full h-12 text-base" size="lg" isLoading={isLoading}>
              Sign In
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                New to Ocean View?{' '}
                <a href="/register" className="text-ocean-DEFAULT font-medium hover:underline">
                  Create Account
                </a>
              </p>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
