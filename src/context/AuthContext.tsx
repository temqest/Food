import React, { createContext, useContext, useState } from 'react';

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
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  requestPasswordReset: (identifier: string) => Promise<{ success: boolean; code?: string; error?: string }>;
  verifyResetCode: (code: string) => boolean;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_001',
  name: 'Maria Santos',
  email: 'maria.santos@gmail.com',
  phone: '+63 917 555 1928',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  location: 'Centro, Naga City',
  spicePreference: 'fiery',
  favoriteDistrict: 'Centro',
  memberSince: 'October 2025',
  badge: 'Local Foodie Level 4',
  reviewCount: 12,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeResetCode, setActiveResetCode] = useState<string | null>(null);

  const login = async (emailOrPhone: string, _password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate realistic network call

    if (!emailOrPhone.trim()) {
      setIsLoading(false);
      return { success: false, error: 'Please enter your email or phone number.' };
    }

    const loggedUser: UserProfile = {
      ...DEFAULT_USER,
      email: emailOrPhone.includes('@') ? emailOrPhone : DEFAULT_USER.email,
      phone: !emailOrPhone.includes('@') ? emailOrPhone : DEFAULT_USER.phone,
    };

    setUser(loggedUser);
    setIsGuest(false);
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (!data.name.trim() || !data.email.trim()) {
      setIsLoading(false);
      return { success: false, error: 'Name and email are required.' };
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim() || '+63 900 000 0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      location: `${data.favoriteDistrict || 'Centro'}, Naga City`,
      spicePreference: data.spicePreference || 'fiery',
      favoriteDistrict: data.favoriteDistrict || 'Centro',
      memberSince: 'Today',
      badge: 'Naga Explorer',
      reviewCount: 0,
    };

    setUser(newUser);
    setIsGuest(false);
    setIsLoading(false);
    return { success: true };
  };

  const loginAsGuest = () => {
    setUser(null);
    setIsGuest(true);
  };

  const logout = () => {
    setUser(null);
    setIsGuest(true);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const requestPasswordReset = async (
    identifier: string
  ): Promise<{ success: boolean; code?: string; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!identifier.trim()) {
      setIsLoading(false);
      return { success: false, error: 'Please enter your registered email or phone.' };
    }

    // Generate 6-digit mock code
    const generatedCode = '724189';
    setActiveResetCode(generatedCode);
    setIsLoading(false);
    return { success: true, code: generatedCode };
  };

  const verifyResetCode = (code: string): boolean => {
    // Accepts generated code or standard test code 123456
    return code === activeResetCode || code === '123456' || code === '724189';
  };

  const resetPassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!newPassword || newPassword.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    setActiveResetCode(null);
    setIsLoading(false);
    return { success: true };
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
