import axios from 'axios';
import type {
  User,
  Vision,
  Goal,
  KPI,
  NonNegotiable,
  System,
  Person,
  Execution,
  Obstacle,
  QuarterlyReflection,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  PaginatedResponse,
  ConfidenceMatrixData,
} from './types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login';
        }
      }
      
      if (status === 403) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthTokens>('/api/auth/login/', credentials),
  register: (data: RegisterData) =>
    api.post<User>('/api/auth/register/', data),
  getUser: () =>
    api.get<User>('/api/auth/user/'),
};

export const visionAPI = {
  getAll: () => api.get<PaginatedResponse<Vision>>('/api/vision/'),
  getOne: (id: number) => api.get<Vision>(`/api/vision/${id}/`),
  create: (data: Partial<Vision>) => api.post<Vision>('/api/vision/', data),
  update: (id: number, data: Partial<Vision>) => api.put<Vision>(`/api/vision/${id}/`, data),
  patch: (id: number, data: Partial<Vision>) => api.patch<Vision>(`/api/vision/${id}/`, data),
  delete: (id: number) => api.delete(`/api/vision/${id}/`),
  softDelete: (id: number) => api.patch(`/api/vision/${id}/soft-delete/`),
  restore: (id: number) => api.patch(`/api/vision/${id}/restore/`),
  getArchived: () => api.get<Vision[]>('/api/vision/archived/'),
};

export const goalsAPI = {
  getAll: () => api.get<PaginatedResponse<Goal>>('/api/goals/'),
  getOne: (id: number) => api.get<Goal>(`/api/goals/${id}/`),
  create: (data: Partial<Goal>) => api.post<Goal>('/api/goals/', data),
  update: (id: number, data: Partial<Goal>) => api.put<Goal>(`/api/goals/${id}/`, data),
  patch: (id: number, data: Partial<Goal>) => api.patch<Goal>(`/api/goals/${id}/`, data),
  delete: (id: number) => api.delete(`/api/goals/${id}/`),
  // New endpoints for strategic cascading and confidence matrix
  getStrategicGoals: () => api.get<PaginatedResponse<Goal>>('/api/goals/strategic_goals/'),
  getTacticalGoals: () => api.get<PaginatedResponse<Goal>>('/api/goals/tactical_goals/'),
  getConfidenceMatrix: () => api.get<ConfidenceMatrixData>('/api/goals/confidence_matrix/'),
  getSubGoals: (id: number) => api.get<Goal[]>(`/api/goals/${id}/sub_goals/'),
};

export const kpisAPI = {
  getAll: () => api.get<PaginatedResponse<KPI>>('/api/kpis/'),
  getOne: (id: number) => api.get<KPI>(`/api/kpis/${id}/`),
  create: (data: Partial<KPI>) => api.post<KPI>('/api/kpis/', data),
  update: (id: number, data: Partial<KPI>) => api.put<KPI>(`/api/kpis/${id}/`, data),
  delete: (id: number) => api.delete(`/api/kpis/${id}/`),
};

export const nonNegotiablesAPI = {
  getAll: () => api.get<PaginatedResponse<NonNegotiable>>('/api/non-negotiables/'),
  getOne: (id: number) => api.get<NonNegotiable>(`/api/non-negotiables/${id}/`),
  create: (data: Partial<NonNegotiable>) => api.post<NonNegotiable>('/api/non-negotiables/', data),
  update: (id: number, data: Partial<NonNegotiable>) => api.put<NonNegotiable>(`/api/non-negotiables/${id}/`, data),
  delete: (id: number) => api.delete(`/api/non-negotiables/${id}/`),
};

export const systemsAPI = {
  getAll: () => api.get<PaginatedResponse<System>>('/api/systems/'),
  getOne: (id: number) => api.get<System>(`/api/systems/${id}/`),
  create: (data: Partial<System>) => api.post<System>('/api/systems/', data),
  update: (id: number, data: Partial<System>) => api.put<System>(`/api/systems/${id}/`, data),
  delete: (id: number) => api.delete(`/api/systems/${id}/`),
};

export const peopleAPI = {
  getAll: () => api.get<PaginatedResponse<Person>>('/api/people/'),
  getOne: (id: number) => api.get<Person>(`/api/people/${id}/`),
  create: (data: Partial<Person>) => api.post<Person>('/api/people/', data),
  update: (id: number, data: Partial<Person>) => api.put<Person>('/api/people/${id}/', data),
  delete: (id: number) => api.delete(`/api/people/${id}/`),
};

export const executionsAPI = {
  getAll: () => api.get<PaginatedResponse<Execution>>('/api/executions/'),
  getOne: (id: number) => api.get<Execution>(`/api/executions/${id}/`),
  create: (data: Partial<Execution>) => api.post<Execution>('/api/executions/', data),
  update: (id: number, data: Partial<Execution>) => api.put<Execution>(`/api/executions/${id}/`, data),
  delete: (id: number) => api.delete(`/api/executions/${id}/`),
};

export const obstaclesAPI = {
  getAll: () => api.get<PaginatedResponse<Obstacle>>('/api/obstacles/'),
  getOne: (id: number) => api.get<Obstacle>(`/api/obstacles/${id}/`),
  create: (data: Partial<Obstacle>) => api.post<Obstacle>('/api/obstacles/', data),
  update: (id: number, data: Partial<Obstacle>) => api.put<Obstacle>(`/api/obstacles/${id}/`, data),
  delete: (id: number) => api.delete(`/api/obstacles/${id}/`),
};

export const reflectionsAPI = {
  getAll: () => api.get<PaginatedResponse<QuarterlyReflection>>('/api/reflections/'),
  getOne: (id: number) => api.get<QuarterlyReflection>(`/api/reflections/${id}/`),
  create: (data: Partial<QuarterlyReflection>) => api.post<QuarterlyReflection>('/api/reflections/', data),
  update: (id: number, data: Partial<QuarterlyReflection>) => api.put<QuarterlyReflection>(`/api/reflections/${id}/`, data),
  delete: (id: number) => api.delete(`/api/reflections/${id}/`),
};

export default api;