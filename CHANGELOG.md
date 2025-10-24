# Changelog

All notable changes to Mermaid Studio Pro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2025-10-23

### 🎉 Major Release: Multi-User Collaboration

This release transforms Mermaid Studio from a single-user local app to a full-featured collaborative platform with cloud storage and team features.

### Added

#### Collaboration Features
- **Multi-User Projects** - Create and share projects with team members
- **Role-Based Permissions** - Owner, Admin, Editor, and Viewer roles
- **Project Sharing** - Invite users via email with customizable roles
- **Share Links** - Generate shareable links for project access
- **Team Management** - View and manage project members
- **Folder Hierarchy** - Organize diagrams in nested folders
- **Drag-and-Drop** - Reorder folders with drag-and-drop

#### Authentication & Security
- **Google OAuth** - Sign in with Google account
- **Supabase Backend** - Cloud database and authentication
- **Row Level Security** - Database-level access control
- **Security Definer Functions** - Prevent RLS recursion
- **User Profiles** - Automatic profile creation on signup

#### User Experience
- **User Menu** - Profile, preferences, and sign out
- **Settings Page** - Manage API credentials and preferences
- **Project Dashboard** - View all your projects
- **Project Header** - Quick access to settings and sharing
- **Responsive Design** - Mobile-friendly sidebar and navigation
- **Dark Mode** - Full dark mode support for all new components
- **i18n Ready** - Prepared for English, Spanish, and Portuguese

#### Performance
- **UserContext** - Cached user state (70% reduction in API calls)
- **Optimized Permissions** - Instant permission checks
- **Better State Management** - Eliminated race conditions
- **Loading States** - Proper loading indicators

### Changed

#### Architecture
- **Migrated from localStorage to Supabase** - Cloud-based storage
- **Zustand Stores** - Added `projectStore` and `uiStore`
- **Service Layer** - New services for projects, folders, invitations
- **Type System** - New types for collaboration features

#### UI/UX
- **New Dashboard** - Replaced single-page app with project dashboard
- **Project-Based Navigation** - Navigate between projects
- **Folder Sidebar** - Collapsible folder navigation
- **Mobile Drawer** - Mobile-friendly folder access
- **Improved Modals** - Better modal system for all actions

### Fixed

#### Database
- **RLS Recursion** - Fixed infinite recursion with security definer function
- **Avatar Sync** - Automatic avatar URL syncing from auth metadata
- **Duplicate Diagrams** - Fixed diagram duplication issues
- **Trigger Conflicts** - Resolved trigger deletion issues

#### State Management
- **Stale Diagram State** - Fixed diagrams showing from wrong folder
- **Excessive API Calls** - Reduced from 20+ to 6 `/user` calls
- **Permission Checks** - Eliminated redundant permission checks
- **Race Conditions** - Better async state handling

#### UI
- **Viewer Permissions** - Viewers cannot edit/delete content
- **Owner Controls** - Only owners see settings and delete options
- **Role Dropdowns** - Hidden for non-owners in share modal
- **Avatar Display** - Fixed avatar display for all users
- **Folder Menu** - Hidden for viewers

### Security

- **Row Level Security** - All tables protected with RLS policies
- **API Credentials** - Encrypted storage of user API keys
- **Access Control** - Proper permission checks at database level
- **Security Definer** - Safe bypass of RLS for specific operations

---

## [1.0.0] - 2025-10-15

### Initial Release

#### Core Features
- **Diagram Management** - Create, edit, delete Mermaid diagrams
- **Diagram Types** - Workflow, Endpoint, Architecture, Sequence, State
- **Export** - JSON, SVG, PNG, ZIP formats
- **Import** - JSON import with validation
- **Search & Filter** - Search by title, description, tags
- **Pagination** - 12 diagrams per page
- **Dark Mode** - Full dark mode support
- **i18n** - English, Spanish, Portuguese support

#### AI Features
- **AI Assistant** - Chat-based diagram generation
- **Flow API** - Primary AI provider
- **OpenAI Fallback** - Backup AI provider
- **Quick Actions** - Pre-built diagram templates
- **Diff Preview** - Preview AI suggestions before applying

#### UI/UX
- **Modern Design** - Gradient buttons, smooth animations
- **Responsive** - Mobile, tablet, desktop support
- **Keyboard Shortcuts** - Cmd/Ctrl+K for AI
- **Zoom Modal** - Full-screen diagram viewer
- **Info Modal** - Detailed diagram information

---

## Upgrade Guide

### From 1.0.0 to 2.0.0

#### Breaking Changes

1. **Data Migration Required**
   - Old diagrams stored in localStorage
   - Need to export and import into new projects
   - Or use migration script (if available)

2. **Authentication Required**
   - Must sign in with Google to use the app
   - No more anonymous local usage

3. **API Credentials**
   - Now stored per-user in database
   - Need to re-enter API credentials in Settings

#### Migration Steps

1. **Export Old Data** (Before Upgrading)
   ```
   1. Open old version
   2. Click "Export JSON"
   3. Save all diagrams
   ```

2. **Upgrade to 2.0.0**
   ```
   1. Pull latest code
   2. Run npm install
   3. Set up Supabase (see docs)
   4. Deploy or run locally
   ```

3. **Import Data**
   ```
   1. Sign in with Google
   2. Create a new project
   3. Create folders
   4. Import JSON files
   ```

---

## Roadmap

### Planned Features

#### v2.1.0 - Enhanced Collaboration
- [ ] Real-time collaboration
- [ ] Diagram comments and annotations
- [ ] Activity feed
- [ ] Notifications

#### v2.2.0 - Version Control
- [ ] Diagram version history
- [ ] Restore previous versions
- [ ] Compare versions
- [ ] Branch and merge diagrams

#### v2.3.0 - Team Features
- [ ] Team workspaces
- [ ] Team analytics
- [ ] Usage statistics
- [ ] Billing and subscriptions

#### v3.0.0 - Advanced Features
- [ ] Custom diagram templates
- [ ] Diagram library
- [ ] Public diagram sharing
- [ ] Embed diagrams in websites

---

## Support

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues
- **Email**: support@mermaidstudio.com (if applicable)

---

## Contributors

- Gabriel Sifuentes (@gsifuentes)
- AI Assistant (Cascade)

---

## License

[Your License Here]

---

**Thank you for using Mermaid Studio Pro!** 🎉
