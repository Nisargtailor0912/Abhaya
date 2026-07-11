import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Phone } from 'lucide-react';

export default function SlideToAnswer({ onAccept }: { onAccept: () => void }) {
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

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-sm h-20 bg-white/20 dark:bg-slate-800/40 backdrop-blur-2xl rounded-full border border-white/30 dark:border-white/10 overflow-hidden flex items-center px-2"
    >
      {/* Shimmer Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-white/80 dark:text-white/60 text-lg tracking-wider font-light ml-8 shimmer-text">
          slide to answer
        </span>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxDrag > 0 ? maxDrag : 200 }}
        dragSnapToOrigin={true}
        onDragEnd={(e, info) => {
          if (info.offset.x > maxDrag * 0.5) {
            onAccept();
          }
        }}
        style={{ touchAction: "none" }}
        className="w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
      >
        <Phone size={32} className="text-emerald-500 animate-pulse" />
      </motion.div>
    </div>
  );
}
