import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  BarChart3,
  FileText,
  Settings,
  Hotel,
  Menu
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Room Management', icon: Hotel, href: '/admin/rooms' },
    { label: 'User Management', icon: Users, href: '/admin/users' },
    { label: 'Reservations', icon: CalendarDays, href: '/admin/reservations' },
    { label: 'Reports', icon: BarChart3, href: '/admin/reports' },
    
    { label: 'Settings', icon: Settings, href: '/admin/settings' }
  ];

  return (
    <div className="flex min-h-screen bg-emerald-50">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        items={navItems}
        role="Admin"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="bg-teal-700 text-white"
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile header */}
        <div className="md:hidden h-16 bg-teal-600 border-b border-teal-500 flex items-center px-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-emerald-100 transition-colors"
          >
            <Menu size={24} />
          </button>

          <span className="ml-3 font-semibold text-white">
            Admin Panel
          </span>
        </div>

        {/* Desktop header */}
        <div className="hidden md:block">
          <Header
            user={{
              name: 'Admin User',
              avatar:
                'https://ui-avatars.com/api/?name=Admin+User&background=008080&color=fff'
            }}
            className="bg-teal-600 text-white shadow-md"
          />
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-emerald-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
