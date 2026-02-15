import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { toast } from 'sonner';
import { User, Camera } from 'lucide-react';
export function StaffProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage your personal information.</p>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-ocean-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                <img
                  src="https://ui-avatars.com/api/?name=Staff+Member&background=3B82F6&color=fff&size=128"
                  alt="Profile"
                  className="w-full h-full object-cover" />

              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-ocean-DEFAULT text-white rounded-full shadow-md hover:bg-ocean-deep transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center">
              <h2 className="font-bold text-lg">Staff Member</h2>
              <p className="text-sm text-gray-500">Front Desk Officer</p>
              <p className="text-xs text-ocean-DEFAULT font-mono mt-1">
                ID: EMP-2024-001
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                defaultValue="Staff"
                disabled={!isEditing} />

              <Input
                label="Last Name"
                defaultValue="Member"
                disabled={!isEditing} />

              <Input
                label="Email"
                defaultValue="staff@oceanview.com"
                disabled={!isEditing} />

              <Input
                label="Phone"
                defaultValue="+94 77 123 4567"
                disabled={!isEditing} />

              <Input label="Department" defaultValue="Front Office" disabled />
              <Input label="Join Date" defaultValue="2023-01-15" disabled />
            </div>

            {isEditing ?
            <div className="flex gap-2 justify-end mt-6">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div> :

            <div className="flex justify-end mt-6">
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              </div>
            }
          </div>
        </div>
      </Card>

      <Card title="Security">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">Password</h3>
            <p className="text-sm text-gray-500">Last changed 3 months ago</p>
          </div>
          <Button variant="outline">Change Password</Button>
        </div>
      </Card>
    </div>);

}