import React from 'react';
import { Trophy, Lock } from 'lucide-react';
import { Achievement } from '../types';

type AchievementCardProps = {
  achievement: Achievement;
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const isUnlocked = achievement.dateUnlocked !== null;
  
  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${isUnlocked ? 'border border-yellow-600' : 'opacity-75'}`}>
      <div className="flex items-start">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
          isUnlocked ? 'bg-yellow-600' : 'bg-gray-700'
        }`}>
          {isUnlocked ? (
            <Trophy className="w-5 h-5 text-yellow-200" />
          ) : (
            <Lock className="w-5 h-5 text-gray-400" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold ${isUnlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
            {achievement.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
          
          {isUnlocked ? (
            <div className="text-xs text-gray-500 mt-2">
              Unlocked on {new Date(achievement.dateUnlocked!).toLocaleDateString()}
            </div>
          ) : (
            <div className="text-xs text-gray-500 mt-2">
              <span className="font-medium">Requirement:</span> {achievement.requirements}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;