import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
  Target, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Users, 
  Calendar,
  Plus,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Lightbulb,
  Briefcase
} from 'lucide-react';
import { professionalDevAPI } from '../lib/supabase';
import type { CareerGoal, SkillRequirement, DevelopmentAction, ProgressMetric } from '../types/professional';

const ProfessionalDevelopment: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [careerGoals, setCareerGoals] = useState<CareerGoal[]>([]);
  const [skillRequirements, setSkillRequirements] = useState<SkillRequirement[]>([]);
  const [developmentActions, setDevelopmentActions] = useState<DevelopmentAction[]>([]);
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);

  // Mock user ID - in real app, get from auth
  const userId = 'mock-user-id';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // In a real app, these would be actual API calls
      // For now, we'll use mock data
      setCareerGoals([
        {
          id: '1',
          user_id: userId,
          title: 'Senior Software Engineer Promotion',
          description: 'Advance to senior level with leadership responsibilities',
          category: 'promotion',
          priority: 'high',
          timeline: '1_year',
          target_date: '2025-12-31',
          current_status: 'in_progress',
          progress_percentage: 35,
          success_metrics: ['Technical leadership on 2+ projects', 'Mentor 2 junior developers', 'Complete system architecture certification'],
          obstacles: ['Limited mentoring experience', 'Need deeper system design knowledge'],
          resources_needed: ['System design course', 'Mentorship training', 'Leadership books'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

      setSkillRequirements([
        {
          id: '1',
          user_id: userId,
          goal_id: '1',
          skill_name: 'System Architecture',
          skill_category: 'technical',
          current_level: 4,
          target_level: 8,
          importance: 'critical',
          learning_priority: 1,
          estimated_time_hours: 120,
          deadline: '2025-06-30',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: userId,
          goal_id: '1',
          skill_name: 'Team Leadership',
          skill_category: 'leadership',
          current_level: 3,
          target_level: 7,
          importance: 'critical',
          learning_priority: 2,
          estimated_time_hours: 80,
          deadline: '2025-08-31',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

      setDevelopmentActions([
        {
          id: '1',
          user_id: userId,
          goal_id: '1',
          skill_id: '1',
          action_type: 'certification',
          title: 'AWS Solutions Architect Certification',
          description: 'Complete AWS SA certification to strengthen system design skills',
          specific_steps: ['Study AWS services', 'Take practice exams', 'Schedule certification exam'],
          estimated_duration: '3 months',
          cost_estimate: 300,
          deadline: '2025-04-30',
          status: 'in_progress',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

    } catch (error) {
      console.error('Error loading professional development data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'goals', label: 'Career Goals', icon: <Target className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills Gap', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'actions', label: 'Action Plan', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'resources', label: 'Resources', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-indigo-900/30">
          <div className="flex items-center mb-2">
            <Target className="w-5 h-5 text-indigo-400 mr-2" />
            <h3 className="font-semibold">Active Goals</h3>
          </div>
          <div className="text-2xl font-bold text-indigo-400">{careerGoals.filter(g => g.current_status === 'in_progress').length}</div>
          <div className="text-sm text-gray-400">In Progress</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-purple-900/30">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400 mr-2" />
            <h3 className="font-semibold">Skills to Develop</h3>
          </div>
          <div className="text-2xl font-bold text-purple-400">{skillRequirements.length}</div>
          <div className="text-sm text-gray-400">Identified Gaps</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-green-900/30">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <h3 className="font-semibold">Action Items</h3>
          </div>
          <div className="text-2xl font-bold text-green-400">{developmentActions.filter(a => a.status === 'planned' || a.status === 'in_progress').length}</div>
          <div className="text-sm text-gray-400">Pending</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-yellow-900/30">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-yellow-400 mr-2" />
            <h3 className="font-semibold">Avg Progress</h3>
          </div>
          <div className="text-2xl font-bold text-yellow-400">
            {Math.round(careerGoals.reduce((sum, goal) => sum + goal.progress_percentage, 0) / careerGoals.length || 0)}%
          </div>
          <div className="text-sm text-gray-400">Completion</div>
        </div>
      </div>

      {/* Current Focus Areas */}
      <div className="bg-gray-800 rounded-lg p-6 border border-indigo-900/30">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 text-indigo-400 mr-2" />
          Current Focus Areas
        </h3>
        <div className="space-y-4">
          {careerGoals.filter(g => g.current_status === 'in_progress').map(goal => (
            <div key={goal.id} className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{goal.title}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  goal.priority === 'high' ? 'bg-red-900 text-red-300' :
                  goal.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-green-900 text-green-300'
                }`}>
                  {goal.priority} priority
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{goal.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{goal.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress_percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  Target: {new Date(goal.target_date || '').toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-indigo-900/30">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Briefcase className="w-5 h-5 text-indigo-400 mr-2" />
          Recommended Next Steps
        </h3>
        <div className="space-y-3">
          {developmentActions.filter(a => a.status === 'planned').slice(0, 3).map(action => (
            <div key={action.id} className="flex items-center p-3 bg-gray-700/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center mr-3">
                <ChevronRight className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{action.title}</h4>
                <p className="text-sm text-gray-400">{action.description}</p>
              </div>
              <div className="text-sm text-gray-400">
                {action.deadline && new Date(action.deadline).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Career Goals</h3>
        <button
          onClick={() => setShowGoalForm(true)}
          className="flex items-center bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {careerGoals.map(goal => (
          <div key={goal.id} className="bg-gray-800 rounded-lg p-6 border border-indigo-900/30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-lg">{goal.title}</h4>
                <p className="text-gray-400 text-sm">{goal.description}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                goal.current_status === 'in_progress' ? 'bg-blue-900 text-blue-300' :
                goal.current_status === 'completed' ? 'bg-green-900 text-green-300' :
                goal.current_status === 'not_started' ? 'bg-gray-900 text-gray-300' :
                'bg-yellow-900 text-yellow-300'
              }`}>
                {goal.current_status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{goal.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress_percentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Timeline:</span>
                  <div className="font-medium">{goal.timeline.replace('_', ' ')}</div>
                </div>
                <div>
                  <span className="text-gray-400">Target Date:</span>
                  <div className="font-medium">
                    {goal.target_date ? new Date(goal.target_date).toLocaleDateString() : 'Not set'}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-gray-400 text-sm">Success Metrics:</span>
                <ul className="mt-1 space-y-1">
                  {goal.success_metrics.map((metric, index) => (
                    <li key={index} className="text-sm flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Skills Gap Analysis</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skillRequirements.map(skill => (
          <div key={skill.id} className="bg-gray-800 rounded-lg p-6 border border-indigo-900/30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold">{skill.skill_name}</h4>
                <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                  skill.skill_category === 'technical' ? 'bg-blue-900 text-blue-300' :
                  skill.skill_category === 'leadership' ? 'bg-purple-900 text-purple-300' :
                  skill.skill_category === 'soft' ? 'bg-green-900 text-green-300' :
                  'bg-gray-900 text-gray-300'
                }`}>
                  {skill.skill_category.replace('_', ' ')}
                </span>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                skill.importance === 'critical' ? 'bg-red-900 text-red-300' :
                skill.importance === 'important' ? 'bg-yellow-900 text-yellow-300' :
                'bg-green-900 text-green-300'
              }`}>
                {skill.importance}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Current Level</span>
                  <span>Target Level</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: `${(skill.current_level / 10) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{skill.current_level}/10</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(skill.target_level / 10) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{skill.target_level}/10</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Est. Time:</span>
                  <div className="font-medium">{skill.estimated_time_hours}h</div>
                </div>
                <div>
                  <span className="text-gray-400">Deadline:</span>
                  <div className="font-medium">
                    {skill.deadline ? new Date(skill.deadline).toLocaleDateString() : 'Flexible'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActions = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Development Action Plan</h3>
      
      <div className="space-y-4">
        {developmentActions.map(action => (
          <div key={action.id} className="bg-gray-800 rounded-lg p-6 border border-indigo-900/30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold">{action.title}</h4>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  action.action_type === 'certification' ? 'bg-blue-900 text-blue-300' :
                  action.action_type === 'training' ? 'bg-purple-900 text-purple-300' :
                  action.action_type === 'project' ? 'bg-green-900 text-green-300' :
                  'bg-gray-900 text-gray-300'
                }`}>
                  {action.action_type}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  action.status === 'in_progress' ? 'bg-blue-900 text-blue-300' :
                  action.status === 'completed' ? 'bg-green-900 text-green-300' :
                  action.status === 'planned' ? 'bg-gray-900 text-gray-300' :
                  'bg-red-900 text-red-300'
                }`}>
                  {action.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-gray-400 text-sm">Specific Steps:</span>
                <ul className="mt-1 space-y-1">
                  {action.specific_steps.map((step, index) => (
                    <li key={index} className="text-sm flex items-center">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2 flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Duration:</span>
                  <div className="font-medium">{action.estimated_duration || 'TBD'}</div>
                </div>
                <div>
                  <span className="text-gray-400">Cost:</span>
                  <div className="font-medium">
                    {action.cost_estimate ? `$${action.cost_estimate}` : 'Free'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Deadline:</span>
                  <div className="font-medium">
                    {action.deadline ? new Date(action.deadline).toLocaleDateString() : 'Flexible'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout currentPage="professional">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="professional">
      <div className="mb-6">
        <h1 className="text-2xl font-['Orbitron'] font-bold mb-1">PROFESSIONAL DEVELOPMENT</h1>
        <p className="text-gray-400">Strategic career advancement and skill development planning.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-gray-800/50 p-2 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-indigo-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {tab.icon}
            <span className="ml-2 hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'goals' && renderGoals()}
        {activeTab === 'skills' && renderSkills()}
        {activeTab === 'actions' && renderActions()}
        {activeTab === 'resources' && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Learning Resources</h3>
            <p className="text-gray-400">Resource recommendations coming soon...</p>
          </div>
        )}
        {activeTab === 'progress' && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-400">Advanced analytics coming soon...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfessionalDevelopment;