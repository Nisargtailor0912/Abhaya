import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Sun, Moon, Settings } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile, signInAnonymously } from 'firebase/auth';

export default function Auth({ onAuth, theme, onThemeChange }: { onAuth: () => void, theme?: 'light' | 'dark' | 'system', onThemeChange?: (theme: 'light' | 'dark' | 'system') => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const trimmedEmail = email.toLowerCase().trim();
      const trimmedPassword = password.trim();

      if (trimmedEmail === 'abhaya@abhaya.com' && isLogin) {
        if (trimmedPassword !== 'abhaya@123') {
          setError('Invalid admin credentials. Please use the exact password for the admin account: abhaya@123');
          setLoading(false);
          return;
        }
        
        try {
          await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
          onAuth();
          return;
        } catch (signInErr: any) {
          if (signInErr.code === 'auth/invalid-credential' || signInErr.code === 'auth/user-not-found') {
            try {
              const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
              await updateProfile(userCredential.user, { displayName: 'Admin' });
              onAuth();
              return;
            } catch (createErr: any) {
              setError(createErr.message || 'Error creating admin account.');
              setLoading(false);
              return;
            }
          }
          setError(signInErr.message || 'Error signing in to admin account. Please ensure the admin account exists in Firebase Console.');
          setLoading(false);
          return;
        }
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        onAuth();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        await updateProfile(userCredential.user, { displayName: fullName });
        onAuth();
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password Sign-In is not enabled. Please enable it in the Firebase Console -> Authentication -> Sign-in method.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  
  
  const handleGuestSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInAnonymously(auth);
      onAuth();
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {
        onAuth(); // Trigger local mock fallback
      } else {
        setError(err.message || 'An error occurred during Guest authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        console.error(err);
      }
      if (err.code === 'auth/unauthorized-domain') {
        setError(`Domain not authorized. Add ${window.location.hostname} to Firebase Console -> Authentication -> Settings -> Authorized domains.`);
      } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/popup-blocked') {
        if (window.self !== window.top) {
          setError('Google Sign-In popup was blocked. Try opening in a new tab, or use guest mode.');
        } else {
          try {
             // Fallback to redirect if popup fails
             await signInWithRedirect(auth, googleProvider);
          } catch(redirectErr) {
             setError('Sign-in popup was closed or blocked. Please try again or use guest mode.');
          }
        }
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Google Sign-In is not enabled. Please enable it in the Firebase Console -> Authentication -> Sign-in method.');
      } else {
        setError(err.message || 'An error occurred during Google authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-slate-50 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden z-0">
      {/* Light Mode Shapes */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200/60 rounded-full blur-3xl mix-blend-multiply dark:hidden"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-200/60 rounded-full blur-3xl mix-blend-multiply dark:hidden"></div>
      

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50 flex bg-white/30 dark:bg-slate-900/50  rounded-full p-1 border border-white/20 dark:border-white/10">
        <button 
          onClick={() => onThemeChange?.('light')}
          className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <Sun size={16} />
        </button>
        <button 
          onClick={() => onThemeChange?.('dark')}
          className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <Moon size={16} />
        </button>
        <button 
          onClick={() => onThemeChange?.('system')}
          className={`p-2 rounded-full transition-colors ${theme === 'system' || !theme ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Dark Mode Aurora */}
      <div className="absolute inset-0 overflow-hidden hidden dark:block -z-10 pointer-events-none">
        
        
        
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/20 dark:bg-slate-900/40  border border-white/30 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
            <ShieldAlert size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 text-center">
            {isLogin ? 'Sign in to access your safety dashboard' : 'Join Abhaya to stay safe and connected'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-100">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/40 dark:bg-slate-800/30 border border-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 " 
                placeholder="Jane Doe"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-white/40 dark:bg-slate-800/30 border border-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 " 
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Password</label>
            <input 
              type="password" 
              required
              minLength={6}
              className="w-full bg-white/40 dark:bg-slate-800/30 border border-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 " 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-rose-600 text-white font-semibold rounded-xl py-3 hover:bg-rose-700 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Complete Sign Up')}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-slate-500 dark:text-slate-400 uppercase">Or continue with</span>
          <span className="border-b w-1/5 lg:w-1/4"></span>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          type="button"
          className="w-full bg-white/40 dark:bg-slate-800/30  border border-white/50 text-slate-700 dark:text-slate-200 font-semibold rounded-xl py-3 mt-4 hover:bg-white dark:bg-slate-800/70 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
        
        
        <button 
          onClick={handleGuestSignIn}
          disabled={loading}
          type="button"
          className="w-full bg-slate-800/80 dark:bg-slate-700/80  border border-slate-700 text-white font-semibold rounded-xl py-3 mt-3 hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Continue as Guest
        </button>

        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
