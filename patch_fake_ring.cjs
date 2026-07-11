const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('const ringAudioCtxRef')) {
  const insertIndex = content.indexOf('const toggleAlarm = () => {');
  
  const ringCode = `
  const ringAudioCtxRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (fakeCallActive && fakeCallState === 'incoming') {
      if (!ringAudioCtxRef.current) {
        ringAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = ringAudioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const playRing = () => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(440, ctx.currentTime);
        osc2.frequency.setValueAtTime(480, ctx.currentTime);
        
        // standard ringing pattern: 2 seconds on, 4 seconds off. We'll do 1.5s on, 2s off.
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + 1.4);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 1.5);
        osc2.stop(ctx.currentTime + 1.5);
      };
      
      playRing();
      ringIntervalRef.current = setInterval(playRing, 3500);
      
    } else {
       if (ringIntervalRef.current) {
         clearInterval(ringIntervalRef.current);
         ringIntervalRef.current = null;
       }
    }
    
    return () => {
      if (ringIntervalRef.current) {
         clearInterval(ringIntervalRef.current);
         ringIntervalRef.current = null;
       }
    };
  }, [fakeCallActive, fakeCallState]);

`;
  
  content = content.substring(0, insertIndex) + ringCode + content.substring(insertIndex);
  fs.writeFileSync('src/App.tsx', content);
  console.log('App.tsx fake ring patched');
}
