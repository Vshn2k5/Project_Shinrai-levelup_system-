import React from 'react';
import { Domain } from '../types';

type RadialProgressChartProps = {
  domain: Domain;
  progress: number; // 0-100
  level: number;
  xp: number;
  size?: number;
  strokeWidth?: number;
};

const RadialProgressChart: React.FC<RadialProgressChartProps> = ({
  domain,
  progress,
  level,
  xp,
  size = 120,
  strokeWidth = 8
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const domainColors = {
    Physical: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      glow: 'rgba(59, 130, 246, 0.4)'
    },
    Mental: {
      primary: '#8B5CF6',
      secondary: '#6D28D9',
      glow: 'rgba(139, 92, 246, 0.4)'
    },
    Technical: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      glow: 'rgba(6, 182, 212, 0.4)'
    },
    Creative: {
      primary: '#EC4899',
      secondary: '#BE185D',
      glow: 'rgba(236, 72, 153, 0.4)'
    }
  };

  const colors = domainColors[domain];

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{
          filter: `drop-shadow(0 0 10px ${colors.glow})`
        }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(75, 85, 99, 0.3)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gradient-${domain})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id={`gradient-${domain}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-lg font-bold text-white">Lv.{level}</div>
        <div className="text-xs text-gray-400">{xp.toLocaleString()} XP</div>
        <div className="text-xs font-medium" style={{ color: colors.primary }}>
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};

export default RadialProgressChart;