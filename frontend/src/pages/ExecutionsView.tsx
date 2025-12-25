import React, { useEffect, useState } from 'react';
import { executionApi } from '../api';
import type { Execution } from '../types';
import type { AppError } from '../utils/errorHandling';
import ErrorDisplay from '../components/ErrorDisplay';

const ExecutionsView: React.FC = () => {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const currentYear = 2026;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchExecutions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await executionApi.getAll();
      setExecutions(data.filter(e => e.year === currentYear));
    } catch (err: unknown) {
      setError(err as AppError);
      console.error('Executions error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutions();
  }, []);

  const getExecutionsForMonth = (monthIndex: number): Execution[] => {
    return executions.filter(e => e.month === monthIndex + 1);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-200 border-green-400';
      case 'in_progress':
        return 'bg-blue-200 border-blue-400';
      case 'deferred':
        return 'bg-gray-200 border-gray-400';
      default:
        return 'bg-yellow-200 border-yellow-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading executions...</div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchExecutions} retryAriaLabel="Retry loading executions data" />;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">2026 Monthly Execution Roadmap</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map((month, index) => {
          const monthExecutions = getExecutionsForMonth(index);
          return (
            <div
              key={month}
              className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-200"
            >
              <h3 className="text-lg font-bold mb-3 text-gray-800 border-b pb-2">
                {month}
              </h3>
              <div className="space-y-2">
                {monthExecutions.length > 0 ? (
                  monthExecutions.map((execution) => (
                    <div
                      key={execution.id}
                      className={`p-3 rounded border-l-4 ${getStatusColor(execution.status)}`}
                    >
                      <h4 className="font-semibold text-sm text-gray-900">
                        {execution.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {execution.description.substring(0, 60)}
                        {execution.description.length > 60 ? '...' : ''}
                      </p>
                      <span className="text-xs font-medium mt-1 inline-block capitalize">
                        {execution.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic">No tasks planned</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 bg-white rounded-lg shadow p-4">
        <h4 className="text-lg font-semibold mb-3">Status Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-yellow-200 border-2 border-yellow-400 rounded"></div>
            <span className="text-sm">Planned</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-200 border-2 border-blue-400 rounded"></div>
            <span className="text-sm">In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-200 border-2 border-green-400 rounded"></div>
            <span className="text-sm">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 border-2 border-gray-400 rounded"></div>
            <span className="text-sm">Deferred</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionsView;
