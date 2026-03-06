import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Phone, Mail, FileText, HelpCircle } from 'lucide-react';

export function StaffHelp() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col space-y-6 animate-fade-in">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-emerald-100 mt-1">Guides, FAQs, and Admin contact.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left / Center Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* FAQ Card */}
          <Card className="p-6 rounded-3xl shadow-md hover:shadow-2xl transition-all bg-white">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {[
                {
                  q: 'How do I cancel a reservation?',
                  a: "Go to Reservation Search, find the booking, click details, and select 'Cancel' if permitted."
                },
                {
                  q: 'How to process a refund?',
                  a: 'Refunds must be approved by Admin. Please contact Admin support.'
                },
                {
                  q: 'Can I change a room assignment?',
                  a: 'Yes, edit the reservation details and select a new available room.'
                }
              ].map((faq, i) => (
                <div
                  key={i}
                  className="p-4 bg-emerald-50 rounded-xl ring-1 ring-emerald-100 hover:bg-emerald-100 transition"
                >
                  <h4 className="font-medium text-teal-700 mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" /> {faq.q}
                  </h4>
                  <p className="text-sm text-gray-600 ml-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* System Guidelines Card */}
          <Card className="p-6 rounded-3xl shadow-md hover:shadow-2xl transition-all bg-white">
            <h3 className="text-xl font-bold text-gray-800 mb-4">System Guidelines</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Always verify guest ID upon check-in.</li>
              <li>Collect full payment before handing over room keys.</li>
              <li>Update room status immediately after check-out.</li>
              <li>Report maintenance issues via the Maintenance Log.</li>
            </ul>
          </Card>

        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Contact Admin */}
          <Card className="p-6 rounded-3xl shadow-md hover:shadow-2xl transition-all bg-gradient-to-br from-emerald-600 to-teal-500 text-white">
            <h3 className="font-bold text-lg mb-4">Contact Admin</h3>
            <p className="text-emerald-100 text-sm mb-6">
              Need urgent assistance? Contact the system administrator directly.
            </p>
            <div className="space-y-3">
             <a href="tel:+94768164113" className="block">
  <Button
    className="w-full bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md rounded-xl"
  >
    <Phone className="h-4 w-4" /> Call Admin
  </Button>
</a>
              <a href="mailto:admin@oceanview.com" className="block">
                <Button variant="outline" className="w-full border-white text-white hover:bg-white/10 flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" /> Email Support
                </Button>
              </a>
            </div>
          </Card>

          {/* Quick Links */}
          <Card className="p-6 rounded-3xl shadow-md hover:shadow-2xl transition-all bg-white">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start flex items-center gap-2" leftIcon={<FileText className="h-4 w-4" />}>
                User Manual PDF
              </Button>
              <Button variant="ghost" className="w-full justify-start flex items-center gap-2" leftIcon={<FileText className="h-4 w-4" />}>
                Policy Document
              </Button>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}