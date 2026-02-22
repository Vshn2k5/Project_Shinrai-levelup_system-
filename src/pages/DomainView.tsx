import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useProdigyStore } from '../store';
import SkillCard from '../components/SkillCard';
import QuestCard from '../components/QuestCard';
import { Domain } from '../types';
import { PlusCircle, Award, Zap, TrendingUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const DomainView: React.FC = () => {
  const { domain = 'physical' } = useParams<{ domain: string }>();
  
  // Convert domain to proper format
  const formattedDomain = domain.charAt(0).toUpperCase() + domain.slice(1).toLowerCase() as Domain;
  
  const { skills, quests, domainRanks, addSkill } = useProdigyStore();
  
  // Filter skills and quests by domain
  const domainSkills = skills.filter(skill => skill.domain === formattedDomain);
  const domainQuests = quests.filter(quest => quest.domain === formattedDomain && !quest.completed);
  
  // Get domain rank
  const rank = domainRanks[formattedDomain];
  
  // Calculate domain stats
  const totalXp = domainSkills.reduce((sum, skill) => sum + skill.xp, 0);
  const highestLevel = Math.max(...domainSkills.map(skill => skill.level), 0);
  
  // Domain-specific colors
  const domainColors = {
    Physical: {
      primary: 'bg-blue-900',
      secondary: 'text-blue-400',
      border: 'border-blue-700',
      light: 'bg-blue-800/50',
    },
    Mental: {
      primary: 'bg-purple-900',
      secondary: 'text-purple-400',
      border: 'border-purple-700',
      light: 'bg-purple-800/50',
    },
    Technical: {
      primary: 'bg-cyan-900',
      secondary: 'text-cyan-400',
      border: 'border-cyan-700',
      light: 'bg-cyan-800/50',
    },
    Creative: {
      primary: 'bg-pink-900',
      secondary: 'text-pink-400',
      border: 'border-pink-700',
      light: 'bg-pink-800/50',
    },
  };
  
  const colors = domainColors[formattedDomain];
  
  // Handle adding a new skill
  const handleAddSkill = () => {
    const skillName = prompt(`Enter name for new ${formattedDomain} skill:`);
    if (skillName) {
      addSkill({
        id: uuidv4(),
        name: skillName,
        domain: formattedDomain,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
      });
    }
  };
  
  return (
    <Layout currentPage={domain.toLowerCase()}>
      <div className="mb-6">
        <h1 className="text-2xl font-['Orbitron'] font-bold mb-1">{formattedDomain.toUpperCase()} DOMAIN</h1>
        <p className="text-gray-400">Master your {formattedDomain.toLowerCase()} abilities and track your progress.</p>
      </div>
      
      {/* Domain Overview */}
      <div className={`${colors.light} rounded-lg p-6 mb-8 ${colors.border} border`}>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className={`w-16 h-16 rounded-full ${colors.primary} flex items-center justify-center mr-4`}>
              <span className="text-2xl font-bold">{rank}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{formattedDomain} Mastery</h2>
              <p className={colors.secondary}>Rank {rank} Hunter</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Zap className={`w-4 h-4 ${colors.secondary} mr-1`} />
                <span className="text-sm text-gray-400">XP</span>
              </div>
              <div className="text-lg font-semibold">{totalXp}</div>
            </div>
            
            <div className="bg-gray-800 rounded p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Award className={`w-4 h-4 ${colors.secondary} mr-1`} />
                <span className="text-sm text-gray-400">Skills</span>
              </div>
              <div className="text-lg font-semibold">{domainSkills.length}</div>
            </div>
            
            <div className="bg-gray-800 rounded p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className={`w-4 h-4 ${colors.secondary} mr-1`} />
                <span className="text-sm text-gray-400">Top Lv</span>
              </div>
              <div className="text-lg font-semibold">{highestLevel}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Skills Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{formattedDomain} Skills</h2>
          <button
            onClick={handleAddSkill}
            className={`flex items-center ${colors.primary} hover:opacity-90 text-white rounded-lg px-3 py-2 transition-colors`}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Skill
          </button>
        </div>
        
        {domainSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400 mb-4">No skills added to this domain yet.</p>
            <button
              onClick={handleAddSkill}
              className={`${colors.primary} hover:opacity-90 text-white px-4 py-2 rounded`}
            >
              Add Your First Skill
            </button>
          </div>
        )}
      </div>
      
      {/* Active Quests */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active {formattedDomain} Quests</h2>
          <a href="/quests" className={colors.secondary + " text-sm hover:underline"}>View All Quests</a>
        </div>
        
        {domainQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400">No active quests for this domain.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DomainView;