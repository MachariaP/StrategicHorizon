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

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Systems</h1>
        {systems.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <span className="text-6xl mb-4 block">⚙️</span>
            <p className="text-gray-600">No systems created yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {systems.map((system) => (
              <div key={system.id} className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{system.name}</h3>
                    <p className="text-gray-600 mb-2">{system.description}</p>
                    <span className="text-sm text-gray-500">Frequency: {system.frequency}</span>
                  </div>
                  <span className="text-3xl ml-4">⚙️</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemsPage;
