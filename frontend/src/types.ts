// Type definitions for the Strategic Planner API

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Vision {
  id: number;
  user: number;
  username?: string;
  year: number;
  north_star: string;
  yearly_theme: string;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: number;
  user: number;
  username?: string;
  vision?: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  target_date?: string;
  kpis?: KPI[];
  created_at: string;
  updated_at: string;
}

export interface KPI {
  id: number;
  user: number;
  goal: number;
  name: string;
  description: string;
  target_value: number;
  actual_value: number;
  unit: string;
  progress_percentage?: number;
  created_at: string;
  updated_at: string;
}

export interface NonNegotiable {
  id: number;
  user: number;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  created_at: string;
  updated_at: string;
}

export interface System {
  id: number;
  user: number;
  name: string;
  description: string;
  frequency: string;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: number;
  user: number;
  name: string;
  role: 'mentor' | 'partner' | 'supporter' | 'advisor' | 'other';
  role_description: string;
  contact_info?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Execution {
  id: number;
  user: number;
  goal?: number;
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
  user: number;
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
  user: number;
  quarter: 1 | 2 | 3 | 4;
  quarter_display?: string;
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
