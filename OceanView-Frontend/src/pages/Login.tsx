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
  const { setUser } = useAuth();
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
        const user: AuthUser = {
          id: data.userId || 0,
          name: data.fullName,
          email,
          role: data.role,
        };

        storeLogin(user);
        setUser(user);
        toast.success(`Welcome back, ${user.name}`);

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
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="flex w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Image Panel */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
            alt="Tropical Resort"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-2000/10 backdrop-blur-sm" />
        </div>

        {/* Right Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 bg-white p-10 md:p-16 flex flex-col justify-center"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-2 font-poppins">
              Ocean View Resort
            </h1>
            <p className="text-green-700 text-sm md:text-base">
              Sign in to continue your unforgettable island escape
            </p>
            {redirectUrl && (
              <p className="text-sm text-yellow-500 mt-2">
                Please sign in to proceed with your reservation
              </p>
            )}
          </div>

          <Card className="bg-white/95 backdrop-blur-xl border border-green-100 shadow-xl p-8">
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
                <a href="#" className="text-xs text-green-700 hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button className="w-full h-12 text-base" size="lg" isLoading={isLoading}>
                Sign In
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  New to Ocean View?{' '}
                  <a href="/register" className="text-green-700 font-medium hover:underline">
                    Create Account
                  </a>
                </p>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
