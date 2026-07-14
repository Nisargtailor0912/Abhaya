import React, { useState, useEffect } from 'react';

export default function StealthMode({ onExit }: { onExit: () => void }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center cursor-default select-none"
      onDoubleClick={onExit}
    >
      <div className="text-8xl font-light tabular-nums tracking-tighter">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-slate-500 mt-4 text-xl">
        {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}
