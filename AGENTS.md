# 🤖 AGENTS.md - AI Agent Guidelines

This file provides context, architecture, and guidelines for AI agents (like Claude, GPT, etc.) working on the Mermaid Studio Pro codebase.

---

## 📋 Project Overview

**Mermaid Studio Pro** is a modern React + TypeScript application for managing Mermaid diagrams. It was migrated from a legacy 2,190-line HTML file to a modern, maintainable architecture.

### Key Facts

- **Purpose**: Professional diagram management platform for developers and technical teams
- **Tech Stack**: React 18.3, TypeScript 5.5, Vite 5.4, TailwindCSS 3.4, Zustand
- **AI Integration**: Flow API (primary), OpenAI (fallback) for diagram generation
- **Storage**: LocalStorage (client-side persistence)
- **Deployment**: Netlify (automatic from `main` branch)
- **Languages**: English, Spanish, Portuguese (i18n support)

---

## 🏗️ Architecture

### Component Structure

```
src/
├── components/
│   ├── ai/               # AI assistant components
│   │   ├── AIAssistant.tsx      # Main AI panel
│   │   ├── AIButton.tsx         # Floating AI button
│   │   ├── ChatInterface.tsx    # Chat UI
│   │   ├── ChatMessage.tsx      # Individual messages
│   │   ├── QuickActions.tsx     # Pre-built prompts
│   │   └── DiffPreview.tsx      # Suggestion preview modal
│   ├── diagram/          # Diagram display and management
│   │   ├── DiagramGrid.tsx      # Main grid with pagination (12 per page)
│   │   └── DiagramCard.tsx      # Individual diagram cards
│   ├── layout/           # App layout and navigation
│   │   ├── Layout.tsx           # Main layout wrapper
│   │   ├── AppHeader.tsx        # Sticky header with logo, language, theme
│   │   ├── Header.tsx           # Welcome message section
│   │   ├── Toolbar.tsx          # Action buttons (Add, Export, Import, etc.)
│   │   └── SearchFilterBar.tsx  # Search and type filtering
│   ├── modals/           # Modal dialogs
│   │   ├── DiagramModal.tsx     # Add/Edit diagram modal
│   │   ├── DiagramForm.tsx      # Diagram creation/edit form
│   │   ├── InfoModal.tsx        # View diagram details
│   │   ├── EndpointFields.tsx   # API-specific fields
│   │   └── WorkflowFields.tsx   # Workflow-specific fields
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Modal.tsx
│   │   └── Pagination.tsx
│   └── zoom/             # Zoom/focus mode
│       └── ZoomModal.tsx        # Full-screen diagram viewer
├── contexts/             # React contexts
│   ├── ThemeContext.tsx         # Dark/light mode management
│   └── I18nContext.tsx          # Internationalization
├── hooks/                # Custom hooks
│   ├── useMermaidRenderer.ts   # Diagram rendering logic
│   ├── useDebouncedValue.ts    # Debounced search
│   └── useDiagramActions.ts    # Diagram CRUD operations
├── services/             # Business logic
│   ├── mermaid.service.ts      # Mermaid.js integration
│   ├── export.service.ts       # Export (JSON, SVG, PNG, ZIP)
│   ├── import.service.ts       # Import from JSON
│   └── storage.service.ts      # LocalStorage operations
├── store/                # Zustand state management
│   ├── diagramStore.ts         # Diagram data and filtering
│   ├── uiStore.ts              # UI state (modals, etc.)
│   └── renderStore.ts          # Rendering cache
├── types/                # TypeScript definitions
│   └── diagram.types.ts        # Diagram, Payload, etc.
└── utils/                # Utility functions
    ├── cn.ts                   # Class name utility
    └── diagram.utils.ts        # Diagram helpers
```

### State Management (Zustand)

**diagramStore.ts**
- `diagrams`: Array of all diagrams
- `filters`: Search term and type filter
- `metadata`: Total and filtered counts
- Actions: `addDiagram`, `updateDiagram`, `deleteDiagram`, `clearAll`, `setAll`, `setFilters`
- Computed: `filteredDiagrams()` - applies search and type filters

