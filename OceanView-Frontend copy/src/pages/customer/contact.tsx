import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';


export default function Contact() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-ocean-deep text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-ocean-100 max-w-2xl mx-auto">
            We’d love to hear from you. Whether you have a question, feedback, or need assistance.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-ocean-deep mb-6">
              Get in Touch
            </h2>

            <p className="text-gray-600 mb-10">
              Our team is always ready to assist you. Reach out to us using any of the
              methods below.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-ocean-DEFAULT" />
                <div>
                  <h4 className="font-medium text-ocean-deep">Address</h4>
                  <p className="text-gray-600">
                    123 Ocean Drive, Paradise Island
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-ocean-DEFAULT" />
                <div>
                  <h4 className="font-medium text-ocean-deep">Phone</h4>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-ocean-DEFAULT" />
                <div>
                  <h4 className="font-medium text-ocean-deep">Email</h4>
                  <p className="text-gray-600">reservations@oceanview.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-2xl shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-ocean-deep mb-6">
              Send Us a Message
            </h3>

            <form className="space-y-5">
              <Input placeholder="Full Name" />
              <Input type="email" placeholder="Email Address" />
              <Input placeholder="Subject" />
              
              <Button className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
