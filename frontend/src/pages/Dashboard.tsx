import React, { useEffect, useState } from 'react';
import { visionAPI, goalsAPI, kpisAPI, executionsAPI } from '../api';
import type { Vision, Goal, KPI, Execution } from '../types';

const Dashboard: React.FC = () => {
  const [vision, setVision] = useState<Vision | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [kpis, setKPIs] = useState<KPI[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visionRes, goalsRes, kpisRes, executionsRes] = await Promise.all([
          visionAPI.getAll(),
          goalsAPI.getAll(),
          kpisAPI.getAll(),
          executionsAPI.getAll(),
        ]);

        setVision(visionRes.data[0] || null);
        setGoals(goalsRes.data);
        setKPIs(kpisRes.data);
        setExecutions(executionsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const completedGoals = goals.filter((g) => g.status === 'completed').length;
  const inProgressGoals = goals.filter((g) => g.status === 'in_progress').length;
  const avgKPIProgress = kpis.length > 0
    ? kpis.reduce((sum, kpi) => sum + kpi.progress_percentage, 0) / kpis.length
    : 0;
  const upcomingExecutions = executions.filter((e) => e.status === 'planned').slice(0, 5);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Vision Card */}
        {vision && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-8 text-white">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-3">🎯</span>
              <div>
                <h2 className="text-2xl font-bold">{vision.yearly_theme}</h2>
                <p className="text-blue-100">{vision.year}</p>
              </div>
            </div>
            <p className="text-lg italic">&ldquo;{vision.north_star}&rdquo;</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Goals</h3>
              <span className="text-2xl">🎪</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{goals.length}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">In Progress</h3>
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{inProgressGoals}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Completed</h3>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{completedGoals}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Avg KPI Progress</h3>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{avgKPIProgress.toFixed(1)}%</p>
          </div>
        </div>

        {/* Recent Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Goals</h2>
            {goals.length === 0 ? (
              <p className="text-gray-500">No goals yet. Create your first goal!</p>
            ) : (
              <div className="space-y-4">
                {goals.slice(0, 5).map((goal) => (
                  <div key={goal.id} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1 text-xs rounded-full ${
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
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Executions */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Executions</h2>
            {upcomingExecutions.length === 0 ? (
              <p className="text-gray-500">No upcoming executions planned.</p>
            ) : (
              <div className="space-y-4">
                {upcomingExecutions.map((execution) => (
                  <div key={execution.id} className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-gray-900">{execution.title}</h3>
                    <p className="text-sm text-gray-600">{execution.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Month {execution.month}, {execution.year}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KPIs Overview */}
        {kpis.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">KPI Progress</h2>
            <div className="space-y-4">
              {kpis.slice(0, 5).map((kpi) => (
                <div key={kpi.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{kpi.name}</span>
                    <span className="text-sm text-gray-600">
                      {kpi.actual_value} / {kpi.target_value} {kpi.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(kpi.progress_percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{kpi.progress_percentage.toFixed(1)}% complete</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
