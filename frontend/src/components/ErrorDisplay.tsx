import React from 'react';
import { AppError, getErrorMessage, getErrorTitle } from '../utils/errorHandling';

interface ErrorDisplayProps {
  error: AppError | null;
  onRetry?: () => void;
  apiUrl?: string;
  retryAriaLabel?: string;
}

/**
 * Reusable error display component with contextual troubleshooting steps
 * 
 * Displays user-friendly error messages with specific troubleshooting guidance
 * based on error type (network, authentication, permission, server errors, etc.)
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry, apiUrl, retryAriaLabel }) => {
  if (!error) return null;

  const errorTitle = getErrorTitle(error);
  const errorMessage = getErrorMessage(error);
  const effectiveApiUrl = apiUrl || process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  // Determine troubleshooting steps based on error type
  const getTroubleshootingSteps = (): string[] => {
    if (error.name === 'NetworkError' || !error.response) {
      return [
        'Ensure the backend server is running (check with `python manage.py runserver`)',
        `Verify the API is accessible at ${effectiveApiUrl}`,
        'Check your network connection',
        'If running locally, ensure PostgreSQL is running and the backend server is started',
      ];
    } else if (error.response?.status === 401) {
      return [
        'Try logging out and logging back in',
        'Your session may have expired',
        'Check that your credentials are correct',
        'Clear browser cache and cookies if the issue persists',
      ];
    } else if (error.response?.status === 403) {
      return [
        'You may not have permission to access this resource',
        'Contact your administrator if you believe you should have access',
        'Verify you are logged in with the correct account',
      ];
    } else if (error.response?.status && error.response.status >= 500) {
      return [
        'The server encountered an error',
        'Try again in a few moments',
        'Check the backend logs in your terminal or console',
        'Contact support if the issue persists',
      ];
    } else if (error.response?.status === 404) {
      return [
        'The requested resource was not found',
        'Verify the API endpoint configuration',
        'Check that all required data has been created',
      ];
    } else {
      return [
        'Review the browser console for detailed error messages (Press F12)',
        `Verify the API is accessible at ${effectiveApiUrl}`,
        'Check your network connection',
        'Contact support if the issue persists',
      ];
    }
  };

  const troubleshootingSteps = getTroubleshootingSteps();

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
            <p className="font-medium">{errorTitle}</p>
            <p className="mt-1 text-sm">{errorMessage}</p>
            {error.response?.status && (
              <p className="mt-1 text-xs">Status Code: {error.response.status}</p>
            )}
            {onRetry && (
              <div className="mt-4">
                <button
                  onClick={onRetry}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
                  aria-label={retryAriaLabel || 'Retry loading data'}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 text-blue-700 px-4 py-3 rounded">
        <p className="font-medium">Troubleshooting Steps:</p>
        <ul className="mt-2 text-sm list-disc list-inside space-y-1">
          {troubleshootingSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ErrorDisplay;