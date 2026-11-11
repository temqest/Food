import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { safeStorage } from '@/utils/safeStorage';
import { getDiceBearAvatar } from '@/utils/dicebearAvatar';

export const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
export const CACHED_PROFILE_KEY = 'naga_auth_cached_profile';
export const SESSION_TIMESTAMP_KEY = 'naga_auth_session_timestamp';
export const GUEST_FLAG_KEY = 'naga_auth_is_guest';

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
   * Fetch user profile from public.food_profiles, persist to safe local cache,
   * with guaranteed offline fallback so network drops never log the user out.
   */
  const loadUserProfile = async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from('food_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      let loadedProfile: UserProfile;

      if (profile) {
        loadedProfile = {
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
        };
      } else {
        // Fallback profile if table row is not yet synced
        const fallbackName = email.split('@')[0];
        loadedProfile = {
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
        };
      }

      setUser(loadedProfile);
      setIsGuest(false);

      // Persist to safeStorage and renew rolling 30-day timestamp
      await safeStorage.setItem(CACHED_PROFILE_KEY, JSON.stringify(loadedProfile));
      await safeStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
      await safeStorage.removeItem(GUEST_FLAG_KEY);
    } catch (err) {
      console.warn('Network issue loading food profile; using offline cache:', err);
      // Fallback: If network failed, do NOT leave user as null!
      const cached = await safeStorage.getItem(CACHED_PROFILE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.id) {
            setUser(parsed);
            setIsGuest(false);
            return;
          }
        } catch {}
      }

      const fallbackName = email ? email.split('@')[0] : 'Food Explorer';
      const offlineProfile: UserProfile = {
        id: userId,
        name: fallbackName,
        email: email || '',
        phone: '',
        avatar: getDiceBearAvatar(fallbackName),
        location: 'Centro, Naga City',
        spicePreference: 'moderate',
        favoriteDistrict: 'Centro',
        memberSince: 'November 2026',
        badge: 'Local Foodie',
        reviewCount: 0,
      };
      setUser(offlineProfile);
      setIsGuest(false);
    }
  };

  // Initialize and listen to active Supabase Session with 30-day persistence
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        // 1. Check local session timestamp for 30-day expiration window
        const storedTimestamp = await safeStorage.getItem(SESSION_TIMESTAMP_KEY);
        const storedGuest = await safeStorage.getItem(GUEST_FLAG_KEY);
        const storedProfile = await safeStorage.getItem(CACHED_PROFILE_KEY);

        const now = Date.now();
        const isSessionExpired = storedTimestamp
          ? now - Number(storedTimestamp) > THIRTY_DAYS_MS
          : false;

        if (isSessionExpired) {
          // 30 days exceeded: clear session
          await supabase.auth.signOut().catch(() => {});
          await safeStorage.removeItem(CACHED_PROFILE_KEY);
          await safeStorage.removeItem(SESSION_TIMESTAMP_KEY);
          await safeStorage.removeItem(GUEST_FLAG_KEY);
          if (mounted) {
            setUser(null);
            setIsGuest(false);
            setIsLoading(false);
          }
          return;
        }

        // 2. Optimistic load from local cache for instant, zero-delay UI rendering
        if (storedGuest === 'true' && mounted) {
          setUser(GUEST_USER);
          setIsGuest(true);
        } else if (storedProfile && mounted) {
          try {
            const parsed = JSON.parse(storedProfile);
            if (parsed?.id) {
              setUser(parsed);
              setIsGuest(false);
            }
          } catch {}
        }

        // 3. Verify / refresh active Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          await safeStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
          await loadUserProfile(session.user.id, session.user.email || '');
        } else if (!storedGuest && !storedProfile) {
          if (mounted) setUser(null);
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
        await safeStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
        await safeStorage.removeItem(GUEST_FLAG_KEY);
        await loadUserProfile(session.user.id, session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        const storedGuest = await safeStorage.getItem(GUEST_FLAG_KEY);
        if (storedGuest !== 'true') {
          await safeStorage.removeItem(CACHED_PROFILE_KEY);
          await safeStorage.removeItem(SESSION_TIMESTAMP_KEY);
          if (mounted) setUser(null);
        }
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

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
        await safeStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
        await safeStorage.removeItem(GUEST_FLAG_KEY);
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

        await safeStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
        await safeStorage.removeItem(GUEST_FLAG_KEY);
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
    safeStorage.setItem(GUEST_FLAG_KEY, 'true').catch(() => {});
    safeStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString()).catch(() => {});
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('SignOut error:', err);
    }
    await safeStorage.removeItem(CACHED_PROFILE_KEY);
    await safeStorage.removeItem(SESSION_TIMESTAMP_KEY);
    await safeStorage.removeItem(GUEST_FLAG_KEY);
    setUser(null);
    setIsGuest(false);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    await safeStorage.setItem(CACHED_PROFILE_KEY, JSON.stringify(updated)).catch(() => {});

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
