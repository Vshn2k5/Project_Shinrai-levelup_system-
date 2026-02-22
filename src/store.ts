import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, setupAuthListener } from './lib/auth';
import {
  Achievement,
  Domain,
  Quest,
  QuestChain,
  Rank,
  Skill,
  UserProfile,
  PersonalProfile,
  HealthMetrics,
  ProfessionalGoals,
  LearningPreferences,
  AccountabilitySettings,
  CommunicationPreferences,
  ShopItem,
  Badge,
  ProfileFrame,
  StreakData,
  PenaltySystem,
  ProgressRings,
  DomainProgress
} from './types';

interface ProdigyState {
  user: UserProfile;
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  skills: Skill[];
  quests: Quest[];
  questChains: QuestChain[];
  achievements: Achievement[];
  shopItems: ShopItem[];
  domainRanks: Record<Domain, Rank>;
  
  // Actions
  updateUser: (user: Partial<UserProfile>) => void;
  setAuthUser: (user: AuthUser | null) => void;
  clearAuth: () => void;
  initializeAuth: () => void;
  updatePersonalProfile: (profile: PersonalProfile) => void;
  updateHealthMetrics: (metrics: HealthMetrics) => void;
  updateProfessionalGoals: (goals: ProfessionalGoals) => void;
  updateLearningPreferences: (prefs: LearningPreferences) => void;
  updateAccountabilitySettings: (settings: AccountabilitySettings) => void;
  updateCommunicationPreferences: (prefs: CommunicationPreferences) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  addXp: (skillId: string, amount: number) => void;
  addQuest: (quest: Quest) => void;
  completeQuest: (id: string) => void;
  failQuest: (id: string) => void;
  refreshDailyQuests: () => void;
  purchaseItem: (itemId: string) => void;
  unlockAchievement: (id: string) => void;
  calculateRank: (domain: Domain) => Rank;
  addProgressEntry: (metrics: Record<string, number>, notes: string) => void;
  updateStreak: () => void;
  applyPenalties: () => void;
  getDomainProgress: (domain: Domain) => DomainProgress;
  initializeShop: () => void;
}

const calculateRankFromXp = (xp: number): Rank => {
  if (xp >= 10000) return 'SSS';
  if (xp >= 7500) return 'SS';
  if (xp >= 5000) return 'S';
  if (xp >= 3000) return 'A';
  if (xp >= 1500) return 'B';
  if (xp >= 750) return 'C';
  if (xp >= 250) return 'D';
  return 'E';
};

const calculateLevelFromXp = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

const getStreakMultiplier = (streak: number): number => {
  if (streak >= 100) return 1.5;
  if (streak >= 30) return 1.25;
  if (streak >= 7) return 1.1;
  return 1.0;
};

const generateDailyQuests = (): Quest[] => {
  const questTemplates = [
    {
      title: 'Morning Workout',
      description: 'Complete a 30-minute exercise session',
      domain: 'Physical' as Domain,
      difficulty: 'Medium' as const,
      completionCriteria: ['Warm up for 5 minutes', 'Complete main workout', 'Cool down and stretch']
    },
    {
      title: 'Learn Something New',
      description: 'Spend 1 hour learning a new skill or concept',
      domain: 'Mental' as Domain,
      difficulty: 'Easy' as const,
      completionCriteria: ['Choose learning material', 'Study for 60 minutes', 'Take notes or practice']
    },
    {
      title: 'Code Review',
      description: 'Review and improve existing code or learn new programming concepts',
      domain: 'Technical' as Domain,
      difficulty: 'Hard' as const,
      completionCriteria: ['Identify code to review', 'Analyze and document improvements', 'Implement changes']
    },
    {
      title: 'Creative Expression',
      description: 'Spend time on a creative project or artistic endeavor',
      domain: 'Creative' as Domain,
      difficulty: 'Medium' as const,
      completionCriteria: ['Set up workspace', 'Work on project for 45 minutes', 'Document progress']
    }
  ];

  return questTemplates.map((template, index) => ({
    id: `daily-${Date.now()}-${index}`,
    title: template.title,
    description: template.description,
    domain: template.domain,
    difficulty: template.difficulty,
    type: 'daily' as const,
    xpReward: template.difficulty === 'Easy' ? 25 : template.difficulty === 'Medium' ? 50 : 75,
    coinReward: template.difficulty === 'Easy' ? 15 : template.difficulty === 'Medium' ? 35 : 60,
    completed: false,
    status: 'active' as const,
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    createdAt: new Date(),
    completionCriteria: template.completionCriteria
  }));
};

