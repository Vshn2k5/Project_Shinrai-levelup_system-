/*
  # Professional Development System Schema

  1. New Tables
    - `professional_assessments` - Skills and personality assessments
    - `career_goals` - Career objectives and targets
    - `skill_requirements` - Required skills for goals
    - `development_actions` - Concrete action steps
    - `progress_metrics` - Progress tracking metrics
    - `learning_resources` - Educational resources
    - `mentorship_connections` - Mentor relationships
    - `certifications` - Professional certifications
    - `industry_events` - Conferences and networking events
    - `skill_projects` - Hands-on skill building projects

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Professional Assessments Table
CREATE TABLE professional_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type text NOT NULL,
  assessment_name text NOT NULL,
  results jsonb NOT NULL,
  score numeric,
  completed_date timestamptz DEFAULT now(),
  expires_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_assessment_type CHECK (assessment_type IN ('skills', 'strengths', 'personality', 'leadership', 'technical'))
);

-- Career Goals Table
CREATE TABLE career_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'skill_development',
  priority text NOT NULL DEFAULT 'medium',
  timeline text NOT NULL DEFAULT '6_months',
  target_date date,
  current_status text NOT NULL DEFAULT 'not_started',
  progress_percentage integer DEFAULT 0,
  success_metrics text[],
  obstacles text[],
  resources_needed text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_category CHECK (category IN ('promotion', 'skill_development', 'industry_change', 'leadership', 'entrepreneurship', 'education')),
  CONSTRAINT valid_priority CHECK (priority IN ('high', 'medium', 'low')),
  CONSTRAINT valid_timeline CHECK (timeline IN ('3_months', '6_months', '1_year', '2_years', '5_years')),
  CONSTRAINT valid_status CHECK (current_status IN ('not_started', 'in_progress', 'completed', 'on_hold', 'cancelled')),
  CONSTRAINT valid_progress CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
);

-- Skill Requirements Table
CREATE TABLE skill_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id uuid REFERENCES career_goals(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  skill_category text NOT NULL DEFAULT 'technical',
  current_level integer NOT NULL DEFAULT 1,
  target_level integer NOT NULL DEFAULT 5,
  importance text NOT NULL DEFAULT 'important',
  learning_priority integer DEFAULT 1,
  estimated_time_hours integer,
  deadline date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_skill_category CHECK (skill_category IN ('technical', 'soft', 'leadership', 'industry_specific', 'language', 'certification')),
  CONSTRAINT valid_current_level CHECK (current_level >= 1 AND current_level <= 10),
  CONSTRAINT valid_target_level CHECK (target_level >= 1 AND target_level <= 10),
  CONSTRAINT valid_importance CHECK (importance IN ('critical', 'important', 'nice_to_have'))
);

-- Development Actions Table
CREATE TABLE development_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id uuid REFERENCES career_goals(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skill_requirements(id) ON DELETE SET NULL,
  action_type text NOT NULL DEFAULT 'training',
  title text NOT NULL,
  description text,
  specific_steps text[],
  estimated_duration text,
  cost_estimate numeric,
  deadline date,
  status text NOT NULL DEFAULT 'planned',
  completion_date timestamptz,
  outcome_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_action_type CHECK (action_type IN ('training', 'certification', 'project', 'networking', 'mentorship', 'reading', 'practice', 'conference')),
  CONSTRAINT valid_action_status CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled'))
);

-- Progress Metrics Table
CREATE TABLE progress_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id uuid REFERENCES career_goals(id) ON DELETE CASCADE,
  metric_name text NOT NULL,
  metric_type text NOT NULL DEFAULT 'quantitative',
  target_value text NOT NULL,
  current_value text,
  measurement_frequency text NOT NULL DEFAULT 'monthly',
  last_measured timestamptz,
  measurement_history jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_metric_type CHECK (metric_type IN ('quantitative', 'qualitative', 'milestone', 'feedback')),
  CONSTRAINT valid_frequency CHECK (measurement_frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'annually'))
);

-- Learning Resources Table
CREATE TABLE learning_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skill_requirements(id) ON DELETE CASCADE,
  resource_type text NOT NULL DEFAULT 'course',
  title text NOT NULL,
  provider text,
  url text,
  cost numeric DEFAULT 0,
  estimated_time_hours integer,
  difficulty_level text DEFAULT 'intermediate',
  rating integer,
  status text NOT NULL DEFAULT 'recommended',
  completion_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_resource_type CHECK (resource_type IN ('course', 'book', 'article', 'video', 'podcast', 'tool', 'platform', 'mentor')),
  CONSTRAINT valid_difficulty CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT valid_resource_status CHECK (status IN ('recommended', 'in_progress', 'completed', 'not_relevant'))
);

-- Mentorship Connections Table
CREATE TABLE mentorship_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_name text NOT NULL,
  mentor_title text,
  mentor_company text,
  mentor_contact text,
  relationship_type text NOT NULL DEFAULT 'informal_mentor',
  focus_areas text[],
  meeting_frequency text,
  last_contact timestamptz,
  status text NOT NULL DEFAULT 'potential',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_relationship_type CHECK (relationship_type IN ('formal_mentor', 'informal_mentor', 'peer_mentor', 'reverse_mentor', 'sponsor')),
  CONSTRAINT valid_mentor_status CHECK (status IN ('active', 'inactive', 'potential', 'ended'))
);

-- Certifications Table
CREATE TABLE certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skill_requirements(id) ON DELETE SET NULL,
  certification_name text NOT NULL,
  issuing_organization text NOT NULL,
  certification_type text NOT NULL DEFAULT 'professional',
  status text NOT NULL DEFAULT 'planned',
  study_start_date date,
  exam_date date,
  completion_date date,
  expiration_date date,
  cost numeric,
  study_hours_estimated integer,
  study_hours_actual integer,
  score text,
  certificate_url text,
  renewal_required boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_cert_type CHECK (certification_type IN ('technical', 'professional', 'industry', 'vendor', 'academic')),
  CONSTRAINT valid_cert_status CHECK (status IN ('planned', 'studying', 'scheduled', 'completed', 'expired', 'cancelled'))
);

-- Industry Events Table
CREATE TABLE industry_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name text NOT NULL,
  event_type text NOT NULL DEFAULT 'conference',
  organizer text,
  event_date date,
  location text,
  virtual boolean DEFAULT false,
  cost numeric DEFAULT 0,
  registration_deadline date,
  status text NOT NULL DEFAULT 'interested',
  networking_goals text[],
  key_takeaways text,
  connections_made text[],
  follow_up_actions text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_event_type CHECK (event_type IN ('conference', 'workshop', 'webinar', 'networking', 'meetup', 'trade_show')),
  CONSTRAINT valid_event_status CHECK (status IN ('interested', 'registered', 'attended', 'cancelled', 'missed'))
);

-- Skill Projects Table
CREATE TABLE skill_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skill_requirements(id) ON DELETE CASCADE,
  project_name text NOT NULL,
  project_type text NOT NULL DEFAULT 'personal',
  description text,
  objectives text[],
  technologies_used text[],
  start_date date,
  target_completion_date date,
  actual_completion_date date,
  status text NOT NULL DEFAULT 'planning',
  progress_percentage integer DEFAULT 0,
  repository_url text,
  demo_url text,
  lessons_learned text,
  skills_gained text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_project_type CHECK (project_type IN ('personal', 'work', 'volunteer', 'open_source', 'freelance', 'academic')),
  CONSTRAINT valid_project_status CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold', 'cancelled')),
  CONSTRAINT valid_project_progress CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
);

-- Enable Row Level Security
ALTER TABLE professional_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_projects ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can manage their own professional assessments"
  ON professional_assessments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own career goals"
  ON career_goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own skill requirements"
  ON skill_requirements
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own development actions"
  ON development_actions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress metrics"
  ON progress_metrics
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own learning resources"
  ON learning_resources
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own mentorship connections"
  ON mentorship_connections
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own certifications"
  ON certifications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own industry events"
  ON industry_events
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own skill projects"
  ON skill_projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_professional_assessments_user_id ON professional_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_career_goals_user_id ON career_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_career_goals_timeline ON career_goals(timeline);
CREATE INDEX IF NOT EXISTS idx_skill_requirements_user_id ON skill_requirements(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_requirements_goal_id ON skill_requirements(goal_id);
CREATE INDEX IF NOT EXISTS idx_development_actions_user_id ON development_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_development_actions_goal_id ON development_actions(goal_id);
CREATE INDEX IF NOT EXISTS idx_progress_metrics_user_id ON progress_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_resources_user_id ON learning_resources(user_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_connections_user_id ON mentorship_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_certifications_user_id ON certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_industry_events_user_id ON industry_events(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_projects_user_id ON skill_projects(user_id);