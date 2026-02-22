import { supabase } from './supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthUser extends User {
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  role: 'guest' | 'user' | 'premium' | 'admin';
  is_verified: boolean;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  user_id: string;
  platform: string;
  username?: string;
  url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
}

// Authentication functions
export const authAPI = {
  // Sign up with email and password
  async signUp(email: string, password: string, metadata?: Record<string, any>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign in with OAuth provider
  async signInWithOAuth(provider: 'google' | 'github' | 'facebook' | 'twitter') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Reset password
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    return { data, error };
  },

  // Update password
  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password
    });
    return { data, error };
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  // Get current user
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  // Enable 2FA
  async enable2FA() {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp'
    });
    return { data, error };
  },

  // Verify 2FA
  async verify2FA(factorId: string, challengeId: string, code: string) {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code
    });
    return { data, error };
  },

  // Create guest session
  createGuestSession() {
    return {
      user: {
        id: 'guest',
        email: 'guest@example.com',
        profile: {
          id: 'guest',
          user_id: 'guest',
          full_name: 'Guest User',
          role: 'guest' as const,
          is_verified: false,
          preferences: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      } as AuthUser,
      session: null,
      isGuest: true
    };
  }
};

// Profile management functions
export const profileAPI = {
  // Get user profile
  async getProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    return { data, error };
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    return { data, error };
  },

  // Upload avatar
  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      return { data: null, error: uploadError };
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    const { data: profile, error: updateError } = await profileAPI.updateProfile(userId, {
      avatar_url: data.publicUrl
    });

    return { data: profile, error: updateError };
  },

  // Get social links
  async getSocialLinks(userId: string): Promise<{ data: SocialLink[] | null; error: any }> {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    return { data, error };
  },

  // Add or update social link
  async upsertSocialLink(userId: string, platform: string, username?: string, url?: string) {
    const { data, error } = await supabase
      .from('social_links')
      .upsert({
        user_id: userId,
        platform,
        username,
        url
      })
      .select()
      .single();
    
    return { data, error };
  },

  // Delete social link
  async deleteSocialLink(userId: string, platform: string) {
    const { error } = await supabase
      .from('social_links')
      .delete()
      .eq('user_id', userId)
      .eq('platform', platform);
    
    return { error };
  }
};

// Security functions
export const securityAPI = {
  // Get active sessions
  async getActiveSessions(userId: string) {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('last_activity', { ascending: false });
    
    return { data, error };
  },

  // Revoke session
  async revokeSession(sessionId: string) {
    const { error } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);
    
    return { error };
  },

  // Check if user has permission
  hasPermission(userRole: string, requiredRole: string): boolean {
    const roleHierarchy = ['guest', 'user', 'premium', 'admin'];
    const userLevel = roleHierarchy.indexOf(userRole);
    const requiredLevel = roleHierarchy.indexOf(requiredRole);
    
    return userLevel >= requiredLevel;
  }
};

// Auth state listener
export const setupAuthListener = (callback: (authState: AuthState) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    let authState: AuthState = {
      user: null,
      session,
      loading: false,
      isGuest: false
    };

    if (session?.user) {
      // Get user profile
      const { data: profile } = await profileAPI.getProfile(session.user.id);
      
      authState.user = {
        ...session.user,
        profile: profile || undefined
      };
    }

    callback(authState);
  });
};