const initializeShopItems = (): ShopItem[] => [
  // Streak Protection
  {
    id: 'streak-freeze-1',
    name: 'Streak Freezer (1 Day)',
    description: 'Protects your streak for 1 day if you miss your quests',
    category: 'protection',
    price: 500,
    effect: { type: 'streak_freeze', value: 1 }
  },
  {
    id: 'streak-freeze-7',
    name: 'Streak Freezer (7 Days)',
    description: 'Protects your streak for 7 days if you miss your quests',
    category: 'protection',
    price: 2000,
    effect: { type: 'streak_freeze', value: 7 }
  },
  
  // XP Boosters
  {
    id: 'xp-boost-1h',
    name: '2x XP Booster (1 Hour)',
    description: 'Double XP gains for 1 hour',
    category: 'booster',
    price: 300,
    effect: { type: 'xp_multiplier', value: 2, duration: 1 }
  },
  {
    id: 'xp-boost-24h',
    name: '2x XP Booster (24 Hours)',
    description: 'Double XP gains for 24 hours',
    category: 'booster',
    price: 1500,
    effect: { type: 'xp_multiplier', value: 2, duration: 24 }
  },
  
  // Coin Multipliers
  {
    id: 'coin-boost-1h',
    name: '1.5x Coin Multiplier (1 Hour)',
    description: 'Increase coin earnings by 50% for 1 hour',
    category: 'booster',
    price: 400,
    effect: { type: 'coin_multiplier', value: 1.5, duration: 1 }
  },
  {
    id: 'coin-boost-24h',
    name: '1.5x Coin Multiplier (24 Hours)',
    description: 'Increase coin earnings by 50% for 24 hours',
    category: 'booster',
    price: 2000,
    effect: { type: 'coin_multiplier', value: 1.5, duration: 24 }
  },
  
  // Badges
  {
    id: 'bronze-badge',
    name: 'Bronze Achievement Badge',
    description: 'Show off your dedication with a bronze badge',
    category: 'cosmetic',
    price: 1000,
    effect: { type: 'badge', value: 1 }
  },
  {
    id: 'silver-badge',
    name: 'Silver Achievement Badge',
    description: 'Display your commitment with a silver badge',
    category: 'cosmetic',
    price: 3000,
    effect: { type: 'badge', value: 2 }
  },
  
  // Profile Frames
  {
    id: 'basic-frame',
    name: 'Animated Profile Frame',
    description: 'Add a subtle glow to your profile',
    category: 'cosmetic',
    price: 800,
    effect: { type: 'frame', value: 1 }
  },
  {
    id: 'premium-frame',
    name: 'Premium Animated Frame',
    description: 'Stand out with a premium animated frame',
    category: 'cosmetic',
    price: 2500,
    effect: { type: 'frame', value: 2 }
  }
];