**uiStore.ts**
- `diagramModal`: { isOpen, editingDiagramId }
- `infoModal`: { isOpen, diagramId }
- `zoomModal`: { isOpen, diagramId }
- Actions: `openDiagramModal`, `closeDiagramModal`, `openInfoModal`, `closeInfoModal`, `openZoomModal`, `closeZoomModal`

**renderStore.ts**
- Caches rendered SVGs to avoid re-rendering
- Key: diagram code hash

---

## 🎨 Design System

### Colors

- **Primary**: Indigo/Purple gradient (`from-primary-500 to-purple-600`)
- **Success**: Emerald (`emerald-600`)
- **Danger**: Red (`red-600`)
- **Warning**: Amber (`amber-500`)
- **Info**: Blue (`blue-600`)

### Dark Mode

- All components support dark mode via `dark:` Tailwind classes
- Background: `dark:bg-gray-800`, `dark:bg-gray-900`
- Text: `dark:text-white`, `dark:text-gray-300`
- Borders: `dark:border-gray-700`
- Managed by `ThemeContext` with localStorage persistence

### Button Styles

- **Add Diagram**: Gradient with hover effects, icon rotation
- **Action Buttons**: Soft colored backgrounds with borders
- **Icon Buttons**: Consistent sizing (h-8 w-8, h-10 w-10, h-12 w-12)

---

## 📊 Diagram Types

### Core Types

1. **workflow** - Business process flows
2. **endpoint** - API/Endpoint documentation
3. **architecture** - System design
4. **sequence** - Interaction diagrams
5. **state** - State machines
6. **other** - General purpose

### Type-Specific Fields

**Endpoint/API**:
- `httpMethod`: GET, POST, PUT, PATCH, DELETE
- `endpointPath`: URL path (e.g., `/api/v1/users/{id}`)
- `requestPayloads`: Array of { status, contentType, json }
- `responsePayloads`: Array of { status, contentType, json }

**Workflow**:
- `workflowActors`: Comma-separated list of participants
- `workflowTrigger`: Event that initiates the workflow

---

## 🔧 Key Features Implementation

### Pagination

- **Location**: `DiagramGrid.tsx`
- **Items per page**: 12 (4 rows × 3 columns)
- **Component**: `Pagination.tsx`
- **Behavior**: Auto-resets to page 1 when filters change

### Search & Filter

- **Debounced search**: 300ms delay via `useDebouncedValue`
- **Searches**: Title, description, tags
- **Type filter**: Dropdown with all diagram types + "All Types"

### Zoom Modal

- **Features**: Pan, zoom, focus mode
- **Keyboard shortcuts**:
  - `+`/`-`: Zoom in/out
  - `0`: Reset zoom
  - `F`: Toggle focus mode
  - `Esc`: Close modal
- **Focus mode**: Hides all controls except close and focus toggle

### Dark Mode Diagram Visibility

- Diagrams are wrapped in white background (`bg-white p-2 rounded`)
- Ensures black text on sequence diagrams is always readable
- Applied in both card preview and zoom modal

---

## 🌍 Internationalization

### Structure

- **Context**: `I18nContext.tsx`
- **Locales**: `en`, `es`, `pt`
- **Storage**: localStorage key `locale`
- **Auto-detection**: Uses `navigator.language`

### Adding Translations

1. Open `src/contexts/I18nContext.tsx`
2. Add keys to all three language objects
3. Use `t('key')` in components via `useI18n()` hook

### Current Translations

- App title and subtitle
- Button labels (Add, Export, Import, Download, Clear)
- Search placeholder
- Filter labels
- Pagination text (Total, Showing, of)

---

## 🎯 Common Tasks

### Adding a New Diagram Type

1. Update `DiagramType` in `src/types/diagram.types.ts`
2. Add to `diagramTypeOptions` in `DiagramForm.tsx`
3. Add color to `typeColors` in `DiagramCard.tsx` and `InfoModal.tsx`
4. Add icon to `typeIcons` in `InfoModal.tsx`
5. (Optional) Create type-specific fields component

### Adding a New Export Format

1. Create export function in `src/services/export.service.ts`
2. Add button to `DiagramCard.tsx` export menu
3. Add toast notification for success/error

### Adding a New Language

