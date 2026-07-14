const fs = require('fs');

let content = fs.readFileSync('src/components/Auth.tsx', 'utf8');

const guestFn = `
  const handleGuestSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInAnonymously(auth);
      onAuth();
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Anonymous Sign-In is not enabled. Please enable it in the Firebase Console -> Authentication -> Sign-in method.');
      } else {
        setError(err.message || 'An error occurred during Guest authentication.');
      }
    } finally {
      setLoading(false);
    }
  };
`;

content = content.replace(
  "const handleGoogleSignIn = async () => {",
  guestFn + "\n  const handleGoogleSignIn = async () => {"
);

const guestBtn = `
        <button 
          onClick={handleGuestSignIn}
          disabled={loading}
          type="button"
          className="w-full bg-slate-800/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-700 text-white font-semibold rounded-xl py-3 mt-3 hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Continue as Guest
        </button>
`;

content = content.replace(
  '<div className="mt-6 text-center">',
  guestBtn + '\n        <div className="mt-6 text-center">'
);

fs.writeFileSync('src/components/Auth.tsx', content);
console.log('Added guest login');
