import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorDisplay from './ErrorDisplay';
import { AppError } from '../utils/errorHandling';

describe('ErrorDisplay Component', () => {
  test('renders nothing when error is null', () => {
    const { container } = render(<ErrorDisplay error={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders network error with correct troubleshooting steps', () => {
    const networkError: AppError = {
      name: 'NetworkError',
      message: 'Unable to connect to server',
    };
    
    render(<ErrorDisplay error={networkError} />);
    
    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(screen.getByText(/Unable to connect to server/i)).toBeInTheDocument();
    expect(screen.getByText(/Ensure the backend server is running/i)).toBeInTheDocument();
    expect(screen.getByText(/python manage.py runserver/i)).toBeInTheDocument();
  });

  test('renders 401 error with authentication troubleshooting steps', () => {
    const authError: AppError = {
      response: {
        status: 401,
      },
    };
    
    render(<ErrorDisplay error={authError} />);
    
    expect(screen.getByText('Authentication Error')).toBeInTheDocument();
    expect(screen.getByText(/Authentication failed/i)).toBeInTheDocument();
    expect(screen.getByText(/Try logging out and logging back in/i)).toBeInTheDocument();
  });

  test('renders 403 error with permission troubleshooting steps', () => {
    const permissionError: AppError = {
      response: {
        status: 403,
      },
    };
    
    render(<ErrorDisplay error={permissionError} />);
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText(/You do not have permission to view this data/i)).toBeInTheDocument();
    expect(screen.getByText(/You may not have permission/i)).toBeInTheDocument();
  });

  test('renders 500 error with server error troubleshooting steps', () => {
    const serverError: AppError = {
      response: {
        status: 500,
      },
    };
    
    render(<ErrorDisplay error={serverError} />);
    
    expect(screen.getByText('Server Error')).toBeInTheDocument();
    expect(screen.getByText(/Please try again later or contact support/i)).toBeInTheDocument();
    expect(screen.getByText(/The server encountered an error/i)).toBeInTheDocument();
  });

  test('renders 404 error with resource not found troubleshooting steps', () => {
    const notFoundError: AppError = {
      response: {
        status: 404,
      },
    };
    
    render(<ErrorDisplay error={notFoundError} />);
    
    expect(screen.getByText(/The requested resource was not found/i)).toBeInTheDocument();
  });

  test('displays status code when available', () => {
    const errorWithStatus: AppError = {
      response: {
        status: 500,
      },
    };
    
    render(<ErrorDisplay error={errorWithStatus} />);
    
    expect(screen.getByText('Status Code: 500')).toBeInTheDocument();
  });

  test('renders retry button and calls onRetry when clicked', () => {
    const mockRetry = jest.fn();
    const error: AppError = {
      name: 'NetworkError',
      message: 'Connection failed',
    };
    
    render(<ErrorDisplay error={error} onRetry={mockRetry} retryAriaLabel="Retry loading test data" />);
    
    const retryButton = screen.getByRole('button', { name: /Retry loading test data/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  test('does not render retry button when onRetry is not provided', () => {
    const error: AppError = {
      message: 'Some error',
    };
    
    render(<ErrorDisplay error={error} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('uses custom API URL in troubleshooting steps when provided', () => {
    const error: AppError = {
      name: 'NetworkError',
    };
    
    render(<ErrorDisplay error={error} apiUrl="http://custom-api:9000" />);
    
    expect(screen.getByText(/http:\/\/custom-api:9000/i)).toBeInTheDocument();
  });

  test('uses default aria-label when retryAriaLabel is not provided', () => {
    const mockRetry = jest.fn();
    const error: AppError = {
      message: 'Some error',
    };
    
    render(<ErrorDisplay error={error} onRetry={mockRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /Retry loading data/i });
    expect(retryButton).toBeInTheDocument();
  });
});
