import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function Contact() {
  return (
    <div className="bg-teal-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Contact OceanView Resort
          </h1>
          <p className="text-teal-100 text-lg md:text-xl max-w-3xl mx-auto">
            We’re here to help! Questions, feedback, or reservations – reach out to us and let’s make your stay unforgettable.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Contact Info */}
          <div className="space-y-10">
            <h2 className="font-serif text-4xl font-bold text-teal-900 mb-4">Get in Touch</h2>
            <p className="text-teal-800 text-lg">
              Our team is ready to assist you. Contact us using any of the following methods:
            </p>

            <div className="space-y-6">

              {/* Address */}
              <div className="flex items-start gap-4 bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
                <MapPin className="w-6 h-6 text-teal-600 mt-1" />
                <div>
                  <h4 className="font-medium text-teal-800 text-lg">Address</h4>
                  <p className="text-teal-700">
                    123 Ocean Drive, Paradise Island, Maldives
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
                <Phone className="w-6 h-6 text-teal-600 mt-1" />
                <div>
                  <h4 className="font-medium text-teal-800 text-lg">Phone</h4>
                  <p className="text-teal-700">+1 (555) 123-4567</p>
                  <p className="text-teal-600 text-sm mt-1">Available 9AM - 9PM IST</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
                <Mail className="w-6 h-6 text-teal-600 mt-1" />
                <div>
                  <h4 className="font-medium text-teal-800 text-lg">Email</h4>
                  <p className="text-teal-700">reservations@oceanview.com</p>
                  <p className="text-teal-600 text-sm mt-1">Response within 24 hours</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4 bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
                <Clock className="w-6 h-6 text-teal-600 mt-1" />
                <div>
                  <h4 className="font-medium text-teal-800 text-lg">Working Hours</h4>
                  <p className="text-teal-700">Monday - Sunday: 9AM - 9PM</p>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-start gap-4 bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
                <div className="flex gap-4">
                  <Instagram className="w-6 h-6 text-pink-400 cursor-pointer" />
                  <Facebook className="w-6 h-6 text-blue-600 cursor-pointer" />
                  <Twitter className="w-6 h-6 text-blue-400 cursor-pointer" />
                </div>
                <div>
                  <h4 className="font-medium text-teal-800 text-lg">Follow Us</h4>
                  <p className="text-teal-700">Stay updated with our latest offers and events.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-teal-100">
            <h3 className="font-serif text-3xl font-bold text-teal-900 mb-8">
              Send Us a Message
            </h3>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Full Name" />
                <Input type="email" placeholder="Email Address" />
              </div>
              <Input placeholder="Subject" />
              <textarea
                placeholder="Your Message"
                className="w-full p-4 rounded-xl border border-teal-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none h-32 bg-teal-50"
              />
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg">
                Send Message
              </Button>
            </form>
          </div>

        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 w-full">
        <iframe
          className="w-full h-full rounded-3xl shadow-lg border-0"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019315328385!2d144.963058!3d-37.814217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577b2c1c1e0c5e0!2s123%20Ocean%20Drive!5e0!3m2!1sen!2sus!4v1685271234567!5m2!1sen!2sus"
          allowFullScreen
          loading="lazy"
        />
      </section>

    </div>
  );
}
