
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

  // Real-time profile updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        () => {
          fetchProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  const calculateCompletionScore = (profileData: any) => {
    const fields = ['name', 'phone', 'age', 'gender', 'income', 'avatar_url'];
    const filledFields = fields.filter(field => {
      const value = profileData[field];
      return value !== null && value !== undefined && value !== '';
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      // Calculate completion score dynamically
      const completion_score = calculateCompletionScore(data);
      
      const profileData: Profile = {
        avatar_url: data.avatar_url,
        name: data.name,
        completion_score
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
        className="relative w-10 h-10 rounded-full transition-all duration-300 hover:scale-105"
      >
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={getAvatarUrl() || ''} alt="Profile" />
            <AvatarFallback className="bg-green-100 text-green-700 text-sm font-medium">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          {/* Progress ring for incomplete profiles */}
          {isIncomplete && (
            <svg 
              className="absolute inset-0 w-10 h-10 transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                className="stroke-gray-200"
                strokeWidth="2"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="stroke-orange-500 transition-all duration-500 ease-out"
                strokeWidth="2"
                strokeDasharray={`${(profile?.completion_score || 0)}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          )}
          {/* Complete indicator */}
          {!isIncomplete && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
              ✓
            </div>
          )}
        </div>
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
