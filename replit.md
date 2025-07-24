# Deuce Diary

## Overview

Deuce Diary is a full-stack web application built as a social platform for sharing bathroom thoughts within groups. The app uses a modern tech stack with React frontend, Express.js backend, and PostgreSQL database with Drizzle ORM. It features real-time communication through WebSockets and is designed as a mobile-first progressive web app. Recent enhancements include time-based deuce logging, dynamic location management, and improved invite system.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes
- **404 error fix implemented** - Fixed session expiration handling to prevent 404 errors when users return after being away
- **Improved authentication flow** - Enhanced routing logic to handle expired sessions gracefully with clear messaging
- **Invite link bug fix** - Fixed error when group creators click their own invite links, now shows proper "already a member" message
- **Profile picture upload feature implemented** - Users can now upload and update profile pictures from their profile page
- **Image processing system added** - Automatic image resizing to 200x200px and optimization as JPEG files
- **Emoji reactions feature implemented** - Users can now react to deuce logs with common emojis (👍, ❤️, 😂, 😮, 😢, 😡, 🔥, 👏)
- **Personal records added** - Members section now shows each user's best deuce day with date and count
- **Username editing feature implemented** - Users can now set and edit usernames from profile page

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Real-time Updates**: WebSocket client for live notifications

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: express-session with PostgreSQL store
- **WebSocket Server**: Built-in WebSocket server for real-time features
- **API Design**: RESTful API with JSON responses

### Database Architecture
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Schema Location**: `shared/schema.ts` for type safety across frontend/backend
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Authentication System
- **Provider**: Replit Auth for user authentication
- **Session Storage**: PostgreSQL-backed sessions table
- **User Management**: Automatic user creation/updates on login
- **Authorization**: Middleware-based route protection

### Group Management
- **Group Creation**: Users can create groups with name and description
- **Member Management**: Invite-based membership system
- **Role System**: Creator role for group administration
- **Invite Links**: Time-limited invite links for group joining

### Content System
- **Deuce Entries**: Main content type for bathroom thoughts with time-based logging
- **Multi-Group Logging**: Users can select multiple groups when logging a deuce, posting the same entry to all selected groups simultaneously
- **Location Management**: Dynamic location system with 8 default locations and user-created custom locations
- **Time Logging**: Users can specify the actual date and time of their deuce experience
- **Thoughts**: Text-based content with optional thoughts
- **Group Association**: Entries can belong to multiple groups through multi-group selection
- **Emoji Reactions**: Users can react to any deuce entry with emojis, see reaction counts and remove reactions
- **Personal Records**: Track each user's best deuce day showing date and count in group member lists

### User Profile System
- **Username Management**: Users can set and edit custom usernames from their profile page
- **Display Priority**: Username takes precedence over firstName/lastName when available
- **Consistent Display**: All user interfaces show usernames consistently across the app
- **Validation**: Username must be 3-20 characters, letters/numbers/spaces/underscores allowed
- **Uniqueness**: Usernames must be unique across all users

### Real-time Features
- **WebSocket Server**: Integrated with HTTP server
- **Live Notifications**: Real-time alerts for new entries
- **Group Updates**: Live member count and activity updates
- **Connection Management**: Automatic reconnection handling

### User Interface
- **Mobile-First**: Responsive design optimized for mobile devices
- **Bottom Navigation**: Tab-based navigation for core features
- **Modal System**: Overlay-based forms for actions
- **Notification System**: Toast notifications and banner alerts
- **Theme Support**: Light/dark mode capability

## Data Flow

### Authentication Flow
1. User clicks login → Redirects to Replit Auth
2. Successful auth → Creates/updates user in database
3. Session stored in PostgreSQL → User redirected to app
4. Protected routes check authentication middleware

### Content Creation Flow
1. User opens "Log Deuce" modal
2. Selects multiple groups via checkboxes, location, and enters thoughts
3. POST request to `/api/deuces` endpoint with groupIds array
4. Server creates entries for each selected group and broadcasts WebSocket messages
5. All members in each selected group receive real-time notifications
6. UI updates with new entry data and shows success message with group count

### Group Management Flow
1. User creates group → Automatically becomes group creator
2. Creator generates invite link → Time-limited token created
3. Invite shared → New users click link and join group
4. Member list updates → Real-time member count updates

### Real-time Updates
1. WebSocket connection established on authentication
2. User joins group rooms for targeted messaging
3. Actions trigger WebSocket broadcasts to relevant groups
4. Frontend receives messages and updates UI accordingly

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: WebSocket-based connection pooling
- **Environment**: DATABASE_URL environment variable required

### Authentication
- **Replit Auth**: OpenID Connect provider
- **Configuration**: REPL_ID, ISSUER_URL, SESSION_SECRET required
- **Domains**: REPLIT_DOMAINS for security configuration

### UI Components
- **Radix UI**: Accessible component primitives
- **Lucide Icons**: SVG icon library
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form validation and management

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Type checking and compilation
- **ESBuild**: Production bundling for server
- **Replit Plugins**: Development environment integration

## Deployment Strategy

### Development
- **Server**: `npm run dev` starts tsx development server
- **Client**: Vite dev server with HMR
- **Database**: `npm run db:push` for schema changes
- **Environment**: NODE_ENV=development

### Production
- **Build Process**: 
  1. `vite build` creates optimized client bundle
  2. `esbuild` bundles server code for Node.js
  3. Static files served from `dist/public`
- **Server**: `npm start` runs compiled server
- **Environment**: NODE_ENV=production
- **Database**: Automatic migration on deployment

### File Structure
- **Client**: `client/` directory with React app
- **Server**: `server/` directory with Express app
- **Shared**: `shared/` directory for common types and schemas
- **Build Output**: `dist/` directory for production assets

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit environment identifier
- `ISSUER_URL`: OpenID Connect issuer URL (optional)
- `REPLIT_DOMAINS`: Allowed domains for auth