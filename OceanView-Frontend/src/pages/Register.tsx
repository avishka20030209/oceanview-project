import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { postUser, login as storeLogin, clearRedirectUrl, getRedirectUrl, AuthUser } from '../utils/auth';
import { useAuth } from '../utils/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';

export function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectUrl = getRedirectUrl();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const data = await postUser('register', {
        fullName: `${firstName} ${lastName}`,
        email,
        password,
        phone,
        role: 'CUSTOMER',
      });

      if (data.status === 'success') {
        toast.success('Registration successful! Logging you in...');

        const loginData = await postUser('login', { email, password });
        if (loginData.status === 'success') {
          const user: AuthUser = {
            id: loginData.userId || 0,
            name: loginData.fullName,
            email,
            role: loginData.role,
          };

          storeLogin(user);
          setUser(user);

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
          toast.error('Login after registration failed. Please login manually.');
          navigate('/login', { replace: true });
        }
      } else {
        toast.error(data.message || 'Registration failed');
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
          <div className="absolute inset-0 bg-green-900/40 backdrop-blur-sm" />
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
              Join Ocean View
            </h1>
            <p className="text-green-700 text-sm md:text-base">
              Create your account to start booking
            </p>
          </div>

          <Card className="bg-white/95 backdrop-blur-xl border border-green-100 shadow-xl p-8">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+94 77 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button
                className="w-full h-12 text-base mt-4"
                size="lg"
                isLoading={isLoading}
              >
                Create Account
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <a href="/login" className="text-green-700 font-medium hover:underline">
                    Sign In
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
