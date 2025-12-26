import React, { useEffect, useState } from 'react';
import { systemsAPI } from '../api';
import type { System } from '../types';

const SystemsPage: React.FC = () => {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await systemsAPI.getAll();
        setSystems(response.data.results || []);
      } catch (error) {
        console.error('Error fetching systems:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mb-4"></div>
        <div className="text-xl text-gray-600 font-semibold">Loading systems...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white py-16 px-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 opacity-50 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center space-x-5 mb-4 animate-fade-in-up">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <span className="text-6xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-6xl font-bold mb-2">Systems</h1>
              <p className="text-cyan-100 text-xl font-medium">Your recurring processes and habits for success</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {systems.length === 0 ? (
            <div className="glass-effect rounded-3xl p-16 text-center shadow-2xl border-2 border-teal-100 animate-fade-in">
              <div className="inline-block bg-gradient-to-r from-cyan-500 to-teal-600 p-6 rounded-3xl mb-6 shadow-glow animate-bounce-slow">
                <span className="text-9xl">⚙️</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Systems Yet</h3>
              <p className="text-gray-600 text-lg">Create your first system to build consistent habits.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {systems.map((system, index) => (
                <div 
                  key={system.id} 
                  className="glass-effect rounded-2xl p-8 shadow-xl border-2 border-teal-100 hover:shadow-2xl transition-all duration-300 card-hover animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl p-4 mr-6 shadow-lg flex-shrink-0">
                      <span className="text-5xl">⚙️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{system.name}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed text-lg">{system.description}</p>
                      <div className="inline-flex items-center bg-gradient-to-r from-cyan-50 to-teal-50 border-2 border-teal-200 rounded-xl px-4 py-2 shadow-sm">
                        <span className="text-lg mr-2">🔄</span>
                        <span className="text-sm font-bold text-teal-700">Frequency: {system.frequency}</span>
                      </div>
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

export default SystemsPage;
