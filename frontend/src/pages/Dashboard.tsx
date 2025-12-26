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

        setVision(visionRes.data.results?.[0] || null);
        setGoals(goalsRes.data.results || []);
        setKPIs(kpisRes.data.results || []);
        setExecutions(executionsRes.data.results || []);
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600 font-medium">Loading dashboard...</div>
        </div>
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
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 animate-fadeIn">Dashboard</h1>

        {/* Vision Card */}
        {vision && (
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-2xl transform hover:scale-[1.02] transition-transform duration-300 animate-fadeIn">
            <div className="flex items-center mb-4">
              <span className="text-5xl mr-4 animate-pulse">🎯</span>
              <div>
                <h2 className="text-3xl font-bold">{vision.yearly_theme}</h2>
                <p className="text-blue-100">{vision.year}</p>
              </div>
            </div>
            <p className="text-lg italic font-light">&ldquo;{vision.north_star}&rdquo;</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Goals</h3>
              <span className="text-3xl">🎪</span>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{goals.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">In Progress</h3>
              <span className="text-3xl">⚡</span>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{inProgressGoals}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Completed</h3>
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{completedGoals}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Avg KPI Progress</h3>
              <span className="text-3xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{avgKPIProgress.toFixed(1)}%</p>
          </div>
        </div>

        {/* Recent Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-fadeIn">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Recent Goals</h2>
            {goals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No goals yet. Create your first goal!</p>
            ) : (
              <div className="space-y-4">
                {goals.slice(0, 5).map((goal) => (
                  <div key={goal.id} className="border-l-4 border-blue-500 pl-4 hover:bg-blue-50/50 p-3 rounded-r-lg transition-colors duration-200">
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
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
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-fadeIn">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Upcoming Executions</h2>
            {upcomingExecutions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming executions planned.</p>
            ) : (
              <div className="space-y-4">
                {upcomingExecutions.map((execution) => (
                  <div key={execution.id} className="border-l-4 border-purple-500 pl-4 hover:bg-purple-50/50 p-3 rounded-r-lg transition-colors duration-200">
                    <h3 className="font-semibold text-gray-900">{execution.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{execution.description}</p>
                    <p className="text-xs text-purple-600 mt-1 font-medium">
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
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-fadeIn">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">KPI Progress</h2>
            <div className="space-y-6">
              {kpis.slice(0, 5).map((kpi) => (
                <div key={kpi.id} className="hover:bg-gray-50 p-4 rounded-xl transition-colors duration-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">{kpi.name}</span>
                    <span className="text-sm text-gray-600 font-medium">
                      {kpi.actual_value} / {kpi.target_value} {kpi.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(kpi.progress_percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">{kpi.progress_percentage.toFixed(1)}% complete</p>
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
