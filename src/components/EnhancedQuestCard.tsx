import React, { useState } from 'react';
import { CheckCircle, Clock, Award, Coins, AlertTriangle, Flame } from 'lucide-react';
import { Quest } from '../types';
import { useProdigyStore } from '../store';
import QuestTimer from './QuestTimer';
import CoinAnimation from './CoinAnimation';

type EnhancedQuestCardProps = {
  quest: Quest;
};

const EnhancedQuestCard: React.FC<EnhancedQuestCardProps> = ({ quest }) => {
  const { completeQuest, failQuest } = useProdigyStore();
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [completedCriteria, setCompletedCriteria] = useState<boolean[]>(
    new Array(quest.completionCriteria.length).fill(false)
  );
  
  const handleCriteriaToggle = (index: number) => {
    const newCompleted = [...completedCriteria];
    newCompleted[index] = !newCompleted[index];
    setCompletedCriteria(newCompleted);
    
    // Check if all criteria are completed
    if (newCompleted.every(completed => completed)) {
      handleComplete();
    }
  };
  
  const handleComplete = () => {
    setShowCoinAnimation(true);
    completeQuest(quest.id);
    
    // Play completion sound (if available)
    try {
      const audio = new Audio('/sounds/quest-complete.mp3');
      audio.play().catch(() => {}); // Ignore if sound file doesn't exist
    } catch (e) {}
  };

  const handleExpire = () => {
    failQuest(quest.id);
  };
  
  const difficultyColors = {
    Easy: 'bg-green-900 text-green-300 border-green-500',
    Medium: 'bg-yellow-900 text-yellow-300 border-yellow-500',
    Hard: 'bg-red-900 text-red-300 border-red-500',
  };
  
  const domainColors = {
    Physical: 'border-l-blue-500',
    Mental: 'border-l-purple-500',
    Technical: 'border-l-cyan-500',
    Creative: 'border-l-pink-500',
  };

  const typeIcons = {
    daily: <Clock className="w-4 h-4" />,
    weekly: <Award className="w-4 h-4" />,
    monthly: <Flame className="w-4 h-4" />,
    chain: <Award className="w-4 h-4" />
  };

  const allCriteriaCompleted = completedCriteria.every(completed => completed);
  const isExpired = quest.status === 'expired' || quest.status === 'failed';
  
  return (
    <>
      <div className={`bg-gray-800 rounded-lg p-4 shadow-lg border-l-4 ${domainColors[quest.domain]} 
        ${isExpired ? 'opacity-60' : ''} transition-all duration-300 hover:transform hover:scale-105`}>
        
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            {typeIcons[quest.type]}
            <h3 className="font-semibold text-lg ml-2">{quest.title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded border ${difficultyColors[quest.difficulty]}`}>
              {quest.difficulty}
            </span>
            {quest.chainId && (
              <span className="text-xs px-2 py-1 rounded bg-purple-900 text-purple-300 border border-purple-500">
                Chain {quest.chainPosition}
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-4">{quest.description}</p>
        
        {/* Completion Criteria */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Completion Criteria:</h4>
          <div className="space-y-2">
            {quest.completionCriteria.map((criteria, index) => (
              <div key={index} className="flex items-center">
                <button
                  onClick={() => handleCriteriaToggle(index)}
                  disabled={quest.completed || isExpired}
                  className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                    completedCriteria[index]
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'border-gray-500 hover:border-green-500'
                  } ${quest.completed || isExpired ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {completedCriteria[index] && <CheckCircle className="w-3 h-3" />}
                </button>
                <span className={`text-sm ${
                  completedCriteria[index] ? 'text-green-400 line-through' : 'text-gray-300'
                }`}>
                  {criteria}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Rewards and Timer */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Award className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm text-yellow-400">{quest.xpReward} XP</span>
            </div>
            <div className="flex items-center">
              <Coins className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm text-yellow-500">{quest.coinReward} coins</span>
            </div>
          </div>
          
          {quest.deadline && !quest.completed && !isExpired && (
            <QuestTimer deadline={quest.deadline} onExpire={handleExpire} />
          )}
        </div>
        
        {/* Status and Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {quest.completed && (
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Completed</span>
              </div>
            )}
            {isExpired && (
              <div className="flex items-center text-red-400">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {quest.status === 'expired' ? 'Expired' : 'Failed'}
                </span>
              </div>
            )}
          </div>
          
          {!quest.completed && !isExpired && (
            <button
              onClick={handleComplete}
              disabled={!allCriteriaCompleted}
              className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 ${
                allCriteriaCompleted
                  ? 'bg-indigo-700 hover:bg-indigo-600 text-white transform hover:scale-105'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Complete Quest
            </button>
          )}
        </div>
        
        {/* Chain Progress */}
        {quest.chainId && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-xs text-purple-400">
              Quest Chain Progress: {quest.chainPosition} / {/* This would need chain data */}
            </div>
          </div>
        )}
      </div>
      
      {showCoinAnimation && (
        <CoinAnimation
          amount={quest.coinReward}
          onComplete={() => setShowCoinAnimation(false)}
        />
      )}
    </>
  );
};

export default EnhancedQuestCard;