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
  const { setUser } = useAuth(); // 🔑 Important for context
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectUrl = getRedirectUrl(); // check if user was redirected from a protected page

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Register the user
      const data = await postUser('register', {
        fullName: `${firstName} ${lastName}`,
        email,
        password,
        phone,
        role: 'CUSTOMER',
      });

      if (data.status === 'success') {
        toast.success('Registration successful! Logging you in...');

        // Auto-login
        const loginData = await postUser('login', { email, password });
        if (loginData.status === 'success') {
          const user: AuthUser = {
            id: loginData.userId || 0,
            name: loginData.fullName,
            email,
            role: loginData.role,
          };

          // Save user in localStorage and context
          storeLogin(user);
          setUser(user); // 🔑 Updates AuthContext

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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000"
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
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Join Ocean View
          </h1>
          <p className="text-ocean-100">Create your account to start booking</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                <a href="/login" className="text-ocean-DEFAULT font-medium hover:underline">
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
