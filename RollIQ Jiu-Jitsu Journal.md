# RollIQ
### AI-Powered BJJ Journal
**Product Requirements Document & Development Plan**
Version 1.0 | February 2026

---

## 1. Product Overview

### 1.1 Vision
RollIQ is an AI-powered Brazilian Jiu-Jitsu training journal that helps practitioners identify patterns in their game, surface weaknesses they didn't know they had, and receive targeted instructional video recommendations — all automatically derived from their own session notes.

### 1.2 Problem Statement
BJJ practitioners train for years without a systematic way to track what's holding them back. They rely on memory and gut feel to identify gaps in their game. Coaches can help, but they can't observe every roll. Instructional content is abundant on YouTube, but finding the right video for your specific weakness is time-consuming and hit-or-miss.

### 1.3 Solution
RollIQ solves this by giving practitioners a low-friction way to log sessions, then uses AI to synthesize those logs over time into actionable insights: which positions they repeatedly get stuck in, how their game is evolving, and exactly which YouTube tutorials would address their current gaps.

### 1.4 Target Users
- Hobbyist BJJ practitioners (blue belt to purple belt) who train 2–4x per week
- Self-motivated learners who supplement mat time with video study
- Practitioners without a dedicated coach who need to self-diagnose gaps
- Competitive grapplers who want data-driven insight into their game

---

## 2. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Users log consistently | Journal entries per active user / week | ≥3 entries/week |
| AI insights are useful | User rating of weekly summary | ≥4.0 / 5.0 |
| Video recs drive action | Click-through rate on recommended videos | ≥30% |
| App is sticky | 30-day retention rate | ≥50% |
| Zero infrastructure cost | Monthly server spend at 100 users | $0 (free tiers) |

---

## 3. Feature Requirements

### 3.1 Journal Entry System

#### Core Entry Fields
- Date, gym/location, session duration
- Session type: Gi / No-Gi / Open mat / Competition
- Training partners (optional, for pattern tracking)
- Round notes: what happened, positions encountered, what worked, what didn't
- Mood / energy level (1–5 scale)
- Free text notes

#### Tagging System
- Position tags: guard, mount, back control, turtle, half guard, side control, etc.
- Outcome tags: submitted, escaped, swept, held, passed
- Role tags: top / bottom / attacking / defending
- Auto-suggest tags based on free text (AI-powered)

#### Entry Modes
- **Quick entry mode:** minimal fields, under 60 seconds to log
- **Detailed entry mode:** full structured breakdown
- **Voice-to-text input:** speak your session notes post-roll

---

### 3.2 AI Analysis Engine

#### Position Pattern Detection
The AI analyzes journal entries over time to identify recurring problems. It looks for:
- Positions that appear frequently in the "what didn't work" sections
- Positions where the user was on the losing end (submitted, swept, passed)
- Gaps in the user's offensive game (positions rarely attacked from)
- Progress signals: problems that were frequent but are now less common

#### Weekly & Monthly Summaries
- Auto-generated every Sunday for the past week's entries
- Highlights top 3 recurring problem areas with specific examples from the journal
- Notes progress vs. previous period
- Ends with 2–3 recommended areas to focus drilling on

#### AI Model
- **Provider:** Groq (free tier) running Llama 3.3 70B
- All journal content sent in context window for synthesis
- Structured prompts to produce consistent, scannable output
- **Fallback:** Google Gemini Flash if Groq rate limited

---

### 3.3 YouTube Recommendation Engine

#### How It Works
- AI identifies the top 2–3 weaknesses from recent journal entries
- Converts those into search queries (e.g., "escape turtle position no-gi")
- Queries YouTube Data API v3 and returns top results
- AI re-ranks results by relevance, filtering for well-known instructors

#### Recommendation Features
- User can thumbs up / thumbs down recommendations
- Watched videos are marked and not re-recommended
- Save to watchlist for later viewing
- Filter by gi / no-gi preference

#### Instructor Quality Filtering
Preferred instructor list (pre-seeded, user-editable):
Gordon Ryan, Bernardo Faria, John Danaher, Craig Jones, Priit Mihkelson, Lachlan Giles, Tom DeBlass, Keenan Cornelius, Andrew Wiltse.

---

