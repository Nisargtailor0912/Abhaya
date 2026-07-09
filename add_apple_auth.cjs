const fs = require('fs');
const file = 'src/components/Auth.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetImport = "import { auth, googleProvider } from '../firebase';";
const newImport = "import { auth, googleProvider, appleProvider } from '../firebase';";
content = content.replace(targetImport, newImport);

const targetHandleGoogle = `  const handleGoogleSignIn = async () => {`;
const newHandleApple = `  const handleAppleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, appleProvider);
      onAuth();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain') {
        setError(\`Domain not authorized. Add \${window.location.hostname} to Firebase Console -> Authentication -> Settings -> Authorized domains.\`);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completion. Please try again.');
      } else {
        setError(err.message || 'An error occurred during Apple authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {`;
content = content.replace(targetHandleGoogle, newHandleApple);

const targetGoogleBtn = `          Google
        </button>`;
const newAppleBtn = `          Google
        </button>
        <button 
          onClick={handleAppleSignIn}
          disabled={loading}
          type="button"
          className="w-full bg-white/50 backdrop-blur-sm border border-white/50 text-slate-700 font-semibold rounded-xl py-3 mt-3 hover:bg-white/70 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="black"/>
            <path d="M13.7915 9.07185C14.2863 8.46824 14.6152 7.62002 14.5209 6.78918C13.8055 6.81831 12.9231 7.27218 12.4173 7.86971C11.9619 8.39702 11.564 9.25547 11.6702 10.076C12.4691 10.1388 13.2965 9.67576 13.7915 9.07185Z" fill="white"/>
            <path d="M14.6146 10.366C13.5684 10.366 12.5694 11.0558 11.9644 11.0558C11.3592 11.0558 10.4908 10.4079 9.6204 10.4394C8.51341 10.4601 7.48168 11.0874 6.91428 12.0792C5.74836 14.103 6.61719 17.0984 7.74719 18.7364C8.29809 19.5358 8.94828 20.4418 9.80789 20.4093C10.6358 20.3776 10.9575 19.8665 11.9483 19.8665C12.9392 19.8665 13.2384 20.4093 14.0986 20.3776C14.9897 20.3456 15.5687 19.5467 16.0984 18.7571C16.708 17.8643 16.9579 16.9934 16.9898 16.9515C16.9579 16.9304 15.2217 16.2736 15.2217 14.3491C15.2217 12.7538 16.512 11.9701 16.574 11.9282C15.8291 10.8413 14.6766 10.366 14.6146 10.366Z" fill="white"/>
          </svg>
          Apple
        </button>`;
content = content.replace(targetGoogleBtn, newAppleBtn);

fs.writeFileSync(file, content, 'utf8');
console.log('Added Apple login UI');
