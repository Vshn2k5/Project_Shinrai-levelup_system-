# 🗡️ Prodigy Protocol 🛡️

*(Formerly Project Shinrai)*

**Level up your life.**

Turn your daily routines, study habits, physical training, and professional goals into an epic RPG adventure. Complete quests, earn XP, gather coins, and ascend the ranks from **Rank E** to the legendary **Rank SSS**.

[Features](#-core-features--mechanics) • [Installation](#-getting-started-enter-the-game) • [Tech Stack](#️-technology-stack-the-game-engine) • [License](#-license)

</div>

---

## 🌍 The World of Prodigy Protocol

Prodigy Protocol is not just a to-do list; it's a comprehensive, gamified personal development system. By treating your real-life tasks as in-game quests, you maintain motivation, track your progression across multiple domains, and build a lasting streak of success.

---

## 🌟 Core Features & Mechanics

### 📊 The Four Domains

Your character's stats are divided into four core attributes, each with its own level and XP bar:

- 🏃‍♂️ **Physical Attributes**: Fitness goals, health metrics, sleep schedules, and workout routines.
- 🧠 **Mental Fortitude**: Study habits, memory drills, emotional control, and meditation.
- 💻 **Technical Mastery**: Coding sessions, tool proficiency, and technical learning.
- 🎨 **Creative Arts**: Writing, personal projects, art, and creative expression.

### 📜 The Quest Board

Take on challenges tailored to your real-life goals.

- **Quest Types**: Daily, Weekly, Monthly, and Epic Chain Quests.
- **Difficulty Scaling**: Easy, Medium, and Hard quests yield different XP and Coin rewards.
- **Time Limits & Deadlines**: Complete quests before they expire to avoid penalties.

### 🔥 Streaks & The Penalty System

Consistency is key to leveling up.

- **Maintain your Streak**: Earn milestone rewards for daily log-ins.
- **The Penalty System**: Missed days lead to coin earning penalties and streak decay.
- **Redemption Quests**: Complete special tasks to regain lost standing and repair your streak.

### 🏪 The Merchant's Shop

Spend your hard-earned coins in the In-Game Shop:

- **Boosters**: Purchase temporary XP/Coin multipliers.
- **Protections**: Buy Streak Freezes to protect your momentum on rest days.
- **Cosmetics**: Unlock exclusive Profile Frames, Badges, and titles to show off your rank.

### 👤 Player Profiling

Configure your character sheet with extensive real-world details:

- Health Metrics & Dietary Preferences
- Professional & Career Goals
- Learning Styles & Accountability Settings
- Daily Progress Rings to visualize your targets at a glance.

---

## 🛠️ Technology Stack (The Game Engine)

This project is built using modern, fast, and scalable technologies to ensure a smooth gameplay experience.

- **Frontend Framework**: React 18 (TypeScript) powered by Vite ⚡
- **State Management**: Zustand 🐻 (For snappy, global state)
- **Routing**: React Router v7 🗺️
- **Styling**: Tailwind CSS 🎨 (For beautiful, responsive interfaces)
- **Animations**: Framer Motion 🎬 (For that buttery-smooth gamified feel)
- **Icons**: Lucide React 🔮
- **Backend & Database**: Supabase 🗄️ (PostgreSQL, Authentication, and Edge Functions)

---

## 🚀 Getting Started (Enter the Game)

Ready to begin your journey? Follow these steps to set up the game on your local machine.

### 📋 Prerequisites

- **Node.js**: (v18+ recommended)
- **npm** or **yarn**
- **Supabase Account**: (For database and authentication services)

### 📥 Installation Steps

1. **Clone the Repository**

   ```bash
   git clone <your-repo-url>
   cd Project_Shinrai-levelup_system--main
   ```
2. **Install Dependencies**

   ```bash
   npm install
   ```
3. **Configure Environment Variables**
   Equip your API keys. Copy the example `.env` file and fill in your Supabase credentials:

   ```bash
   cp .env.example .env
   ```
4. **Initialize the Database**
   Run the Supabase migrations located in `supabase/migrations/` to set up the database schema for the game.
5. **Run the Development Server**
   Start the game locally:

   ```bash
   npm run dev
   ```
6. **Build for Production**
   Ready for the final release?

   ```bash
   npm run build
   ```

---

## 🤝 Contributing (Join the Guild)

Want to help build the ultimate gamified life system? Feel free to fork this repository, submit Pull Requests, or open Issues for new feature ideas and bug reports.

## 📜 License

This project is licensed under the **MIT License**.

<div align="center">
  <i>"Level up as you live."</i>
</div>
