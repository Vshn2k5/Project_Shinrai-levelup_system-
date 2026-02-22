import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          className="relative mb-4"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="relative">
            <Sparkles className={`${sizeClasses[size]} text-indigo-400 mx-auto`} />
            
            {/* Orbiting particles */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-3 h-3 text-purple-400 absolute -top-1 left-1/2 transform -translate-x-1/2" />
            </motion.div>
            
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full absolute top-1/2 -right-1 transform -translate-y-1/2" />
            </motion.div>
          </div>
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-indigo-400/20 rounded-full blur-lg"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Loading text with typing effect */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300"
        >
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-sm font-medium"
          >
            {message}
          </motion.span>
          
          {/* Animated dots */}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            className="ml-1"
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.7 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.9 }}
          >
            .
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;