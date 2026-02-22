import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  tap?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  delay = 0,
  hover = true,
  tap = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={hover ? {
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={tap ? {
        scale: 0.98,
        transition: { duration: 0.1 }
      } : undefined}
      className={`anime-card ${className}`}
    >
      {children}
      
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, #4f46e5, #6366f1, #818cf8, #4f46e5)',
          backgroundSize: '300% 300%',
          filter: 'blur(2px)',
          zIndex: -1
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
        whileHover={{ opacity: 0.3 }}
      />
    </motion.div>
  );
};

export default AnimatedCard;