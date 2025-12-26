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

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-teal-50 via-green-50 to-blue-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mb-4"></div>
        <div className="text-xl text-gray-600 font-semibold">Loading reflections...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-blue-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-teal-600 via-green-600 to-blue-600 text-white py-16 px-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-green-600 to-blue-600 opacity-50 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center space-x-5 mb-4 animate-fade-in-up">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <span className="text-6xl">🔄</span>
            </div>
            <div>
              <h1 className="text-6xl font-bold mb-2">Quarterly Reflections</h1>
              <p className="text-teal-100 text-xl font-medium">Review, learn, and pivot with structured insights</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {reflections.length === 0 ? (
            <div className="glass-effect rounded-3xl p-16 text-center shadow-2xl border-2 border-teal-100 animate-fade-in">
              <div className="inline-block bg-gradient-to-r from-teal-500 to-green-600 p-6 rounded-3xl mb-6 shadow-glow animate-bounce-slow">
                <span className="text-9xl">🔄</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Reflections Yet</h3>
              <p className="text-gray-600 text-lg">Create your first quarterly reflection to track progress.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {reflections.map((reflection, index) => (
                <div 
                  key={reflection.id} 
                  className="glass-effect rounded-3xl p-10 shadow-2xl border-2 border-teal-100 hover:shadow-glow transition-all duration-300 card-hover animate-fade-in-up"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <div className="flex items-center mb-8">
                    <div className="bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl p-5 mr-5 shadow-lg">
                      <span className="text-5xl">📊</span>
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-green-600 text-transparent bg-clip-text">
                        Q{reflection.quarter} {reflection.year}
                      </h2>
                      <p className="text-gray-600 text-lg font-medium">Quarterly Review & Insights</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-green-500 shadow-sm">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">✅</span>
                        <h3 className="font-bold text-green-800 text-xl">Wins</h3>
                      </div>
                      <p className="text-gray-800 leading-relaxed">{reflection.wins}</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border-l-4 border-orange-500 shadow-sm">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">⚠️</span>
                        <h3 className="font-bold text-orange-800 text-xl">Challenges</h3>
                      </div>
                      <p className="text-gray-800 leading-relaxed">{reflection.challenges}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">💡</span>
                        <h3 className="font-bold text-blue-800 text-xl">Lessons Learned</h3>
                      </div>
                      <p className="text-gray-800 leading-relaxed">{reflection.lessons_learned}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-l-4 border-purple-500 shadow-sm">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">🎯</span>
                        <h3 className="font-bold text-purple-800 text-xl">Adjustments</h3>
                      </div>
                      <p className="text-gray-800 leading-relaxed">{reflection.adjustments}</p>
                    </div>
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

export default ReflectionsPage;
