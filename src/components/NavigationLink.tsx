import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  badge?: string | number;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({
  to,
  children,
  className = '',
  activeClassName = '',
  onClick,
  icon,
  badge
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === to || 
    (to !== '/' && location.pathname.startsWith(to));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate(to);
  };

  return (
    <motion.a
      href={to}
      onClick={handleClick}
      className={`relative block ${className} ${isActive ? activeClassName : ''}`}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex items-center relative">
        {icon && (
          <motion.div
            className="mr-3"
            animate={isActive ? { 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        )}
        
        <span className="flex-1">{children}</span>
        
        {badge && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto bg-gray-700/50 px-2 py-0.5 rounded text-xs power-level"
          >
            {badge}
          </motion.span>
        )}
      </div>
      
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-r-full"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.a>
  );
};

export default NavigationLink;