# Mermaid Studio Pro - Modernization & Enhancement Guide

## 📋 Table of Contents
1. [Current State Analysis](#current-state-analysis)
2. [Recommended Tech Stack](#recommended-tech-stack)
3. [Project Structure](#project-structure)
4. [Migration Strategy](#migration-strategy)
5. [Implementation Phases](#implementation-phases)
6. [Suggested Features & Enhancements](#suggested-features--enhancements)
7. [Development Setup](#development-setup)
8. [Testing Strategy](#testing-strategy)

---

## 🔍 Current State Analysis

### Current Architecture
- **Single HTML file** (~1500 lines)
- **Inline CSS** (~800 lines)
- **Inline JavaScript** (~2000 lines)
- **No build process**
- **No module system**
- **No version control for dependencies**
- **No testing framework**
- **localStorage only** (no cloud sync)

### What's Working Well ✅
- Clean, functional UI
- Good UX with drag-and-drop, zoom controls
- Comprehensive feature set
- Offline-first approach
- No external dependencies (self-contained)

### Pain Points ⚠️
- Hard to maintain (everything in one file)
- No code reusability
- Difficult to test
- No TypeScript (type safety)
- Manual dependency management
- No component isolation
- CSS is not scoped
- No hot module replacement during development

---

## 🚀 Recommended Tech Stack

### Core Framework: **Vite + React + TypeScript**

**Why this stack?**
- ✅ **Vite**: Lightning-fast dev server, optimized builds, modern tooling
- ✅ **React**: Component-based, huge ecosystem, easy to find developers
- ✅ **TypeScript**: Type safety, better IDE support, fewer runtime errors
- ✅ **Tailwind CSS**: Utility-first CSS (you're already using similar patterns)
- ✅ **Zustand**: Lightweight state management (simpler than Redux)

### Alternative Stacks (Consider if preferred)

#### Option B: **Vite + Vue 3 + TypeScript**
- Similar benefits, slightly different syntax
- Composition API is very clean
- Good if team prefers Vue

#### Option C: **Next.js + React + TypeScript**
- If you need SSR/SSG in the future
- Built-in routing
- Better for SEO (if that matters)

#### Option D: **Astro + React Islands**
- Best performance (ships minimal JS)
- Component framework agnostic
- Great for mostly static content

### Recommended Supporting Libraries

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "mermaid": "^10.6.1",
    "zustand": "^4.5.0",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.400.0",
    "jszip": "^3.10.1",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "vitest": "^1.6.0",
    "@testing-library/react": "^16.0.0",
    "eslint": "^8.57.0",
    "prettier": "^3.3.0"
  }
}
```

---

## 📁 Project Structure

### Proposed Directory Structure

```
mermaid-studio-pro/
├── public/
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   └── SearchFilterBar.tsx
│   │   │
│   │   ├── diagram/
│   │   │   ├── DiagramCard.tsx
│   │   │   ├── DiagramGrid.tsx
│   │   │   ├── DiagramPreview.tsx
│   │   │   └── DiagramExportMenu.tsx
│   │   │
│   │   ├── modals/
│   │   │   ├── DiagramModal.tsx
│   │   │   ├── DiagramForm.tsx
│   │   │   ├── EndpointFields.tsx
│   │   │   ├── WorkflowFields.tsx
│   │   │   └── PayloadEditor.tsx
│   │   │
│   │   ├── zoom/
│   │   │   ├── ZoomModal.tsx
│   │   │   ├── ZoomControls.tsx
│   │   │   ├── ZoomCanvas.tsx
│   │   │   ├── Minimap.tsx
│   │   │   └── KeyboardHelp.tsx
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Textarea.tsx
│   │       ├── Modal.tsx
│   │       └── Toast.tsx
│   │
│   ├── hooks/
│   │   ├── useDiagrams.ts
│   │   ├── useZoom.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMermaidRenderer.ts
│   │   └── useKeyboardShortcuts.ts
│   │
│   ├── store/
│   │   ├── diagramStore.ts
│   │   ├── uiStore.ts
│   │   └── zoomStore.ts
│   │
│   ├── services/
│   │   ├── diagramService.ts
│   │   ├── exportService.ts
│   │   ├── importService.ts
│   │   └── storageService.ts
│   │
│   ├── types/
│   │   ├── diagram.types.ts
│   │   ├── export.types.ts
│   │   └── ui.types.ts
│   │
│   ├── utils/
│   │   ├── diagram.utils.ts
│   │   ├── file.utils.ts
│   │   ├── validation.utils.ts
│   │   └── cn.ts (classname utility)
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   └── integration/
│       └── components/
│
├── .env.example
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## 🔄 Migration Strategy

### Phase 1: Setup & Foundation (Week 1)

#### 1.1 Initialize Vite + React + TypeScript Project

```bash
# Create new Vite project
npm create vite@latest mermaid-studio-pro-v2 -- --template react-ts
cd mermaid-studio-pro-v2

# Install dependencies
npm install mermaid zustand react-hot-toast lucide-react jszip clsx tailwind-merge

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Install linting tools
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-react
```

#### 1.2 Configure Tailwind CSS

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
    },
  },
  plugins: [],
}
```

**src/styles/globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gradient-to-br from-primary-500 to-purple-600 min-h-screen;
  }
}
```

#### 1.3 Setup TypeScript Types

**src/types/diagram.types.ts:**
```typescript
export type DiagramType = 'workflow' | 'endpoint' | 'architecture' | 'sequence' | 'state' | 'other';

export interface Payload {
  status: string;
  contentType: string;
  json: string;
}

export interface Diagram {
  name: string;
  title: string;
  description?: string;
  code: string;
  type: DiagramType;
  tags?: string;
  createdAt: string;
  updatedAt: string;
  
  // Endpoint-specific
  httpMethod?: string;
  endpointPath?: string;
  requestPayloads?: Payload[];
  responsePayloads?: Payload[];
  
  // Workflow-specific
  workflowActors?: string;
  workflowTrigger?: string;
}

export interface DiagramFilters {
  searchTerm: string;
  typeFilter: DiagramType | 'all';
}
```

### Phase 2: Core Components (Week 2)

#### 2.1 Create State Management

**src/store/diagramStore.ts:**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Diagram, DiagramFilters } from '../types/diagram.types';

interface DiagramStore {
  diagrams: Diagram[];
  filters: DiagramFilters;
  selectedDiagram: Diagram | null;
  
  // Actions
  addDiagram: (diagram: Diagram) => void;
  updateDiagram: (index: number, diagram: Diagram) => void;
  deleteDiagram: (index: number) => void;
  setFilters: (filters: Partial<DiagramFilters>) => void;
  setSelectedDiagram: (diagram: Diagram | null) => void;
  clearAll: () => void;
  
  // Computed
  filteredDiagrams: () => Diagram[];
}

export const useDiagramStore = create<DiagramStore>()(
  persist(
    (set, get) => ({
      diagrams: [],
      filters: { searchTerm: '', typeFilter: 'all' },
      selectedDiagram: null,
      
      addDiagram: (diagram) => 
        set((state) => ({ 
          diagrams: [...state.diagrams, diagram] 
        })),
      
      updateDiagram: (index, diagram) =>
        set((state) => ({
          diagrams: state.diagrams.map((d, i) => 
            i === index ? diagram : d
          ),
        })),
      
      deleteDiagram: (index) =>
        set((state) => ({
          diagrams: state.diagrams.filter((_, i) => i !== index),
        })),
      
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      
      setSelectedDiagram: (diagram) =>
        set({ selectedDiagram: diagram }),
      
      clearAll: () => set({ diagrams: [] }),
      
      filteredDiagrams: () => {
        const { diagrams, filters } = get();
        return diagrams.filter((diagram) => {
          const matchesSearch = 
            diagram.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            (diagram.description || '').toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            (diagram.tags || '').toLowerCase().includes(filters.searchTerm.toLowerCase());
          
          const matchesType = 
            filters.typeFilter === 'all' || diagram.type === filters.typeFilter;
          
          return matchesSearch && matchesType;
        });
      },
    }),
    {
      name: 'mermaid-diagrams-storage',
    }
  )
);
```

#### 2.2 Create Mermaid Renderer Hook

**src/hooks/useMermaidRenderer.ts:**
```typescript
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

export const useMermaidRenderer = (code: string, containerId?: string) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code) {
        setSvg('');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const id = containerId || `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, code);
        setSvg(renderedSvg);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      } finally {
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [code, containerId]);

  return { svg, error, isLoading, containerRef };
};
```

#### 2.3 Create Reusable UI Components

**src/components/ui/Button.tsx:**
```typescript
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-lg',
    secondary: 'bg-slate-600 text-white hover:bg-slate-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={twMerge(clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      ))}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};
```

### Phase 3: Feature Migration (Week 3-4)

#### 3.1 Migrate Core Features

**Priority Order:**
1. ✅ Diagram listing and rendering
2. ✅ Create/Edit diagram modal
3. ✅ Search and filters
4. ✅ Export functionality (SVG, PNG, JSON)
5. ✅ Import functionality
6. ✅ Zoom modal with controls
7. ✅ Keyboard shortcuts
8. ✅ Toast notifications

#### 3.2 Create Service Layer

**src/services/exportService.ts:**
```typescript
import JSZip from 'jszip';
import { Diagram } from '../types/diagram.types';

export class ExportService {
  static async exportToSVG(diagram: Diagram, svgElement: SVGElement): Promise<void> {
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    this.downloadBlob(blob, `${diagram.name}.svg`);
  }

  static async exportToPNG(diagram: Diagram, svgElement: SVGElement): Promise<void> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    const svgRect = svgElement.getBoundingClientRect();
    const scale = 2;
    canvas.width = svgRect.width * scale;
    canvas.height = svgRect.height * scale;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (blob) {
            this.downloadBlob(blob, `${diagram.name}.png`);
            resolve();
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        });
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  static async exportToJSON(diagrams: Diagram[]): Promise<void> {
    const dataStr = JSON.stringify(diagrams, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    this.downloadBlob(blob, 'mermaid-diagrams-backup.json');
  }

  static async exportAllToZip(diagrams: Diagram[], svgElements: Map<string, SVGElement>): Promise<void> {
    const zip = new JSZip();

    diagrams.forEach((diagram) => {
      const svg = svgElements.get(diagram.name);
      if (svg) {
        const svgString = new XMLSerializer().serializeToString(svg);
        zip.file(`${diagram.name}.svg`, svgString);
      }
    });

    zip.file('diagrams-metadata.json', JSON.stringify(diagrams, null, 2));

    const content = await zip.generateAsync({ type: 'blob' });
    this.downloadBlob(content, 'mermaid-diagrams.zip');
  }

  private static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
```

### Phase 4: Testing & Quality (Week 5)

#### 4.1 Unit Tests Example

**tests/unit/utils/diagram.utils.test.ts:**
```typescript
import { describe, it, expect } from 'vitest';
import { generateFilename, validateDiagramCode } from '../../../src/utils/diagram.utils';

describe('diagram.utils', () => {
  describe('generateFilename', () => {
    it('should convert title to lowercase kebab-case', () => {
      expect(generateFilename('My Diagram Title')).toBe('my-diagram-title');
    });

    it('should remove special characters', () => {
      expect(generateFilename('User@#$%Flow!')).toBe('user-flow');
    });

    it('should handle multiple spaces', () => {
      expect(generateFilename('Test    Diagram')).toBe('test-diagram');
    });
  });

  describe('validateDiagramCode', () => {
    it('should return true for valid mermaid code', () => {
      const code = 'graph TD\n    A[Start] --> B[End]';
      expect(validateDiagramCode(code)).toBe(true);
    });

    it('should return false for empty code', () => {
      expect(validateDiagramCode('')).toBe(false);
    });
  });
});
```

#### 4.2 Component Tests Example

**tests/integration/components/DiagramCard.test.tsx:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DiagramCard } from '../../../src/components/diagram/DiagramCard';
import { Diagram } from '../../../src/types/diagram.types';

describe('DiagramCard', () => {
  const mockDiagram: Diagram = {
    name: 'test-diagram',
    title: 'Test Diagram',
    description: 'Test description',
    code: 'graph TD\n    A --> B',
    type: 'workflow',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('should render diagram title', () => {
    render(<DiagramCard diagram={mockDiagram} index={0} />);
    expect(screen.getByText('Test Diagram')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<DiagramCard diagram={mockDiagram} index={0} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByTitle('Edit Diagram'));
    expect(onEdit).toHaveBeenCalledWith(0);
  });

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<DiagramCard diagram={mockDiagram} index={0} onDelete={onDelete} />);
    
    fireEvent.click(screen.getByTitle('Delete Diagram'));
    expect(onDelete).toHaveBeenCalledWith(0);
  });
});
```

---

## ✨ Suggested Features & Enhancements

### High Priority (MVP+)

#### 1. **Cloud Sync & Collaboration**
- [ ] Firebase/Supabase integration for cloud storage
- [ ] User authentication (Google, GitHub OAuth)
- [ ] Real-time collaboration (multiple users editing)
- [ ] Sharing diagrams via public links
- [ ] Team workspaces

**Estimated Effort:** 2-3 weeks  
**Value:** High - enables team collaboration

#### 2. **Version History & Diff Viewer**
- [ ] Track diagram versions (git-like)
- [ ] Compare different versions side-by-side
- [ ] Restore previous versions
- [ ] Show who made changes and when

**Estimated Effort:** 1-2 weeks  
**Value:** High - prevents data loss, improves auditability

#### 3. **Template Library**
- [ ] Pre-built diagram templates for common use cases
- [ ] Category organization (API, Workflow, Architecture, etc.)
- [ ] Community-contributed templates
- [ ] Custom template creation and sharing

**Estimated Effort:** 1 week  
**Value:** Medium - speeds up diagram creation

#### 4. **Advanced Search & Filtering**
- [ ] Full-text search across diagram content
- [ ] Filter by date range (created, modified)
- [ ] Filter by tags (multiple tag support)
- [ ] Saved search queries
- [ ] Regex search support

**Estimated Effort:** 1 week  
**Value:** High - improves discoverability

#### 5. **Diagram Collections/Folders**
- [ ] Organize diagrams into folders/projects
- [ ] Nested folder structure
- [ ] Drag-and-drop to move diagrams
- [ ] Bulk operations (move, delete, export)

**Estimated Effort:** 1-2 weeks  
**Value:** High - better organization for large teams

### Medium Priority

#### 6. **AI-Powered Features**
- [ ] Generate Mermaid code from natural language descriptions
- [ ] Suggest diagram improvements
- [ ] Auto-generate documentation from diagrams
- [ ] Diagram complexity analysis

**Estimated Effort:** 2-3 weeks  
**Value:** High - cutting-edge feature, big differentiator

#### 7. **Integration with Documentation Tools**
- [ ] Export to Confluence
- [ ] Export to Notion
- [ ] Export to Markdown with embedded diagrams
- [ ] GitHub README integration
- [ ] Slack/Teams bot for sharing

**Estimated Effort:** 2 weeks  
**Value:** High - fits into existing workflows

#### 8. **Advanced Export Options**
- [ ] Export to PDF with multiple diagrams
- [ ] Export to PowerPoint slides
- [ ] Batch export (all diagrams at once)
- [ ] Custom export templates
- [ ] Watermark support

**Estimated Effort:** 1 week  
**Value:** Medium - enhances presentation capabilities

#### 9. **Diagram Analytics**
- [ ] View count tracking
- [ ] Last viewed timestamp
- [ ] Most popular diagrams
- [ ] Usage statistics dashboard
- [ ] Export analytics

**Estimated Effort:** 1 week  
**Value:** Low-Medium - useful insights

#### 10. **Comments & Annotations**
- [ ] Add comments to specific diagram nodes
- [ ] Discussion threads
- [ ] @mentions for team members
- [ ] Resolved/Unresolved comment status

**Estimated Effort:** 2 weeks  
**Value:** Medium - improves collaboration

### Low Priority (Nice-to-Have)

#### 11. **Diagram Validation & Linting**
- [ ] Validate Mermaid syntax in real-time
- [ ] Suggest best practices
- [ ] Style guide enforcement
- [ ] Complexity warnings

**Estimated Effort:** 1 week  
**Value:** Low - improves diagram quality

#### 12. **Theming & Customization**
- [ ] Multiple color themes (dark, light, custom)
- [ ] Custom Mermaid themes
- [ ] Font customization
- [ ] Grid/snap-to-grid options

**Estimated Effort:** 1 week  
**Value:** Low - aesthetic improvements

#### 13. **Keyboard Shortcuts Customization**
- [ ] Custom keyboard shortcut mapping
- [ ] Import/Export shortcut configs
- [ ] Vim-like navigation mode

**Estimated Effort:** 3-4 days  
**Value:** Low - power user feature

#### 14. **Diagram Embedding Widget**
- [ ] Embeddable iframe for external sites
- [ ] WordPress plugin
- [ ] Browser extension for quick diagram creation

**Estimated Effort:** 1-2 weeks  
**Value:** Low-Medium - expands reach

#### 15. **Offline PWA Support**
- [ ] Full PWA with offline caching
- [ ] Background sync when online
- [ ] Install as desktop app

**Estimated Effort:** 3-4 days  
**Value:** Medium - improves accessibility

---

## 🛠️ Development Setup

### Initial Setup Commands

```bash
# Clone the new repository
git clone https://github.com/gsifuentes-ciandt/mermaid-studio-pro-v2.git
cd mermaid-studio-pro-v2

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Environment Variables

