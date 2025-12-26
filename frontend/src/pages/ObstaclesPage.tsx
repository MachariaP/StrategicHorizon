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

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Obstacles & Mitigations</h1>
        {obstacles.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <span className="text-6xl mb-4 block">🚧</span>
            <p className="text-gray-600">No obstacles identified yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {obstacles.map((obstacle) => (
              <div key={obstacle.id} className="bg-white rounded-lg p-6 shadow border-l-4 border-orange-500">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{obstacle.title}</h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      obstacle.severity === 'critical'
                        ? 'bg-red-100 text-red-800'
                        : obstacle.severity === 'high'
                        ? 'bg-orange-100 text-orange-800'
                        : obstacle.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {obstacle.severity.toUpperCase()}
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Description:</h4>
                  <p className="text-gray-600">{obstacle.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Mitigation Strategy:</h4>
                  <p className="text-gray-600">{obstacle.mitigation}</p>
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
