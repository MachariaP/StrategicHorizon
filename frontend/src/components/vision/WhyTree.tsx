import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhyTreeProps {
  whys: string[];
  onUpdate?: (whys: string[]) => void;
  isEditing?: boolean;
}

const WhyTree: React.FC<WhyTreeProps> = ({ whys = [], onUpdate, isEditing = false }) => {
  const [deepenLevel, setDeepenLevel] = useState(0);
  const [currentWhys, setCurrentWhys] = useState<string[]>(whys);

  useEffect(() => {
    setCurrentWhys(whys);
  }, [whys]);

  const handleDeepen = () => {
    if (deepenLevel < currentWhys.length) {
      setDeepenLevel(deepenLevel + 1);
    }
  };

  const handleReset = () => {
    setDeepenLevel(0);
  };

  const handleWhyChange = (index: number, value: string) => {
    const updatedWhys = [...currentWhys];
    updatedWhys[index] = value;
    setCurrentWhys(updatedWhys);
    if (onUpdate) {
      onUpdate(updatedWhys);
    }
  };

  if (currentWhys.length === 0 && !isEditing) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No "Five Whys" defined yet.</p>
        <p className="text-sm mt-2">Deepen your understanding by exploring the reasons behind your vision.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          <h3 className="text-xl font-bold text-white">The Five Whys</h3>
        </div>
        
        {!isEditing && currentWhys.length > 0 && (
          <div className="flex space-x-3">
            {deepenLevel < currentWhys.length && (
              <motion.button
                onClick={handleDeepen}
                className="px-6 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Deepen</span>
                <span>🔍</span>
              </motion.button>
            )}
            
            {deepenLevel > 0 && (
              <motion.button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-xl hover:bg-gray-500/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Why Tree Visualization */}
      <div className="space-y-6">
        <AnimatePresence>
          {currentWhys.slice(0, isEditing ? 5 : deepenLevel).map((why, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ 
                delay: isEditing ? 0 : index * 0.5,
                type: 'spring',
                stiffness: 100 
              }}
              className="relative"
            >
              {/* Connection line */}
              {index > 0 && (
                <div className="absolute left-6 -top-6 w-0.5 h-6 bg-gradient-to-b from-purple-500/50 to-blue-500/50" />
              )}

              {/* Why card */}
              <div className="flex items-start space-x-4">
                {/* Why number badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: isEditing ? 0 : index * 0.5 + 0.2 }}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg"
                >
                  {index + 1}
                </motion.div>

                {/* Why content */}
                {isEditing ? (
                  <textarea
                    value={why}
                    onChange={(e) => handleWhyChange(index, e.target.value)}
                    placeholder={`Why #${index + 1}...`}
                    className="flex-1 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                    rows={2}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.5 + 0.3 }}
                    className="flex-1 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-white/10 rounded-xl"
                  >
                    <p className="text-gray-200 text-lg leading-relaxed typewriter">
                      {why}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add more prompt for editing */}
        {isEditing && currentWhys.length < 5 && (
          <motion.button
            onClick={() => {
              const newWhys = [...currentWhys, ''];
              setCurrentWhys(newWhys);
              if (onUpdate) onUpdate(newWhys);
            }}
            className="w-full p-4 border-2 border-dashed border-purple-500/30 rounded-xl text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            + Add Why ({currentWhys.length}/5)
          </motion.button>
        )}
      </div>

      {/* Root visualization at bottom */}
      {!isEditing && deepenLevel > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-white/10 rounded-full text-purple-300 text-sm">
            🌳 Depth Level: {deepenLevel}/{currentWhys.length}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WhyTree;
