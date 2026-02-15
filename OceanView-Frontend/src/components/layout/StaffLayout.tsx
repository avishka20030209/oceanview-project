import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  CreditCard,
  HelpCircle,
  User } from
'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
export function StaffLayout() {
  const navItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/staff/dashboard'
  },
  {
    label: 'New Reservation',
    icon: PlusCircle,
    href: '/staff/new-reservation'
  },
  {
    label: 'View Reservations',
    icon: Search,
    href: '/staff/search'
  },
  {
    label: 'Billing',
    icon: CreditCard,
    href: '/staff/billing'
  },
  {
    label: 'Help & Guide',
    icon: HelpCircle,
    href: '/staff/help'
  },
  {
    label: 'My Profile',
    icon: User,
    href: '/staff/profile'
  }];

  return (
    <div className="flex min-h-screen bg-gray-50" >
      <Sidebar items={navItems} role="Staff" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={{
            name: 'Staff Member',
            avatar:
            'https://ui-avatars.com/api/?name=Staff+Member&background=3B82F6&color=fff'
          }} />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>);

}