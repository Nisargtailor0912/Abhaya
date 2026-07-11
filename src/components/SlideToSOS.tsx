import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertOctagon } from 'lucide-react';

export default function SlideToSOS({ onTrigger, active, countdown, onCancel }: { onTrigger: () => void, active: boolean, countdown: number | null, onCancel: () => void }) {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const buttonSize = 72;
  const padding = 8;
  const maxDrag = containerWidth > 0 ? containerWidth - buttonSize - padding * 2 : 200;

  if (active || countdown !== null) {
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onCancel}
        className={`relative w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 backdrop-blur-2xl border border-white/20 dark:border-white/10 ${
          active 
            ? 'bg-rose-500/80 text-white' 
            : 'bg-amber-500/80 text-white'
        }`}
      >
        {countdown !== null ? (
          <>
            <span className="text-7xl font-bold mb-2 drop-shadow-md">{countdown}</span>
            <span className="text-sm font-medium uppercase tracking-wider opacity-90">Tap to cancel</span>
          </>
        ) : (
          <>
            <AlertOctagon size={64} className="mb-4 animate-pulse drop-shadow-md" />
            <span className="text-2xl font-bold uppercase tracking-widest drop-shadow-md">Active</span>
            <span className="text-sm mt-2 opacity-80">Tap to stop</span>
          </>
        )}
      </motion.button>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div 
        ref={containerRef}
        className="relative w-full max-w-sm h-24 bg-rose-500/20 dark:bg-rose-900/30 backdrop-blur-2xl rounded-full border border-rose-500/30 overflow-hidden flex items-center px-2 shadow-[0_8px_32px_rgba(244,63,94,0.15)]"
      >
        {/* Shimmer Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-rose-600 dark:text-rose-200 text-xl tracking-widest uppercase font-bold ml-12 shimmer-text opacity-90">
            Slide for SOS
          </span>
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: maxDrag > 0 ? maxDrag : 200 }}
          dragSnapToOrigin={true}
          onDragEnd={(e, info) => {
            if (info.offset.x > maxDrag * 0.5) {
              onTrigger();
            }
          }}
          style={{ touchAction: "none" }}
          className="w-[80px] h-[80px] bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shadow-[0_0_20px_rgba(244,63,94,0.6)]"
        >
          <AlertOctagon size={40} className="text-white drop-shadow-md" />
        </motion.div>
      </div>
    </div>
  );
}
