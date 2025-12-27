import React from 'react';
import { motion } from 'framer-motion';

interface HorizonToggleProps {
  value: 1 | 3 | 5 | 10;
  onChange: (value: 1 | 3 | 5 | 10) => void;
}

const HorizonToggle: React.FC<HorizonToggleProps> = ({ value, onChange }) => {
  const horizons = [
    { value: 1 as const, label: '1yr' },
    { value: 3 as const, label: '3yr' },
    { value: 5 as const, label: '5yr' },
    { value: 10 as const, label: '10yr' },
  ];

  return (
    <div className="relative inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl rounded-full p-2 border border-white/10">
      {horizons.map((horizon) => (
        <motion.button
          key={horizon.value}
          onClick={() => onChange(horizon.value)}
          className={`relative px-6 py-2 rounded-full font-semibold text-sm transition-colors duration-300 ${
            value === horizon.value
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {value === horizon.value && (
            <motion.div
              layoutId="horizon-bg"
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{horizon.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default HorizonToggle;
