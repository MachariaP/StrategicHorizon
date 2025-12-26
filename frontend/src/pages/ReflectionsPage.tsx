import React, { useEffect, useState } from 'react';
import { reflectionsAPI } from '../api';
import type { QuarterlyReflection } from '../types';

const ReflectionsPage: React.FC = () => {
  const [reflections, setReflections] = useState<QuarterlyReflection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await reflectionsAPI.getAll();
        setReflections(response.data.results || []);
      } catch (error) {
        console.error('Error fetching reflections:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 animate-fadeIn">Quarterly Reflections</h1>
        {reflections.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl border border-white/20">
            <span className="text-6xl mb-4 block animate-pulse">🤔</span>
            <p className="text-gray-600 text-lg">No reflections created yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {reflections.map((reflection, index) => (
              <div key={reflection.id} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
                    <span className="text-2xl">🤔</span>
                    <h2 className="text-2xl font-bold">
                      Q{reflection.quarter} {reflection.year}
                    </h2>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 transform hover:scale-[1.02] transition-transform">
                    <h3 className="font-bold text-green-800 mb-3 text-lg flex items-center">
                      <span className="text-2xl mr-2">✅</span> Wins
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{reflection.wins}</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200 transform hover:scale-[1.02] transition-transform">
                    <h3 className="font-bold text-orange-800 mb-3 text-lg flex items-center">
                      <span className="text-2xl mr-2">⚠️</span> Challenges
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{reflection.challenges}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 transform hover:scale-[1.02] transition-transform">
                    <h3 className="font-bold text-blue-800 mb-3 text-lg flex items-center">
                      <span className="text-2xl mr-2">💡</span> Lessons Learned
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{reflection.lessons_learned}</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 transform hover:scale-[1.02] transition-transform">
                    <h3 className="font-bold text-purple-800 mb-3 text-lg flex items-center">
                      <span className="text-2xl mr-2">🎯</span> Adjustments
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{reflection.adjustments}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionsPage;
