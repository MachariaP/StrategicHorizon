import React from 'react';
import { motion } from 'framer-motion';

interface MantraCardProps {
  northStar: string;
  theme: string;
  year: number;
}

const MantraCard: React.FC<MantraCardProps> = ({ northStar, theme, year }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      {/* Glowing border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur-xl opacity-50 animate-pulse" />
      
      {/* Main card */}
      <div className="relative bg-gradient-to-br from-purple-900/40 via-slate-900/40 to-pink-900/40 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
        {/* Year badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="absolute top-6 right-6 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full"
        >
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {year}
          </span>
        </motion.div>

        {/* Theme */}
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-6xl font-bold mb-8 text-white"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {theme}
        </motion.h2>

        {/* North Star Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
            <h3 className="text-sm uppercase tracking-widest text-purple-400 font-semibold">
              North Star Statement
            </h3>
          </div>
          
          <blockquote className="text-2xl md:text-3xl text-gray-200 leading-relaxed italic pl-8 border-l-4 border-purple-500/50">
            &ldquo;{northStar}&rdquo;
          </blockquote>
        </motion.div>

        {/* Floating stars decoration */}
        <div className="absolute top-1/4 right-12 text-6xl opacity-20 animate-float">
          ✨
        </div>
        <div className="absolute bottom-1/4 left-12 text-4xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>
          ⭐
        </div>
      </div>
    </motion.div>
  );
};

export default MantraCard;
