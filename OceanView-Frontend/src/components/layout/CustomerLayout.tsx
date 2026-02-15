import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../utils/AuthContext';
import { logout as clearSession } from '../../utils/auth';

export function CustomerLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const navLinks = [
    { label: 'Home', href: '/customer' },
    { label: 'Rooms & Suites', href: '/customer/rooms' },
    { label: 'My Bookings', href: '/customer/my-bookings' },
    { label: 'Contact', href: '/customer/contact' },
  ];

  const handleLogout = () => {
    clearSession();
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50 font-poppins">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg shadow-md border-b border-teal-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/customer" className="flex items-center gap-2">
              <span className="text-3xl animate-bounce">🌴</span>
              <span className="text-2xl font-bold text-teal-900 font-serif">Ocean View</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                    location.pathname === link.href
                      ? 'text-teal-800 font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-teal-800">
                    Hello, {user.name.split(' ')[0]}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 border-teal-600 text-teal-600 hover:bg-teal-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </Button>
                </div>
              ) : (
                <Link to="/customer/rooms">
                  <Button size="sm" className="bg-teal-600 text-white hover:bg-teal-700">
                    Book Now
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 border-t border-teal-200 p-4 flex flex-col gap-4 shadow-lg backdrop-blur-sm rounded-b-xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-base font-medium text-teal-800 py-2 hover:text-teal-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <Button
                className="w-full flex items-center justify-center gap-2 border-teal-600 text-teal-600 hover:bg-teal-50"
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
              >
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            ) : (
              <Link to="/customer/rooms" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-teal-600 text-white hover:bg-teal-700">Book Now</Button>
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-teal-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl animate-pulse">🌴</span>
                <span className="text-2xl font-bold font-serif text-teal-50">
                  Ocean View Resort
                </span>
              </div>
              <p className="text-teal-100 max-w-md leading-relaxed">
                Discover tropical paradise and luxury accommodations. Crystal-clear waters, lush greenery, and memories that last a lifetime.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-serif text-lg font-semibold text-teal-50 mb-6">Quick Links</h4>
              <ul className="space-y-3 text-teal-200">
                <li>
                  <Link to="/customer/rooms" className="hover:text-white transition-colors">Accommodations</Link>
                </li>
                <li>
                  <Link to="/customer/amenities" className="hover:text-white transition-colors">Amenities</Link>
                </li>
                <li>
                  <Link to="/customer/dining" className="hover:text-white transition-colors">Dining</Link>
                </li>
                <li>
                  <Link to="/customer/contact" className="hover:text-white transition-colors">Contact Us</Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-serif text-lg font-semibold text-teal-50 mb-6">Contact</h4>
              <ul className="space-y-3 text-teal-200">
                <li>123 Ocean Drive, Paradise Island</li>
                <li>+1 (555) 123-4567</li>
                <li>reservations@oceanview.com</li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-teal-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-teal-200">
            <p>© 2024 Ocean View Resort. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
