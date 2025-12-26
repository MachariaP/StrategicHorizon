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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Your strategic planning overview</p>
          </div>

          {/* Vision Card */}
          {vision && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-2xl hover:shadow-3xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mr-4">
                  <span className="text-5xl">🎯</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{vision.yearly_theme}</h2>
                  <p className="text-blue-100 text-lg">{vision.year}</p>
                </div>
              </div>
              <p className="text-xl italic leading-relaxed">&ldquo;{vision.north_star}&rdquo;</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Goals</h3>
                <span className="text-3xl">🎪</span>
              </div>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                {goals.length}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-yellow-100 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">In Progress</h3>
                <span className="text-3xl">⚡</span>
              </div>
              <p className="text-4xl font-bold text-yellow-600">{inProgressGoals}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-100 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Completed</h3>
                <span className="text-3xl">✅</span>
              </div>
              <p className="text-4xl font-bold text-green-600">{completedGoals}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-100 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Avg KPI Progress</h3>
                <span className="text-3xl">📈</span>
              </div>
              <p className="text-4xl font-bold text-blue-600">{avgKPIProgress.toFixed(1)}%</p>
            </div>
          </div>

          {/* Recent Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">🎯</span>
                <h2 className="text-2xl font-bold text-gray-900">Recent Goals</h2>
              </div>
              {goals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No goals yet. Create your first goal!</p>
              ) : (
                <div className="space-y-4">
                  {goals.slice(0, 5).map((goal) => (
                    <div key={goal.id} className="border-l-4 border-blue-500 pl-4 bg-blue-50/50 rounded-r-lg p-4 hover:bg-blue-100/50 transition-colors">
                      <h3 className="font-semibold text-gray-900 mb-1">{goal.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
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
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Executions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">🚀</span>
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Executions</h2>
              </div>
              {upcomingExecutions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No upcoming executions planned.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingExecutions.map((execution) => (
                    <div key={execution.id} className="border-l-4 border-purple-500 pl-4 bg-purple-50/50 rounded-r-lg p-4 hover:bg-purple-100/50 transition-colors">
                      <h3 className="font-semibold text-gray-900 mb-1">{execution.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{execution.description}</p>
                      <p className="text-xs text-purple-600 font-medium">
                        📅 Month {execution.month}, {execution.year}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* KPIs Overview */}
          {kpis.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">📈</span>
                <h2 className="text-2xl font-bold text-gray-900">KPI Progress</h2>
              </div>
              <div className="space-y-6">
                {kpis.slice(0, 5).map((kpi) => (
                  <div key={kpi.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">{kpi.name}</span>
                      <span className="text-sm text-gray-600 font-medium">
                        {kpi.actual_value} / {kpi.target_value} {kpi.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
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
    </div>
  );
};

export default Dashboard;
