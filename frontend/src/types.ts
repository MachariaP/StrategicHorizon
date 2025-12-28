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
  health_score?: number;
}

export interface Goal {
  id: number;
  vision: number;
  vision_name?: string;
  vision_year?: number;
  parent_goal?: number | null;
  parent_goal_title?: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'stalled';
  strategic_level: 'high' | 'low';
  confidence_level: number;
  target_date?: string;
  weight: number;
  progress_percentage: number;
  kpi_count: number;
  sub_goal_count: number;
  is_deleted?: boolean;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
  vision_details?: Vision;
}

export interface ConfidenceMatrixData {
  quadrant1: Goal[];
  quadrant2: Goal[];
  quadrant3: Goal[];
  quadrant4: Goal[];
  stats: {
    total: number;
    high_risk: number;
    false_security: number;
    on_track: number;
    early_stage: number;
  };
}

export interface KPI {
  id: number;
  goal: number;
  goal_title?: string;
  goal_status?: string;
  name: string;
  description?: string;
  target_value: number;
  current_value?: number;
  actual_value: number;
  unit: string;
  progress_percentage: number;
  trend_data?: Array<{ date: string; value: number }>;
  history_trend_data?: Array<{ date: string; value: number }>;
  created_at: string;
  updated_at: string;
}

export interface NonNegotiable {
  id: number;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  frequency_display?: string;
  is_binary?: boolean;
  created_at: string;
  updated_at: string;
}

export interface System {
  id: number;
  name: string;
  description: string;
  frequency: string;
  frequency_display?: string;
  input_definition?: string;
  output_kpi_link?: string;
  last_execution_date?: string;
  health_status?: string;
  health_status_display?: string;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: number;
  name: string;
  role: 'mentor' | 'partner' | 'supporter' | 'advisor' | 'other';
  role_display?: string;
  role_description: string;
  contact_info?: string;
  notes?: string;
  relationship_depth?: number;
  relationship_depth_display?: string;
  last_contact_date?: string;
  frequency_days?: number;
  needs_contact?: boolean;
  days_until_contact?: number;
  created_at: string;
  updated_at: string;
}

export interface Execution {
  id: number;
  goal?: number;
  goal_title?: string;
  goal_status?: string;
  title: string;
  description: string;
  month: number;
  month_display?: string;
  year: number;
  status: 'planned' | 'in_progress' | 'completed' | 'deferred';
  created_at: string;
  updated_at: string;
}

export interface Obstacle {
  id: number;
  goal?: number;
  goal_title?: string;
  goal_status?: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  severity_index?: number;
  mitigation?: string;
  mitigation_plan?: string;
  is_blocking?: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuarterlyReflection {
  id: number;
  reflection_type?: 'weekly' | 'monthly' | 'quarterly';
  quarter?: 1 | 2 | 3 | 4;
  week_number?: number;
  month?: number;
  year: number;
  wins: string;
  challenges: string;
  lessons_learned: string;
  adjustments: string;
  gratitude_log?: string;
  is_locked?: boolean;
  locked_at?: string;
  can_edit?: boolean;
  time_until_lock?: number;
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