1. Add language to `languages` array in `I18nContext.tsx`
2. Add translations object with all keys
3. Add flag emoji to language definition
4. Update `AppHeader.tsx` if needed

### Modifying the Header

- **Logo**: `public/mermaid-studio-logo.png`
- **Height**: `h-14` (56px)
- **Sticky**: `sticky top-0 z-50`
- **Components**: Logo, title, language selector, theme toggle

---

## ⚠️ Important Conventions

### Code Style

- **TypeScript**: Strict mode enabled, no implicit any
- **Components**: Functional components with hooks
- **Props**: Explicit interface definitions
- **Exports**: Named exports for components, default for pages
- **File naming**: PascalCase for components, camelCase for utilities

### Styling

- **TailwindCSS only**: No inline styles or CSS modules
- **Responsive**: Mobile-first approach
- **Dark mode**: Always add `dark:` variants
- **Animations**: Use Tailwind transitions, `group-hover:` for nested effects

### State Management

- **Zustand stores**: Keep stores focused and minimal
- **No prop drilling**: Use stores for global state
- **Local state**: Use `useState` for component-specific state
- **Computed values**: Use selectors or functions, not stored state

### Performance

- **Mermaid rendering**: Cached in `renderStore`
- **Debounced search**: 300ms delay
- **Pagination**: Only render current page items
- **Lazy loading**: Dynamic imports for heavy features (e.g., ZIP export)

---

## 🐛 Common Issues & Solutions

### Issue: Diagram not rendering

**Cause**: Invalid Mermaid syntax
**Solution**: Check `useMermaidRenderer` hook, displays error message

### Issue: Dark mode not applying

**Cause**: Missing `dark:` classes or `darkMode: 'class'` in Tailwind config
**Solution**: Ensure `tailwind.config.ts` has `darkMode: 'class'` and all components have dark variants

### Issue: Language not persisting

**Cause**: localStorage not saving
**Solution**: Check `I18nContext` `setLocale` function calls `localStorage.setItem`

### Issue: Pagination not resetting

**Cause**: Filter change not detected
**Solution**: Check `DiagramGrid` useEffect dependencies

### Issue: Modal z-index conflicts

**Cause**: Overlapping z-index values
**Solution**: Use z-50 for modals, z-[100] for dropdowns inside modals

---

## 📝 Testing Checklist

When making changes, verify:

- ✅ Works in light mode
- ✅ Works in dark mode
- ✅ Responsive on mobile, tablet, desktop
- ✅ All three languages display correctly
- ✅ LocalStorage persists data
- ✅ Export/import functions work
- ✅ Search and filters work
- ✅ Pagination works correctly
- ✅ Keyboard shortcuts work in zoom modal
- ✅ Toast notifications appear
- ✅ No TypeScript errors (`npm run type-check`)

---

## 🚀 Deployment

- **Platform**: Netlify
- **Branch**: `main` (auto-deploy)
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Node version**: 18+

---

## 📚 Key Dependencies

- **mermaid**: Diagram rendering engine
- **zustand**: State management (lightweight Redux alternative)
- **lucide-react**: Icon library (modern, tree-shakeable)
- **react-hot-toast**: Toast notifications
- **jszip**: ZIP file generation

---

## 💡 Best Practices for AI Agents

1. **Read before editing**: Always read files before making changes
2. **Preserve styling**: Match existing Tailwind patterns
3. **Dark mode**: Always add dark mode variants
4. **TypeScript**: Maintain strict typing, no `any`
5. **Responsive**: Test changes on multiple screen sizes
6. **Translations**: Add new text to all three languages
7. **Testing**: Verify in both light and dark modes
8. **Consistency**: Follow existing patterns and conventions
9. **Performance**: Consider render performance for large lists
10. **Accessibility**: Use semantic HTML and ARIA labels

---

## 🚀 Deployment & Testing

### Deployment Architecture

#### Local Development vs Production

| Component | Local Development | Production (Netlify) |
|-----------|------------------|----------------------|
| **Frontend** | Vite dev server (`:5173`) | Static files on Netlify CDN |
| **Backend** | Node.js proxy (`server/proxy.js` on `:3001`) | Netlify Functions (serverless) |
| **API Endpoint** | `http://localhost:3001/api/chat/completions` | `/api/chat/completions` |
| **Credentials** | `.env.local` file | Netlify environment variables |

