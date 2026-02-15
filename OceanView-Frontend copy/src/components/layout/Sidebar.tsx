import React from 'react';
import { NavLink } from 'react-router-dom';
import { BoxIcon } from 'lucide-react';
interface NavItem {
  label: string;
  icon: BoxIcon;
  href: string;
}
interface SidebarProps {
  items: NavItem[];
  role: string;
}
export function Sidebar({ items, role }: SidebarProps) {
  return (
    <aside className="w-64 bg-ocean-deep text-white flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-ocean-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-xl">🌊</span>
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-wide text-sand">
              Ocean View
            </h1>
            <p className="text-xs text-ocean-200 uppercase tracking-wider font-medium">
              {role} Portal
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {items.map((item) =>
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive ? 'bg-white/10 text-white shadow-sm' : 'text-ocean-100 hover:bg-white/5 hover:text-white'}
            `}>

            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-ocean-800">
        <div className="bg-ocean-900/50 rounded-lg p-4">
          <p className="text-xs text-ocean-200 mb-1">Need Help?</p>
          <p className="text-sm text-white font-medium">Contact Support</p>
        </div>
      </div>
    </aside>);

}