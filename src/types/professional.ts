export interface CareerGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: 'promotion' | 'skill_development' | 'industry_change' | 'leadership' | 'entrepreneurship' | 'education';
  priority: 'high' | 'medium' | 'low';
  timeline: '3_months' | '6_months' | '1_year' | '2_years' | '5_years';
  target_date?: string;
  current_status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  progress_percentage: number;
  success_metrics: string[];
  obstacles: string[];
  resources_needed: string[];
  created_at: string;
  updated_at: string;
}

export interface SkillRequirement {
  id: string;
  user_id: string;
  goal_id: string;
  skill_name: string;
  skill_category: 'technical' | 'soft' | 'leadership' | 'industry_specific' | 'language' | 'certification';
  current_level: number;
  target_level: number;
  importance: 'critical' | 'important' | 'nice_to_have';
  learning_priority: number;
  estimated_time_hours?: number;
  deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface DevelopmentAction {
  id: string;
  user_id: string;
  goal_id: string;
  skill_id?: string;
  action_type: 'training' | 'certification' | 'project' | 'networking' | 'mentorship' | 'reading' | 'practice' | 'conference';
  title: string;
  description?: string;
  specific_steps: string[];
  estimated_duration?: string;
  cost_estimate?: number;
  deadline?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  completion_date?: string;
  outcome_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LearningResource {
  id: string;
  user_id: string;
  skill_id: string;
  resource_type: 'course' | 'book' | 'article' | 'video' | 'podcast' | 'tool' | 'platform' | 'mentor';
  title: string;
  provider?: string;
  url?: string;
  cost: number;
  estimated_time_hours?: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  status: 'recommended' | 'in_progress' | 'completed' | 'not_relevant';
  completion_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  user_id: string;
  skill_id?: string;
  certification_name: string;
  issuing_organization: string;
  certification_type: 'technical' | 'professional' | 'industry' | 'vendor' | 'academic';
  status: 'planned' | 'studying' | 'scheduled' | 'completed' | 'expired' | 'cancelled';
  study_start_date?: string;
  exam_date?: string;
  completion_date?: string;
  expiration_date?: string;
  cost?: number;
  study_hours_estimated?: number;
  study_hours_actual?: number;
  score?: string;
  certificate_url?: string;
  renewal_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgressMetric {
  id: string;
  user_id: string;
  goal_id: string;
  metric_name: string;
  metric_type: 'quantitative' | 'qualitative' | 'milestone' | 'feedback';
  target_value: string;
  current_value?: string;
  measurement_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  last_measured?: string;
  measurement_history: Array<{
    date: string;
    value: string;
    notes?: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalAssessment {
  id: string;
  user_id: string;
  assessment_type: 'skills' | 'strengths' | 'personality' | 'leadership' | 'technical';
  assessment_name: string;
  results: Record<string, any>;
  score?: number;
  completed_date: string;
  expires_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}