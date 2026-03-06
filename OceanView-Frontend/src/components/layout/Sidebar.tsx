import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { X, LogOut } from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

interface SidebarProps {
  items: NavItem[];
  role: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ items, role, isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onClose();
    navigate('/login');
  };

  return (
    <aside
      className={`
        fixed md:sticky top-0 z-50
        h-screen w-64 flex flex-col
        bg-gradient-to-b from-teal-700 to-emerald-600 text-white
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        overflow-hidden
      `}
    >
      {/* Header */}
      <div className="p-6 border-b border-emerald-500 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-xl">🌴</span>
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-wide text-emerald-100">
              Ocean View
            </h1>
            <p className="text-xs text-teal-200 uppercase tracking-wider font-medium">
              {role} Panel
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="md:hidden text-teal-200 hover:text-emerald-100 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 px-4 py-6 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'bg-emerald-500/30 text-white shadow-sm'
                      : 'text-teal-100 hover:bg-emerald-400/20 hover:text-white'
                  }
                `
              }
            >
              <Icon className="h-5 w-5 text-teal-50" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-emerald-500 shrink-0 space-y-3">
        <div className="bg-emerald-700/40 rounded-lg p-4">
          <p className="text-xs text-teal-200 mb-1">We're here for you ?</p>
          <p className="text-sm text-white font-medium">Contact Us</p>
        </div>

        <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-3 px-4 py-3 rounded-lg
            text-sm font-medium text-white -400
            hover:bg-red-500/20 hover:text-red-300
            transition-all
          "
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
