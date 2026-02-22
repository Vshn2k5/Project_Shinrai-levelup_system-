import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Crown,
  ChevronDown,
  UserCircle
} from 'lucide-react';
import { useProdigyStore } from '../store';
import { authAPI } from '../lib/auth';

const UserMenu: React.FC = () => {
  const { authUser, clearAuth } = useProdigyStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await authAPI.signOut();
      clearAuth();
      setIsOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!authUser) return null;

  const isGuest = authUser.profile?.role === 'guest';
  const displayName = authUser.profile?.full_name || authUser.email?.split('@')[0] || 'User';
  const avatarUrl = authUser.profile?.avatar_url;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'premium': return <Shield className="w-4 h-4 text-purple-400" />;
      default: return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      guest: { label: 'Guest', color: 'bg-gray-600 text-gray-300' },
      user: { label: 'Hunter', color: 'bg-blue-600 text-blue-100' },
      premium: { label: 'Elite', color: 'bg-purple-600 text-purple-100' },
      admin: { label: 'Admin', color: 'bg-yellow-600 text-yellow-100' }
    };
    
    return badges[role as keyof typeof badges] || badges.user;
  };

  const roleBadge = getRoleBadge(authUser.profile?.role || 'user');

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
      >
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-white" />
            </div>
          )}
          {isGuest && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-500 rounded-full border border-gray-800"></div>
          )}
        </div>
        
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-white">{displayName}</div>
          <div className="flex items-center space-x-1">
            <span className={`text-xs px-2 py-0.5 rounded ${roleBadge.color}`}>
              {roleBadge.label}
            </span>
          </div>
        </div>
        
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          {/* User Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{displayName}</div>
                <div className="text-xs text-gray-400 truncate">{authUser.email}</div>
                <div className="flex items-center space-x-1 mt-1">
                  {getRoleIcon(authUser.profile?.role || 'user')}
                  <span className={`text-xs px-2 py-0.5 rounded ${roleBadge.color}`}>
                    {roleBadge.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {!isGuest && (
              <>
                <a
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </a>
                
                <a
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </a>
                
                <div className="border-t border-gray-700 my-2"></div>
              </>
            )}
            
            {isGuest ? (
              <a
                href="/auth"
                className="flex items-center px-4 py-2 text-sm text-indigo-400 hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4 mr-3" />
                Sign In / Sign Up
              </a>
            ) : (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;