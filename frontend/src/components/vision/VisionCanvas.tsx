import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface VisionCanvasProps {
  children: React.ReactNode;
  timeHorizon: 1 | 3 | 5 | 10;
}

const VisionCanvas: React.FC<VisionCanvasProps> = ({ children, timeHorizon }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create starfield animation effect
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Dynamically adjust background based on time horizon
    const getBackgroundStyle = () => {
      switch (timeHorizon) {
        case 10:
          return 'from-[#0f172a] via-[#1e1b4b] to-[#0f172a]'; // Deep space, starry
        case 5:
          return 'from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]'; // High altitude
        case 3:
          return 'from-[#312e81] via-[#1e293b] to-[#312e81]'; // Transitional
        case 1:
        default:
          return 'from-[#1e293b] via-[#0f172a] to-[#1e293b]'; // More technical, grid-like
      }
    };

    canvas.className = `min-h-screen bg-gradient-to-br ${getBackgroundStyle()} transition-all duration-1000`;
  }, [timeHorizon]);

  return (
    <div ref={canvasRef} className="relative overflow-hidden">
      {/* Starfield background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle animated stars */}
        {[...Array(timeHorizon === 10 ? 50 : timeHorizon === 5 ? 30 : 15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Grid overlay for lower time horizons */}
      {timeHorizon === 1 && (
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      )}

      {/* Main content with glassmorphism container */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Ambient gradient overlays */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full filter blur-[120px] pointer-events-none" />
    </div>
  );
};

export default VisionCanvas;
