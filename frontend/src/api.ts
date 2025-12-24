import axios from 'axios';
import type {
  Vision, Goal, KPI, NonNegotiable, System, Person,
  Execution, Obstacle, QuarterlyReflection, AuthTokens
} from './types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 errors and connection errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network/connection errors
    if (!error.response) {
      // Network error (e.g., ERR_CONNECTION_REFUSED, no internet)
      const enhancedError = new Error(
        `Unable to connect to the server. Please ensure the backend is running on ${
          process.env.REACT_APP_API_URL || 'http://localhost:8000'
        } or check your internet connection.`
      );
      enhancedError.name = 'NetworkError';
      return Promise.reject(enhancedError);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/token/refresh/`,
            { refresh: refreshToken }
          );
          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  login: async (username: string, password: string): Promise<AuthTokens> => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/token/`,
      { username, password }
    );
    return response.data;
  },
};

// Vision API
export const visionApi = {
  getAll: async (): Promise<Vision[]> => {
    const response = await api.get('/api/visions/');
    return response.data;
  },
  getById: async (id: number): Promise<Vision> => {
    const response = await api.get(`/api/visions/${id}/`);
    return response.data;
  },
  create: async (data: Partial<Vision>): Promise<Vision> => {
    const response = await api.post('/api/visions/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Vision>): Promise<Vision> => {
    const response = await api.patch(`/api/visions/${id}/`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/visions/${id}/`);
  },
};

// Goal API
export const goalApi = {
  getAll: async (): Promise<Goal[]> => {
    const response = await api.get('/api/goals/');
    return response.data;
  },
  getById: async (id: number): Promise<Goal> => {
    const response = await api.get(`/api/goals/${id}/`);
    return response.data;
  },
  getByStatus: async (status: string): Promise<Goal[]> => {
    const response = await api.get(`/api/goals/by_status/?status=${status}`);
    return response.data;
  },
  create: async (data: Partial<Goal>): Promise<Goal> => {
    const response = await api.post('/api/goals/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Goal>): Promise<Goal> => {
    const response = await api.patch(`/api/goals/${id}/`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/goals/${id}/`);
  },
};

// KPI API
export const kpiApi = {
  getAll: async (): Promise<KPI[]> => {
    const response = await api.get('/api/kpis/');
    return response.data;
  },
  getById: async (id: number): Promise<KPI> => {
    const response = await api.get(`/api/kpis/${id}/`);
    return response.data;
  },
  create: async (data: Partial<KPI>): Promise<KPI> => {
    const response = await api.post('/api/kpis/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<KPI>): Promise<KPI> => {
    const response = await api.patch(`/api/kpis/${id}/`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/kpis/${id}/`);
  },
};

// Non-Negotiables API
export const nonNegotiableApi = {
  getAll: async (): Promise<NonNegotiable[]> => {
    const response = await api.get('/api/non-negotiables/');
    return response.data;
  },
  create: async (data: Partial<NonNegotiable>): Promise<NonNegotiable> => {
    const response = await api.post('/api/non-negotiables/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<NonNegotiable>): Promise<NonNegotiable> => {
    const response = await api.patch(`/api/non-negotiables/${id}/`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/non-negotiables/${id}/`);
  },
};

// Systems API
export const systemApi = {
  getAll: async (): Promise<System[]> => {
    const response = await api.get('/api/systems/');
    return response.data;
  },
  create: async (data: Partial<System>): Promise<System> => {
    const response = await api.post('/api/systems/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<System>): Promise<System> => {
    const response = await api.patch(`/api/systems/${id}/`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/systems/${id}/`);
  },
};

// People API
export const personApi = {
  getAll: async (): Promise<Person[]> => {
    const response = await api.get('/api/people/');
    return response.data;
  },
  create: async (data: Partial<Person>): Promise<Person> => {
    const response = await api.post('/api/people/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Person>): Promise<Person> => {
    const response = await api.patch(`/api/people/${id}/`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/people/${id}/`);
  },
};

// Executions API
export const executionApi = {
  getAll: async (): Promise<Execution[]> => {
    const response = await api.get('/api/executions/');
    return response.data;
  },
  getByMonth: async (month: number, year: number): Promise<Execution[]> => {
    const response = await api.get(`/api/executions/by_month/?month=${month}&year=${year}`);
    return response.data;
  },
  create: async (data: Partial<Execution>): Promise<Execution> => {
    const response = await api.post('/api/executions/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Execution>): Promise<Execution> => {
    const response = await api.patch(`/api/executions/${id}/`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/executions/${id}/`);
  },
};

// Obstacles API
export const obstacleApi = {
  getAll: async (): Promise<Obstacle[]> => {
    const response = await api.get('/api/obstacles/');
    return response.data;
  },
  create: async (data: Partial<Obstacle>): Promise<Obstacle> => {
    const response = await api.post('/api/obstacles/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Obstacle>): Promise<Obstacle> => {
    const response = await api.patch(`/api/obstacles/${id}/`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/obstacles/${id}/`);
  },
};

// Quarterly Reflections API
export const reflectionApi = {
  getAll: async (): Promise<QuarterlyReflection[]> => {
    const response = await api.get('/api/reflections/');
    return response.data;
  },
  create: async (data: Partial<QuarterlyReflection>): Promise<QuarterlyReflection> => {
    const response = await api.post('/api/reflections/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<QuarterlyReflection>): Promise<QuarterlyReflection> => {
    const response = await api.patch(`/api/reflections/${id}/`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/reflections/${id}/`);
  },
};

export default api;
