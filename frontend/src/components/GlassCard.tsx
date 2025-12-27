// src/components/GlassCard.tsx
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  gradient?: boolean;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  gradient = false,
  style
}) => {
  return (
    <div 
      className={`
        relative
        backdrop-blur-xl
        bg-gradient-to-br from-white/10 to-white/5
        border border-white/20
        shadow-2xl
        rounded-3xl
        overflow-hidden
        ${hoverEffect ? 'hover:scale-[1.02] hover:shadow-3xl' : ''}
        transition-all duration-500
        group
        ${gradient ? 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/10 before:via-pink-500/10 before:to-purple-500/10 before:animate-gradient-x' : ''}
        ${className}
      `}
      style={style}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {/* Content */}
      <div className="relative z-10 p-8">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
