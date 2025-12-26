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

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-gradient-to-r from-red-600 to-rose-600';
      case 'high':
        return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      default:
        return 'bg-gradient-to-r from-green-500 to-teal-500';
    }
  };

  const getBorderColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'border-red-500';
      case 'high':
        return 'border-orange-500';
      case 'medium':
        return 'border-yellow-500';
      default:
        return 'border-green-500';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mb-4"></div>
        <div className="text-xl text-gray-600 font-semibold">Loading obstacles...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white py-16 px-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 opacity-50 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center space-x-5 mb-4 animate-fade-in-up">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <span className="text-6xl">🚧</span>
            </div>
            <div>
              <h1 className="text-6xl font-bold mb-2">Obstacles & Mitigations</h1>
              <p className="text-yellow-100 text-xl font-medium">Identify challenges and create strategic solutions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {obstacles.length === 0 ? (
            <div className="glass-effect rounded-3xl p-16 text-center shadow-2xl border-2 border-orange-100 animate-fade-in">
              <div className="inline-block bg-gradient-to-r from-yellow-500 to-orange-600 p-6 rounded-3xl mb-6 shadow-glow animate-bounce-slow">
                <span className="text-9xl">🚧</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Obstacles Identified Yet</h3>
              <p className="text-gray-600 text-lg">Start your pre-mortem analysis by identifying potential obstacles.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {obstacles.map((obstacle, index) => (
                <div 
                  key={obstacle.id} 
                  className={`glass-effect rounded-2xl p-8 shadow-xl border-l-8 ${getBorderColor(obstacle.severity)} hover:shadow-2xl transition-all duration-300 card-hover animate-fade-in-up`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-start flex-1">
                      <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-4 mr-4 shadow-lg">
                        <span className="text-4xl">⚠️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{obstacle.title}</h3>
                      </div>
                    </div>
                    <span className={`${getSeverityColor(obstacle.severity)} text-white px-4 py-2 text-xs font-bold rounded-full shadow-md ml-4`}>
                      {obstacle.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-2">📋</span>
                      <h4 className="font-bold text-gray-800 text-lg">Description:</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed ml-10 bg-gradient-to-r from-gray-50 to-transparent rounded-xl p-4 border border-gray-200">{obstacle.description}</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-2">🛡️</span>
                      <h4 className="font-bold text-gray-800 text-lg">Mitigation Strategy:</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed ml-10 bg-gradient-to-r from-green-50 to-transparent rounded-xl p-4 border border-green-300">{obstacle.mitigation}</p>
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

export default ObstaclesPage;