### 3.4 Dashboard & Analytics
- Training frequency heatmap (GitHub-style)
- Position frequency chart: which positions appear most in logs
- Problem position trend: is it getting better or worse over time?
- Streak tracker: current training streak in days
- Rolling 30-day vs. previous 30-day comparison

---

### 3.5 Authentication & Data
- Email / password auth via Supabase
- Google OAuth login
- All journal data stored in Supabase PostgreSQL
- Data is private per user by default
- Export journal to JSON or CSV

---

## 4. Technical Architecture

### 4.1 Tech Stack (100% Free Tier)

| Layer | Technology | Free Tier Limits |
|-------|-----------|-----------------|
| Frontend | React + Vite + TailwindCSS | Unlimited (static) |
| Hosting | Vercel | Unlimited hobby projects |
| Database & Auth | Supabase | 500MB DB, 50MB file storage |
| AI / LLM | Groq API (Llama 3.3 70B) | 30 req/min, 6000 req/day |
| AI Fallback | Google Gemini Flash | 1500 req/day |
| Video Search | YouTube Data API v3 | 10,000 units/day |
| State Management | Zustand | Free (open source) |

---

### 4.2 System Architecture

The app is a fully client-side React application that talks directly to Supabase for data and makes API calls to Groq and YouTube from the browser. There is no custom backend server, keeping infrastructure costs at $0.

#### Data Flow: Journal Entry
1. User writes entry in React UI
2. Entry saved to Supabase `entries` table in real-time
3. Tags extracted client-side using regex + keyword matching
4. AI auto-tag suggestion: entry text sent to Groq, suggested tags returned and applied

#### Data Flow: AI Summary
1. User requests summary (or it triggers automatically on Sunday)
2. Last 30 days of entries fetched from Supabase
3. Entries formatted into structured prompt and sent to Groq
4. Response parsed and stored in `summaries` table
5. YouTube queries generated from summary's identified weaknesses
6. YouTube Data API queried, results ranked by AI and stored in `recommendations` table

---

### 4.3 Database Schema

| Table | Key Fields |
|-------|-----------|
| `users` | id, email, created_at, preferences (json) |
| `entries` | id, user_id, date, session_type, notes, tags (json), mood, created_at |
| `summaries` | id, user_id, period_start, period_end, content, problem_positions (json), created_at |
| `recommendations` | id, user_id, summary_id, youtube_url, title, channel, watched, liked, saved |
| `watchlist` | id, user_id, recommendation_id, added_at |

---

## 5. UX & Design Requirements

### 5.1 Design Principles
- **Speed first:** logging a session should take under 60 seconds
- **Mobile-first:** most users will log from their phone at the gym
- **Dark mode by default:** gyms are often dimly lit
- **Minimal friction:** fewer fields visible by default, more available on demand

### 5.2 Core Screens
- **Home / Dashboard:** streak, recent entries, latest AI summary card, top video rec
- **New Entry:** quick entry form with voice input button
- **Journal Feed:** chronological list of past entries with tag pills
- **AI Insights:** full weekly/monthly summary view with problem position breakdown
- **Recommendations:** video cards organized by position weakness
- **Profile / Settings:** instructor preferences, gi/no-gi toggle, export data

---

## 6. Development Plan

The app is scoped for a solo developer building in spare time. Phases are designed to be independently deployable — each phase produces something usable.

---

### Phase 1 — Foundation (Week 1–2)
**Goal: Working app with auth and journal CRUD. Can log sessions and view them.**

| Task | Details | Est. Time |
|------|---------|-----------|
| Project setup | Vite + React + TailwindCSS + Supabase init | 2 hrs |
| Supabase config | Create DB tables, Row Level Security policies | 2 hrs |
| Auth screens | Login, signup, Google OAuth via Supabase | 3 hrs |
| New entry form | Fields: date, type, notes, mood. Save to DB | 4 hrs |
| Journal feed | List view of past entries, basic filters | 3 hrs |
| Tag system | Hardcoded position tags, clickable pills on entry form | 2 hrs |
| Deploy to Vercel | CI/CD from GitHub | 1 hr |

**Phase 1 Total: ~17 hrs**

---

### Phase 2 — AI Core (Week 3–4)
**Goal: AI reads your journal and gives you a useful summary. The core value prop.**

