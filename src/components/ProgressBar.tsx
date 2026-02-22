import React from 'react';

type ProgressBarProps = {
  current: number;
  max: number;
  color?: string;
  height?: number;
  showText?: boolean;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  max, 
  color = 'indigo', 
  height = 6,
  showText = true
}) => {
  const percentage = Math.min(Math.round((current / max) * 100), 100);
  
  const colorClasses = {
    indigo: 'bg-indigo-600',
    purple: 'bg-purple-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
    pink: 'bg-pink-600',
    cyan: 'bg-cyan-600',
  };
  
  const bgColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.indigo;
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        {showText && (
          <>
            <span className="text-xs text-gray-400">{current} / {max}</span>
            <span className="text-xs font-medium text-gray-400">{percentage}%</span>
          </>
        )}
      </div>
      <div className={`w-full bg-gray-700 rounded-full`} style={{ height: `${height}px` }}>
        <div 
          className={`${bgColor} rounded-full transition-all duration-300 ease-out`} 
          style={{ width: `${percentage}%`, height: `${height}px` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;