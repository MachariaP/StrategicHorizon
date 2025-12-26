import React, { useEffect, useState } from 'react';
import { obstaclesAPI } from '../api';
import type { Obstacle } from '../types';

const ObstaclesPage: React.FC = () => {
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await obstaclesAPI.getAll();
        setObstacles(response.data.results || []);
      } catch (error) {
        console.error('Error fetching obstacles:', error);
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 animate-fadeIn">Obstacles & Mitigations</h1>
        {obstacles.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl border border-white/20">
            <span className="text-6xl mb-4 block animate-pulse">🚧</span>
            <p className="text-gray-600 text-lg">No obstacles identified yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {obstacles.map((obstacle, index) => (
              <div key={obstacle.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-orange-500 transform hover:-translate-y-1 animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">🚧</span>
                    <h3 className="text-2xl font-bold text-gray-900">{obstacle.title}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      obstacle.severity === 'critical'
                        ? 'bg-gradient-to-r from-red-500 to-red-700 text-white'
                        : obstacle.severity === 'high'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : obstacle.severity === 'medium'
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                        : 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                    }`}
                  >
                    {obstacle.severity.toUpperCase()}
                  </span>
                </div>
                <div className="mb-4 bg-red-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="mr-2">⚠️</span> Description:
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{obstacle.description}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="mr-2">✅</span> Mitigation Strategy:
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{obstacle.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ObstaclesPage;
