import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Github, 
  Chrome,
  Facebook,
  Twitter,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { authAPI } from '../lib/auth';
import { useProdigyStore } from '../store';

type AuthMode = 'signin' | 'signup' | 'reset' | 'guest';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthUser } = useProdigyStore();
  
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  useEffect(() => {
    // Check for auth callback or reset token
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const type = searchParams.get('type');
    
    if (error) {
      setMessage({ type: 'error', text: errorDescription || error });
    } else if (type === 'recovery') {
      setMode('reset');
      setMessage({ type: 'info', text: 'Please enter your new password below.' });
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = (): boolean => {
    if (mode === 'signup') {
      if (!formData.fullName.trim()) {
        setMessage({ type: 'error', text: 'Full name is required' });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match' });
        return false;
      }
    }
    
    if (mode !== 'reset' && !formData.email) {
      setMessage({ type: 'error', text: 'Email is required' });
      return false;
    }
    
    if ((mode === 'signin' || mode === 'signup') && formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      switch (mode) {
        case 'signin':
          const { data: signInData, error: signInError } = await authAPI.signIn(
            formData.email,
            formData.password
          );
          
          if (signInError) throw signInError;
          if (signInData.user) {
            setMessage({ type: 'success', text: 'Welcome back!' });
            navigate('/');
          }
          break;
          
        case 'signup':
          const { data: signUpData, error: signUpError } = await authAPI.signUp(
            formData.email,
            formData.password,
            { full_name: formData.fullName }
          );
          
          if (signUpError) throw signUpError;
          
          setMessage({ 
            type: 'success', 
            text: 'Account created! Please check your email to verify your account.' 
          });
          setMode('signin');
          break;
          
        case 'reset':
          if (searchParams.get('type') === 'recovery') {
            // Update password
            const { error: updateError } = await authAPI.updatePassword(formData.password);
            if (updateError) throw updateError;
            
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            navigate('/');
          } else {
            // Send reset email
            const { error: resetError } = await authAPI.resetPassword(formData.email);
            if (resetError) throw resetError;
            
            setMessage({ 
              type: 'success', 
              text: 'Password reset email sent! Check your inbox.' 
            });
          }
          break;
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'facebook' | 'twitter') => {
    setLoading(true);
    try {
      const { error } = await authAPI.signInWithOAuth(provider);
      if (error) throw error;
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'OAuth sign in failed' });
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    const guestSession = authAPI.createGuestSession();
    setAuthUser(guestSession.user);
    navigate('/');
  };

  const renderOAuthButtons = () => (
    <div className="space-y-3">
      <button
        onClick={() => handleOAuthSignIn('google')}
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors disabled:opacity-50"
      >
        <Chrome className="w-5 h-5 mr-3" />
        Continue with Google
      </button>
      
      <button
        onClick={() => handleOAuthSignIn('github')}
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors disabled:opacity-50"
      >
        <Github className="w-5 h-5 mr-3" />
        Continue with GitHub
      </button>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleOAuthSignIn('facebook')}
          disabled={loading}
          className="flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
        >
          <Facebook className="w-5 h-5 mr-2" />
          Facebook
        </button>
        
        <button
          onClick={() => handleOAuthSignIn('twitter')}
          disabled={loading}
          className="flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg bg-blue-400 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
        >
          <Twitter className="w-5 h-5 mr-2" />
          Twitter
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/20 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse mr-2" />
            <h1 className="text-3xl font-['Orbitron'] font-bold text-white">PRODIGY</h1>
          </div>
          <p className="text-gray-400">
            {mode === 'signin' && 'Welcome back, Hunter'}
            {mode === 'signup' && 'Begin your journey'}
            {mode === 'reset' && 'Reset your password'}
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'error' ? 'bg-red-900/50 border border-red-700 text-red-300' :
            message.type === 'success' ? 'bg-green-900/50 border border-green-700 text-green-300' :
            'bg-blue-900/50 border border-blue-700 text-blue-300'
          }`}>
            {message.type === 'error' && <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />}
            {message.type === 'success' && <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Auth Form */}
        <div className="bg-gray-800/50 backdrop-blur-md border border-indigo-900/50 rounded-lg p-6">
          {/* OAuth Buttons */}
          {mode !== 'reset' && (
            <>
              {renderOAuthButtons()}
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">or continue with email</span>
                </div>
              </div>
            </>
          )}

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            {mode !== 'reset' || !searchParams.get('type') ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            ) : null}

            {(mode === 'signin' || mode === 'signup' || (mode === 'reset' && searchParams.get('type'))) && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {mode === 'reset' ? 'New Password' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && (searchParams.get('type') ? 'Update Password' : 'Send Reset Email')}
            </button>
          </form>

          {/* Mode Switching */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'signin' && (
              <>
                <button
                  onClick={() => setMode('signup')}
                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  Don't have an account? Sign up
                </button>
                <br />
                <button
                  onClick={() => setMode('reset')}
                  className="text-gray-400 hover:text-gray-300 text-sm"
                >
                  Forgot your password?
                </button>
              </>
            )}
            
            {mode === 'signup' && (
              <button
                onClick={() => setMode('signin')}
                className="text-indigo-400 hover:text-indigo-300 text-sm"
              >
                Already have an account? Sign in
              </button>
            )}
            
            {mode === 'reset' && !searchParams.get('type') && (
              <button
                onClick={() => setMode('signin')}
                className="text-indigo-400 hover:text-indigo-300 text-sm"
              >
                Back to sign in
              </button>
            )}
          </div>

          {/* Guest Access */}
          {mode !== 'reset' && (
            <div className="mt-6 pt-6 border-t border-gray-600">
              <button
                onClick={handleGuestAccess}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Continue as Guest
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                Limited features available in guest mode
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;