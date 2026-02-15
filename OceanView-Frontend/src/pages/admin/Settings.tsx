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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500">
          Configure system parameters and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="General Information">
          <div className="space-y-4">
            <Input label="Hotel Name" defaultValue="Ocean View Resort" />
            <Input label="Contact Email" defaultValue="info@oceanview.com" />
            <Input label="Phone Number" defaultValue="+94 77 123 4567" />
            <Input
              label="Address"
              defaultValue="123 Coastal Road, Galle, Sri Lanka" />

          </div>
        </Card>

        <Card title="Booking Configuration">
          <div className="space-y-4">
            <Input
              label="Default Check-in Time"
              type="time"
              defaultValue="14:00" />

            <Input
              label="Default Check-out Time"
              type="time"
              defaultValue="11:00" />

            <Input label="Tax Rate (%)" type="number" defaultValue="15" />
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="maintenance"
                className="rounded border-gray-300 text-ocean-DEFAULT focus:ring-ocean-light" />

              <label htmlFor="maintenance" className="text-sm text-gray-700">
                Enable Maintenance Mode
              </label>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>);

}