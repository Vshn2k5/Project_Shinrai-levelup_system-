# Project_Shinrai-levelup_system-
Build a gamified personal development system that: •Tracks activities (study, coding, martial arts, workouts, memory drills, emotion control). •Awards XP, levels, skill points, and achievements. •Shows progression: skill trees, stat screens, daily quests, streaks, periodic tests.•Integrates with your daily routine, so you levelup as you live.
# Leveling System — MVP (Jan 1 2026 target)

Personal gamified life-tracker to turn study, training and skill-building into quests, XP, and levels.

## MVP features
- User profile
- Dashboard with global level + skill bars
- Tasks: Daily / Quests / Challenges
- XP engine + leveling formula (XP_total(L) = 100 * L^2)
- Skill trees with skill points on level-up
- Timers (Pomodoro/training) and history export (CSV)

## Tech stack
- Frontend: React
- Backend: Node.js + Express (or Supabase Edge Functions)
- Database & Auth: Supabase (Postgres + Auth)
- Hosting: Vercel + Supabase

## Day 0
- Wireframes: Dashboard, Quest Log, Skill Screen
- 10 initial tasks to seed the app
- Supabase SQL schema (see `supabase/schema.sql`)
- React starter: `npx create-react-app luna-levels`

## Getting started (local)
1. `git clone <your-repo>`
2. `cd luna-levels`
3. `npx create-react-app .`
4. `npm start`

## XP formula
Total XP to reach level L: `XP_total(L) = 100 * L^2`.
XP to next level = `XP_total(L+1) - XP_total(L)`.

## License
MIT
