import React, { useEffect, useState } from 'react';
import { visionApi, goalApi } from '../api';
import type { Vision, Goal } from '../types';

const Dashboard: React.FC = () => {
  const [vision, setVision] = useState<Vision | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch vision for 2026
        const visions = await visionApi.getAll();
        const vision2026 = visions.find(v => v.year === 2026);
        if (vision2026) {
          setVision(vision2026);
        }

        // Fetch goals
        const goalsData = await goalApi.getAll();
        setGoals(goalsData);

        setError(null);
      } catch (err: any) {
        // Provide more specific error messages based on error type
        if (err.name === 'NetworkError') {
          setError(err.message);
        } else if (err.response?.status === 401) {
          setError('Authentication failed. Please log in to continue.');
        } else if (err.response?.status === 403) {
          setError('Access denied. You do not have permission to view this data.');
        } else if (err.response?.status >= 500) {
          setError('Server error. Please try again later or contact support.');
        } else {
          setError('Failed to load dashboard data. Please try again or contact support.');
        }
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="font-medium">Connection Error</p>
              <p className="mt-1 text-sm">{error}</p>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 text-blue-700 px-4 py-3 rounded">
          <p className="font-medium">Troubleshooting Steps:</p>
          <ul className="mt-2 text-sm list-disc list-inside space-y-1">
            <li>Ensure the backend server is running (check Docker container status)</li>
            <li>Verify the API is accessible at {process.env.REACT_APP_API_URL || 'http://localhost:8000'}</li>
            <li>Check your network connection</li>
            <li>Review the browser console for detailed error messages</li>
          </ul>
        </div>
      </div>
    );
  }

  const pendingGoals = goals.filter(g => g.status === 'pending');
  const inProgressGoals = goals.filter(g => g.status === 'in_progress');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      {/* Vision Section */}
      <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-blue-600">2026 Vision</h3>
        {vision ? (
          <div>
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-700">Yearly Theme</h4>
              <p className="text-xl text-gray-900">{vision.yearly_theme}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-700">North Star</h4>
              <p className="text-gray-800">{vision.north_star}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No vision set for 2026 yet.</p>
        )}
      </div>

      {/* Goals Summary */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Goals Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-100 rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold text-yellow-800">Pending</h4>
            <p className="text-4xl font-bold text-yellow-600">{pendingGoals.length}</p>
          </div>
          <div className="bg-blue-100 rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold text-blue-800">In Progress</h4>
            <p className="text-4xl font-bold text-blue-600">{inProgressGoals.length}</p>
          </div>
          <div className="bg-green-100 rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold text-green-800">Completed</h4>
            <p className="text-4xl font-bold text-green-600">{completedGoals.length}</p>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Recent Goals</h3>
        {goals.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <ul className="divide-y divide-gray-200">
              {goals.slice(0, 5).map((goal) => (
                <li key={goal.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        goal.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : goal.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {goal.status.replace('_', ' ')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600">No goals created yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
