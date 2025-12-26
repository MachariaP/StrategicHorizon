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
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-xl text-gray-600">Loading visions...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-8 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center space-x-4 mb-3">
            <span className="text-5xl">🎯</span>
            <h1 className="text-5xl font-bold">Vision & Theme</h1>
          </div>
          <p className="text-blue-100 text-lg">Define your North Star and yearly theme</p>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          {visions.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl border border-purple-100">
              <span className="text-8xl mb-6 block animate-pulse">🎯</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Visions Yet</h3>
              <p className="text-gray-600">Start by creating your vision and yearly theme to guide your journey.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {visions.map((vision) => (
                <div key={vision.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-purple-100 hover:shadow-2xl transition-all hover:scale-[1.02]">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-4 mr-6">
                      <span className="text-5xl">🎯</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                        {vision.yearly_theme}
                      </h2>
                      <p className="text-xl text-gray-600 font-semibold">{vision.year}</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
                    <p className="text-xl text-gray-700 italic leading-relaxed">
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
