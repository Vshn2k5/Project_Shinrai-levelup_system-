import React from 'react';
import { Flame, Shield, Trophy } from 'lucide-react';
import { StreakData } from '../types';

type StreakCounterProps = {
  streak: StreakData;
  className?: string;
};

const StreakCounter: React.FC<StreakCounterProps> = ({ streak, className = '' }) => {
  const getNextMilestone = () => {
    return streak.milestones.find(m => !m.claimed && m.days > streak.current);
  };

  const nextMilestone = getNextMilestone();
  const daysToNext = nextMilestone ? nextMilestone.days - streak.current : 0;

  const getStreakColor = () => {
    if (streak.current >= 100) return 'text-purple-400';
    if (streak.current >= 30) return 'text-yellow-400';
    if (streak.current >= 7) return 'text-orange-400';
    return 'text-red-400';
  };

  const getFlameIntensity = () => {
    if (streak.current >= 100) return 'animate-pulse drop-shadow-lg';
    if (streak.current >= 30) return 'animate-pulse';
    if (streak.current >= 7) return '';
    return 'opacity-75';
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-4 border border-indigo-900/30 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Flame className={`w-6 h-6 mr-2 ${getStreakColor()} ${getFlameIntensity()}`} />
          <div>
            <div className="text-lg font-bold text-white">{streak.current} Days</div>
            <div className="text-xs text-gray-400">Current Streak</div>
          </div>
        </div>
        
        {streak.freezeActive && (
          <div className="flex items-center text-blue-400">
            <Shield className="w-4 h-4 mr-1" />
            <span className="text-xs">Protected</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Longest Streak:</span>
          <span className="text-yellow-400 font-medium">{streak.longest} days</span>
        </div>
        
        {nextMilestone && (
          <div className="bg-gray-700/50 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Next Milestone:</span>
              <Trophy className="w-3 h-3 text-yellow-400" />
            </div>
            <div className="text-sm font-medium text-white">
              {daysToNext} days to {nextMilestone.reward.coins} coins
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1 mt-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(streak.current / nextMilestone.days) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakCounter;