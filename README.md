# 💬 SlakChat

A real-time chat application built with React, TypeScript, and Supabase — inspired by Slack.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-realtime-green?logo=supabase)
![Chakra UI](https://img.shields.io/badge/Chakra_UI-v3-teal?logo=chakraui)

---

## ✨ Features

- 🔐 **Authentication** — Register and sign in with email
- 💬 **Real-time messaging** — Messages appear instantly
- 📢 **Channels** — Create, delete, and switch between channels
- 👤 **User profiles** — Username and avatar support
- 🗑️ **Message deletion** — Delete your own messages in real-time
- 👥 **User list** — See all registered users in the sidebar
- ⏰ **Message timestamps** — Formatted with Day.js

---

## 🛠️ Tech Stack

| Technology                                   | Usage                     |
| -------------------------------------------- | ------------------------- |
| [React 18](https://react.dev)                | UI framework              |
| [TypeScript](https://www.typescriptlang.org) | Type safety               |
| [Vite 4](https://vitejs.dev)                 | Build tool                |
| [Supabase](https://supabase.com)             | Database, Auth, Real-time |
| [Chakra UI v3](https://chakra-ui.com)        | UI components             |
| [Lucide React](https://lucide.dev)           | Icons                     |
| [Day.js](https://day.js.org)                 | Time formatting           |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- A Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/username/slakchat.git
cd slakchat

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

Run the following SQL in the Supabase SQL Editor:

```sql
-- Tables
create table channels (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamptz default now()
);

create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  updated_at timestamptz default now()
);

create table messages (
  id uuid default gen_random_uuid() primary key,
  channel_id uuid references channels(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Default channels
insert into channels (name) values ('general'), ('random');

-- Row Level Security
alter table channels enable row level security;
alter table messages enable row level security;
alter table profiles enable row level security;

create policy "Anyone can view channels" on channels for select using (true);
create policy "Authenticated users can create channels" on channels for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can delete channels" on channels for delete using (auth.role() = 'authenticated');

create policy "Anyone can view messages" on messages for select using (true);
create policy "Authenticated users can send messages" on messages for insert with check (auth.uid() = user_id);
create policy "Users can only delete their own messages" on messages for delete using (auth.uid() = user_id);

create policy "Anyone can view profiles" on profiles for select using (true);
create policy "Users can create their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile on user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Run the App

```bash
npm run dev
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/
│   ├── Chat/
│   ├── AddChannelModal/
│   └── AvatarComponent/
├── hooks/
│   ├── useGetChannels.ts
│   ├── useGetMessages.ts
│   ├── useGetUsers.ts
│   ├── useProfile.ts
│   ├── useAddChannels.ts
│   ├── useRemoveChannel.ts
│   └── useRemoveMessages.ts
├── lib/
│   └── supabase.ts
├── models/
│   └── api.ts
└── App.tsx
```

---

## 📄 License

MIT
