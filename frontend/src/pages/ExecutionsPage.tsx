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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'in_progress':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'deferred':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <div className="text-xl text-gray-600 font-semibold">Loading executions...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-50 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-5 mb-4 animate-fade-in-up">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <span className="text-6xl">🚀</span>
            </div>
            <div>
              <h1 className="text-6xl font-bold mb-2">Executions</h1>
              <p className="text-indigo-100 text-xl font-medium">Your monthly roadmap and action plan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {executions.length === 0 ? (
            <div className="glass-effect rounded-3xl p-16 text-center shadow-2xl border-2 border-purple-100 animate-fade-in">
              <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-3xl mb-6 shadow-glow animate-bounce-slow">
                <span className="text-9xl">🚀</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Executions Planned Yet</h3>
              <p className="text-gray-600 text-lg">Start planning your monthly executions for the year.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {executions.map((execution, index) => (
                <div 
                  key={execution.id} 
                  className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-purple-100 hover:shadow-2xl transition-all duration-300 card-hover animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg">
                      <span className="text-lg mr-2">📅</span>
                      <span className="text-sm font-bold">
                        {monthNames[execution.month - 1]} {execution.year}
                      </span>
                    </div>
                    <span className={`${getStatusColor(execution.status)} text-white px-3 py-1 text-xs font-bold rounded-full shadow-md`}>
                      {execution.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{execution.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{execution.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutionsPage;
