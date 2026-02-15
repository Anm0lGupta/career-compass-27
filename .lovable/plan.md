

# SkillSync — AI Career Intelligence Platform

## Design Direction
Inspired by the HeadsIn Dribbble reference: clean, modern UI with soft gradients (purple/indigo accent palette), rounded cards, generous whitespace, and bold score numbers. Mobile-first with bottom navigation bar, desktop gets a top navbar with sidebar.

---

## Phase 1: Foundation & Auth
- **Landing page** — Hero with gradient headline "Your AI Career Reality Check", CTA buttons ("Try Demo" / "Sign Up"), 3 benefit cards (Reality Check • Role Fit • Roadmap), animated dashboard mockup
- **Auth system** (Supabase Auth) — Sign up/login with email, Google OAuth, GitHub OAuth, and a **Guest Demo** mode that loads a pre-built sample profile + scores
- **Bottom nav** (mobile) / **Top navbar** (desktop) — Upload, Dashboard, Roadmap, Profile tabs

## Phase 2: Onboarding & Resume Upload
- **3-step onboarding stepper** (mobile vertical, desktop side-by-side):
  1. Upload resume (drag & drop zone, accepts PDF/DOCX/TXT, paste text option)
  2. Add GitHub handle, LinkedIn URL, LeetCode handle (all optional)
  3. Select career goal (Internship / Full-time / Dream Role) + interest roles
- **Upload & parse screen** — Cards per source showing parsing status with skeleton loaders, parsed text preview (first 200 chars), edit button for corrections

## Phase 3: AI Scoring & Dashboard (Core Demo Flow)
- **Lovable AI edge function** processes resume text against role requirements, returns structured score JSON via tool calling
- **Dashboard** (the hero screen):
  - **ScoreCard** — Large circular score (0-100), percentile label ("Top 25%"), confidence badge (HIGH/MED/LOW)
  - **Breakdown metrics** — 4 mini cards (Lexical, Semantic, Project Depth, Experience) with progress bars
  - **Role Fit carousel** — Swipeable cards showing best-fit roles with match %
  - **Skills chips** — Matched (green) and Missing (red/amber) skill tags; tap missing → modal with learning resources
  - **Quick Roadmap** — 3 prioritized action cards with time estimates
  - **Integrity flags** — Green/red badges for repetition, copy detection

## Phase 4: Profile & Dream Role Mode
- **Profile page** — Full parsed resume viewer, matched skills with evidence, projects list with depth scores, GitHub summary (languages, activity), score history chart (Recharts)
- **Dream Role Mode** — Select target role + company → see current readiness %, critical gaps, week-by-week priority roadmap. "What-if" simulator: toggle a skill on/off and see score recalculate

## Phase 5: Roadmap & Learning Plan
- **Week-by-week plan** (4-8 weeks) with checkboxes for progress tracking
- Each item: task description, time estimate, difficulty badge, curated resource link
- Export to PDF button, shareable link

## Phase 6: Recruiter Dashboard
- **JD upload** — Paste or upload job description text
- **Weight sliders** — Adjust importance of lexical/semantic/project/experience scoring
- **Ranked candidate table** — Sortable, filterable, with score breakdowns and integrity flags
- **Export shortlist** as CSV

## Phase 7: Settings & Polish
- **Settings page** — Data export (CSV), data deletion (GDPR demo), privacy toggles, connected accounts management
- **Accessibility** — WCAG-compliant contrast ratios, ARIA labels, keyboard navigation, 44px+ touch targets
- **Responsive polish** — 360px mobile → 768px tablet → 1280px desktop breakpoints

---

## Database (Supabase)
- **profiles** — user_id, resume_text, github_handle, linkedin_url, leetcode_handle, primary_goal
- **scans** — user_id, score, percentile, result_json (full breakdown), status, created_at
- **job_descriptions** — user_id, title, jd_text (for recruiter flow)
- Auth via Supabase built-in (email + Google + GitHub OAuth)

## AI Integration (Lovable AI via Edge Functions)
- Edge function receives resume text + optional JD → calls Lovable AI with structured tool calling → returns score breakdown, matched/missing skills, roadmap suggestions, flags
- Guest demo mode uses hardcoded mock responses for instant demo without AI calls

## Demo Script (for judges)
1. Land on homepage → click "Try Demo" → instantly see a pre-scored dashboard
2. Sign up → upload a resume → watch it parse → see your real AI-generated score
3. Enter "Dream Role: Backend Engineer at Google" → see gaps + personalized roadmap
4. Switch to Recruiter view → paste a JD → see ranked candidates with adjustable weights
5. Export roadmap as PDF

