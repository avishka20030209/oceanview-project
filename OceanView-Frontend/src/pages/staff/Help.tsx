import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Phone, Mail, FileText, HelpCircle } from 'lucide-react';
export function StaffHelp() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-500">Guides, FAQs, and Admin contact.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Frequently Asked Questions">
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
              }].
              map((faq, i) =>
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-ocean-deep mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" /> {faq.q}
                  </h4>
                  <p className="text-sm text-gray-600 ml-6">{faq.a}</p>
                </div>
              )}
            </div>
          </Card>

          <Card title="System Guidelines">
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Always verify guest ID upon check-in.</li>
              <li>Collect full payment before handing over room keys.</li>
              <li>Update room status immediately after check-out.</li>
              <li>Report maintenance issues via the Maintenance Log.</li>
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-ocean-deep text-white">
            <h3 className="font-bold text-lg mb-4">Contact Admin</h3>
            <p className="text-ocean-100 text-sm mb-6">
              Need urgent assistance? Contact the system administrator directly.
            </p>
            <div className="space-y-3">
              <a href="tel:+94768164113" className="block">
                <Button
                  className="w-full bg-white text-ocean-deep hover:bg-gray-100"
                  leftIcon={<Phone className="h-4 w-4" />}>

                  Call Admin
                </Button>
              </a>
              <a href="mailto:admin@oceanview.com" className="block">
                <Button
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white/10"
                  leftIcon={<Mail className="h-4 w-4" />}>

                  Email Support
                </Button>
              </a>
            </div>
          </Card>

          <Card title="Quick Links">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                leftIcon={<FileText className="h-4 w-4" />}>

                User Manual PDF
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                leftIcon={<FileText className="h-4 w-4" />}>

                Policy Document
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}