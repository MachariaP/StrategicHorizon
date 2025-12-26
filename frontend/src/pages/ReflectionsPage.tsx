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
        setReflections(response.data);
      } catch (error) {
        console.error('Error fetching reflections:', error);
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Quarterly Reflections</h1>
        {reflections.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <span className="text-6xl mb-4 block">🤔</span>
            <p className="text-gray-600">No reflections created yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {reflections.map((reflection) => (
              <div key={reflection.id} className="bg-white rounded-lg p-8 shadow">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Q{reflection.quarter} {reflection.year}
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-green-700 mb-2">✅ Wins</h3>
                    <p className="text-gray-700">{reflection.wins}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-700 mb-2">⚠️ Challenges</h3>
                    <p className="text-gray-700">{reflection.challenges}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-700 mb-2">💡 Lessons Learned</h3>
                    <p className="text-gray-700">{reflection.lessons_learned}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-700 mb-2">🎯 Adjustments</h3>
                    <p className="text-gray-700">{reflection.adjustments}</p>
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
