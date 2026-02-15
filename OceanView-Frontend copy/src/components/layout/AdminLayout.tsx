import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  BarChart3,
  FileText,
  Settings,
  Hotel } from
'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
export function AdminLayout() {
  const navItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard'
  },
  {
    label: 'Room Management',
    icon: Hotel,
    href: '/admin/rooms'
  },
  {
    label: 'User Management',
    icon: Users,
    href: '/admin/users'
  },
  {
    label: 'Reservations',
    icon: CalendarDays,
    href: '/admin/reservations'
  },
  {
    label: 'Reports',
    icon: BarChart3,
    href: '/admin/Reports'
  },
  {
    label: 'System Logs',
    icon: FileText,
    href: '/admin/logs'
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/admin/settings'
  }];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={navItems} role="Admin" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={{
            name: 'Admin User',
            avatar:
            'https://ui-avatars.com/api/?name=Admin+User&background=0A2463&color=fff'
          }} />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>);

}