export const useProdigyStore = create<ProdigyState>()(
  persist(
    (set, get) => ({
      user: {
        name: 'Hunter',
        title: 'Novice Explorer',
        rank: 'E',
        level: 1,
        totalXp: 0,
        coins: 1000, // Starting coins
        joinDate: new Date(),
        streak: {
          current: 0,
          longest: 0,
          lastUpdated: new Date(),
          freezeActive: false,
          milestones: [
            { days: 7, reward: { coins: 100 }, claimed: false },
            { days: 30, reward: { coins: 500, items: ['bronze-badge'] }, claimed: false },
            { days: 100, reward: { coins: 2000, items: ['legendary-frame'] }, claimed: false }
          ]
        },
        lastActive: new Date(),
        penalties: {
          consecutiveMissedDays: 0,
          coinEarningPenalty: 0,
          streakDecayRate: 0,
          redemptionTasksRequired: 0,
          redemptionTasksCompleted: 0
        },
        progressRings: {
          daily: { current: 0, target: 3, resetTime: new Date() },
          weekly: { current: 0, target: 15, resetTime: new Date() },
          monthly: { current: 0, target: 60, resetTime: new Date() }
        },
        ownedItems: [],
        activeBoosts: [],
        badges: [],
        progressHistory: [],
      },
      authUser: null,
      isAuthenticated: false,
      authLoading: true,
      skills: [],
      quests: [],
      questChains: [],
      achievements: [],
      shopItems: [],
      domainRanks: {
        Physical: 'E',
        Mental: 'E',
        Technical: 'E',
        Creative: 'E',
      },

      setAuthUser: (authUser) => {
        set({ 
          authUser, 
          isAuthenticated: !!authUser && authUser.id !== 'guest',
          authLoading: false 
        });
        
        // Update legacy user object for backward compatibility
        if (authUser?.profile) {
          get().updateUser({
            name: authUser.profile.full_name || authUser.email?.split('@')[0] || 'User'
          });
        }
      },

      clearAuth: () => {
        set({ 
          authUser: null, 
          isAuthenticated: false,
          authLoading: false 
        });
      },

      initializeAuth: () => {
        // Set up auth state listener
        setupAuthListener((authState) => {
          get().setAuthUser(authState.user);
        });
      },

      initializeShop: () => {
        const state = get();
        if (state.shopItems.length === 0) {
          set({ shopItems: initializeShopItems() });
        }
      },

      updateUser: (updates) => 
        set((state) => ({
          user: { ...state.user, ...updates }
        })),

      updatePersonalProfile: (profile) =>
        set((state) => ({
          user: { ...state.user, personalProfile: profile }
        })),

      updateHealthMetrics: (metrics) =>
        set((state) => ({
          user: { ...state.user, healthMetrics: metrics }
        })),

      updateProfessionalGoals: (goals) =>
        set((state) => ({
          user: { ...state.user, professionalGoals: goals }
        })),

      updateLearningPreferences: (prefs) =>
        set((state) => ({
          user: { ...state.user, learningPreferences: prefs }
        })),

      updateAccountabilitySettings: (settings) =>
        set((state) => ({
          user: { ...state.user, accountabilitySettings: settings }
        })),

      updateCommunicationPreferences: (prefs) =>
        set((state) => ({
          user: { ...state.user, communicationPreferences: prefs }
        })),

      addProgressEntry: (metrics, notes) =>
        set((state) => ({
          user: {
            ...state.user,
            progressHistory: [
              ...state.user.progressHistory,
              {
                date: new Date(),
                metrics,
                notes
              }
            ]
          }
        })),

      addSkill: (skill) => 
        set((state) => ({
          skills: [...state.skills, skill]
        })),

      updateSkill: (id, updates) => 
        set((state) => ({
          skills: state.skills.map(skill => 
            skill.id === id ? { ...skill, ...updates } : skill
          )
        })),

      addXp: (skillId, amount) => {
        const state = get();
        const skill = state.skills.find(s => s.id === skillId);
        
        if (!skill) return;
        
        // Apply boosts
        const xpBoost = state.user.activeBoosts.find(b => b.effect.type === 'xp_multiplier');
        const finalAmount = xpBoost ? amount * xpBoost.effect.value : amount;
        
        const newXp = skill.xp + finalAmount;
        const levelUps = Math.floor(newXp / skill.xpToNextLevel);
        const remainingXp = newXp % skill.xpToNextLevel;
        const newLevel = skill.level + levelUps;
        const newXpToNextLevel = skill.xpToNextLevel * (levelUps > 0 ? 1.5 : 1);
        
        state.updateSkill(skillId, {
          xp: remainingXp,
          level: newLevel,
          xpToNextLevel: newXpToNextLevel,
        });
        
        // Update total XP and user level
        const newTotalXp = state.user.totalXp + finalAmount;
        state.updateUser({ 
          totalXp: newTotalXp,
          level: calculateLevelFromXp(newTotalXp),
          rank: calculateRankFromXp(newTotalXp)
        });
        
        // Recalculate domain ranks
        const domain = skill.domain;
        const domainSkills = state.skills.filter(s => s.domain === domain);
        const domainXp = domainSkills.reduce((sum, s) => sum + s.xp, 0);
        const domainRank = calculateRankFromXp(domainXp);
        
        set((state) => ({
          domainRanks: {
            ...state.domainRanks,
            [domain]: domainRank
          }
        }));
      },

      addQuest: (quest) => 
        set((state) => ({
          quests: [...state.quests, quest]
        })),

      completeQuest: (id) => {
        const state = get();
        const quest = state.quests.find(q => q.id === id);
        
        if (!quest || quest.completed) return;
        
        // Apply coin boost
        const coinBoost = state.user.activeBoosts.find(b => b.effect.type === 'coin_multiplier');
        const streakMultiplier = getStreakMultiplier(state.user.streak.current);
        const penaltyMultiplier = 1 - (state.user.penalties.coinEarningPenalty / 100);
        
        let finalCoinReward = quest.coinReward * streakMultiplier * penaltyMultiplier;
        if (coinBoost) finalCoinReward *= coinBoost.effect.value;
        
        // Mark quest as completed
        set((state) => ({
          quests: state.quests.map(q => 
            q.id === id ? {
              ...q,
              completed: true,
              status: 'completed' as const,
              completedAt: new Date()
            } : q
          ),
          user: {
            ...state.user,
            coins: state.user.coins + Math.floor(finalCoinReward),
            progressRings: {
              ...state.user.progressRings,
              daily: {
                ...state.user.progressRings.daily,
                current: state.user.progressRings.daily.current + 1
              },
              weekly: {
                ...state.user.progressRings.weekly,
                current: state.user.progressRings.weekly.current + 1
              },
              monthly: {
                ...state.user.progressRings.monthly,
                current: state.user.progressRings.monthly.current + 1
              }
            }
          }
        }));
        
        // Award XP to a skill in the quest's domain
        const domainSkills = state.skills.filter(s => s.domain === quest.domain);
        if (domainSkills.length > 0) {
          state.addXp(domainSkills[0].id, quest.xpReward);
        }
        
        // Update streak
        state.updateStreak();
      },

      failQuest: (id) => {
        set((state) => ({
          quests: state.quests.map(q => 
            q.id === id ? {
              ...q,
              status: 'failed' as const
            } : q
          )
        }));
        
        // Apply penalties
        get().applyPenalties();
      },

      refreshDailyQuests: () => {
        const state = get();
        const now = new Date();
        const lastReset = new Date(state.user.progressRings.daily.resetTime);
        
        // Check if it's a new day
        if (now.getDate() !== lastReset.getDate() || now.getMonth() !== lastReset.getMonth()) {
          // Remove old daily quests
          const nonDailyQuests = state.quests.filter(q => q.type !== 'daily');
          
          // Generate new daily quests
          const newDailyQuests = generateDailyQuests();
          
          // Reset daily progress
          const newResetTime = new Date();
          newResetTime.setHours(0, 0, 0, 0);
          newResetTime.setDate(newResetTime.getDate() + 1);
          
          set({
            quests: [...nonDailyQuests, ...newDailyQuests],
            user: {
              ...state.user,
              progressRings: {
                ...state.user.progressRings,
                daily: {
                  current: 0,
                  target: 3,
                  resetTime: newResetTime
                }
              }
            }
          });
        }
      },

      purchaseItem: (itemId) => {
        const state = get();
        const item = state.shopItems.find(i => i.id === itemId);
        
        if (!item || state.user.coins < item.price || item.owned) return;
        
        const updatedItem = { ...item, owned: true };
        
        // If it's a temporary boost, activate it
        if (item.effect.duration) {
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + item.effect.duration);
          
          updatedItem.active = true;
          updatedItem.expiresAt = expiresAt;
          
          set((state) => ({
            user: {
              ...state.user,
              coins: state.user.coins - item.price,
              ownedItems: [...state.user.ownedItems, itemId],
              activeBoosts: [...state.user.activeBoosts, updatedItem]
            },
            shopItems: state.shopItems.map(i => i.id === itemId ? updatedItem : i)
          }));
        } else {
          set((state) => ({
            user: {
              ...state.user,
              coins: state.user.coins - item.price,
              ownedItems: [...state.user.ownedItems, itemId]
            },
            shopItems: state.shopItems.map(i => i.id === itemId ? updatedItem : i)
          }));
        }
      },

      updateStreak: () => {
        const state = get();
        const now = new Date();
        const lastUpdate = new Date(state.user.streak.lastUpdated);
        
        // Check if it's a new day
        if (now.getDate() !== lastUpdate.getDate() || now.getMonth() !== lastUpdate.getMonth()) {
          const newStreak = state.user.streak.current + 1;
          
          set((state) => ({
            user: {
              ...state.user,
              streak: {
                ...state.user.streak,
                current: newStreak,
                longest: Math.max(newStreak, state.user.streak.longest),
                lastUpdated: now
              }
            }
          }));
        }
      },

      applyPenalties: () => {
        set((state) => ({
          user: {
            ...state.user,
            penalties: {
              ...state.user.penalties,
              consecutiveMissedDays: state.user.penalties.consecutiveMissedDays + 1,
              coinEarningPenalty: Math.min(50, state.user.penalties.coinEarningPenalty + 5),
              streakDecayRate: Math.min(15, state.user.penalties.streakDecayRate + 3),
              lastMissedDate: new Date(),
              redemptionTasksRequired: 3,
              redemptionTasksCompleted: 0
            }
          }
        }));
      },

      getDomainProgress: (domain) => {
        const state = get();
        const domainSkills = state.skills.filter(s => s.domain === domain);
        const domainQuests = state.quests.filter(q => q.domain === domain);
        const completedQuests = domainQuests.filter(q => q.completed);
        
        const totalXp = domainSkills.reduce((sum, s) => sum + s.xp, 0);
        const averageLevel = domainSkills.length > 0 
          ? domainSkills.reduce((sum, s) => sum + s.level, 0) / domainSkills.length 
          : 1;
        
        return {
          domain,
          level: Math.floor(averageLevel),
          xp: totalXp,
          xpToNextLevel: Math.floor(averageLevel + 1) * 100 - totalXp,
          completedQuests: completedQuests.length,
          totalQuests: domainQuests.length,
          averageScore: domainQuests.length > 0 ? (completedQuests.length / domainQuests.length) * 100 : 0
        };
      },

      unlockAchievement: (id) => 
        set((state) => ({
          achievements: state.achievements.map(a => 
            a.id === id && !a.dateUnlocked 
              ? { ...a, dateUnlocked: new Date() } 
              : a
          )
        })),

      calculateRank: (domain) => {
        const state = get();
        const domainSkills = state.skills.filter(s => s.domain === domain);
        const domainXp = domainSkills.reduce((sum, s) => sum + s.xp, 0);
        return calculateRankFromXp(domainXp);
      }
    }),
    {
      name: 'prodigy-protocol-storage',
    }
  )
);