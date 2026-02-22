import React from 'react';
import { ProgressRings as ProgressRingsType } from '../types';

type ProgressRingsProps = {
  rings: ProgressRingsType;
  size?: number;
};

const ProgressRings: React.FC<ProgressRingsProps> = ({ rings, size = 200 }) => {
  const center = size / 2;
  const strokeWidth = 12;
  
  // Ring radii (from outer to inner)
  const monthlyRadius = center - strokeWidth;
  const weeklyRadius = center - strokeWidth * 3;
  const dailyRadius = center - strokeWidth * 5;

  const createRing = (radius: number, progress: number, color: string, label: string) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <g key={label}>
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(75, 85, 99, 0.3)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`
          }}
        />
      </g>
    );
  };

  const dailyProgress = (rings.daily.current / rings.daily.target) * 100;
  const weeklyProgress = (rings.weekly.current / rings.weekly.target) * 100;
  const monthlyProgress = (rings.monthly.current / rings.monthly.target) * 100;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {createRing(monthlyRadius, monthlyProgress, '#EC4899', 'Monthly')}
        {createRing(weeklyRadius, weeklyProgress, '#8B5CF6', 'Weekly')}
        {createRing(dailyRadius, dailyProgress, '#06B6D4', 'Daily')}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-white mb-1">Progress</div>
        <div className="text-xs text-center space-y-1">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
            <span className="text-cyan-400">Daily: {rings.daily.current}/{rings.daily.target}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
            <span className="text-purple-400">Weekly: {rings.weekly.current}/{rings.weekly.target}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-pink-400 rounded-full mr-2"></div>
            <span className="text-pink-400">Monthly: {rings.monthly.current}/{rings.monthly.target}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressRings;