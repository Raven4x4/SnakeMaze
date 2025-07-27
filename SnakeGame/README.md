# Interactive Maze Solver Game

A web-based maze generator and solver with animated pathfinding visualization built with React, TypeScript, and HTML5 Canvas.

## Features

- **Interactive Maze Generation**: Creates unique mazes using recursive backtracking algorithm
- **Animated Pathfinding**: Watch the solution path animate step-by-step from start to finish
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Visualization**: HTML5 Canvas rendering for smooth graphics
- **Modern UI**: Clean interface with intuitive controls

## Demo

- Green squares: Start position and solution path
- Red square: Goal/end position
- White areas: Walkable paths
- Black areas: Walls

## Quick Start

### Development
```bash
npm install
npm run dev
```
Visit http://localhost:5173

### Production Build
```bash
npm run build
npm start
```

## Deployment

### Replit (Recommended)
1. Click the "Deploy" button in Replit
2. Your app will be live at your-repl-name.repl.app

### Render
1. Push code to GitHub
2. Connect Render to your repository  
3. Use these settings:
   - Build Command: `npm install && ./build.sh`
   - Start Command: `node dist/index.js`
   - Environment: `NODE_ENV=production`

Or use the included `render.yaml` for automatic configuration.

### Other Platforms
Works on Vercel, Netlify, Railway, or any Node.js hosting service.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Canvas**: HTML5 Canvas for maze rendering
- **Build**: Vite for fast development and production builds

## How It Works

1. **Maze Generation**: Uses recursive backtracking to create perfect mazes
2. **Pathfinding**: Implements depth-first search to find solutions
3. **Animation**: RequestAnimationFrame for smooth path visualization
4. **Responsive**: Automatic canvas resizing and mobile-friendly controls