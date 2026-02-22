import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useProdigyStore } from '../store';
import { securityAPI } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'guest' | 'user' | 'premium' | 'admin';
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'user',
  fallback 
}) => {
  const { authUser, isAuthenticated } = useProdigyStore();
  const location = useLocation();

  // If not authenticated and not a guest, redirect to auth
  if (!isAuthenticated && !authUser?.profile?.role) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check role permissions
  const userRole = authUser?.profile?.role || 'guest';
  const hasPermission = securityAPI.hasPermission(userRole, requiredRole);

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Redirect based on user role
    if (userRole === 'guest') {
      return <Navigate to="/auth" state={{ from: location }} replace />;
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/20 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-400 mb-6">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;