# Replit.md

## Overview

This is a full-stack React application with a Node.js/Express backend that implements a maze solver game. The application uses TypeScript throughout and features a modern web stack with Vite for frontend bundling, Drizzle ORM for database operations, and Tailwind CSS with shadcn/ui components for styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React SPA built with Vite, using TypeScript and Tailwind CSS
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (configured but using in-memory storage currently)
- **Shared**: Common TypeScript types and database schema definitions

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for component development
- **Vite** as the build tool and dev server
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** component library for consistent UI elements
- **React Three Fiber** for potential 3D graphics (imported but not actively used)
- **Zustand** for state management (game state and audio control)
- **TanStack Query** for server state management

### Backend Architecture
- **Express.js** server with TypeScript
- **Drizzle ORM** configured for PostgreSQL (using Neon database)
- **In-memory storage** implementation as fallback
- **Session-based architecture** prepared but not implemented
- **RESTful API** structure ready for expansion

### Game Features
- **Maze Generation**: Custom maze generation algorithm using recursive backtracking
- **Maze Solving**: Pathfinding algorithm for solving generated mazes
- **Canvas-based Rendering**: Custom HTML5 Canvas implementation for maze visualization
- **Game State Management**: Zustand stores for game phases and audio control
- **Animation System**: Step-by-step solution animation

## Data Flow

1. **Client-side Game Logic**: Maze generation and solving happen entirely in the browser
2. **State Management**: Zustand manages game phases (ready/playing/ended) and audio settings
3. **Canvas Rendering**: Custom hook manages canvas drawing and resizing
4. **User Interactions**: Button-based controls for maze generation and solving

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand with subscriptions
- **Canvas Utilities**: Custom useCanvas hook
- **Build Tool**: Vite with React plugin

### Backend Dependencies
- **Runtime**: Node.js with Express
- **Database**: Drizzle ORM + @neondatabase/serverless
- **Development**: tsx for TypeScript execution
- **Building**: esbuild for production builds

### Database Schema
- **Users table**: Basic user management with username/password
- **Validation**: Zod schemas for type safety
- **Migrations**: Drizzle-kit for database migrations

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution
- **Database**: Environment-based DATABASE_URL configuration

### Production Build
- **Frontend**: Vite builds to `dist/public`
- **Backend**: esbuild bundles server to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Environment**: NODE_ENV=production for optimizations

### Database Configuration
- **PostgreSQL**: Configured via DATABASE_URL environment variable
- **Neon Database**: Serverless PostgreSQL provider
- **Fallback**: In-memory storage for development without database

### Key Scripts
- `npm run dev`: Start development servers
- `npm run build`: Build for production
- `npm run start`: Run production build
- `npm run db:push`: Apply database schema changes

## Notable Design Decisions

### Architecture Choices
- **Monorepo Structure**: Keeps related code together while maintaining separation
- **Shared Schema**: Database schema and types shared between client/server
- **Canvas Rendering**: Chose HTML5 Canvas over SVG for better performance with animations
- **Client-side Game Logic**: Maze algorithms run in browser for better responsiveness

### Technology Choices
- **Zustand over Redux**: Simpler state management for game-specific needs
- **Drizzle over Prisma**: Better TypeScript integration and performance
- **Vite over Webpack**: Faster development builds and modern tooling
- **Express over Next.js**: Separation of concerns between API and frontend

### Current Limitations
- Database integration is prepared but using in-memory storage
- Authentication system is scaffolded but not implemented
- 3D libraries are imported but not utilized in current implementation