# 🌊 Mermaid Studio Pro

<div align="center">

**A modern, professional application for creating, managing, and exporting Mermaid diagrams with enterprise-grade features.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)

</div>

---

## 📖 Overview

Mermaid Studio Pro is a comprehensive diagram management platform that transforms the way you create, organize, and share Mermaid diagrams. Built with modern web technologies, it offers a seamless experience for developers, architects, and technical teams who need to document systems, workflows, and processes.

### Why Mermaid Studio Pro?

- 🎨 **Beautiful UI**: Modern, gradient-based design with smooth animations
- 🤖 **AI-Powered**: Generate, modify, and explain diagrams with AI assistance
- 🌙 **Dark Mode**: Full dark theme support for comfortable viewing
- 🌍 **Internationalization**: Support for English, Spanish, and Portuguese
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- 💾 **Local Storage**: Your diagrams are saved automatically in your browser
- 🔍 **Advanced Search**: Find diagrams quickly with powerful filtering
- 🎯 **Focus Mode**: Distraction-free diagram viewing
- 📊 **Type-Specific Fields**: Special metadata for API endpoints and workflows

---

## ✨ Features

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

---

## 🛠️ Tech Stack

### Core Technologies

- **[React 18.3](https://reactjs.org/)** - UI library with hooks and concurrent features
- **[TypeScript 5.5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite 5.4](https://vitejs.dev/)** - Lightning-fast build tool and dev server

### Styling & UI

- **[TailwindCSS 3.4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful, consistent icons
- **Custom Gradients** - Modern, eye-catching color schemes

### State Management & Data

- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight state management
- **LocalStorage API** - Client-side data persistence
- **Custom Hooks** - Reusable logic for rendering, debouncing, and more

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

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mermaid-studio.git
cd mermaid-studio

# Install dependencies
npm install

# Install proxy server dependencies (for AI features)
cd server
npm install
cd ..

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Start proxy server (Terminal 1)
cd server
npm start

# Start development server (Terminal 2)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Important:** The AI features require a proxy server to handle Flow API requests. See [PROXY-SETUP.md](./PROXY-SETUP.md) for detailed setup instructions.

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
│   │   ├── layout/          # Layout components (Header, Toolbar)
│   │   ├── modals/          # Modal dialogs
│   │   ├── ui/              # Reusable UI components
│   │   └── zoom/            # Zoom modal components
│   ├── contexts/            # React contexts (Theme, i18n)
│   ├── hooks/               # Custom React hooks
│   ├── services/            # Business logic
│   │   ├── ai/              # AI service layer
│   │   │   ├── providers/   # AI provider implementations
│   │   │   └── prompts/     # System prompts
│   │   ├── export.service.ts
│   │   ├── import.service.ts
│   │   └── mermaid.service.ts
│   ├── store/               # Zustand stores
│   │   ├── aiStore.ts       # AI state management
│   │   ├── diagramStore.ts
│   │   └── uiStore.ts
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main app component
│   ├── env.d.ts             # Environment variable types
│   └── main.tsx             # App entry point
├── docs/                     # Documentation
│   ├── ai/                  # AI implementation guides
│   └── legacy-index.html    # Original HTML implementation
├── .env.local                # Environment variables (not in git)
├── AGENTS.md                 # AI agent guidelines
├── README.md                 # This file
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
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

This project is automatically deployed to Netlify from the `main` branch.

Visit: [https://mermaid-studio.netlify.app](https://mermaid-studio.netlify.app)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write TypeScript with proper types
- Use Tailwind CSS for styling
- Test in both light and dark modes
- Ensure responsive design works on all screen sizes
- Add translations for new UI text

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
