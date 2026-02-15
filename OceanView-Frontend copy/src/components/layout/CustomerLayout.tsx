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
  const { user, setUser } = useAuth(); // 🔑 get user from context

  const navLinks = [
    { label: 'Home', href: '/customer' },
    { label: 'Rooms & Suites', href: '/customer/rooms' },
    { label: 'My Bookings', href: '/customer/my-bookings' },
    { label: 'Contact', href: '/customer/contact' },
  ];

  const handleLogout = () => {
    clearSession(); // clears localStorage
    setUser(null); // clears context
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/customer" className="flex items-center gap-2">
              <span className="text-2xl">🌊</span>
              <span className="font-serif text-2xl font-bold text-ocean-deep">
                Ocean View
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-ocean-DEFAULT ${
                    location.pathname === link.href
                      ? 'text-ocean-deep font-semibold'
                      : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-ocean-deep">
                    Hello, {user.name.split(' ')[0]}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </Button>
                </div>
              ) : (
                <Link to="/customer/rooms">
                  <Button size="sm">Book Now</Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-base font-medium text-gray-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <Button className="w-full flex items-center justify-center gap-2" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            ) : (
              <Link to="/customer/rooms" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Book Now</Button>
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */} <footer className="bg-ocean-deep text-white pt-16 pb-8"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"> <div className="col-span-1 md:col-span-2"> <div className="flex items-center gap-2 mb-6"> <span className="text-2xl">🌊</span> <span className="font-serif text-2xl font-bold text-sand"> Ocean View Resort </span> </div> <p className="text-ocean-100 max-w-md leading-relaxed"> Experience the ultimate luxury at our oceanfront paradise. Where pristine sands meet crystal clear waters, creating memories that last a lifetime. </p> </div> <div> <h4 className="font-serif text-lg font-semibold text-sand mb-6"> Quick Links </h4> <ul className="space-y-3 text-ocean-100"> <li> <Link to="/customer/rooms" className="hover:text-white transition-colors"> Accommodations </Link> </li> <li> <Link to="/customer/amenities" className="hover:text-white transition-colors"> Amenities </Link> </li> <li> <Link to="/customer/dining" className="hover:text-white transition-colors"> Dining </Link> </li> <li> <Link to="/customer/contact" className="hover:text-white transition-colors"> Contact Us </Link> </li> </ul> </div> <div> <h4 className="font-serif text-lg font-semibold text-sand mb-6"> Contact </h4> <ul className="space-y-3 text-ocean-100"> <li>123 Ocean Drive, Paradise Island</li> <li>+1 (555) 123-4567</li> <li>reservations@oceanview.com</li> </ul> </div> </div> <div className="border-t border-ocean-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-ocean-200"> <p>© 2024 Ocean View Resort. All rights reserved.</p> <div className="flex gap-6"> <a href="#" className="hover:text-white"> Privacy Policy </a> <a href="#" className="hover:text-white"> Terms of Service </a> </div> </div> </div> </footer>
    </div>
  );
}
