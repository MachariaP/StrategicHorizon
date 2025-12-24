import React, { useEffect, useState } from 'react';
import { executionApi } from '../api';
import type { Execution } from '../types';
import { getErrorMessage, getErrorTitle } from '../utils/errorHandling';

const ExecutionsView: React.FC = () => {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<any>(null);
  const currentYear = 2026;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const fetchExecutions = async () => {
      try {
        setLoading(true);
        const data = await executionApi.getAll();
        setExecutions(data.filter(e => e.year === currentYear));
        setError(null);
        setErrorType(null);
      } catch (err: any) {
        // Use utility functions for consistent error handling
        setError(getErrorMessage(err));
        setErrorType(err);
        console.error('Executions error:', err);
      } finally {
        setLoading(false);
      }
    };

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
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="font-medium">{getErrorTitle(errorType)}</p>
              <p className="mt-1 text-sm">{error}</p>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 text-blue-700 px-4 py-3 rounded">
          <p className="font-medium">Troubleshooting Steps:</p>
          <ul className="mt-2 text-sm list-disc list-inside space-y-1">
            <li>Ensure the backend server is running (check Docker container status)</li>
            <li>Verify the API is accessible at {process.env.REACT_APP_API_URL || 'http://localhost:8000'}</li>
            <li>Check your network connection</li>
            <li>Review the browser console for detailed error messages</li>
          </ul>
        </div>
      </div>
    );
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
