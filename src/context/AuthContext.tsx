'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/app';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebaseClient';

interface AuthContextType {
  user: User | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (name: string, email: string, password?: string) => Promise<void>;
  signUp: (name: string, email: string, password?: string) => Promise<void>;
  loginWithGoogle: (fallbackEmail?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // 1. Firebase Auth listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const cleanEmail = firebaseUser.email.toLowerCase().trim();
        const emailPrefix = cleanEmail.split('@')[0];
        const defaultName = firebaseUser.displayName || (emailPrefix ? emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1) : 'Member');
        
        const authenticatedUser: User = {
          id: firebaseUser.uid || 'user-' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
          name: defaultName,
          email: cleanEmail,
          avatarUrl: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
        };
        setUser(authenticatedUser);
        localStorage.setItem('app100yen_user', JSON.stringify(authenticatedUser));
      } else {
        // Fallback to local storage if present
        const savedUser = localStorage.getItem('app100yen_user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem('app100yen_user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const saveLocalUser = (name: string, email: string) => {
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
  };

  const login = async (name: string, email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (password && password.length >= 6) {
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      } catch (err: any) {
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          throw new Error('AUTH_WRONG_PASSWORD');
        } else if (err.code === 'auth/user-not-found') {
          throw new Error('AUTH_USER_NOT_FOUND');
        } else {
          saveLocalUser(name, email);
        }
      }
    } else {
      saveLocalUser(name, email);
    }
    setIsLoginModalOpen(false);
  };

  const signUp = async (name: string, email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (password && password.length >= 6) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        if (name && userCred.user) {
          await updateProfile(userCred.user, { displayName: name });
        }
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          throw new Error('AUTH_EMAIL_EXISTS');
        } else if (err.code === 'auth/weak-password') {
          throw new Error('AUTH_WEAK_PASSWORD');
        } else {
          saveLocalUser(name, email);
        }
      }
    } else {
      saveLocalUser(name, email);
    }
    setIsLoginModalOpen(false);
  };

  const loginWithGoogle = async (fallbackEmail?: string) => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user && res.user.email) {
        const cleanEmail = res.user.email.toLowerCase().trim();
        const defaultName = res.user.displayName || cleanEmail.split('@')[0];
        saveLocalUser(defaultName, cleanEmail);
        setIsLoginModalOpen(false);
        return;
      }
    } catch (err: any) {
      console.warn('Google Auth popup notice:', err?.code || err?.message);
    }

    // If fallbackEmail is provided from user input, log in with user's specified email
    if (fallbackEmail && fallbackEmail.includes('@')) {
      const cleanEmail = fallbackEmail.trim().toLowerCase();
      const targetName = cleanEmail.split('@')[0];
      saveLocalUser(targetName, cleanEmail);
      setIsLoginModalOpen(false);
      return;
    }

    // Never generate dummy 'user@gmail.com'! Throw error so UI can prompt user
    throw new Error('AUTH_GOOGLE_FAILED');
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
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
        signUp,
        loginWithGoogle,
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
