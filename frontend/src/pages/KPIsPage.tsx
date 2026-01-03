import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { kpisAPI } from '../api';
import type { KPI } from '../types';
import { formatValueWithUnit, getProgressBarColor, getProgressBadgeColor } from '../utils/kpiUtils';

const KPIsPage: React.FC = () => {
  const [kpis, setKPIs] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const response = await kpisAPI.getAll();
        setKPIs(response.data.results || []);
      } catch (error) {
        console.error('Error fetching KPIs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-600 mb-4"></div>
        <div className="text-xl text-gray-600 font-semibold">Loading KPIs...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white py-16 px-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 opacity-50 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center space-x-5 mb-4 animate-fade-in-up">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <span className="text-6xl">📈</span>
            </div>
            <div>
              <h1 className="text-6xl font-bold mb-2">KPIs</h1>
              <p className="text-cyan-100 text-xl font-medium">Track your Key Performance Indicators</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {kpis.length === 0 ? (
            <div className="glass-effect rounded-3xl p-16 text-center shadow-2xl border-2 border-cyan-100 animate-fade-in">
              <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 p-6 rounded-3xl mb-6 shadow-glow animate-bounce-slow">
                <span className="text-9xl">📈</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No KPIs Yet</h3>
              <p className="text-gray-600 text-lg mb-6">Create your first KPI to start tracking performance.</p>
              <button 
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  // TODO: Open create KPI modal or navigate to create page
                  console.log('Create KPI clicked');
                }}
              >
                Create KPI
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {kpis.map((kpi, index) => {
                // Use history_trend_data if available, otherwise fall back to trend_data
                const trendData = kpi.history_trend_data || kpi.trend_data || [];
                const hasData = trendData.length > 0;
                
                return (
                  <div 
                    key={kpi.id} 
                    className="glass-effect rounded-2xl p-8 shadow-xl border-2 border-blue-100 hover:shadow-2xl transition-all duration-300 card-hover animate-fade-in-up"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-4 shadow-lg">
                          {hasData ? (
                            <div className="w-16 h-16">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                  <Line 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#ffffff" 
                                    strokeWidth={2}
                                    dot={false}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          ) : (
                            <span className="text-4xl">📊</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{kpi.name}</h3>
                          <p className="text-gray-600 text-base leading-relaxed">{kpi.description}</p>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className={`inline-block bg-gradient-to-br ${getProgressBadgeColor(kpi.progress_percentage)} text-white px-6 py-3 rounded-xl shadow-lg`}>
                          <p className="text-4xl font-bold">{kpi.progress_percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-semibold text-gray-600 mb-3">
                        <span>Progress</span>
                        <span className="text-gray-800">
                          {formatValueWithUnit(kpi.actual_value, kpi.unit)} / {formatValueWithUnit(kpi.target_value, kpi.unit)}
                        </span>
                      </div>
                      <div className="relative w-full bg-gray-200 rounded-full h-4 shadow-inner overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getProgressBarColor(kpi.progress_percentage)} rounded-full transition-all duration-1000 shadow-lg`}
                          style={{ width: `${Math.min(kpi.progress_percentage, 100)}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPIsPage;
