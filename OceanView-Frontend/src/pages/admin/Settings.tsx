import React from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { toast } from 'sonner';

export function Settings() {
  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-4xl mx-auto py-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-3xl p-6 shadow-xl">
        <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-teal-100 mt-1">Configure system parameters and preferences in your Idol-style dashboard.</p>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* General Information */}
        <Card className="p-6 rounded-3xl shadow-xl border border-emerald-100 bg-white hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-bold text-teal-900 mb-4">General Information</h2>
          <div className="space-y-4">
            <Input
              label="Hotel Name"
              defaultValue="Ocean View Resort"
              className="focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
            />
            <Input
              label="Contact Email"
              defaultValue="info@oceanview.com"
              className="focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
            />
            <Input
              label="Phone Number"
              defaultValue="+94 77 123 4567"
              className="focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
            />
            <Input
              label="Address"
              defaultValue="123 Coastal Road, Galle, Sri Lanka"
              className="focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
            />
          </div>
        </Card>

        {/* Booking Configuration */}
        <Card className="p-6 rounded-3xl shadow-xl border border-emerald-100 bg-white hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-bold text-teal-900 mb-4">Booking Configuration</h2>
          <div className="space-y-4">
            <Input
              label="Default Check-in Time"
              type="time"
              defaultValue="14:00"
              className="focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
            />
            <Input
              label="Default Check-out Time"
              type="time"
              defaultValue="11:00"
              className="focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
            />
            <Input
              label="Tax Rate (%)"
              type="number"
              defaultValue="15"
              className="focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
            />

            {/* Maintenance Mode */}
            <div className="flex items-center gap-3 mt-4">
              <input
                type="checkbox"
                id="maintenance"
                className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-300"
              />
              <label htmlFor="maintenance" className="text-sm text-gray-700">
                Enable Maintenance Mode
              </label>
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button
          size="lg"
          className="bg-gradient-to-br from-teal-700 to-emerald-500 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-transform"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}