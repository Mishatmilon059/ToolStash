# 🌌 AI Memory (ToolStash)

**Your personal AI tool discovery companion — powered by a built-in AI assistant.**

AI Memory is a platform to effortlessly save, organize, and track AI tools. Paste a link or drop a screenshot, and the built-in AI auto-categorizes, tags, and links your content—minimizing manual data entry.

## ✨ Key Features
- **🤖 Built-in AI Assistant:** Auto-categorizes, tags, and generates descriptions for saved tools.
- **🔗 Smart Link Paste:** Paste any link; the app auto-detects the platform and extracts necessary info.
- **📸 Quick Capture:** Upload screenshots or text notes for seamless context saving.
- **📦 Dashboard & Analytics:** Track your saved tools, media, and learning progress.

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite 7, Tailwind CSS v4, Framer Motion, Recharts
- **Backend:** Supabase (Auth, PostgreSQL, Storage)

## 📁 Folder Structure
```text
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── supabase_setup.sql
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A [Supabase](https://supabase.com/) project

### Setup Instructions

1. **Clone & Install**
   ```bash
   git clone <your-repo-url>
   cd ai-memory/client
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `client/` directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Database Setup**
   Run `supabase_setup.sql` in your Supabase SQL Editor to initialize tables and RLS policies.

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:5173`.

## 📄 License
Private and not currently licensed for distribution.
