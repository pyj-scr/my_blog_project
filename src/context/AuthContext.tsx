'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/app';

interface AuthContextType {
  user: User | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // 로컬스토리지 로그인 세션 로드
    const savedUser = localStorage.getItem('app100yen_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('app100yen_user');
      }
    }
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const login = (name: string, email: string) => {
    const cleanEmail = email.trim().toLowerCase() || 'user@100yenapp.com';
    const emailPrefix = cleanEmail.split('@')[0];
    const defaultName = emailPrefix ? emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1) : 'Member';
    const cleanName = name.trim() || defaultName;

    const newUser: User = {
      id: 'user-' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
      name: cleanName,
      email: cleanEmail,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
    };
    setUser(newUser);
    localStorage.setItem('app100yen_user', JSON.stringify(newUser));
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('app100yen_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        login,
        logout,
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
