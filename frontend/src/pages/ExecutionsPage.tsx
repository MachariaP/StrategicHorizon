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

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Executions</h1>
        {executions.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <span className="text-6xl mb-4 block">📅</span>
            <p className="text-gray-600">No executions planned yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {executions.map((execution) => (
              <div key={execution.id} className="bg-white rounded-lg p-6 shadow">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-blue-600">
                    {monthNames[execution.month - 1]} {execution.year}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      execution.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : execution.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : execution.status === 'deferred'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {execution.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{execution.title}</h3>
                <p className="text-gray-600 text-sm">{execution.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionsPage;
