/**
 * Utility functions for error handling
 */

/**
 * Type for errors that can be handled by our error utilities
 */
export interface AppError {
  name?: string;
  message?: string;
  response?: {
    status?: number;
    data?: unknown;
  };
}

/**
 * Get a user-friendly error message based on the error type
 */
export const getErrorMessage = (err: AppError | null): string => {
  if (!err) return 'An unknown error occurred.';
  
  if (err.name === 'NetworkError') {
    return err.message || 'Unable to connect to the server.';
  } else if (err.response?.status === 401) {
    return 'Authentication failed. Please log in to continue.';
  } else if (err.response?.status === 403) {
    return 'Access denied. You do not have permission to view this data.';
  } else if (err.response?.status && err.response.status >= 500) {
    return 'Server error. Please try again later or contact support.';
  } else {
    return 'Failed to load data. Please try again or contact support.';
  }
};

/**
 * Get an error title based on the error type
 */
export const getErrorTitle = (err: AppError | null): string => {
  if (!err) return 'Error';
  
  if (err.name === 'NetworkError') {
    return 'Connection Error';
  } else if (err.response?.status === 401) {
    return 'Authentication Error';
  } else if (err.response?.status === 403) {
    return 'Access Denied';
  } else if (err.response?.status && err.response.status >= 500) {
    return 'Server Error';
  } else {
    return 'Error';
  }
};
