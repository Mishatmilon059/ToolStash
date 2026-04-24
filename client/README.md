# 🌌 AI Memory (ToolStash)

**Your personal AI tool discovery companion — powered by a built-in AI assistant that organizes everything for you.**

AI Memory helps you save AI tools you discover, log your experiences with them, and store context media (reels, screenshots, notes) — with **zero friction**. Just paste a link or drop a screenshot and the AI handles the rest: auto-categorizing, tagging, linking, and maintaining your entire knowledge base so you never have to. Wrapped in a sleek, neon-cyberpunk interface.

---

## 🧠 Core Philosophy

> **Less clicking. Less typing. More discovering.**
>
> AI Memory is designed so that the **user does as little manual work as possible**. The built-in AI assistant handles organization, categorization, tagging, and linking — you just feed it raw content and it takes care of the rest.

---

## ✨ Features

### 🤖 Built-in AI Assistant — "Your Personal Organizer"
> The beating heart of AI Memory. The assistant runs behind the scenes to keep your library clean, organized, and useful — so you don't have to.

- **Auto-categorization** — When you save a tool, the AI figures out its category (Image Generation, Code Assistant, Chatbot, Video, Audio, etc.)
- **Auto-tagging** — Generates relevant tags automatically based on the tool's name, description, and your usage context
- **Smart linking** — Connects media (reels, screenshots, notes) to the correct tools without you selecting anything manually
- **Description generation** — If you only provide a name or link, the AI fills in a useful description
- **Status suggestions** — Nudges you to update tools from `new` → `tried` → `useful` based on your activity

### 🔗 Smart Link Paste — "Just Paste It"
> Saving a tool should be as easy as pasting a link. No forms, no dropdowns, no friction.

**How it works:**
1. Paste any link into the input bar (Instagram reel, YouTube video, Facebook post, Twitter/X thread, TikTok, website URL, etc.)
2. The app **auto-detects the platform** and shows the platform icon
3. You're asked **only one thing**: _"What's the AI tool name?"_
4. The AI assistant takes over: it fills in the description, category, tags, and links the media entry to the tool automatically

### 📸 Quick Capture — "Drop It In"
- **Upload a screenshot** — Drop an image/screenshot of the AI tool
- **Upload a photo** — Snap a picture of an AI tool's interface
- **Paste plain text** — Jot down a quick note or thought

### 📦 Dashboard & Analytics
- **My Stash**: Browse your personal library of saved AI tools
- **Context Memory**: Save the **why** behind each AI tool (reels, screenshots)
- **Learning Progress**: Personal growth metrics, charts, and milestones tracking your AI tool exploration

---

## 🛠️ Tech Stack

| Layer        | Technology                                                      |
| ------------ | --------------------------------------------------------------- |
| **Framework**| [React 19](https://react.dev/) + [Vite 7](https://vite.dev/)    |
| **Styling**  | [Tailwind CSS v4](https://tailwindcss.com/)                     |
| **Animations**| [Framer Motion](https://www.framer.com/motion/)                |
| **Charts**   | [Recharts](https://recharts.org/)                               |
| **Icons**    | [Lucide React](https://lucide.dev/)                             |
| **Routing**  | [React Router v7](https://reactrouter.com/)                     |
| **Backend**  | [Supabase](https://supabase.com/) (Auth, PostgreSQL, Storage)   |

---

## 📁 Project Structure

```text
client/
├── public/
│   └── vite.svg                        # Favicon
├── src/
│   ├── assets/                         # Static assets (images, icons)
│   ├── components/                     # Reusable React components
│   │   ├── dashboard/                  # Dashboard charts and metrics
│   │   ├── guide/                      # Interactive learning guides
│   │   ├── layout/                     # App shell, Sidebar, Protected routes
│   │   ├── media/                      # Media gallery and preview modals
│   │   ├── tools/                      # Tool cards and Smart Save modal
│   │   └── ui/                         # Generic UI elements (Buttons, Inputs)
│   ├── context/
│   │   └── AuthContext.jsx             # Supabase Auth state provider
│   ├── hooks/                          # Custom React hooks
│   │   ├── useGuide.js                 # Checklist data logic
│   │   ├── useMedia.js                 # Media CRUD operations
│   │   ├── useMockData.js              # Fallback mock data
│   │   ├── useStats.js                 # Analytics calculations
│   │   └── useTools.js                 # AI tools CRUD operations
│   ├── lib/
│   │   └── supabase.js                 # Supabase client initialization
│   ├── pages/                          # Main route pages
│   │   ├── AdminDashboard.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Guide.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── Media.jsx
│   │   ├── Signup.jsx
│   │   └── Stats.jsx
│   ├── App.jsx                         # Root application router
│   ├── index.css                       # Global Tailwind CSS and design tokens
│   └── main.jsx                        # Application entry point
├── .env                                # Environment variables (Not committed)
├── eslint.config.js                    # ESLint configuration
├── package.json                        # Dependencies and scripts
├── supabase_setup.sql                  # Database migration script
└── vite.config.js                      # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm (comes with Node.js)
- A [Supabase](https://supabase.com/) project

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-memory/client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `client/` directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up the Database

Run the SQL in `supabase_setup.sql` inside the **Supabase SQL Editor** to create the required tables (`ai_tools`, `media`, `guide_progress`) and Row Level Security policies.

### 5. Start the Dev Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔮 Roadmap

### 🚧 In Progress
- [ ] **AI Assistant Integration** — Core intelligence layer: auto-categorize, auto-tag, auto-link, and auto-describe tools
- [ ] **Smart Link Paste** — One-field input that auto-detects platform and asks only for the tool name
- [ ] **Quick Capture** — Drop text, screenshots, or photos with zero mandatory fields

### 📋 Planned
- [ ] **Image/Screenshot OCR** — Extract AI tool names and descriptions from uploaded screenshots automatically
- [ ] **AI Chat Interface** — Conversational assistant to ask questions about your stash
- [ ] **Smart Notifications** — AI nudges to try new tools, update statuses, or revisit forgotten saves
- [ ] **Supabase Storage Integration** — Upload and serve media files directly
- [ ] **Real Authentication** — Remove dev bypass, enable full Supabase Auth flow
- [ ] **Mobile Responsive Sidebar** — Hamburger menu and bottom navigation for mobile

### 💡 Vision
- [ ] **Voice Notes** — Record quick audio notes about a tool; AI transcribes and organizes
- [ ] **Browser Extension** — Save tools directly from any browser tab with one click
- [ ] **Collaborative Stash** — Share and discover tools with friends or community

---

## 📄 License

This project is private and not currently licensed for distribution.
