import React from 'react';
import { motion } from 'framer-motion';

interface HorizonSliderProps {
  value: 1 | 3 | 5 | 10;
  onChange: (value: 1 | 3 | 5 | 10) => void;
}

const HorizonSlider: React.FC<HorizonSliderProps> = ({ value, onChange }) => {
  const horizonValues = [1, 3, 5, 10] as const;
  const horizonLabels: Record<number, string> = {
    1: 'Immediate Reality',
    3: 'Near Future',
    5: 'Strategic Vision',
    10: 'Infinite Horizon',
  };

  const getPositionPercent = (val: number) => {
    const index = horizonValues.indexOf(val as any);
    return (index / (horizonValues.length - 1)) * 100;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = parseInt(e.target.value);
    const index = Math.round((sliderValue / 100) * (horizonValues.length - 1));
    onChange(horizonValues[index]);
  };

  return (
    <div className="w-full">
      {/* Label display */}
      <div className="mb-6 text-center">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block"
        >
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            {horizonLabels[value]}
          </h3>
          <p className="text-gray-400 text-sm">
            {value === 1 && '🎯 Focus on the now - concrete and actionable'}
            {value === 3 && '🚀 Building momentum - mid-term strategy'}
            {value === 5 && '🌟 Strategic transformation - long-term vision'}
            {value === 10 && '✨ Infinite possibilities - ultimate aspiration'}
          </p>
        </motion.div>
      </div>

      {/* Slider container */}
      <div className="relative px-4">
        {/* Track background */}
        <div className="absolute top-1/2 left-4 right-4 h-2 -translate-y-1/2 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-full" />
        
        {/* Progress fill */}
        <motion.div
          className="absolute top-1/2 left-4 h-2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          style={{ width: `calc(${getPositionPercent(value)}% - 1rem)` }}
          animate={{ width: `calc(${getPositionPercent(value)}% - 1rem)` }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        />

        {/* Markers */}
        {horizonValues.map((val) => (
          <motion.div
            key={val}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `calc(${getPositionPercent(val)}% + 1rem)` }}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                val === value
                  ? 'bg-white border-white shadow-lg shadow-purple-500/50 scale-125'
                  : 'bg-gray-700 border-gray-600 hover:border-gray-500'
              }`}
            />
            <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span
                className={`text-xs font-semibold transition-colors ${
                  val === value ? 'text-white' : 'text-gray-500'
                }`}
              >
                {val}yr
              </span>
            </div>
          </motion.div>
        ))}

        {/* Actual slider input (invisible but functional) */}
        <input
          type="range"
          min="0"
          max="100"
          value={getPositionPercent(value)}
          onChange={handleSliderChange}
          className="relative w-full h-12 bg-transparent appearance-none cursor-pointer z-10"
          style={{
            WebkitAppearance: 'none',
          }}
        />
      </div>

      {/* Horizon year display */}
      <div className="mt-12 text-center">
        <motion.div
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="inline-flex items-center space-x-4 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
        >
          <span className="text-gray-400 text-sm">Time Horizon:</span>
          <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {value} {value === 1 ? 'Year' : 'Years'}
          </span>
        </motion.div>
      </div>

      {/* CSS for removing default slider styling */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default HorizonSlider;
