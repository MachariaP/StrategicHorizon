// src/pages/Dashboard.tsx - Enhanced version with Confidence Matrix
import React, { useEffect, useState } from 'react';
import { visionAPI, goalsAPI, kpisAPI, executionsAPI } from '../api';
import type { Vision, Goal, KPI, Execution } from '../types';
import GlassCard from '../components/GlassCard';
import ConfidenceMatrix from '../components/ConfidenceMatrix';

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

  const completedGoals = goals.filter((g) => g.status === 'completed').length;
  const inProgressGoals = goals.filter((g) => g.status === 'in_progress').length;
  const highRiskGoals = goals.filter(g => 
    g.progress_percentage <= 30 && g.confidence_level <= 2
  ).length;
  const onTrackGoals = goals.filter(g => 
    g.progress_percentage >= 70 && g.confidence_level >= 4
  ).length;
  
  const avgKPIProgress = kpis.length > 0
    ? kpis.reduce((sum, kpi) => sum + kpi.progress_percentage, 0) / kpis.length
    : 0;
  const upcomingExecutions = executions.filter((e) => e.status === 'planned').slice(0, 5);

  const stats = [
    {
      title: 'Total Goals',
      value: goals.length,
      icon: '🎯',
      color: 'from-purple-500 to-pink-500',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'High Risk',
      value: highRiskGoals,
      icon: '⚠️',
      color: 'from-red-500 to-orange-500',
      change: highRiskGoals > 0 ? `${highRiskGoals} need attention` : 'All clear',
      trend: highRiskGoals > 0 ? 'down' : 'up'
    },
    {
      title: 'On Track',
      value: onTrackGoals,
      icon: '✅',
      color: 'from-green-500 to-emerald-500',
      change: '+23%',
      trend: 'up'
    },
    {
      title: 'Avg Progress',
      value: `${avgKPIProgress.toFixed(1)}%`,
      icon: '📈',
      color: 'from-blue-500 to-cyan-500',
      change: '+8%',
      trend: 'up'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-gray-800/50 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x mb-2">
                  Dashboard Overview
                </h1>
                <p className="text-purple-300/70 text-lg">Your strategic planning command center</p>
              </div>
              <div className="text-5xl animate-float">🚀</div>
            </div>
          </div>

          {/* Vision Card - Hero */}
          {vision && (
            <GlassCard 
              className="mb-12"
              gradient={true}
            >
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className="relative mr-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50" />
                      <div className="relative text-7xl">🎯</div>
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-2">{vision.yearly_theme}</h2>
                      <p className="text-purple-300 text-xl">{vision.year} • Your North Star</p>
                    </div>
                  </div>
                  <p className="text-2xl text-gray-200 italic leading-relaxed">
                    &ldquo;{vision.north_star}&rdquo;
                  </p>
                </div>
                <div className="mt-8 lg:mt-0 lg:ml-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-50" />
                    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-purple-500/30">
                      <p className="text-lg text-purple-300 mb-2">Progress</p>
                      <div className="flex items-end space-x-2">
                        <span className="text-5xl font-bold text-white">{completedGoals}</span>
                        <span className="text-2xl text-purple-400">/</span>
                        <span className="text-3xl text-gray-400">{goals.length}</span>
                        <span className="text-green-400 ml-4">↑ 23%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <GlassCard 
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <span className="text-3xl">{stat.icon}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    stat.trend === 'up' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">{stat.title}</p>
                  <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000`}
                      style={{ width: `${Math.random() * 80 + 20}%` }}
                    />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Confidence Matrix Section */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full blur opacity-50" />
                <div className="relative text-4xl">📊</div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Confidence vs Progress Matrix</h2>
                <p className="text-purple-300/70">Analyze goal health across four risk quadrants</p>
              </div>
            </div>
            <ConfidenceMatrix />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Goals Column */}
            <div>
              <div className="flex items-center mb-6">
                <div className="relative mr-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-50" />
                  <div className="relative text-4xl">🎪</div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Recent Goals</h2>
                  <p className="text-purple-300/70">Track your strategic milestones</p>
                </div>
              </div>

              {goals.length === 0 ? (
                <GlassCard>
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold text-white mb-2">No Goals Yet</h3>
                    <p className="text-gray-400">Create your first goal to start tracking</p>
                  </div>
                </GlassCard>
              ) : (
                <div className="space-y-4">
                  {goals.slice(0, 4).map((goal) => (
                    <GlassCard 
                      key={goal.id}
                      className="group hover:border-purple-500/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-bold text-white">{goal.title}</h3>
                            <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${
                              goal.status === 'completed'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : goal.status === 'in_progress'
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                              {goal.status.replace('_', ' ').toUpperCase()}
                            </span>
                            {goal.strategic_level === 'high' && (
                              <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                                Strategic
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{goal.description}</p>
                          <div className="flex items-center justify-between">
                            {goal.target_date && (
                              <div className="flex items-center text-sm text-purple-400">
                                <span className="mr-2">📅</span>
                                <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                              </div>
                            )}
                            <span className="text-sm text-blue-400">
                              Confidence: {goal.confidence_level}/5
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 text-4xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                          🎯
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>

            {/* KPIs & Executions Column */}
            <div>
              {/* KPIs */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="relative mr-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-50" />
                    <div className="relative text-4xl">📈</div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">KPI Progress</h2>
                    <p className="text-purple-300/70">Key performance indicators</p>
                  </div>
                </div>

                {kpis.length === 0 ? (
                  <GlassCard>
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">📊</div>
                      <p className="text-gray-400">No KPIs configured yet</p>
                    </div>
                  </GlassCard>
                ) : (
                  <div className="space-y-4">
                    {kpis.slice(0, 3).map((kpi) => (
                      <GlassCard key={kpi.id}>
                        <div className="mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-white">{kpi.name}</h3>
                            <span className="text-lg font-bold text-white">{kpi.progress_percentage.toFixed(1)}%</span>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{kpi.description}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">
                              {kpi.actual_value} / {kpi.target_value} {kpi.unit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000"
                              style={{ width: `${Math.min(kpi.progress_percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Executions */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="relative mr-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur opacity-50" />
                    <div className="relative text-4xl">🚀</div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Upcoming Executions</h2>
                    <p className="text-purple-300/70">Next actions to take</p>
                  </div>
                </div>

                {upcomingExecutions.length === 0 ? (
                  <GlassCard>
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">📅</div>
                      <p className="text-gray-400">No executions planned yet</p>
                    </div>
                  </GlassCard>
                ) : (
                  <div className="space-y-4">
                    {upcomingExecutions.map((execution) => (
                      <GlassCard key={execution.id}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="font-bold text-white mr-3">{execution.title}</h3>
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                                Month {execution.month}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{execution.description}</p>
                          </div>
                          <div className="ml-4 text-3xl">📅</div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12">
            <GlassCard gradient={true}>
              <div className="text-center py-8">
                <div className="text-6xl mb-4 animate-float">✨</div>
                <h3 className="text-2xl font-bold text-white mb-3">Ready to Level Up Your Strategy?</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  You're making great progress! Keep building momentum and track your journey towards your 2026 vision.
                </p>
                <div className="flex items-center justify-center space-x-6">
                  <div className="text-center">
                    <div className="text-3xl text-white font-bold mb-1">{inProgressGoals}</div>
                    <div className="text-sm text-gray-400">Goals in Progress</div>
                  </div>
                  <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-transparent rounded-full"></div>
                  <div className="text-center">
                    <div className="text-3xl text-white font-bold mb-1">{completedGoals}</div>
                    <div className="text-sm text-gray-400">Goals Completed</div>
                  </div>
                  <div className="w-1 h-12 bg-gradient-to-b from-pink-500 to-transparent rounded-full"></div>
                  <div className="text-center">
                    <div className="text-3xl text-white font-bold mb-1">{avgKPIProgress.toFixed(0)}%</div>
                    <div className="text-sm text-gray-400">Average Progress</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;