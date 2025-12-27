import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Vision } from '../../types';

interface VaultProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (visionId: number) => void;
}

const Vault: React.FC<VaultProps> = ({ isOpen, onClose, onRestore }) => {
  const [archivedVisions, setArchivedVisions] = useState<Vision[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchArchivedVisions();
    }
  }, [isOpen]);

  const fetchArchivedVisions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/api/vision/archived/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setArchivedVisions(data);
      }
    } catch (error) {
      console.error('Error fetching archived visions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Vault Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🗄️</div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Legacy Vault</h2>
                    <p className="text-sm text-gray-400">Archived Visions</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-2xl text-gray-400">×</span>
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  <p className="text-gray-400 mt-4">Loading archived visions...</p>
                </div>
              ) : archivedVisions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">🗄️</div>
                  <p className="text-gray-400 text-lg">Your vault is empty</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Archived visions will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {archivedVisions.map((vision, index) => (
                    <motion.div
                      key={vision.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group"
                    >
                      {/* Ghost card effect */}
                      <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:border-purple-500/30 transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-semibold">
                              {vision.year}
                            </span>
                            <span className="text-xs text-gray-500">
                              Archived {vision.deleted_at ? new Date(vision.deleted_at).toLocaleDateString() : ''}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white/70 mb-2">
                          {vision.yearly_theme}
                        </h3>

                        <p className="text-gray-400 text-sm line-clamp-2 mb-4 italic">
                          &ldquo;{vision.north_star}&rdquo;
                        </p>

                        {/* Restore button */}
                        <motion.button
                          onClick={() => onRestore(vision.id)}
                          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="flex items-center justify-center space-x-2">
                            <span>Restore Vision</span>
                            <span>↺</span>
                          </span>
                        </motion.button>
                      </div>

                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 bg-purple-600/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Info footer */}
            <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 p-6">
              <div className="flex items-start space-x-3 text-sm text-gray-400">
                <span className="text-xl">💡</span>
                <p>
                  Archived visions are preserved in your Legacy Vault.
                  <span className="text-purple-400"> It's okay to pivot.</span>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Vault;
