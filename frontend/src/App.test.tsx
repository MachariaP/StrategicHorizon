import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock API calls
jest.mock('./api', () => ({
  visionApi: {
    getAll: jest.fn().mockResolvedValue([]),
  },
  goalApi: {
    getAll: jest.fn().mockResolvedValue([]),
  },
  authApi: {
    login: jest.fn(),
  },
}));

describe('App Authentication', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('redirects to login when not authenticated', () => {
    render(<App />);
    // Should show login page when not authenticated
    expect(screen.getByText(/Strategic Planner/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your username/i)).toBeInTheDocument();
  });

  test('shows protected content when authenticated', async () => {
    // Set authentication token
    localStorage.setItem('accessToken', 'mock-token');
    
    render(<App />);
    
    // Should show dashboard loading state initially
    await waitFor(() => {
      expect(screen.getByText(/Loading.../i) || screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
  });
});
