// src/pages/VisionPage.tsx - Enhanced Vision Module
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { visionAPI } from '../api';
import type { Vision } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import VisionCanvas from '../components/vision/VisionCanvas';
import HorizonSlider from '../components/vision/HorizonSlider';
import HorizonToggle from '../components/vision/HorizonToggle';
import MantraCard from '../components/vision/MantraCard';
import WhyTree from '../components/vision/WhyTree';
import Vault from '../components/vision/Vault';

const VisionPage: React.FC = () => {
  const [visions, setVisions] = useState<Vision[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVision, setSelectedVision] = useState<Vision | null>(null);
  const [timeHorizon, setTimeHorizon] = useState<1 | 3 | 5 | 10>(1);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  useEffect(() => {
    fetchVisions();
  }, []);

  useEffect(() => {
    if (visions.length > 0 && !selectedVision) {
      setSelectedVision(visions[0]);
      setTimeHorizon(visions[0].time_horizon);
    }
  }, [visions, selectedVision]);

  const fetchVisions = async () => {
    try {
      const response = await visionAPI.getAll();
      const visionsData = response.data.results || [];
      setVisions(visionsData);
    } catch (error) {
      console.error('Error fetching visions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (visionId: number) => {
    try {
      await visionAPI.softDelete(visionId);
      showToast("Archived to your Legacy Vault. It's okay to pivot.");
      fetchVisions();
      setSelectedVision(null);
    } catch (error) {
      console.error('Error archiving vision:', error);
      showToast('Failed to archive vision');
    }
  };

  const handleRestore = async (visionId: number) => {
    try {
      await visionAPI.restore(visionId);
      showToast('Vision restored successfully!');
      fetchVisions();
      setIsVaultOpen(false);
    } catch (error) {
      console.error('Error restoring vision:', error);
      showToast('Failed to restore vision');
    }
  };

  const handleUpdateTimeHorizon = async (newHorizon: 1 | 3 | 5 | 10) => {
    if (!selectedVision) return;
    
    setTimeHorizon(newHorizon);
    
    try {
      await visionAPI.patch(selectedVision.id, { time_horizon: newHorizon });
      fetchVisions();
    } catch (error) {
      console.error('Error updating time horizon:', error);
    }
  };

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <LoadingSpinner size="lg" text="Loading your vision..." />
      </div>
    );
  }

  return (
    <VisionCanvas timeHorizon={timeHorizon}>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Vault Button */}
          <div className="mb-12 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <motion.div
                  className="relative"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl animate-pulse" />
                  <div className="relative text-5xl">🎯</div>
                </motion.div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Vision Canvas
                  </h1>
                  <p className="text-purple-300/70 text-lg">Your Strategic Command Center</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-3xl">
                Transform your aspirations into reality through deep reflection and strategic planning.
              </p>
            </div>

            {/* Vault Button */}
            <motion.button
              onClick={() => setIsVaultOpen(true)}
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="relative px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center space-x-3">
                <span className="text-2xl">🗄️</span>
                <span className="font-semibold text-white">Legacy Vault</span>
              </div>
            </motion.button>
          </div>

          {/* Main Content */}
          {visions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-50" />
                <div className="relative text-8xl animate-float">✨</div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Your Canvas Awaits</h3>
              <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
                Begin your journey by painting your North Star. Define your vision and let it guide your path forward.
              </p>
              <motion.button
                onClick={() => setShowCreateForm(true)}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/50"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your Vision
              </motion.button>
            </motion.div>
          ) : selectedVision ? (
            <div className="space-y-12">
              {/* Time Horizon Controls */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center space-y-6"
              >
                <HorizonToggle value={timeHorizon} onChange={handleUpdateTimeHorizon} />
                <div className="w-full max-w-3xl">
                  <HorizonSlider value={timeHorizon} onChange={handleUpdateTimeHorizon} />
                </div>
              </motion.div>

              {/* Vision Mantra Card */}
              <MantraCard
                northStar={selectedVision.north_star}
                theme={selectedVision.yearly_theme}
                year={selectedVision.year}
              />

              {/* Five Whys Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
              >
                <WhyTree whys={selectedVision.five_whys || []} />
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center space-x-4"
              >
                <motion.button
                  onClick={() => handleSoftDelete(selectedVision.id)}
                  className="px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 hover:border-red-500/30 hover:text-red-400 transition-all duration-300 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Archive Vision</span>
                  <span>🗄️</span>
                </motion.button>
              </motion.div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Vault Sidebar */}
      <Vault isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} onRestore={handleRestore} />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20">
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </VisionCanvas>
  );
};

export default VisionPage;