**Create `.env.example`:**
```env
# App Configuration
VITE_APP_NAME="Mermaid Studio Pro"
VITE_APP_VERSION="2.0.0"

# Cloud Sync (if implementing)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id

# Analytics (if implementing)
VITE_GOOGLE_ANALYTICS_ID=your_ga_id

# Feature Flags
VITE_ENABLE_CLOUD_SYNC=false
VITE_ENABLE_AI_FEATURES=false
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 🧪 Testing Strategy

### Test Coverage Goals
- **Unit Tests:** 80%+ coverage
- **Integration Tests:** Key user flows
- **E2E Tests:** Critical paths (optional)

### Testing Pyramid

```
       /\
      /  \    E2E Tests (5-10%)
     /----\   - Full user workflows
    /      \  
   /--------\ Integration Tests (20-30%)
  /          \ - Component interactions
 /------------\ 
/______________\ Unit Tests (60-70%)
                 - Utils, services, hooks
```

### Key Test Scenarios

1. **Diagram CRUD Operations**
   - Create new diagram
   - Edit existing diagram
   - Delete diagram
   - Duplicate diagram

2. **Search & Filter**
   - Search by title
   - Filter by type
   - Combined search + filter

3. **Export/Import**
   - Export to JSON
   - Import from JSON
   - Export to SVG/PNG
   - Batch export to ZIP

4. **Zoom Controls**
   - Zoom in/out
   - Pan around
   - Fit to screen
   - Keyboard navigation

---

## 📊 Migration Checklist

### Pre-Migration
- [ ] Backup current production data (export all diagrams)
- [ ] Document current feature list
- [ ] Set up new repository
- [ ] Configure CI/CD pipeline

### During Migration
- [ ] Create new Vite project
- [ ] Set up TypeScript configuration
- [ ] Install dependencies
- [ ] Create folder structure
- [ ] Migrate types
- [ ] Migrate state management
- [ ] Migrate components (one by one)
- [ ] Migrate utilities
- [ ] Write tests
- [ ] Update documentation

### Post-Migration
- [ ] Deploy to staging environment
- [ ] User acceptance testing
- [ ] Performance testing
- [ ] Migrate localStorage data (migration script)
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Gather user feedback

---

## 🚀 Deployment Strategy

### Recommended: Netlify + GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build
        env:
          VITE_APP_VERSION: ${{ github.sha }}
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Alternative: Vercel
- Zero-config deployment
- Automatic preview deployments for PRs
- Edge functions support (if needed)

---

## 📈 Success Metrics

### Performance Targets
- [ ] Lighthouse Score: 90+ (all categories)
- [ ] First Contentful Paint: < 1.5s
- [ ] Time to Interactive: < 3s
- [ ] Bundle size: < 500KB (gzipped)

### Quality Targets
- [ ] Test coverage: > 80%
- [ ] Zero TypeScript errors
- [ ] Zero ESLint warnings
- [ ] 100% Prettier formatted

### User Experience Targets
- [ ] Loading states for all async operations
- [ ] Error boundaries for graceful error handling
- [ ] Keyboard navigation support
- [ ] Mobile responsive (tablet support)

---

## 🎯 Implementation Priority Order

### Phase 1: Foundation (Week 1-2)
1. ✅ Project setup (Vite + React + TypeScript)
2. ✅ State management (Zustand)
3. ✅ Basic UI components
4. ✅ Mermaid rendering hook

### Phase 2: Core Features (Week 3-4)
5. ✅ Diagram grid with cards
6. ✅ Create/Edit modal
7. ✅ Search and filters
8. ✅ Export/Import

### Phase 3: Advanced Features (Week 5-6)
9. ✅ Zoom modal with full controls
10. ✅ Keyboard shortcuts
11. ✅ Testing setup
12. ✅ Documentation

### Phase 4: Enhancements (Week 7+)
13. 🔄 Cloud sync (if needed)
14. 🔄 Version history
15. 🔄 Template library
16. 🔄 AI features

---

## 💡 Best Practices

### Code Quality
- **Always use TypeScript** - no `any` types
- **Write tests first** for critical logic (TDD)
- **Use ESLint + Prettier** - enforce code style
- **Component composition** - small, reusable components
- **Custom hooks** - extract reusable logic
- **Error boundaries** - graceful error handling

### Performance
- **Lazy load** components with React.lazy
- **Memoization** - use React.memo, useMemo, useCallback
- **Virtualization** - use react-window for large lists
- **Code splitting** - split by route
- **Optimize images** - use WebP, lazy loading

### Accessibility
- **Semantic HTML** - use proper elements
- **ARIA labels** - for screen readers
- **Keyboard navigation** - all actions keyboard accessible
- **Color contrast** - WCAG AA compliant
- **Focus management** - visible focus indicators

---

## 📚 Resources & References

### Documentation
- [Vite Guide](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Mermaid Documentation](https://mermaid.js.org/)

### Tools
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/) (works with Zustand)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## 🤝 Getting Help

### For AI-Assisted Development
This guide is optimized for feeding to AI assistants like:
- **Claude** (Anthropic)
- **Cursor** (AI Code Editor)
- **GitHub Copilot**
- **ChatGPT** (with code interpreter)

### Prompt Template for AI
```
I'm migrating a single-file HTML application to a modern React + TypeScript stack using Vite.

Current state: [describe current file/component]
Target: [describe what you want to build]

Please follow the structure and patterns described in the Mermaid Studio Pro Modernization Guide.

Use:
- TypeScript with strict types
- Zustand for state management
- Tailwind CSS for styling
- Functional components with hooks
- Component composition pattern

[Your specific request]
```

---

## ✅ Final Checklist

Before considering migration complete:

- [ ] All features from v1 working in v2
- [ ] Data migration script tested
- [ ] Performance benchmarks met
- [ ] Tests passing (80%+ coverage)
- [ ] Documentation updated
- [ ] Deployed to production
- [ ] User training materials created
- [ ] Rollback plan documented
- [ ] Monitoring set up
- [ ] Team onboarded

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Maintained by:** Gabriel Sifuentes  
**For questions or suggestions, contact:** gsifuentes@ciandt.com

---

*This guide is designed to be fed to AI assistants for automated code generation and refactoring. Each section contains detailed specifications that AI can use to generate production-ready code.*