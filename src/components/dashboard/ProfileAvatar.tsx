
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Profile {
  avatar_url: string | null;
  name: string | null;
  completion_score?: number;
}

const ProfileAvatar = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isDropdownOpen]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, name')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      // Handle the profile data, including completion_score if it exists
      const profileData: Profile = {
        avatar_url: data.avatar_url,
        name: data.name,
        completion_score: (data as any).completion_score || 0
      };
      
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const getInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    return profile?.name || user?.email || 'User';
  };

  const getAvatarUrl = () => {
    if (profile?.avatar_url) {
      return `${supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl}`;
    }
    return null;
  };

  const isIncomplete = (profile?.completion_score || 0) < 100;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`relative w-10 h-10 rounded-full transition-all duration-300 ${
          isIncomplete 
            ? 'ring-2 ring-dashed ring-orange-400 ring-offset-2' 
            : 'hover:ring-2 hover:ring-green-300'
        }`}
      >
        <Avatar className="w-10 h-10">
          <AvatarImage src={getAvatarUrl() || ''} alt="Profile" />
          <AvatarFallback className="bg-green-100 text-green-700 text-sm font-medium">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        {isIncomplete && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            !
          </div>
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            {isIncomplete && (
              <p className="text-xs text-orange-600 mt-1">
                Profile {profile?.completion_score || 0}% complete
              </p>
            )}
          </div>
          
          <Link
            to="/dashboard/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsDropdownOpen(false)}
          >
            <User className="w-4 h-4 mr-3" />
            View Profile
          </Link>
          
          <Link
            to="/dashboard/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsDropdownOpen(false)}
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Link>
          
          <Link
            to="/dashboard/invite-friends"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsDropdownOpen(false)}
          >
            <Users className="w-4 h-4 mr-3" />
            Invite Friends
          </Link>
          
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                signOut();
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
