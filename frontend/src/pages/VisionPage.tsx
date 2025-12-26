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

  if (loading) return <div className="p-8 flex justify-center items-center min-h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <div className="text-xl text-gray-600 font-medium">Loading...</div>
    </div>
  </div>;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 animate-fadeIn">Vision & Theme</h1>
        {visions.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl border border-white/20">
            <span className="text-6xl mb-4 block animate-pulse">🎯</span>
            <p className="text-gray-600 text-lg">No visions created yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {visions.map((vision, index) => (
              <div key={vision.id} className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 shadow-2xl transform hover:scale-[1.02] transition-all duration-300 animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-4xl animate-pulse">🎯</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{vision.yearly_theme}</h2>
                    <p className="text-blue-100 font-medium">{vision.year}</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <p className="text-xl text-white italic font-light leading-relaxed">&ldquo;{vision.north_star}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionPage;
