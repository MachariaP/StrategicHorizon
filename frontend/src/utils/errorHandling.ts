/**
 * Utility functions for error handling
 */

/**
 * Get a user-friendly error message based on the error type
 */
export const getErrorMessage = (err: any): string => {
  if (err.name === 'NetworkError') {
    return err.message;
  } else if (err.response?.status === 401) {
    return 'Authentication failed. Please log in to continue.';
  } else if (err.response?.status === 403) {
    return 'Access denied. You do not have permission to view this data.';
  } else if (err.response?.status >= 500) {
    return 'Server error. Please try again later or contact support.';
  } else {
    return 'Failed to load data. Please try again or contact support.';
  }
};

/**
 * Get an error title based on the error type
 */
export const getErrorTitle = (err: any): string => {
  if (err.name === 'NetworkError') {
    return 'Connection Error';
  } else if (err.response?.status === 401) {
    return 'Authentication Error';
  } else if (err.response?.status === 403) {
    return 'Access Denied';
  } else if (err.response?.status >= 500) {
    return 'Server Error';
  } else {
    return 'Error';
  }
};
