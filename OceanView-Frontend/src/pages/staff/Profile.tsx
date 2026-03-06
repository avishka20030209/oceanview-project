import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';

export function StaffProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-4xl mx-auto py-8">

      {/* Profile Header Box */}
      <Card className="relative p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          {/* Glow behind avatar */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-emerald-400 via-teal-300 to-cyan-300 opacity-20 blur-3xl"></div>
          <div className="relative w-36 h-36 rounded-full bg-white flex items-center justify-center shadow-2xl overflow-hidden">
            <img
              src="https://ui-avatars.com/api/?name=Staff+Member&background=3B82F6&color=fff&size=128"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-md hover:scale-110 transition-transform">
            <Camera className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="font-extrabold text-3xl">Staff Member</h2>
          <p className="text-teal-100 text-sm mt-1">Front Desk Officer</p>
          <p className="text-teal-200 font-mono mt-2 text-xs">ID: EMP-2024-001</p>
        </div>

        <div className="flex mt-4 md:mt-0 gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-br from-teal-700 to-emerald-500 text-white shadow hover:-translate-y-0.5 hover:shadow-lg transition-transform">
                Save
              </Button>
            </>
          ) : (
            <Button className="bg-gradient-to-br from-teal-700 to-emerald-500 text-white shadow hover:-translate-y-0.5 hover:shadow-lg transition-transform" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      {/* Form Fields Card */}
      <Card className="p-8 rounded-3xl shadow-xl bg-white border border-emerald-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            defaultValue="Staff"
            disabled={!isEditing}
            className="focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
          />
          <Input
            label="Last Name"
            defaultValue="Member"
            disabled={!isEditing}
            className="focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
          />
          <Input
            label="Email"
            defaultValue="staff@oceanview.com"
            disabled={!isEditing}
            className="focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
          />
          <Input
            label="Phone"
            defaultValue="+94 77 123 4567"
            disabled={!isEditing}
            className="focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
          />
          <Input
            label="Department"
            defaultValue="Front Office"
            disabled
            className="focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
          />
          <Input
            label="Join Date"
            defaultValue="2023-01-15"
            disabled
            className="focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
          />
        </div>
      </Card>

      {/* Security Card */}
      <Card className="p-8 rounded-3xl shadow-xl bg-white border border-emerald-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-teal-900">Password</h3>
            <p className="text-sm text-teal-700">Last changed 1 months ago</p>
          </div>
          <Button className="bg-gradient-to-br from-teal-700 to-emerald-500 text-white shadow hover:-translate-y-0.5 hover:shadow-lg transition-transform">
            Change Password
          </Button>
        </div>
      </Card>

    </div>
  );
}