import React, { useEffect, useState } from 'react';
import { kpisAPI } from '../api';
import type { KPI } from '../types';

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

  if (loading) return <div className="p-8 flex justify-center items-center min-h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <div className="text-xl text-gray-600 font-medium">Loading...</div>
    </div>
  </div>;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 animate-fadeIn">KPIs</h1>
        {kpis.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl border border-white/20">
            <span className="text-6xl mb-4 block animate-pulse">📈</span>
            <p className="text-gray-600 text-lg">No KPIs created yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {kpis.map((kpi, index) => (
              <div key={kpi.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{kpi.name}</h3>
                    <p className="text-gray-600 text-sm">{kpi.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{kpi.progress_percentage.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-3 font-medium">
                    <span>Progress</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">{kpi.actual_value} / {kpi.target_value} {kpi.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500 ease-out relative"
                      style={{ width: `${Math.min(kpi.progress_percentage, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIsPage;
