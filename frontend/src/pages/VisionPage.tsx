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
        setVisions(response.data);
      } catch (error) {
        console.error('Error fetching visions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisions();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Vision & Theme</h1>
        {visions.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <span className="text-6xl mb-4 block">🎯</span>
            <p className="text-gray-600">No visions created yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {visions.map((vision) => (
              <div key={vision.id} className="bg-white rounded-lg p-8 shadow">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">🎯</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{vision.yearly_theme}</h2>
                    <p className="text-gray-600">{vision.year}</p>
                  </div>
                </div>
                <p className="text-lg text-gray-700 italic">&ldquo;{vision.north_star}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionPage;
