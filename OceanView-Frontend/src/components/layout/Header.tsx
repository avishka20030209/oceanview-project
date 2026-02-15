import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
  };
}
export function Header({ user }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 border-none focus:ring-2 focus:ring-ocean-100 text-sm" />

        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-coral rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || 'User'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="text-xs text-gray-500 hover:text-ocean-DEFAULT">

              Sign Out
            </button>
          </div>
          <div className="h-10 w-10 rounded-full bg-ocean-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            {user?.avatar ?
            <img
              src={user.avatar}
              alt={user.name}
              className="h-full w-full object-cover" /> :


            <User className="h-5 w-5 text-ocean-deep" />
            }
          </div>
        </div>
      </div>
    </header>);

}