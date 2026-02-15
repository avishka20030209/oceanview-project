import React from 'react';
import { ArrowRight, Star, Wifi, Coffee, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
export function CustomerHome() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury Hotel"
            className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.span
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.2
            }}
            className="inline-block text-sand font-medium tracking-[0.2em] uppercase mb-4">

            Welcome to Paradise
          </motion.span>
          <motion.h1
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.4
            }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight text-white">

            Experience Luxury <br /> By The Ocean
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.6
            }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light">

            Discover a sanctuary of serenity where pristine sands meet crystal
            clear waters. Your perfect escape awaits at Ocean View Resort.
          </motion.p>
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.8
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link to="/customer/rooms">
              <Button
                size="lg"
                className="min-w-[200px] text-lg h-14 bg-sand text-ocean-deep hover:text-ocean-deep border-none">

                Book Your Stay
              </Button>
            </Link>
            <Link to="/customer/rooms">
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] text-lg h-14 text-white border-white hover:bg-white/10 hover:text-white">

                View Rooms
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-ocean-deep mb-4">
              World-Class Amenities
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Designed for your comfort and relaxation, our resort offers
              everything you need for an unforgettable stay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
            {
              icon: Star,
              title: '5-Star Service',
              desc: '24/7 concierge and room service dedicated to your needs.'
            },
            {
              icon: Wifi,
              title: 'High-Speed Wi-Fi',
              desc: 'Stay connected with complimentary high-speed internet throughout the resort.'
            },
            {
              icon: Coffee,
              title: 'Gourmet Dining',
              desc: 'Experience culinary excellence at our three award-winning restaurants.'
            }].
            map((feature, idx) =>
            <div
              key={idx}
              className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">

                <div className="h-16 w-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-6 text-ocean-DEFAULT">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Rooms Preview */}
      <section className="py-24 bg-sand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-ocean-deep mb-4">
                Featured Accommodations
              </h2>
              <p className="text-gray-600">
                Choose from our selection of luxury rooms and suites.
              </p>
            </div>
            <Link
              to="/customer/rooms"
              className="hidden md:flex items-center text-ocean-DEFAULT font-medium hover:text-ocean-deep transition-colors">

              View All Rooms <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Room 1 */}
            <div className="group cursor-pointer">
              <div className="relative h-80 overflow-hidden rounded-2xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
                  alt="Deluxe Room"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 group-hover:text-ocean-DEFAULT transition-colors">
                Ocean Deluxe King
              </h3>
              <p className="text-gray-500 mb-4 line-clamp-2">
                Wake up to the sound of waves in our spacious Deluxe King room
                featuring panoramic ocean views.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-ocean-deep">
                  $350{' '}
                  <span className="text-sm font-normal text-gray-500">
                    / night
                  </span>
                </span>
                <span className="text-sm font-medium text-ocean-DEFAULT group-hover:underline">
                  Book Now
                </span>
              </div>
            </div>

            {/* Room 2 */}
            <div className="group cursor-pointer">
              <div className="relative h-80 overflow-hidden rounded-2xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800"
                  alt="Garden Suite"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 group-hover:text-ocean-DEFAULT transition-colors">
                Garden Suite
              </h3>
              <p className="text-gray-500 mb-4 line-clamp-2">
                Perfect for families, our Garden Suite offers direct access to
                the resort gardens and pool area.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-ocean-deep">
                  $550{' '}
                  <span className="text-sm font-normal text-gray-500">
                    / night
                  </span>
                </span>
                <span className="text-sm font-medium text-ocean-DEFAULT group-hover:underline">
                  Book Now
                </span>
              </div>
            </div>

            {/* Room 3 */}
            <div className="group cursor-pointer">
              <div className="relative h-80 overflow-hidden rounded-2xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800"
                  alt="Royal Villa"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 group-hover:text-ocean-DEFAULT transition-colors">
                Royal Villa
              </h3>
              <p className="text-gray-500 mb-4 line-clamp-2">
                The ultimate luxury experience. Our Royal Villa features a
                private infinity pool and dedicated butler service.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-ocean-deep">
                  $1,200{' '}
                  <span className="text-sm font-normal text-gray-500">
                    / night
                  </span>
                </span>
                <span className="text-sm font-medium text-ocean-DEFAULT group-hover:underline">
                  Book Now
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/customer/rooms">
              <Button variant="outline" className="w-full">
                View All Rooms
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>);

}