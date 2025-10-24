# 🌊 Mermaid Studio Pro

<div align="center">

**A modern, cloud-based collaboration platform for creating, managing, and sharing Mermaid diagrams with your team.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e.svg)](https://supabase.com/)

**Version 2.0** - Now with Multi-User Collaboration! 🎉

</div>

---

## 📖 Overview

Mermaid Studio Pro is a cloud-based collaboration platform that transforms the way teams create, organize, and share Mermaid diagrams. Built with modern web technologies and powered by Supabase, it offers a seamless experience for developers, architects, and technical teams who need to document systems, workflows, and processes together.

### Why Mermaid Studio Pro?

- 🤝 **Team Collaboration**: Share projects with role-based permissions (Owner, Admin, Editor, Viewer)
- 🗂️ **Project Organization**: Organize diagrams in projects and nested folders
- ☁️ **Cloud Storage**: All diagrams stored securely in PostgreSQL database
- 🔐 **Secure Authentication**: Sign in with Google OAuth
- 🎨 **Beautiful UI**: Modern, gradient-based design with smooth animations
- 🤖 **AI-Powered**: Generate, modify, and explain diagrams with AI assistance
- 🌙 **Dark Mode**: Full dark theme support for comfortable viewing
- 🌍 **Internationalization**: Support for English, Spanish, and Portuguese
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- 🔍 **Advanced Search**: Find diagrams quickly with powerful filtering
- 🎯 **Focus Mode**: Distraction-free diagram viewing

---

## ✨ Features

### 🤝 Collaboration (NEW in v2.0)

- **Multi-User Projects**: Create and share projects with your team
- **Role-Based Permissions**: Control access with Owner, Admin, Editor, and Viewer roles
- **Project Sharing**: Invite team members via email
- **Folder Hierarchy**: Organize diagrams in nested folders
- **Drag & Drop**: Reorder folders with intuitive drag-and-drop
- **Team Dashboard**: View all your projects in one place
- **User Preferences**: Per-user AI credentials and settings
- **Secure Access**: Row-level security at the database level

### 🤖 AI Assistant

- **Generate Diagrams**: Create diagrams from natural language descriptions
- **Modify Diagrams**: Ask AI to update existing diagrams with new requirements
- **Explain Diagrams**: Get clear explanations of complex diagram logic
- **Quick Actions**: Pre-built prompts for common diagram types
- **Keyboard Shortcut**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open AI assistant
- **Multi-language Support**: AI responses in English, Spanish, and Portuguese
- **Preview & Accept**: Review AI suggestions before adding them to your collection

### 🎨 Diagram Management

- **Multiple Diagram Types**: Workflow, Endpoint/API, Architecture, Sequence, State Machine, and Other
- **Rich Metadata**: Add titles, descriptions, tags, and type-specific information
- **Search & Filter**: Find diagrams by title, description, tags, or type
- **Pagination**: Clean navigation through large diagram collections (12 per page)
- **CRUD Operations**: Create, read, update, and delete diagrams with ease

### 🔌 API/Endpoint Diagrams

- **HTTP Method & Path**: Document your API endpoints
- **Request Payloads**: Multiple request examples with status and content type
- **Response Payloads**: Color-coded responses (green for 2xx, red for 4xx/5xx)
- **JSON Preview**: Formatted JSON payloads for easy reading

### 📄 Workflow Diagrams

- **Actors/Participants**: Define who's involved in the process
- **Trigger Events**: Document what initiates the workflow
- **Visual Process Mapping**: Clear representation of business processes

### 🔍 Advanced Viewing

- **Zoom Modal**: Full-screen diagram viewing with pan and zoom
- **Focus Mode**: Hide all controls for distraction-free viewing (press `F`)
- **Keyboard Shortcuts**: 
  - `+` / `-` : Zoom in/out
  - `0` : Reset zoom
  - `F` : Toggle focus mode
  - `Esc` : Close modal
- **Click & Drag**: Pan around large diagrams
- **White Background**: Diagrams always have proper contrast for readability

### 💾 Import/Export

- **JSON Export**: Export all diagrams as structured JSON
- **JSON Import**: Import diagrams from JSON files
- **SVG Export**: Download individual diagrams as SVG
- **PNG Export**: Export diagrams as high-quality PNG images
- **Bulk Download**: Download all diagrams as a ZIP archive

### 🎨 User Interface

- **Modern Design**: Gradient backgrounds, smooth animations, and polished components
- **Dark Mode**: Complete dark theme with proper contrast
- **Sticky Header**: Navigation always accessible
- **Responsive Layout**: Adapts to any screen size
- **Toast Notifications**: Clear feedback for all actions
- **Loading States**: Visual feedback during operations

### 🌍 Internationalization (i18n)

- **English** 🇺🇸
- **Español** 🇪🇸
- **Português** 🇧🇷
- Auto-detects browser language
- Persistent language preference
- i18n ready for collaboration features

---

## 🛠️ Tech Stack

### Core Technologies

- **[React 18.3](https://reactjs.org/)** - UI library with hooks and concurrent features
- **[TypeScript 5.5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite 5.4](https://vitejs.dev/)** - Lightning-fast build tool and dev server
- **[React Router 6](https://reactrouter.com/)** - Client-side routing

### Backend & Database

- **[Supabase](https://supabase.com/)** - PostgreSQL database and authentication
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database with RLS
- **Row Level Security** - Database-level access control
- **Google OAuth** - Secure authentication

### Styling & UI

- **[TailwindCSS 3.4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful, consistent icons
- **Custom Gradients** - Modern, eye-catching color schemes

### State Management & Data

- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight state management
- **React Context** - User state caching and theme management
- **Custom Hooks** - Reusable logic for rendering, permissions, and more

### Diagram Rendering

- **[Mermaid.js](https://mermaid.js.org/)** - Powerful diagram rendering engine
- **SVG Output** - Scalable, high-quality diagrams

### AI & Data Processing

- **[Zod](https://zod.dev/)** - Runtime type validation for API responses
- **[React Markdown](https://remarkjs.github.io/react-markdown/)** - Markdown rendering for AI responses
- **[React Syntax Highlighter](https://react-syntax-highlighter.github.io/react-syntax-highlighter/)** - Code syntax highlighting

### Additional Libraries

- **[React Hot Toast](https://react-hot-toast.com/)** - Beautiful notifications
- **[JSZip](https://stuk.github.io/jszip/)** - ZIP file generation for bulk downloads

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Supabase account (free tier available)
- Google Cloud Console account (for OAuth)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/mermaid-studio.git
cd mermaid-studio

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase and API keys

# Start development server
npm run dev
```

### Full Setup (with Collaboration)

For complete setup instructions including Supabase configuration and Google OAuth:

📖 **See [docs/collaboration/SETUP-GUIDE.md](docs/collaboration/SETUP-GUIDE.md)**

Setup time: ~30-45 minutes

### Development Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript type checking
```

### Development Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript type checking
```

---

## 📁 Project Structure

```
mermaid-studio/
├── public/                    # Static assets
│   └── mermaid-studio-logo.png
├── src/
│   ├── components/           # React components
│   │   ├── ai/              # AI assistant components
│   │   ├── diagram/         # Diagram-related components
│   │   ├── folders/         # Folder management components
│   │   ├── layout/          # Layout components
│   │   ├── modals/          # Modal dialogs
│   │   ├── projects/        # Project components
│   │   ├── sharing/         # Share modal and invitation
│   │   ├── ui/              # Reusable UI components
│   │   └── zoom/            # Zoom modal components
│   ├── contexts/            # React contexts
│   │   ├── ThemeContext.tsx # Dark mode management
│   │   ├── I18nContext.tsx  # Internationalization
│   │   └── UserContext.tsx  # User state caching
│   ├── hooks/               # Custom React hooks
│   │   ├── useProjectPermissions.ts
│   │   ├── useMermaidRenderer.ts
│   │   └── useDebouncedValue.ts
│   ├── pages/               # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── ProjectPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/            # Business logic
│   │   ├── ai/              # AI service layer
│   │   ├── auth.service.ts  # Authentication
│   │   ├── project.service.ts
│   │   ├── folder.service.ts
│   │   ├── invitation.service.ts
│   │   └── supabase.ts      # Supabase client
│   ├── store/               # Zustand stores
│   │   ├── aiStore.ts
│   │   ├── diagramStore.ts
│   │   ├── projectStore.ts
│   │   └── uiStore.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── diagram.types.ts
│   │   └── collaboration.types.ts
│   ├── AppRouter.tsx        # Main router
│   └── main.tsx             # App entry point
├── docs/                     # Documentation
│   ├── collaboration/       # Collaboration guides
│   │   ├── SETUP-GUIDE.md
│   │   ├── I18N-GUIDE.md
│   │   └── PERMISSIONS.md
│   ├── database/            # Database schema and fixes
│   │   └── DATABASE_SCHEMA.sql
│   ├── deployment/          # Deployment guides
│   └── development/         # Development guides
├── .env.local                # Environment variables (not in git)
├── AGENTS.md                 # AI agent guidelines
├── CHANGELOG.md              # Version history
├── README.md                 # This file
└── package.json              # Dependencies and scripts
```

---

## 🎯 Usage Examples

### Using AI to Generate Diagrams

1. Press **`Cmd+K`** (Mac) or **`Ctrl+K`** (Windows/Linux) to open AI assistant
2. Type a natural language description, e.g., "Create a user login workflow diagram"
3. Review the AI-generated diagram preview
4. Click **"Accept & Add Diagram"** to add it to your collection
5. Or use **Quick Actions** for common diagram types

### Creating a Workflow Diagram Manually

1. Click **"Add Diagram"** button
2. Select **"Workflow"** type
3. Add title, description, and tags
4. Fill in actors and trigger event
5. Paste your Mermaid code
6. Click **"Create Diagram"**

### Viewing Diagram Details

1. Click the **Info (ℹ️)** button on any diagram card
2. View metadata, tags, and type-specific information
3. See the full Mermaid code
4. For API diagrams, review request/response payloads

### Exporting Diagrams

- **Individual**: Click the download button on a card, choose SVG or PNG
- **Bulk JSON**: Click "Export JSON" in the toolbar
- **All as ZIP**: Click "Download All" to get a ZIP with all diagrams

---

## 🌙 Dark Mode

Dark mode is fully supported throughout the application:

- Toggle via the moon/sun icon in the header
- Preference is saved to localStorage
- Respects system preference on first load
- All components have proper dark mode styling

---

## 🌍 Internationalization

The app supports multiple languages:

- **Auto-detection**: Detects browser language on first visit
- **Manual selection**: Click the language dropdown in the header
- **Persistent**: Language preference is saved
- **Extensible**: Easy to add new languages in `src/contexts/I18nContext.tsx`

---

## 🚀 Deployment

This project is configured for Netlify deployment.

### Deployment Steps:

1. **Set up Supabase** (see [docs/collaboration/SETUP-GUIDE.md](docs/collaboration/SETUP-GUIDE.md))
2. **Configure Google OAuth** with production redirect URIs
3. **Add environment variables** to Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Push to main branch** - Netlify auto-deploys

📖 **Full deployment guide**: [docs/deployment/NETLIFY.md](docs/deployment/NETLIFY.md)

### Cost

- **Supabase**: Free tier (500MB DB, 50K MAU)
- **Netlify**: Free tier (100GB bandwidth)
- **Total**: $0/month for MVP

---

## 📚 Documentation

- **[AGENTS.md](AGENTS.md)** - AI agent guidelines and project conventions
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes
- **[docs/collaboration/SETUP-GUIDE.md](docs/collaboration/SETUP-GUIDE.md)** - Complete setup instructions
- **[docs/collaboration/I18N-GUIDE.md](docs/collaboration/I18N-GUIDE.md)** - Internationalization guide
- **[docs/deployment/NETLIFY.md](docs/deployment/NETLIFY.md)** - Deployment guide
- **[docs/database/DATABASE_SCHEMA.sql](docs/database/DATABASE_SCHEMA.sql)** - Database schema

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Read **[AGENTS.md](AGENTS.md)** for project conventions
- Follow the existing code style
- Write TypeScript with proper types
- Use Tailwind CSS for styling
- Test in both light and dark modes
- Ensure responsive design works on all screen sizes
- Add translations for new UI text (EN, ES, PT)
- Test with different user roles (Owner, Admin, Editor, Viewer)

---

## 📝 License

MIT

---

## 🙏 Acknowledgments

- [Mermaid.js](https://mermaid.js.org/) - Amazing diagram rendering
- [Lucide](https://lucide.dev/) - Beautiful icon set
- [TailwindCSS](https://tailwindcss.com/) - Excellent utility-first CSS
- [Zustand](https://github.com/pmndrs/zustand) - Simple state management

---

<div align="center">

**Made with ❤️ by the Mermaid Studio Team**

⭐ Star us on GitHub if you find this useful!

</div>
