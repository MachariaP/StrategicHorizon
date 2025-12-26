import React, { useEffect, useState } from 'react';
import { goalsAPI } from '../api';
import type { Goal } from '../types';

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await goalsAPI.getAll();
        setGoals(response.data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Goals</h1>
        {goals.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <span className="text-6xl mb-4 block">🎪</span>
            <p className="text-gray-600">No goals created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      goal.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : goal.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {goal.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{goal.description}</p>
                {goal.target_date && (
                  <p className="text-sm text-gray-500">Target: {new Date(goal.target_date).toLocaleDateString()}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;
