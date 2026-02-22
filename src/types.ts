export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export type Domain = 'Physical' | 'Mental' | 'Technical' | 'Creative';

export type PersonalProfile = {
  name: string;
  age: number;
  physicalMetrics: {
    height: number;
    weight: number;
    bodyType: string;
  };
  location: string;
  schedule: {
    dailyCommitments: string[];
    preferredStudyHours: string[];
  };
  languages: string[];
};

export type HealthMetrics = {
  exerciseRoutine: string;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  bodyGoals: string[];
  medicalConditions: string[];
  dietaryPreferences: string[];
  sleepSchedule: {
    bedtime: string;
    wakeTime: string;
    quality: number;
  };
};

export type ProfessionalGoals = {
  currentStatus: string;
  industry: string;
  targetSkills: string[];
  careerGoals: {
    sixMonths: string[];
    oneYear: string[];
    fiveYears: string[];
  };
  workEnvironment: string[];
};

export type LearningPreferences = {
  learningStyle: 'Visual' | 'Auditory' | 'Kinesthetic';
  availableHours: number;
  knowledgeGaps: string[];
  currentResources: string[];
  toolsProficiency: Record<string, number>;
};

export type AccountabilitySettings = {
  checkInFrequency: 'Daily' | 'Weekly' | 'Monthly';
  motivationTriggers: string[];
  consequences: {
    type: 'Financial' | 'Assignment' | 'Social' | 'Physical' | 'Custom';
    details: string;
  }[];
  trackingMethod: string;
  rewards: string[];
};

export type CommunicationPreferences = {
  contactMethod: string;
  updateFrequency: {
    progressReports: 'Daily' | 'Weekly' | 'Monthly';
    learningOpportunities: boolean;
    careerOpenings: boolean;
    fitnessUpdates: boolean;
    achievements: boolean;
  };
  reminderStyle: 'Encouraging' | 'Strict' | 'Neutral';
};

export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard';

export type QuestStatus = 'active' | 'completed' | 'failed' | 'expired';

export type QuestType = 'daily' | 'weekly' | 'monthly' | 'chain';

export type Skill = {
  id: string;
  name: string;
  domain: Domain;
  level: number;
  xp: number;
  xpToNextLevel: number;
  metrics?: {
    startDate: Date;
    lastUpdated: Date;
    progressHistory: {
      date: Date;
      value: number;
      notes: string;
    }[];
    relatedQuests: string[];
  };
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  domain: Domain;
  difficulty: QuestDifficulty;
  type: QuestType;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  status: QuestStatus;
  deadline?: Date;
  createdAt: Date;
  completedAt?: Date;
  chainId?: string;
  chainPosition?: number;
  completionCriteria: string[];
  timeLimit?: number; // in hours
  metrics?: {
    startDate: Date;
    checkpoints: {
      date: Date;
      description: string;
      completed: boolean;
    }[];
    consequences?: {
      type: 'Financial' | 'Assignment' | 'Social' | 'Physical' | 'Custom';
      details: string;
    };
  };
};

export type QuestChain = {
  id: string;
  title: string;
  description: string;
  domain: Domain;
  questIds: string[];
  bonusReward: {
    xp: number;
    coins: number;
  };
  completed: boolean;
};

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  category: 'booster' | 'protection' | 'cosmetic' | 'special';
  price: number;
  effect: {
    type: 'streak_freeze' | 'xp_multiplier' | 'coin_multiplier' | 'badge' | 'frame';
    value: number;
    duration?: number; // in hours
  };
  owned?: boolean;
  active?: boolean;
  expiresAt?: Date;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'legendary';
  unlockedAt?: Date;
  requirements: string;
  featured?: boolean;
};

export type ProfileFrame = {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  animationType: 'none' | 'glow' | 'particles' | 'rainbow';
  unlockedAt?: Date;
  seasonal?: boolean;
};

export type StreakData = {
  current: number;
  longest: number;
  lastUpdated: Date;
  freezeActive: boolean;
  freezeExpiresAt?: Date;
  milestones: {
    days: number;
    reward: {
      coins: number;
      items?: string[];
    };
    claimed: boolean;
  }[];
};

export type PenaltySystem = {
  consecutiveMissedDays: number;
  coinEarningPenalty: number; // percentage
  streakDecayRate: number; // percentage per day
  lastMissedDate?: Date;
  redemptionTasksRequired: number;
  redemptionTasksCompleted: number;
};

export type ProgressRings = {
  daily: {
    current: number;
    target: number;
    resetTime: Date;
  };
  weekly: {
    current: number;
    target: number;
    resetTime: Date;
  };
  monthly: {
    current: number;
    target: number;
    resetTime: Date;
  };
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateUnlocked: Date | null;
  requirements: string;
  category?: 'Physical' | 'Mental' | 'Technical' | 'Creative' | 'Special';
  progressMetrics?: {
    current: number;
    target: number;
    history: {
      date: Date;
      value: number;
    }[];
  };
};

export type UserProfile = {
  name: string;
  title: string;
  rank: Rank;
  level: number;
  totalXp: number;
  coins: number;
  joinDate: Date;
  streak: StreakData;
  lastActive: Date;
  penalties: PenaltySystem;
  progressRings: ProgressRings;
  ownedItems: string[];
  activeBoosts: ShopItem[];
  badges: Badge[];
  profileFrame?: ProfileFrame;
  profilePicture?: string;
  personalProfile?: PersonalProfile;
  healthMetrics?: HealthMetrics;
  professionalGoals?: ProfessionalGoals;
  learningPreferences?: LearningPreferences;
  accountabilitySettings?: AccountabilitySettings;
  communicationPreferences?: CommunicationPreferences;
  progressHistory: {
    date: Date;
    metrics: Record<string, number>;
    notes: string;
  }[];
};

export type DomainProgress = {
  domain: Domain;
  level: number;
  xp: number;
  xpToNextLevel: number;
  completedQuests: number;
  totalQuests: number;
  averageScore: number;
};