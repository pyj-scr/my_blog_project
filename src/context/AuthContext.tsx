'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/app';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Mobile browsers commonly block/mishandle signInWithPopup, so Google
    // login redirects away on mobile instead - this picks the result back up
    // once the browser returns from accounts.google.com.
    getRedirectResult(auth).catch((err) => {
      console.warn('Google redirect sign-in error:', err?.code || err?.message);
    });

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

  // Every login path must produce a real Firebase Auth session (never a locally
  // fabricated user) - Storage Security Rules and any future server-side auth
  // checks gate on request.auth, and accepting an unverified typed-in email as
  // someone's identity would let anyone claim an account that isn't theirs.
  const login = async (_name: string, email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!password || password.length < 6) {
      throw new Error('AUTH_WEAK_PASSWORD');
    }
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        throw new Error('AUTH_WRONG_PASSWORD');
      } else if (err.code === 'auth/user-not-found') {
        throw new Error('AUTH_USER_NOT_FOUND');
      }
      throw new Error('AUTH_GENERIC_FAILED');
    }
    // onAuthStateChanged picks up the real Firebase user and sets it.
    setIsLoginModalOpen(false);
  };

  const signUp = async (name: string, email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!password || password.length < 6) {
      throw new Error('AUTH_WEAK_PASSWORD');
    }
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
      }
      throw new Error('AUTH_GENERIC_FAILED');
    }
    setIsLoginModalOpen(false);
  };

  const loginWithGoogle = async () => {
    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    if (isMobile) {
      // Popups are unreliable on mobile browsers - redirect away instead and
      // pick the result back up in the useEffect above once the browser returns.
      await signInWithRedirect(auth, googleProvider);
      return;
    }

    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoginModalOpen(false);
    } catch (err: any) {
      console.warn('Google Auth popup error:', err?.code || err?.message);
      if (err?.code === 'auth/unauthorized-domain') {
        throw new Error('AUTH_UNAUTHORIZED_DOMAIN');
      } else if (err?.code === 'auth/popup-closed-by-user') {
        throw new Error('AUTH_POPUP_CLOSED');
      } else if (err?.code === 'auth/operation-not-allowed') {
        throw new Error('AUTH_OPERATION_NOT_ALLOWED');
      } else {
        throw new Error(err?.code || 'AUTH_GOOGLE_FAILED');
      }
    }
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
