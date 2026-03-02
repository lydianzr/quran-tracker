# 📖 Quran Tracker

A personal Quran reading tracker web app built with React and Supabase.

## Features

- Log daily reading sessions by page number
- Two logging modes — "read until page X" or "read X pages"
- Auto-fills from your last recorded page with validation
- Stats dashboard — latest page, juz completed, day streak
- Current surah display with Arabic name
- Juz progress bar
- Full reading history with edit and delete
- User authentication — each user sees only their own data
- PWA support — installable on mobile and desktop

## Tech Stack

- **React** + **Vite** — frontend
- **Tailwind CSS v4** — styling
- **Supabase** — database + authentication

## Getting Started

1. Clone the repo
```bash
   git clone https://github.com/lydianzr/quran-tracker.git
   cd quran-tracker
```

2. Install dependencies
```bash
   npm install
```

3. Create a `.env` file in the root folder
```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the dev server
```bash
   npm run dev
```

## Database Setup

Run this in your Supabase SQL Editor:
```sql
create table readings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  date date not null,
  time time not null,
  page_from int not null,
  page_to int not null,
  created_at timestamp default now()
);

alter table readings enable row level security;

create policy "Users can view own readings" on readings for select using (auth.uid() = user_id);
create policy "Users can insert own readings" on readings for insert with check (auth.uid() = user_id);
create policy "Users can update own readings" on readings for update using (auth.uid() = user_id);
create policy "Users can delete own readings" on readings for delete using (auth.uid() = user_id);
```

## Deployment

Deployed on **Vercel**. Every push to `main` triggers an automatic redeploy.