import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
    scale: 0.98,
    filter: 'blur(4px)'
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)'
  },
  out: {
    opacity: 0,
    x: -20,
    scale: 0.98,
    filter: 'blur(4px)'
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;