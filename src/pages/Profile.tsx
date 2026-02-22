import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useProdigyStore } from '../store';
import { User, Award, Calendar, Zap, Edit2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import AchievementCard from '../components/AchievementCard';
import type { PersonalProfile, HealthMetrics, ProfessionalGoals, LearningPreferences, AccountabilitySettings, CommunicationPreferences } from '../types';

const Profile: React.FC = () => {
  const {
    user,
    updateUser,
    updatePersonalProfile,
    updateHealthMetrics,
    updateProfessionalGoals,
    updateLearningPreferences,
    updateAccountabilitySettings,
    updateCommunicationPreferences,
    achievements
  } = useProdigyStore();

  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Form states
  const [personalProfile, setPersonalProfile] = useState<PersonalProfile>(user.personalProfile || {
    name: user.name,
    age: 0,
    physicalMetrics: { height: 0, weight: 0, bodyType: '' },
    location: '',
    schedule: { dailyCommitments: [], preferredStudyHours: [] },
    languages: []
  });

  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>(user.healthMetrics || {
    exerciseRoutine: '',
    fitnessLevel: 'Beginner',
    bodyGoals: [],
    medicalConditions: [],
    dietaryPreferences: [],
    sleepSchedule: { bedtime: '', wakeTime: '', quality: 0 }
  });

  const [professionalGoals, setProfessionalGoals] = useState<ProfessionalGoals>(user.professionalGoals || {
    currentStatus: '',
    industry: '',
    targetSkills: [],
    careerGoals: { sixMonths: [], oneYear: [], fiveYears: [] },
    workEnvironment: []
  });

  const [learningPrefs, setLearningPrefs] = useState<LearningPreferences>(user.learningPreferences || {
    learningStyle: 'Visual',
    availableHours: 0,
    knowledgeGaps: [],
    currentResources: [],
    toolsProficiency: {}
  });

  const [accountabilitySettings, setAccountabilitySettings] = useState<AccountabilitySettings>(user.accountabilitySettings || {
    checkInFrequency: 'Weekly',
    motivationTriggers: [],
    consequences: [],
    trackingMethod: '',
    rewards: []
  });

  const [communicationPrefs, setCommunicationPrefs] = useState<CommunicationPreferences>(user.communicationPreferences || {
    contactMethod: '',
    updateFrequency: {
      progressReports: 'Weekly',
      learningOpportunities: true,
      careerOpenings: true,
      fitnessUpdates: true,
      achievements: true
    },
    reminderStyle: 'Encouraging'
  });

  const handleSave = () => {
    updatePersonalProfile(personalProfile);
    updateHealthMetrics(healthMetrics);
    updateProfessionalGoals(professionalGoals);
    updateLearningPreferences(learningPrefs);
    updateAccountabilitySettings(accountabilitySettings);
    updateCommunicationPreferences(communicationPrefs);
    updateUser({ name: personalProfile.name });
    setIsEditing(false);
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const renderSection = (title: string, content: React.ReactNode) => (
    <div className="mb-6 bg-gray-800/50 rounded-lg overflow-hidden border border-indigo-900/30">
      <button
        onClick={() => toggleSection(title)}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-700/30 transition-colors"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {activeSection === title ? (
          <ChevronUp className="w-5 h-5 text-indigo-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-indigo-400" />
        )}
      </button>
      {activeSection === title && (
        <div className="p-6 border-t border-indigo-900/30 anime-card">
          {content}
        </div>
      )}
    </div>
  );

  return (
    <Layout currentPage="profile">
      <div className="mb-6">
        <h1 className="text-2xl font-['Orbitron'] font-bold mb-1">HUNTER PROFILE</h1>
        <p className="text-gray-400">Your personal journey and achievements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg border border-indigo-900 overflow-hidden">
            <div className="bg-indigo-900/30 p-6">
              <div className="flex justify-between items-start">
                <div className="w-20 h-20 rounded-full bg-indigo-700 flex items-center justify-center glow">
                  <User className="w-10 h-10 text-white" />
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-indigo-700 p-2 rounded-full hover:bg-indigo-600 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h2 className="text-xl font-semibold sparkle">{user.name}</h2>
                <p className="text-indigo-400">{user.title}</p>
                {personalProfile.age && (
                  <p className="text-sm text-gray-400 mt-1">Age: {personalProfile.age}</p>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-4">
                <Award className="w-5 h-5 text-yellow-500 mr-3" />
                <div>
                  <div className="text-sm text-gray-400">Current Rank</div>
                  <div className="font-semibold">{user.rank}</div>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <Zap className="w-5 h-5 text-indigo-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-400">Total XP</div>
                  <div className="font-semibold">{user.totalXp.toLocaleString()} points</div>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-green-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-400">Current Streak</div>
                  <div className="font-semibold">{user.streak.current} days</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Member Since</div>
                <div className="font-semibold">{new Date(user.joinDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Development Tracking */}
        <div className="lg:col-span-2">
          {renderSection("Personal Profile", (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={personalProfile.name}
                    onChange={(e) => setPersonalProfile({ ...personalProfile, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Age</label>
                  <input
                    type="number"
                    value={personalProfile.age}
                    onChange={(e) => setPersonalProfile({ ...personalProfile, age: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location</label>
                <input
                  type="text"
                  value={personalProfile.location}
                  onChange={(e) => setPersonalProfile({ ...personalProfile, location: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  disabled={!isEditing}
                />
              </div>
            </div>
          ))}

          {renderSection("Health & Wellness", (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Exercise Routine</label>
                <textarea
                  value={healthMetrics.exerciseRoutine}
                  onChange={(e) => setHealthMetrics({ ...healthMetrics, exerciseRoutine: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Fitness Level</label>
                  <select
                    value={healthMetrics.fitnessLevel}
                    onChange={(e) => setHealthMetrics({ ...healthMetrics, fitnessLevel: e.target.value as any })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    disabled={!isEditing}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Sleep Quality (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={healthMetrics.sleepSchedule.quality}
                    onChange={(e) => setHealthMetrics({
                      ...healthMetrics,
                      sleepSchedule: {
                        ...healthMetrics.sleepSchedule,
                        quality: parseInt(e.target.value)
                      }
                    })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          ))}

          {renderSection("Professional Journey", (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Current Status</label>
                <input
                  type="text"
                  value={professionalGoals.currentStatus}
                  onChange={(e) => setProfessionalGoals({ ...professionalGoals, currentStatus: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Industry</label>
                <input
                  type="text"
                  value={professionalGoals.industry}
                  onChange={(e) => setProfessionalGoals({ ...professionalGoals, industry: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Target Skills (comma-separated)</label>
                <input
                  type="text"
                  value={professionalGoals.targetSkills.join(', ')}
                  onChange={(e) => setProfessionalGoals({
                    ...professionalGoals,
                    targetSkills: e.target.value.split(',').map(s => s.trim())
                  })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  disabled={!isEditing}
                />
              </div>
            </div>
          ))}

          {renderSection("Learning & Development", (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Learning Style</label>
                  <select
                    value={learningPrefs.learningStyle}
                    onChange={(e) => setLearningPrefs({ ...learningPrefs, learningStyle: e.target.value as any })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    disabled={!isEditing}
                  >
                    <option value="Visual">Visual</option>
                    <option value="Auditory">Auditory</option>
                    <option value="Kinesthetic">Kinesthetic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Available Hours/Day</label>
                  <input
                    type="number"
                    value={learningPrefs.availableHours}
                    onChange={(e) => setLearningPrefs({ ...learningPrefs, availableHours: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Knowledge Gaps (comma-separated)</label>
                <input
                  type="text"
                  value={learningPrefs.knowledgeGaps.join(', ')}
                  onChange={(e) => setLearningPrefs({
                    ...learningPrefs,
                    knowledgeGaps: e.target.value.split(',').map(s => s.trim())
                  })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  disabled={!isEditing}
                />
              </div>
            </div>
          ))}

          {renderSection("Accountability", (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Check-in Frequency</label>
                  <select
                    value={accountabilitySettings.checkInFrequency}
                    onChange={(e) => setAccountabilitySettings({
                      ...accountabilitySettings,
                      checkInFrequency: e.target.value as any
                    })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    disabled={!isEditing}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tracking Method</label>
                  <input
                    type="text"
                    value={accountabilitySettings.trackingMethod}
                    onChange={(e) => setAccountabilitySettings({
                      ...accountabilitySettings,
                      trackingMethod: e.target.value
                    })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Motivation Triggers (comma-separated)</label>
                <input
                  type="text"
                  value={accountabilitySettings.motivationTriggers.join(', ')}
                  onChange={(e) => setAccountabilitySettings({
                    ...accountabilitySettings,
                    motivationTriggers: e.target.value.split(',').map(s => s.trim())
                  })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  disabled={!isEditing}
                />
              </div>
            </div>
          ))}

          {renderSection("Communication", (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Contact Method</label>
                  <input
                    type="text"
                    value={communicationPrefs.contactMethod}
                    onChange={(e) => setCommunicationPrefs({
                      ...communicationPrefs,
                      contactMethod: e.target.value
                    })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Reminder Style</label>
                  <select
                    value={communicationPrefs.reminderStyle}
                    onChange={(e) => setCommunicationPrefs({
                      ...communicationPrefs,
                      reminderStyle: e.target.value as any
                    })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    disabled={!isEditing}
                  >
                    <option value="Encouraging">Encouraging</option>
                    <option value="Strict">Strict</option>
                    <option value="Neutral">Neutral</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Update Preferences</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(communicationPrefs.updateFrequency).map(([key, value]) => (
                    key !== 'progressReports' && (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => setCommunicationPrefs({
                            ...communicationPrefs,
                            updateFrequency: {
                              ...communicationPrefs.updateFrequency,
                              [key]: e.target.checked
                            }
                          })}
                          className="mr-2"
                          disabled={!isEditing}
                        />
                        <label className="text-sm text-gray-400">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Achievements */}
          {achievements.length > 0 && renderSection("Achievements", (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          ))}

          {/* Progress History */}
          {user.progressHistory.length > 0 && renderSection("Progress History", (
            <div className="space-y-4">
              {user.progressHistory.map((entry, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                  <div className="mt-2">
                    <div className="text-sm">{entry.notes}</div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {Object.entries(entry.metrics).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="text-gray-400">{key}:</span>{' '}
                          <span className="text-indigo-400">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;