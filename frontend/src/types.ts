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
  health_score?: number; // Added from backend enhancement
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
  goal_title?: string; // Added from backend enhancement
  goal_status?: string; // Added from backend enhancement
  name: string;
  description: string;
  target_value: number;
  current_value?: number; // Added
  actual_value: number;
  unit: string;
  progress_percentage: number;
  trend_data?: Array<{ date: string; value: number }>; // Added
  created_at: string;
  updated_at: string;
}

export interface NonNegotiable {
  id: number;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  frequency_display?: string; // Added from backend enhancement
  is_binary?: boolean; // Added
  created_at: string;
  updated_at: string;
}

export interface System {
  id: number;
  name: string;
  description: string;
  frequency: string;
  frequency_display?: string; // Added from backend enhancement
  input_definition?: string; // Added
  output_kpi_link?: string; // Added
  last_execution_date?: string; // Added
  health_status?: string; // Added
  health_status_display?: string; // Added from backend enhancement
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: number;
  name: string;
  role: 'mentor' | 'partner' | 'supporter' | 'advisor' | 'other';
  role_display?: string; // Added from backend enhancement
  role_description: string;
  contact_info: string;
  notes: string;
  relationship_depth?: number; // Added
  relationship_depth_display?: string; // Added from backend enhancement
  last_contact_date?: string; // Added
  frequency_days?: number; // Added
  needs_contact?: boolean; // Added
  days_until_contact?: number; // Added
  created_at: string;
  updated_at: string;
}

export interface Execution {
  id: number;
  goal?: number;
  goal_title?: string; // Added from backend enhancement
  goal_status?: string; // Added from backend enhancement
  title: string;
  description: string;
  month: number;
  month_display?: string; // Added from backend enhancement
  year: number;
  status: 'planned' | 'in_progress' | 'completed' | 'deferred';
  created_at: string;
  updated_at: string;
}

export interface Obstacle {
  id: number;
  goal?: number;
  goal_title?: string; // Added from backend enhancement
  goal_status?: string; // Added from backend enhancement
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  severity_index?: number; // Added
  mitigation: string;
  mitigation_plan?: string; // Added
  is_blocking?: boolean; // Added
  created_at: string;
  updated_at: string;
}

export interface QuarterlyReflection {
  id: number;
  reflection_type?: 'weekly' | 'monthly' | 'quarterly'; // Added
  quarter?: 1 | 2 | 3 | 4;
  week_number?: number; // Added
  month?: number; // Added
  year: number;
  wins: string;
  challenges: string;
  lessons_learned: string;
  adjustments: string;
  gratitude_log?: string; // Added
  is_locked?: boolean; // Added
  locked_at?: string; // Added
  can_edit?: boolean; // Added
  time_until_lock?: number; // Added
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
