import React, { useEffect, useState } from 'react';
import { executionsAPI } from '../api';
import type { Execution } from '../types';

const ExecutionsPage: React.FC = () => {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await executionsAPI.getAll();
        setExecutions(response.data.results || []);
      } catch (error) {
        console.error('Error fetching executions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (loading) return <div className="p-8 flex justify-center items-center min-h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <div className="text-xl text-gray-600 font-medium">Loading...</div>
    </div>
  </div>;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 animate-fadeIn">Executions</h1>
        {executions.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl border border-white/20">
            <span className="text-6xl mb-4 block animate-pulse">📅</span>
            <p className="text-gray-600 text-lg">No executions planned yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {executions.map((execution, index) => (
              <div key={execution.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 animate-fadeIn" style={{ animationDelay: `${index * 0.03}s` }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full">
                    <span>📅</span>
                    <span>{monthNames[execution.month - 1]} {execution.year}</span>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      execution.status === 'completed'
                        ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                        : execution.status === 'in_progress'
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                        : execution.status === 'deferred'
                        ? 'bg-gradient-to-r from-red-400 to-red-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {execution.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{execution.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{execution.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionsPage;
