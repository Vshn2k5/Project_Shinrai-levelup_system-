import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useProdigyStore } from '../store';
import QuestCard from '../components/QuestCard';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { Domain, Quest } from '../types';
import { v4 as uuidv4 } from 'uuid';

const Quests: React.FC = () => {
  const { quests, addQuest } = useProdigyStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [domainFilter, setDomainFilter] = useState<Domain | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New quest form state
  const [newQuest, setNewQuest] = useState<Partial<Quest>>({
    title: '',
    description: '',
    domain: 'Physical',
    difficulty: 'Medium',
    xpReward: 50,
  });
  
  const handleAddQuest = () => {
    if (!newQuest.title || !newQuest.description) return;
    
    addQuest({
      id: uuidv4(),
      title: newQuest.title,
      description: newQuest.description,
      domain: newQuest.domain as Domain,
      difficulty: newQuest.difficulty as 'Easy' | 'Medium' | 'Hard' | 'Expert',
      xpReward: newQuest.xpReward || 50,
      completed: false,
    });
    
    setNewQuest({
      title: '',
      description: '',
      domain: 'Physical',
      difficulty: 'Medium',
      xpReward: 50,
    });
    
    setShowAddForm(false);
  };
  
  // Filter quests
  const filteredQuests = quests.filter(quest => {
    // Status filter
    if (filter === 'active' && quest.completed) return false;
    if (filter === 'completed' && !quest.completed) return false;
    
    // Domain filter
    if (domainFilter !== 'all' && quest.domain !== domainFilter) return false;
    
    // Search term
    if (searchTerm && !quest.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    return true;
  });
  
  return (
    <Layout currentPage="quests">
      <div className="mb-6">
        <h1 className="text-2xl font-['Orbitron'] font-bold mb-1">QUEST BOARD</h1>
        <p className="text-gray-400">Complete quests to gain XP and level up your skills.</p>
      </div>
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2 w-full md:w-auto">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search quests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-white w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
            <Filter className="w-4 h-4 text-gray-400 mr-2" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-transparent border-none focus:outline-none text-white"
            >
              <option value="all">All Quests</option>
              <option value="active">Active Only</option>
              <option value="completed">Completed Only</option>
            </select>
          </div>
          
          <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value as any)}
              className="bg-transparent border-none focus:outline-none text-white"
            >
              <option value="all">All Domains</option>
              <option value="Physical">Physical</option>
              <option value="Mental">Mental</option>
              <option value="Technical">Technical</option>
              <option value="Creative">Creative</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg px-3 py-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Quest
          </button>
        </div>
      </div>
      
      {/* Add Quest Form */}
      {showAddForm && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-indigo-900">
          <h2 className="text-xl font-semibold mb-4">Create New Quest</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Quest Title</label>
              <input
                type="text"
                value={newQuest.title}
                onChange={(e) => setNewQuest({...newQuest, title: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="Enter quest title"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Domain</label>
              <select
                value={newQuest.domain}
                onChange={(e) => setNewQuest({...newQuest, domain: e.target.value as Domain})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="Physical">Physical</option>
                <option value="Mental">Mental</option>
                <option value="Technical">Technical</option>
                <option value="Creative">Creative</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
              <select
                value={newQuest.difficulty}
                onChange={(e) => setNewQuest({...newQuest, difficulty: e.target.value as any})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">XP Reward</label>
              <input
                type="number"
                value={newQuest.xpReward}
                onChange={(e) => setNewQuest({...newQuest, xpReward: parseInt(e.target.value)})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                min="10"
                max="500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={newQuest.description}
                onChange={(e) => setNewQuest({...newQuest, description: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-24"
                placeholder="Describe the quest objectives and requirements"
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-700 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleAddQuest}
              className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded"
              disabled={!newQuest.title || !newQuest.description}
            >
              Create Quest
            </button>
          </div>
        </div>
      )}
      
      {/* Quests Grid */}
      {filteredQuests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuests.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No quests found matching your criteria.</p>
          <button
            onClick={() => {
              setFilter('all');
              setDomainFilter('all');
              setSearchTerm('');
            }}
            className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Reset Filters
          </button>
        </div>
      )}
    </Layout>
  );
};

export default Quests;