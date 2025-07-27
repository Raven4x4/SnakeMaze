# Replit.md

## Overview

This is a refined, full-stack React application that implements an advanced maze solver game with interactive visualizations. The application features a modern, polished interface with A* pathfinding algorithm, real-time statistics, customizable settings, and smooth animations. Built with TypeScript, Vite, and an enhanced UI design system.

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
- **Tailwind CSS** for styling
- **Minimal UI** - Only essential button component
- **HTML5 Canvas** for maze rendering and animations
- **Built-in React state** for game management (no external state library needed)

### Backend Architecture
- **Express.js** server with TypeScript
- **Drizzle ORM** configured for PostgreSQL (using Neon database)
- **In-memory storage** implementation as fallback
- **Session-based architecture** prepared but not implemented
- **RESTful API** structure ready for expansion

### Game Features
- **Advanced Maze Generation**: Optimized recursive backtracking algorithm with guaranteed solvability
- **A* Pathfinding**: Intelligent pathfinding algorithm that finds optimal solutions
- **Enhanced Canvas Rendering**: High-quality HTML5 Canvas with gradient effects and smooth animations
- **Dynamic Settings**: Configurable maze sizes (small/medium/large) and animation speeds
- **Real-time Statistics**: Path length, difficulty analysis, dead-end counting, and solution timing
- **Modern UI Design**: Glass morphism effects, gradient buttons, and responsive layout
- **Performance Optimized**: Efficient rendering and memory management

## Data Flow

1. **Client-side Game Logic**: Maze generation and solving happen entirely in the browser
2. **State Management**: Zustand manages game phases (ready/playing/ended) and audio settings
3. **Canvas Rendering**: Custom hook manages canvas drawing and resizing
4. **User Interactions**: Button-based controls for maze generation and solving

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React 18 with TypeScript and modern hooks (useState, useCallback, useMemo)
- **Styling**: Advanced Tailwind CSS with glass morphism, gradients, and animations
- **Enhanced Button Component**: Loading states, multiple variants, and improved accessibility
- **Canvas Utilities**: Optimized useCanvas hook with crisp pixel rendering
- **Algorithms**: A* pathfinding and improved recursive backtracking maze generation
- **Build Tool**: Vite with HMR and optimized production builds

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

### Recent Improvements (January 27, 2025)
- **Algorithm Enhancement**: Upgraded to A* pathfinding for optimal solutions
- **UI Refinement**: Implemented glass morphism design with smooth animations
- **Performance Optimization**: Improved rendering performance and memory usage
- **Feature Addition**: Real-time statistics and configurable game settings
- **Code Quality**: Enhanced TypeScript interfaces and error handling
- **Visual Polish**: Gradient effects, loading states, and responsive design

### Current Status
- Fully functional maze solver with professional-grade UI
- Ready for deployment to production environments
- Optimized for both desktop and mobile devices