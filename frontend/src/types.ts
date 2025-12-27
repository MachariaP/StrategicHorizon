export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Vision {
  id: number;
  year: number;
  north_star: string;
  yearly_theme: string;
  time_horizon: 1 | 3 | 5 | 10;
  time_horizon_display: string;
  five_whys: string[];
  is_active: boolean;
  is_deleted: boolean;
  deleted_at?: string;
  visual_url?: string;
  created_at: string;
  updated_at: string;
  goal_count?: number;
}

export interface Goal {
  id: number;
  vision?: number;
  vision_details?: Vision;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'stalled';
  confidence_level: number; // 1-5
  target_date?: string;
  progress_percentage: number;
  kpi_count: number;
  strategic_level?: 'high' | 'low'; // Client-side only for UI distinction
  created_at: string;
  updated_at: string;
}

export interface KPI {
  id: number;
  goal: number;
  name: string;
  description: string;
  target_value: number;
  actual_value: number;
  unit: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface NonNegotiable {
  id: number;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  created_at: string;
  updated_at: string;
}

export interface System {
  id: number;
  name: string;
  description: string;
  frequency: string;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: number;
  name: string;
  role: 'mentor' | 'partner' | 'supporter' | 'advisor' | 'other';
  role_description: string;
  contact_info: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Execution {
  id: number;
  goal?: number;
  title: string;
  description: string;
  month: number;
  year: number;
  status: 'planned' | 'in_progress' | 'completed' | 'deferred';
  created_at: string;
  updated_at: string;
}

export interface Obstacle {
  id: number;
  goal?: number;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
  created_at: string;
  updated_at: string;
}

export interface QuarterlyReflection {
  id: number;
  quarter: 1 | 2 | 3 | 4;
  year: number;
  wins: string;
  challenges: string;
  lessons_learned: string;
  adjustments: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
