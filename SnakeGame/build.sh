#!/bin/bash
set -e

echo "Building frontend..."
echo "Version: $(cat VERSION)"
npm run build

echo "Creating production server..."
cat > dist/index.js << 'EOF'
import express from "express";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the public directory
app.use(express.static(join(__dirname, 'public')));

// Simple API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    app: 'Smart Maze Solver',
    version: '2.0.0-refined-ui',
    features: ['A* pathfinding', 'Glass morphism UI', 'Real-time statistics']
  });
});

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎮 Smart Maze Solver v2.0.0 server running on port ${PORT}`);
  console.log(`📱 Visit: http://localhost:${PORT}`);
  console.log(`✨ Features: A* pathfinding, Glass morphism UI, Real-time stats`);
});
EOF

echo "Build completed successfully!"
echo "To run locally: node dist/index.js"