#### Request Flow

**Local**: Browser → Frontend → Proxy Server → Flow API  
**Production**: Browser → Frontend → Netlify Function → Flow API

**Key Point**: `server/proxy.js` is LOCAL ONLY. In production, Netlify Functions (`netlify/functions/`) handle API proxying.

### Environment Variables

#### Required for Deployment

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```bash
FLOW_CLIENT_ID=<your-client-id>
FLOW_CLIENT_SECRET=<your-client-secret>
FLOW_APP_TO_ACCESS=llm-api
FLOW_TENANT=lithiadw
FLOW_AGENT=mermaid-studio
```

#### Optional Variables

```bash
VITE_OPENAI_API_KEY=<your-openai-key>  # Fallback AI provider
```

#### Local Development Setup

Create `.env.local` in project root (already in `.gitignore`):

```bash
# Backend Variables (NO VITE_ prefix)
FLOW_CLIENT_ID=your-client-id
FLOW_CLIENT_SECRET=your-client-secret
FLOW_APP_TO_ACCESS=llm-api
FLOW_TENANT=lithiadw
FLOW_AGENT=mermaid-studio

# Frontend Variables (MUST have VITE_ prefix)
VITE_OPENAI_API_KEY=your-openai-key
```

**Key Point**: Backend variables (used by `server/proxy.js` and `netlify/functions/`) should NOT have the `VITE_` prefix. Only frontend variables need `VITE_`.

### Deployment Process

1. **Commit code**: `git push` to `main` branch
2. **Netlify auto-deploys**: Builds frontend + deploys functions
3. **Configure env vars**: Add in Netlify dashboard (one-time setup)
4. **Verify**: Test `/api/health` endpoint

### Testing

#### Run Tests Locally

```bash
# Unit tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# Specific test file
npm test -- ai.utils.test.ts
```

#### Test AI Integration Locally

```bash
# Start proxy server (Terminal 1)
cd server
npm start

# Start frontend (Terminal 2)
npm run dev

# Test authentication (Terminal 3)
node server/test-auth.js
```

#### Test Production Deployment

```bash
# Health check
curl https://your-site.netlify.app/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

### Netlify Functions

Located in `netlify/functions/`:
- **`chat-completions.js`**: Main AI proxy (handles Flow API auth + requests)
- **`health.js`**: Health check endpoint

These are serverless functions that:
- Run on AWS Lambda (managed by Netlify)
- Only execute when called (pay-per-use)
- Have access to environment variables
- Cache authentication tokens for performance

### Security Model

**Why use proxy/functions?**
- ❌ **Bad**: Store credentials in frontend → Exposed in browser
- ✅ **Good**: Store credentials on server → Never exposed to client

Both `server/proxy.js` (local) and `netlify/functions/` (production) keep credentials secure on the server side.

### Troubleshooting Deployment

**"Function not found"**
- Check `netlify.toml` has `functions = "netlify/functions"`
- Verify files exist in `netlify/functions/` directory

**"Missing environment variables"**
- Add `FLOW_CLIENT_ID` and `FLOW_CLIENT_SECRET` in Netlify dashboard
- Redeploy after adding variables

**"Authentication failed"**
- Verify credentials are correct
- Check `FLOW_TENANT` is set to `lithiadw`
- Test locally with `node server/test-auth.js`

**CORS errors**
- Functions already include CORS headers (`Access-Control-Allow-Origin: *`)
- Check browser console for specific error

---

## 🔗 Related Files

- **README.md**: User-facing documentation
- **package.json**: Dependencies and scripts
- **netlify.toml**: Netlify configuration (functions, redirects)
- **server/**: Local development proxy server
- **netlify/functions/**: Production serverless functions

---

## 📧 Questions?

If you're an AI agent and encounter ambiguity:
1. Check this file first
2. Review existing similar implementations
3. Follow established patterns
4. Ask the user for clarification if truly uncertain

---

**Last Updated**: 2025-01-22
**Version**: 2.0.0 (Modern React implementation with AI integration)
