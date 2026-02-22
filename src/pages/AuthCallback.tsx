import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';
import { authAPI } from '../lib/auth';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session after OAuth callback
        const { data, error } = await authAPI.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/auth?error=' + encodeURIComponent(error.message));
          return;
        }

        if (data.session) {
          // Successfully authenticated, redirect to dashboard
          navigate('/');
        } else {
          // No session found, redirect to auth page
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth?error=' + encodeURIComponent('Authentication failed'));
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/20 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse mr-2" />
          <h1 className="text-3xl font-['Orbitron'] font-bold text-white">PRODIGY</h1>
        </div>
        
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
        
        <p className="text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;