import React from 'react';
import { Skill } from '../types';
import ProgressBar from './ProgressBar';
import { useProdigyStore } from '../store';

type SkillCardProps = {
  skill: Skill;
};

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const { addXp } = useProdigyStore();
  
  const handleAddXp = () => {
    // For demo purposes, add a small amount of XP when clicked
    addXp(skill.id, 10);
  };
  
  const domainColors = {
    Physical: 'border-blue-500 bg-blue-900/20',
    Mental: 'border-purple-500 bg-purple-900/20',
    Technical: 'border-cyan-500 bg-cyan-900/20',
    Creative: 'border-pink-500 bg-pink-900/20',
  };
  
  return (
    <div className={`border rounded-lg p-4 ${domainColors[skill.domain]}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{skill.name}</h3>
        <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
          Lv. {skill.level}
        </span>
      </div>
      
      <div className="mb-4">
        <ProgressBar 
          current={skill.xp} 
          max={skill.xpToNextLevel} 
          color={
            skill.domain === 'Physical' ? 'blue' : 
            skill.domain === 'Mental' ? 'purple' : 
            skill.domain === 'Technical' ? 'cyan' : 
            'pink'
          }
        />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">{skill.domain}</span>
        <button
          onClick={handleAddXp}
          className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded transition-colors"
        >
          +10 XP
        </button>
      </div>
    </div>
  );
};

export default SkillCard;