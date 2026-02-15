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
    { label: 'System Logs', icon: FileText, href: '/admin/logs' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        items={navItems}
        role="Admin"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile header (hamburger lives here) */}
        <div className="md:hidden h-16 bg-white border-b flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700"
          >
            <Menu size={24} />
          </button>

          <span className="ml-3 font-semibold text-gray-800">
            Admin Panel
          </span>
        </div>

        {/* Desktop header (your existing Header) */}
        <div className="hidden md:block">
          <Header
            user={{
              name: 'Admin User',
              avatar:
                'https://ui-avatars.com/api/?name=Admin+User&background=0A2463&color=fff'
            }}
          />
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
