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
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <div className="text-xl text-gray-600 font-semibold">Loading goals...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-16 px-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 opacity-50 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center space-x-5 mb-4 animate-fade-in-up">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <span className="text-6xl">🎪</span>
            </div>
            <div>
              <h1 className="text-6xl font-bold mb-2">Goals</h1>
              <p className="text-green-100 text-xl font-medium">Track your specific, measurable milestones</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {goals.length === 0 ? (
            <div className="glass-effect rounded-3xl p-16 text-center shadow-2xl border-2 border-blue-100 animate-fade-in">
              <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-3xl mb-6 shadow-glow animate-bounce-slow">
                <span className="text-9xl">🎪</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Goals Yet</h3>
              <p className="text-gray-600 text-lg">Create your first goal to start tracking your progress.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {goals.map((goal, index) => (
                <div 
                  key={goal.id} 
                  className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-blue-100 hover:shadow-2xl transition-all duration-300 card-hover animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-xl p-4 shadow-lg">
                      <span className="text-4xl">🎯</span>
                    </div>
                    <span
                      className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-md ${
                        goal.status === 'completed'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : goal.status === 'in_progress'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                      }`}
                    >
                      {goal.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">{goal.title}</h3>
                  <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">{goal.description}</p>
                  {goal.target_date && (
                    <div className="flex items-center text-sm text-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-3 border border-blue-200 shadow-sm">
                      <span className="mr-2 text-xl">📅</span>
                      <span className="font-bold">Target: {new Date(goal.target_date).toLocaleDateString()}</span>
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
