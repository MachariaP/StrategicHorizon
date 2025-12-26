import React, { useEffect, useState } from 'react';
import { visionAPI } from '../api';
import type { Vision } from '../types';

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
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
        <div className="text-xl text-gray-600 font-semibold">Loading visions...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 px-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-50 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center space-x-5 mb-4 animate-fade-in-up">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <span className="text-6xl">🎯</span>
            </div>
            <div>
              <h1 className="text-6xl font-bold mb-2">Vision & Theme</h1>
              <p className="text-blue-100 text-xl font-medium">Define your North Star and yearly theme</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          {visions.length === 0 ? (
            <div className="glass-effect rounded-3xl p-16 text-center shadow-2xl border-2 border-purple-100 animate-fade-in">
              <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-3xl mb-6 shadow-glow animate-bounce-slow">
                <span className="text-9xl">🎯</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Visions Yet</h3>
              <p className="text-gray-600 text-lg">Start by creating your vision and yearly theme to guide your journey.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {visions.map((vision, index) => (
                <div 
                  key={vision.id} 
                  className="glass-effect rounded-3xl p-12 shadow-2xl border-2 border-purple-100 hover:shadow-glow-lg transition-all duration-300 card-hover animate-fade-in-up"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <div className="flex items-center mb-8">
                    <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-5 mr-6 shadow-glow">
                      <span className="text-6xl">🎯</span>
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text mb-2">
                        {vision.yearly_theme}
                      </h2>
                      <p className="text-2xl text-gray-600 font-bold">{vision.year}</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 border-l-4 border-purple-500 shadow-inner">
                    <div className="flex items-start mb-3">
                      <div className="text-3xl mr-3">💫</div>
                      <p className="text-xs uppercase font-bold text-purple-600 tracking-wider">North Star Statement</p>
                    </div>
                    <p className="text-2xl text-gray-800 italic leading-relaxed font-medium">
                      &ldquo;{vision.north_star}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisionPage;
