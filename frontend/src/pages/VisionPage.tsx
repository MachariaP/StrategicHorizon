// src/pages/VisionPage.tsx - Enhanced version
import React, { useEffect, useState } from 'react';
import { visionAPI } from '../api';
import type { Vision } from '../types';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';

const VisionPage: React.FC = () => {
  const [visions, setVisions] = useState<Vision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisions = async () => {
      try {
        const response = await visionAPI.getAll();
        setVisions(response.data.results || []);
      } catch (error) {
        console.error('Error fetching visions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisions();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading your vision..." />
    </div>
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl animate-pulse" />
              <div className="relative text-5xl">🎯</div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x mb-2">
                Vision & Theme
              </h1>
              <p className="text-purple-300/70 text-lg">Your North Star for 2026</p>
            </div>
          </div>
          <p className="text-gray-400 max-w-3xl">
            Define your overarching vision, yearly theme, and guiding principles. This is your strategic compass for the year ahead.
          </p>
        </div>

        {/* Main Content */}
        {visions.length === 0 ? (
          <GlassCard className="text-center py-20">
            <div className="text-7xl mb-6 animate-float">✨</div>
            <h3 className="text-2xl font-bold text-white mb-3">No Vision Yet</h3>
            <p className="text-gray-400 mb-8">Start by creating your vision and yearly theme to guide your journey.</p>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
              Create Your Vision
            </button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {visions.map((vision, index) => (
              <GlassCard 
                key={vision.id}
                gradient={true}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold">
                      {vision.year}
                    </span>
                    <div className="text-4xl animate-float">🎯</div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {vision.yearly_theme}
                  </h2>
                  
                  <div className="mb-6">
                    <h3 className="text-sm text-purple-400 mb-2 font-semibold">NORTH STAR STATEMENT</h3>
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-purple-500 rounded-r-xl p-6">
                      <p className="text-xl text-gray-200 italic leading-relaxed">
                        &ldquo;{vision.north_star}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vision Details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-gray-300">Strategic planning enabled</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-gray-300">Quarterly reviews scheduled</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-gray-300">Progress tracking active</span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex space-x-4">
                    <button className="flex-1 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-colors">
                      Edit Vision
                    </button>
                    <button className="flex-1 px-4 py-2 bg-pink-500/20 text-pink-400 rounded-xl hover:bg-pink-500/30 transition-colors">
                      Share Progress
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Empty State CTA */}
        {visions.length === 0 && (
          <div className="mt-12">
            <GlassCard className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h4 className="text-lg font-bold text-white mb-2">Define Your Theme</h4>
                  <p className="text-gray-400 text-sm">Set a guiding theme for your year</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <h4 className="text-lg font-bold text-white mb-2">North Star Statement</h4>
                  <p className="text-gray-400 text-sm">Your overarching vision statement</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">📅</div>
                  <h4 className="text-lg font-bold text-white mb-2">Yearly Planning</h4>
                  <p className="text-gray-400 text-sm">Break down into actionable quarters</p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionPage;