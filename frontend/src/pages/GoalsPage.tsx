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
        setGoals(response.data.results || []);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-xl text-gray-600">Loading goals...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12 px-8 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-3">
            <span className="text-5xl">🎪</span>
            <h1 className="text-5xl font-bold">Goals</h1>
          </div>
          <p className="text-green-100 text-lg">Track your specific, measurable milestones</p>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {goals.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl border border-blue-100">
              <span className="text-8xl mb-6 block animate-pulse">🎪</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Goals Yet</h3>
              <p className="text-gray-600">Create your first goal to start tracking your progress.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-100 hover:shadow-2xl transition-all hover:scale-[1.03]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-xl p-3">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                        goal.status === 'completed'
                          ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
                          : goal.status === 'in_progress'
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                          : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                      }`}
                    >
                      {goal.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{goal.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{goal.description}</p>
                  {goal.target_date && (
                    <div className="flex items-center text-sm text-gray-500 bg-blue-50 rounded-lg px-3 py-2">
                      <span className="mr-2">📅</span>
                      <span className="font-medium">Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
