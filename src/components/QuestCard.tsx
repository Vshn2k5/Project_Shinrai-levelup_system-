import React from 'react';
import { CheckCircle, Clock, Award } from 'lucide-react';
import { Quest } from '../types';
import { useProdigyStore } from '../store';

type QuestCardProps = {
  quest: Quest;
};

const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const { completeQuest } = useProdigyStore();
  
  const handleComplete = () => {
    completeQuest(quest.id);
  };
  
  const difficultyColors = {
    Easy: 'bg-green-900 text-green-300',
    Medium: 'bg-blue-900 text-blue-300',
    Hard: 'bg-purple-900 text-purple-300',
    Expert: 'bg-red-900 text-red-300',
  };
  
  const domainColors = {
    Physical: 'border-l-blue-500',
    Mental: 'border-l-purple-500',
    Technical: 'border-l-cyan-500',
    Creative: 'border-l-pink-500',
  };
  
  return (
    <div className={`bg-gray-800 rounded-lg p-4 shadow-lg border-l-4 ${domainColors[quest.domain]}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{quest.title}</h3>
        <span className={`text-xs px-2 py-1 rounded ${difficultyColors[quest.difficulty]}`}>
          {quest.difficulty}
        </span>
      </div>
      
      <p className="text-gray-400 text-sm mb-4">{quest.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Award className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-sm text-yellow-400">{quest.xpReward} XP</span>
        </div>
        
        {quest.deadline && (
          <div className="flex items-center text-gray-400 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            <span>{new Date(quest.deadline).toLocaleDateString()}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-end">
        {quest.completed ? (
          <div className="flex items-center text-green-400">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-sm">Completed</span>
          </div>
        ) : (
          <button
            onClick={handleComplete}
            className="bg-indigo-700 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestCard;