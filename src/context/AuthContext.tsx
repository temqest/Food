import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getDiceBearAvatar } from '@/utils/dicebearAvatar';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  spicePreference: 'mild' | 'moderate' | 'fiery';
  favoriteDistrict: string;
  memberSince: string;
  badge: string;
  reviewCount: number;
}

interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  spicePreference?: 'mild' | 'moderate' | 'fiery';
  favoriteDistrict?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  requestPasswordReset: (identifier: string) => Promise<{ success: boolean; code?: string; error?: string }>;
  verifyResetCode: (code: string) => boolean;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const GUEST_USER: UserProfile = {
  id: 'usr_guest',
  name: 'Naga Food Explorer (Guest)',
  email: 'guest@foodie.ph',
  phone: '',
  avatar: getDiceBearAvatar('Naga Guest Foodie'),
  location: 'Centro, Naga City',
  spicePreference: 'moderate',
  favoriteDistrict: 'Centro',
  memberSince: 'November 2026',
  badge: 'Guest Explorer',
  reviewCount: 0,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeResetCode, setActiveResetCode] = useState<string | null>(null);

  /**
   * Fetch user profile from public.food_profiles or construct from metadata
   */
  const loadUserProfile = async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from('food_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name || email.split('@')[0],
          email: profile.email || email,
          phone: profile.phone || '',
          avatar: profile.avatar_url || getDiceBearAvatar(profile.name || email),
          location: profile.location || 'Centro, Naga City',
          spicePreference: (profile.spice_preference as any) || 'moderate',
          favoriteDistrict: profile.favorite_district || 'Centro',
          memberSince: profile.member_since || 'November 2026',
          badge: profile.badge || 'Local Foodie',
          reviewCount: profile.review_count || 0,
        });
      } else {
        // Fallback profile if table is not yet synced
        const fallbackName = email.split('@')[0];
        setUser({
          id: userId,
          name: fallbackName,
          email: email,
          phone: '',
          avatar: getDiceBearAvatar(fallbackName),
          location: 'Centro, Naga City',
          spicePreference: 'moderate',
          favoriteDistrict: 'Centro',
          memberSince: 'November 2026',
          badge: 'New Explorer',
          reviewCount: 0,
        });
      }
      setIsGuest(false);
    } catch (err) {
      console.warn('Error loading food profile:', err);
    }
  };

  // Initialize and listen to active Supabase Session
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          await loadUserProfile(session.user.id, session.user.email || '');
        }
      } catch (err) {
        console.warn('Supabase session load error:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id, session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        if (!isGuest) setUser(null);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [isGuest]);

  /**
   * Real Supabase Authentication: Log in
   */
  const login = async (emailOrPhone: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (!emailOrPhone.trim()) {
      setIsLoading(false);
      return { success: false, error: 'Please enter your email or phone number.' };
    }

    const email = emailOrPhone.includes('@') ? emailOrPhone.trim() : `${emailOrPhone.replace(/\s+/g, '')}@foodie.ph`;
    const pwd = password || 'FoodieSecret123!';

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pwd,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        await loadUserProfile(data.user.id, data.user.email || email);
      }

      setIsGuest(false);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  /**
   * Real Supabase Authentication: Sign up
   */
  const signup = async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (!data.name.trim() || !data.email.trim()) {
      setIsLoading(false);
      return { success: false, error: 'Name and email are required.' };
    }

    const email = data.email.trim();
    const password = data.password || 'FoodieSecret123!';

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: data.name.trim(),
            phone: data.phone.trim(),
            spice_preference: data.spicePreference || 'moderate',
            favorite_district: data.favoriteDistrict || 'Centro',
            avatar_url: getDiceBearAvatar(data.name.trim()),
          },
        },
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (authData.user) {
        // Optimistically create/upsert profile row
        try {
          await supabase.from('food_profiles').upsert({
            id: authData.user.id,
            name: data.name.trim(),
            email: email,
            phone: data.phone.trim(),
            avatar_url: getDiceBearAvatar(data.name.trim()),
            spice_preference: data.spicePreference || 'moderate',
            favorite_district: data.favoriteDistrict || 'Centro',
            location: `${data.favoriteDistrict || 'Centro'}, Naga City`,
            member_since: 'November 2026',
          });
        } catch (dbErr) {
          console.warn('Profile upsert note:', dbErr);
        }

        await loadUserProfile(authData.user.id, email);
      }

      setIsGuest(false);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Signup failed.' };
    }
  };

  const loginAsGuest = () => {
    setUser(GUEST_USER);
    setIsGuest(true);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('SignOut error:', err);
    }
    setUser(null);
    setIsGuest(false);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);

    if (!isGuest && user.id) {
      try {
        await supabase
          .from('food_profiles')
          .update({
            name: updated.name,
            phone: updated.phone,
            avatar_url: updated.avatar,
            location: updated.location,
            spice_preference: updated.spicePreference,
            favorite_district: updated.favoriteDistrict,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      } catch (err) {
        console.warn('Could not sync profile updates to Supabase:', err);
      }
    }
  };

  const requestPasswordReset = async (
    identifier: string
  ): Promise<{ success: boolean; code?: string; error?: string }> => {
    setIsLoading(true);
    if (!identifier.trim()) {
      setIsLoading(false);
      return { success: false, error: 'Please enter your registered email.' };
    }

    try {
      if (identifier.includes('@')) {
        await supabase.auth.resetPasswordForEmail(identifier.trim());
      }
      const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
      setActiveResetCode(demoCode);
      setIsLoading(false);
      return { success: true, code: demoCode };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  const verifyResetCode = (code: string): boolean => {
    return activeResetCode === code.trim();
  };

  const resetPassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      setIsLoading(false);
      if (error) return { success: false, error: error.message };
      setActiveResetCode(null);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isGuest,
        isLoading,
        login,
        signup,
        loginAsGuest,
        logout,
        updateProfile,
        requestPasswordReset,
        verifyResetCode,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
