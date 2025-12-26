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
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-10 mb-8 text-white shadow-2xl hover:shadow-glow-lg transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mr-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-6xl">🎯</span>
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold mb-1">{vision.yearly_theme}</h2>
                    <p className="text-blue-100 text-xl font-semibold">{vision.year}</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-l-4 border-white">
                  <p className="text-2xl italic leading-relaxed font-medium">&ldquo;{vision.north_star}&rdquo;</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-purple-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 card-hover">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-700 text-sm font-bold uppercase tracking-wide">Total Goals</h3>
                <div className="text-4xl animate-float">🎪</div>
              </div>
              <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                {goals.length}
              </p>
              <div className="mt-3 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </div>

            <div className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-yellow-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 card-hover">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-700 text-sm font-bold uppercase tracking-wide">In Progress</h3>
                <div className="text-4xl animate-float" style={{animationDelay: '0.2s'}}>⚡</div>
              </div>
              <p className="text-5xl font-bold text-yellow-600">{inProgressGoals}</p>
              <div className="mt-3 h-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
            </div>

            <div className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-green-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 card-hover">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-700 text-sm font-bold uppercase tracking-wide">Completed</h3>
                <div className="text-4xl animate-float" style={{animationDelay: '0.4s'}}>✅</div>
              </div>
              <p className="text-5xl font-bold text-green-600">{completedGoals}</p>
              <div className="mt-3 h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            </div>

            <div className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-blue-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 card-hover">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-700 text-sm font-bold uppercase tracking-wide">Avg KPI Progress</h3>
                <div className="text-4xl animate-float" style={{animationDelay: '0.6s'}}>📈</div>
              </div>
              <p className="text-5xl font-bold text-blue-600">{avgKPIProgress.toFixed(1)}%</p>
              <div className="mt-3 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
            </div>
          </div>

          {/* Recent Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="glass-effect rounded-2xl p-8 shadow-xl border-2 border-blue-100/50 card-hover">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl mr-4 shadow-lg">
                  <span className="text-4xl">🎯</span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Recent Goals</h2>
              </div>
              {goals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No goals yet. Create your first goal!</p>
              ) : (
                <div className="space-y-4">
                  {goals.slice(0, 5).map((goal, index) => (
                    <div key={goal.id} className="border-l-4 border-blue-500 pl-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-r-xl p-4 hover:from-blue-100/70 hover:shadow-md transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                      <h3 className="font-bold text-gray-900 mb-1">{goal.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{goal.description}</p>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
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
