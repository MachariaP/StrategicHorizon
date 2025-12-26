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

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">KPIs</h1>
        {kpis.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <span className="text-6xl mb-4 block">📈</span>
            <p className="text-gray-600">No KPIs created yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {kpis.map((kpi) => (
              <div key={kpi.id} className="bg-white rounded-lg p-6 shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{kpi.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{kpi.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{kpi.progress_percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{kpi.actual_value} / {kpi.target_value} {kpi.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(kpi.progress_percentage, 100)}%` }}
                    />
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
