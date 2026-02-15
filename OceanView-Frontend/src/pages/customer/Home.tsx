import React from 'react';
import { ArrowRight, Star, Wifi, Coffee, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function CustomerHome() {
  return (
    <div className="animate-fade-in font-poppins bg-emerald-50">
      {/* Hero Section */}
      <section className="relative flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 gap-12 min-h-screen">
        
        {/* Left Side Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 flex flex-col justify-center"
        >
          <span className="uppercase tracking-[0.3em] text-teal-600 font-semibold mb-4">
            Welcome to Paradise
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-teal-900 mb-6 leading-tight">
            Experience Luxury <br /> By The Ocean
          </h1>
          <p className="text-lg md:text-xl text-teal-800/80 mb-8">
            Discover a tropical sanctuary where lush greenery meets crystal-clear waters.
            Your perfect escape awaits at Ocean View Resort.
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-md">
              <Star className="w-6 h-6 text-teal-600" />
              <span className="text-teal-900 font-medium">5-Star Service</span>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-md">
              <Wifi className="w-6 h-6 text-teal-600" />
              <span className="text-teal-900 font-medium">High-Speed Wi-Fi</span>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-md">
              <Coffee className="w-6 h-6 text-teal-600" />
              <span className="text-teal-900 font-medium">Gourmet Dining</span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/customer/rooms">
              <Button
                size="lg"
                className="bg-teal-600 text-white min-w-[180px] h-14 hover:bg-teal-700"
              >
                Book Your Stay
              </Button>
            </Link>
            <Link to="/customer/rooms">
              <Button
                size="lg"
                variant="outline"
                className="min-w-[180px] h-14 text-teal-600 border-teal-600 hover:bg-teal-50"
              >
                View Rooms
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Right Side Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 flex justify-center"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl w-full max-w-lg h-[600px] md:h-[700px]">
            <img
              src="https://img.freepik.com/premium-photo/luxury-hotel-room-with-ocean-view_1022456-198552.jpg"
              alt="Luxury Room"
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
          </div>
        </motion.div>
      </section>

      {/* Optional Additional Features Section */}
      <section className="py-24 bg-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-900 mb-4">Why Choose Us?</h2>
          <p className="text-teal-800/80 mb-12 max-w-2xl mx-auto">
            Our resort combines luxury, comfort, and exceptional service for an unforgettable stay.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: 'Exceptional Service', desc: 'Dedicated staff to make your stay perfect.' },
              { icon: Wifi, title: 'Seamless Connectivity', desc: 'High-speed Wi-Fi throughout the property.' },
              { icon: Coffee, title: 'Gourmet Dining', desc: 'Exquisite cuisine at every meal.' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">
                <feature.icon className="w-10 h-10 text-teal-600 mb-4 mx-auto" />
                <h3 className="text-xl font-bold text-teal-900 mb-2">{feature.title}</h3>
                <p className="text-teal-800/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
