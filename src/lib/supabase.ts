import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Professional Development API
export const professionalDevAPI = {
  // Career Goals
  async getCareerGoals(userId: string) {
    const { data, error } = await supabase
      .from('career_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createCareerGoal(goal: any) {
    const { data, error } = await supabase
      .from('career_goals')
      .insert(goal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCareerGoal(id: string, updates: any) {
    const { data, error } = await supabase
      .from('career_goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Skill Requirements
  async getSkillRequirements(userId: string, goalId?: string) {
    let query = supabase
      .from('skill_requirements')
      .select('*')
      .eq('user_id', userId);

    if (goalId) {
      query = query.eq('goal_id', goalId);
    }

    const { data, error } = await query.order('learning_priority', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createSkillRequirement(skill: any) {
    const { data, error } = await supabase
      .from('skill_requirements')
      .insert(skill)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSkillRequirement(id: string, updates: any) {
    const { data, error } = await supabase
      .from('skill_requirements')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Development Actions
  async getDevelopmentActions(userId: string, goalId?: string) {
    let query = supabase
      .from('development_actions')
      .select('*')
      .eq('user_id', userId);

    if (goalId) {
      query = query.eq('goal_id', goalId);
    }

    const { data, error } = await query.order('deadline', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createDevelopmentAction(action: any) {
    const { data, error } = await supabase
      .from('development_actions')
      .insert(action)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDevelopmentAction(id: string, updates: any) {
    const { data, error } = await supabase
      .from('development_actions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Learning Resources
  async getLearningResources(userId: string, skillId?: string) {
    let query = supabase
      .from('learning_resources')
      .select('*')
      .eq('user_id', userId);

    if (skillId) {
      query = query.eq('skill_id', skillId);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createLearningResource(resource: any) {
    const { data, error } = await supabase
      .from('learning_resources')
      .insert(resource)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Certifications
  async getCertifications(userId: string) {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('user_id', userId)
      .order('exam_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createCertification(certification: any) {
    const { data, error } = await supabase
      .from('certifications')
      .insert(certification)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mentorship
  async getMentorshipConnections(userId: string) {
    const { data, error } = await supabase
      .from('mentorship_connections')
      .select('*')
      .eq('user_id', userId)
      .order('last_contact', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createMentorshipConnection(connection: any) {
    const { data, error } = await supabase
      .from('mentorship_connections')
      .insert(connection)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Industry Events
  async getIndustryEvents(userId: string) {
    const { data, error } = await supabase
      .from('industry_events')
      .select('*')
      .eq('user_id', userId)
      .order('event_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Skill Projects
  async getSkillProjects(userId: string, skillId?: string) {
    let query = supabase
      .from('skill_projects')
      .select('*')
      .eq('user_id', userId);

    if (skillId) {
      query = query.eq('skill_id', skillId);
    }

    const { data, error } = await query.order('target_completion_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Progress Metrics
  async getProgressMetrics(userId: string, goalId?: string) {
    let query = supabase
      .from('progress_metrics')
      .select('*')
      .eq('user_id', userId);

    if (goalId) {
      query = query.eq('goal_id', goalId);
    }

    const { data, error } = await query.order('last_measured', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateProgressMetric(id: string, currentValue: string, notes?: string) {
    const now = new Date().toISOString();

    // Get current metric to update history
    const { data: metric } = await supabase
      .from('progress_metrics')
      .select('measurement_history')
      .eq('id', id)
      .single();

    const history = metric?.measurement_history || [];
    const newEntry = {
      date: now,
      value: currentValue,
      notes: notes || ''
    };

    const { data, error } = await supabase
      .from('progress_metrics')
      .update({
        current_value: currentValue,
        last_measured: now,
        measurement_history: [...history, newEntry],
        updated_at: now
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};