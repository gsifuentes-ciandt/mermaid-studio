# 🤖 AGENTS.md - AI Agent Guidelines

This file provides context, architecture, and guidelines for AI agents (like Claude, GPT, etc.) working on the Mermaid Studio Pro codebase.

---

## 📋 Project Overview

**Mermaid Studio Pro** is a modern React + TypeScript application for managing Mermaid diagrams. It was migrated from a legacy 2,190-line HTML file to a modern, maintainable architecture.

### Key Facts

- **Purpose**: Professional diagram management platform for developers and technical teams
- **Tech Stack**: React 18.3, TypeScript 5.5, Vite 5.4, TailwindCSS 3.4, Zustand
- **Storage**: LocalStorage (client-side persistence)
- **Deployment**: Netlify (automatic from `main` branch)
- **Languages**: English, Spanish, Portuguese (i18n support)

---

## 🏗️ Architecture

### Component Structure

```
src/
├── components/
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

## 🔗 Related Files

- **README.md**: User-facing documentation
- **mermaid-studio-modernization.md**: Migration guide from legacy HTML
- **docs/legacy-index.html**: Original implementation (reference only)

---

## 📧 Questions?

If you're an AI agent and encounter ambiguity:
1. Check this file first
2. Review existing similar implementations
3. Follow established patterns
4. Ask the user for clarification if truly uncertain

---

**Last Updated**: 2025-01-09
**Version**: 2.0.0 (Modern React implementation)