| Task | Details | Est. Time |
|------|---------|-----------|
| Groq integration | API key setup, test call, error handling | 1 hr |
| Summary prompt design | Engineer prompt that reliably extracts problem positions | 3 hrs |
| Summary generation UI | Button to trigger analysis, loading state, display result | 3 hrs |
| Auto-tag suggestions | Send entry text to Groq, parse returned tags | 2 hrs |
| Summary storage | Save AI output to summaries table in Supabase | 1 hr |
| Gemini fallback | If Groq rate limited, retry with Gemini Flash | 2 hrs |
| Summary history view | List past summaries, click to expand | 2 hrs |

**Phase 2 Total: ~14 hrs**

---

### Phase 3 — Video Recommendations (Week 5–6)
**Goal: App automatically finds relevant YouTube tutorials based on your weaknesses.**

| Task | Details | Est. Time |
|------|---------|-----------|
| YouTube API setup | Google Cloud project, API key, quota monitoring | 1 hr |
| Query generation | AI converts problem positions into search queries | 2 hrs |
| YouTube search module | Call API, parse results, filter by instructor list | 3 hrs |
| Video card UI | Thumbnail, title, channel, duration, link to YouTube | 3 hrs |
| Feedback system | Watched, liked, disliked buttons with Supabase persistence | 2 hrs |
| Watchlist | Save videos to watchlist, dedicated watchlist screen | 2 hrs |
| Recommendation history | Don't re-show watched/disliked videos | 1 hr |

**Phase 3 Total: ~14 hrs**

---

### Phase 4 — Dashboard & Polish (Week 7–8)
**Goal: Make the app feel complete and worth opening daily.**

| Task | Details | Est. Time |
|------|---------|-----------|
| Training heatmap | GitHub-style calendar showing training frequency | 4 hrs |
| Position frequency chart | Bar chart of most-logged positions (Recharts) | 3 hrs |
| Streak tracker | Current + longest streak displayed on dashboard | 2 hrs |
| Voice-to-text entry | Web Speech API on mobile for post-training dictation | 3 hrs |
| Dark mode | Tailwind dark mode toggle, persisted in localStorage | 2 hrs |
| Data export | Download all entries as JSON or CSV | 2 hrs |
| Settings screen | Instructor prefs, gi/no-gi default, profile edit | 2 hrs |
| PWA config | Manifest + service worker so it installs on phone | 2 hrs |

**Phase 4 Total: ~20 hrs**

---

### Phase 5 — Optional Enhancements (Future)
- Opponent profiling: track tendencies of specific training partners
- Technique library: link journal entries to technique nodes
- Coach sharing: generate a shareable read-only summary for your coach
- Push notifications: Sunday summary reminder
- Competition mode: separate tracking for competition rolls vs. training

---

## 7. Setup & API Keys Checklist

| Service | What You Need | Where to Get It |
|---------|--------------|----------------|
| Supabase | Project URL + anon key | supabase.com → new project |
| Groq | API key | console.groq.com → API keys |
| Google Gemini | API key | aistudio.google.com |
| YouTube Data API v3 | API key | console.cloud.google.com → enable YouTube Data API |
| Vercel | Link GitHub repo | vercel.com → import project |

> All API keys should be stored in a `.env.local` file locally and as Vercel environment variables in production. **Never commit API keys to GitHub.**

---

## 8. Recommended Project Structure

```
rolliq/
  src/
    components/     → Reusable UI components
    pages/          → Dashboard, Journal, Insights, Recs, Settings
    hooks/          → useEntries, useSummary, useRecommendations
    lib/
      supabase.js   → Supabase client init
      groq.js       → Groq API calls + prompts
      youtube.js    → YouTube Data API wrapper
      gemini.js     → Gemini fallback
    store/          → Zustand state slices
    utils/          → Tag parsing, date helpers
  .env.local        → API keys (never commit)
  .env.example      → Template with blank values
```

---

## 9. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Groq rate limit hit | Medium | Gemini Flash fallback + client-side rate tracking |
| YouTube API quota exhausted | Low | Cache results in Supabase, don't re-query same weakness twice in a day |
| AI summary quality poor | Medium | Iteratively improve prompts, allow user to regenerate |
| Low retention (users forget to log) | High | PWA push notifications, daily reminder, quick entry mode |
| Supabase 500MB limit hit | Very Low | Journal text is small; 500MB supports ~2M entries |

---

*RollIQ PRD v1.0 — February 2026*
