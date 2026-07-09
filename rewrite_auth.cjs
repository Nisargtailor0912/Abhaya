const fs = require('fs');
const file = 'src/components/Auth.tsx';

const newContent = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, HeartPulse, MapPin, BellRing } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';

export default function Auth({ onAuth }: { onAuth: () => void }) {
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
        if (trimmedPassword !== 'abhaya@091207') {
          setError('Invalid admin credentials. Please use the exact password for the admin account: abhaya@091207');
          setLoading(false);
          return;
        }
        
        try {
          await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
          onAuth();
          return;
        } catch (signInErr: any) {
          setError(signInErr.message || 'Error signing in to admin account.');
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
      } else {
        setError(err.message || 'An error occurred during authentication.');
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
      onAuth();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain') {
        setError(\`Domain not authorized. Add \${window.location.hostname} to Firebase Console -> Authentication -> Settings -> Authorized domains.\`);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completion. Please try again.');
      } else {
        setError(err.message || 'An error occurred during Google authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      
      {/* Aesthetic Left Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-rose-400 via-rose-500 to-emerald-600 relative flex-col justify-between p-12 overflow-hidden">
        
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/20 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-emerald-300/30 rounded-full blur-3xl mix-blend-overlay"></div>

        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8 border border-white/30 shadow-lg">
            <ShieldAlert size={36} strokeWidth={2} />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            Fearless.<br />Empowered.<br />Protected.
          </h1>
          <p className="text-rose-100 text-lg max-w-md font-medium leading-relaxed">
            Abhaya is your personal safety companion. Instantly alert loved ones, share your live location, and get safe routing—anytime, anywhere.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-6 max-w-md">
           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
             <MapPin className="text-white mb-3" size={24} />
             <h3 className="text-white font-semibold text-sm">Live Tracking</h3>
             <p className="text-rose-100 text-xs mt-1">Real-time location sharing</p>
           </div>
           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
             <BellRing className="text-white mb-3" size={24} />
             <h3 className="text-white font-semibold text-sm">SOS Alerts</h3>
             <p className="text-rose-100 text-xs mt-1">One-tap emergency dispatch</p>
           </div>
        </div>
      </div>

      {/* Right Panel (Auth Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative">
        {/* Mobile decorative blobs */}
        <div className="lg:hidden absolute top-0 right-0 w-64 h-64 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="lg:hidden absolute bottom-0 left-0 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-8 mx-auto shadow-sm">
            <ShieldAlert size={32} strokeWidth={2.5} />
          </div>
          
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              {isLogin ? 'Welcome back' : 'Join Abhaya'}
            </h2>
            <p className="text-slate-500 mt-3 font-medium">
              {isLogin ? 'Enter your details to access your dashboard' : 'Create an account to prioritize your safety'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-rose-50 text-rose-700 text-sm font-medium rounded-2xl border border-rose-100 flex items-start gap-3"
            >
              <div className="mt-0.5">
                <ShieldAlert size={16} />
              </div>
              <div>{error}</div>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all shadow-sm" 
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all shadow-sm" 
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Password</label>
              <input 
                type="password" 
                required
                minLength={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all shadow-sm" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white font-semibold rounded-2xl py-4 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 transition-all disabled:opacity-50 mt-4 active:scale-[0.98]"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In to Dashboard' : 'Create Secure Account')}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <span className="border-b border-slate-200 w-1/4"></span>
            <span className="text-xs font-semibold text-center text-slate-400 uppercase tracking-wider">Or continue with</span>
            <span className="border-b border-slate-200 w-1/4"></span>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            className="w-full bg-white border-2 border-slate-100 text-slate-700 font-semibold rounded-2xl py-3.5 mt-6 hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors"
            >
              {isLogin ? "New to Abhaya? Create an account" : "Already have an account? Sign in"}
            </button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
             <HeartPulse size={14} className="text-rose-400" />
             <span>Built for women's safety & security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
`

fs.writeFileSync(file, newContent, 'utf8');
console.log('Done!');
