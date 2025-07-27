import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Button } from './ui/button';
import { MazeGenerator, MazeSolver, Point, MazeConfig, MazeStats } from '../lib/mazeAlgorithms';
import { useCanvas } from '../hooks/useCanvas';

interface GameSettings {
  size: 'small' | 'medium' | 'large';
  animationSpeed: 'slow' | 'medium' | 'fast';
  showStats: boolean;
}

const MazeSolverComponent: React.FC = () => {
  const [maze, setMaze] = useState<boolean[][]>([]);
  const [solutionPath, setSolutionPath] = useState<Point[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [gameState, setGameState] = useState<'ready' | 'solving' | 'solved'>('ready');
  const [mazeStats, setMazeStats] = useState<MazeStats | null>(null);
  const [settings, setSettings] = useState<GameSettings>({
    size: 'medium',
    animationSpeed: 'medium',
    showStats: true
  });
  const [solutionStartTime, setSolutionStartTime] = useState<number>(0);
  const animationRef = useRef<number>();

  // Dynamic maze configuration based on settings
  const config: MazeConfig = useMemo(() => {
    const sizeMap = {
      small: { width: 21, height: 21 },
      medium: { width: 29, height: 29 },
      large: { width: 37, height: 37 }
    };
    
    return {
      ...sizeMap[settings.size],
      cellSize: 20
    };
  }, [settings.size]);

  const start: Point = { x: 0, y: 0 };
  const end: Point = { x: config.width - 1, y: config.height - 1 };

  // Generate a new maze
  const generateMaze = useCallback(() => {
    try {
      const generator = new MazeGenerator(config.width, config.height);
      const newMaze = generator.generate();
      
      // Ensure start and end positions are walkable
      if (newMaze && newMaze[start.x] && newMaze[end.x]) {
        newMaze[start.x][start.y] = true;
        newMaze[end.x][end.y] = true;
      }
      
      setMaze(newMaze);
      setSolutionPath([]);
      setAnimationStep(0);
      setIsAnimating(false);
      setGameState('ready');
      setMazeStats(null);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } catch (error) {
      console.error('Error generating maze:', error);
      setGameState('ready');
    }
  }, [config.width, config.height, start.x, start.y, end.x, end.y]);

  // Animation speed mapping
  const getAnimationDelay = useCallback(() => {
    const speedMap = { slow: 100, medium: 50, fast: 20 };
    return speedMap[settings.animationSpeed];
  }, [settings.animationSpeed]);

  // Solve the maze with animation
  const solveMaze = useCallback(() => {
    if (maze.length === 0 || isAnimating) return;

    try {
      const startTime = performance.now();
      const solution = MazeSolver.solve(maze, start, end);
      const solutionTime = performance.now() - startTime;
      
      if (solution.length === 0) {
        console.warn('No solution found for maze');
        setGameState('ready');
        return;
      }

      setSolutionPath(solution);
      setGameState('solving');
      setIsAnimating(true);
      setAnimationStep(0);

      // Calculate and set stats
      const stats = MazeSolver.calculateStats(maze, solution, solutionTime);
      setMazeStats(stats);

      // Animate the solution path with configurable speed
      let step = 0;
      const animationDelay = getAnimationDelay();
      
      const animate = () => {
        if (step < solution.length) {
          setAnimationStep(step);
          step++;
          setTimeout(() => {
            animationRef.current = requestAnimationFrame(animate);
          }, animationDelay);
        } else {
          setIsAnimating(false);
          setGameState('solved');
        }
      };

      animate();
    } catch (error) {
      console.error('Error solving maze:', error);
      setGameState('ready');
      setIsAnimating(false);
    }
  }, [maze, isAnimating, start, end, getAnimationDelay]);

  // Settings controls
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    // Reset maze state when size changes
    if (newSettings.size && newSettings.size !== settings.size) {
      setMaze([]);
      setSolutionPath([]);
      setMazeStats(null);
      setGameState('ready');
      setIsAnimating(false);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [settings.size]);

  // Enhanced draw function with better visuals
  const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Clear canvas with dark background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (maze.length === 0 || !maze[0]) return;

    const cellSize = Math.min(
      Math.floor(canvas.width / config.width),
      Math.floor(canvas.height / config.height)
    );

    const offsetX = (canvas.width - config.width * cellSize) / 2;
    const offsetY = (canvas.height - config.height * cellSize) / 2;

    // Draw maze with better colors and borders
    for (let x = 0; x < config.width; x++) {
      for (let y = 0; y < config.height; y++) {
        const pixelX = offsetX + x * cellSize;
        const pixelY = offsetY + y * cellSize;

        if (maze[x][y]) {
          // Path cells
          ctx.fillStyle = '#f8f9fa';
          ctx.fillRect(pixelX, pixelY, cellSize, cellSize);
          
          // Subtle border for paths
          ctx.strokeStyle = '#e9ecef';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(pixelX, pixelY, cellSize, cellSize);
        } else {
          // Wall cells
          ctx.fillStyle = '#343a40';
          ctx.fillRect(pixelX, pixelY, cellSize, cellSize);
        }
      }
    }

    // Draw animated solution path with gradient effect
    if (solutionPath.length > 0) {
      for (let i = 0; i < Math.min(animationStep + 1, solutionPath.length); i++) {
        const point = solutionPath[i];
        const pixelX = offsetX + point.x * cellSize;
        const pixelY = offsetY + point.y * cellSize;
        
        // Gradient effect for path
        const opacity = Math.max(0.3, 1 - (animationStep - i) / 20);
        ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`;
        ctx.fillRect(pixelX + 1, pixelY + 1, cellSize - 2, cellSize - 2);
      }
    }

    // Draw start point with glow effect
    const startX = offsetX + start.x * cellSize;
    const startY = offsetY + start.y * cellSize;
    
    const startGradient = ctx.createRadialGradient(
      startX + cellSize/2, startY + cellSize/2, 0,
      startX + cellSize/2, startY + cellSize/2, cellSize/2
    );
    startGradient.addColorStop(0, '#10b981');
    startGradient.addColorStop(1, '#059669');
    
    ctx.fillStyle = startGradient;
    ctx.fillRect(startX, startY, cellSize, cellSize);

    // Draw end point with glow effect  
    const endX = offsetX + end.x * cellSize;
    const endY = offsetY + end.y * cellSize;
    
    const endGradient = ctx.createRadialGradient(
      endX + cellSize/2, endY + cellSize/2, 0,
      endX + cellSize/2, endY + cellSize/2, cellSize/2
    );
    endGradient.addColorStop(0, '#ef4444');
    endGradient.addColorStop(1, '#dc2626');
    
    ctx.fillStyle = endGradient;
    ctx.fillRect(endX, endY, cellSize, cellSize);

  }, [maze, solutionPath, animationStep, config.width, config.height, start, end]);

  const { canvasRef } = useCanvas(draw, [maze, solutionPath, animationStep]);

  // Generate initial maze and when size changes
  useEffect(() => {
    generateMaze();
  }, [generateMaze]);

  // Auto-generate new maze when settings change and maze is empty
  useEffect(() => {
    if (maze.length === 0) {
      generateMaze();
    }
  }, [config.width, config.height, generateMaze, maze.length]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleNewMaze = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    generateMaze();
  };

  const getStatusMessage = () => {
    switch (gameState) {
      case 'ready':
        return `Ready to solve a ${settings.size} maze! Click "Solve" to find the optimal path.`;
      case 'solving':
        return 'Finding the optimal path using A* algorithm...';
      case 'solved':
        return mazeStats 
          ? `Solution found! Path length: ${mazeStats.pathLength} steps, Difficulty: ${mazeStats.difficulty}`
          : 'Path found! Click "New Maze" for another challenge.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Smart Maze Solver
          </h1>
          <p className="text-gray-300">
            Advanced pathfinding with A* algorithm
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Settings Panel */}
          <div className="glass rounded-xl p-6 fade-in">
            <h3 className="text-xl font-semibold text-white mb-4">Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Maze Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['small', 'medium', 'large'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => updateSettings({ size })}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        settings.size === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/20 text-gray-300 hover:bg-white/30'
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Animation Speed
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['slow', 'medium', 'fast'] as const).map(speed => (
                    <button
                      key={speed}
                      onClick={() => updateSettings({ animationSpeed: speed })}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        settings.animationSpeed === speed
                          ? 'bg-green-600 text-white'
                          : 'bg-white/20 text-gray-300 hover:bg-white/30'
                      }`}
                    >
                      {speed.charAt(0).toUpperCase() + speed.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    checked={settings.showStats}
                    onChange={(e) => updateSettings({ showStats: e.target.checked })}
                    className="mr-2"
                  />
                  Show Statistics
                </label>
              </div>
            </div>

            {/* Statistics */}
            {settings.showStats && mazeStats && (
              <div className="mt-6 pt-4 border-t border-white/20">
                <h4 className="text-lg font-medium text-white mb-3">Maze Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Path Length:</span>
                    <span className="text-blue-400">{mazeStats.pathLength}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Difficulty:</span>
                    <span className={`font-medium ${
                      mazeStats.difficulty === 'Easy' ? 'text-green-400' :
                      mazeStats.difficulty === 'Medium' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {mazeStats.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Dead Ends:</span>
                    <span className="text-purple-400">{mazeStats.deadEnds}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Solve Time:</span>
                    <span className="text-orange-400">{mazeStats.solutionTime.toFixed(2)}ms</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Game Area */}
          <div className="lg:col-span-3">
            <div className="glass rounded-xl p-6 fade-in">
              {/* Status */}
              <div className="text-center mb-6">
                <p className="text-lg text-gray-200 mb-4">
                  {getStatusMessage()}
                </p>
                
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button
                    onClick={solveMaze}
                    disabled={isAnimating || gameState === 'solved'}
                    loading={gameState === 'solving'}
                    className="min-w-32"
                    variant={gameState === 'ready' ? 'gradient' : 'secondary'}
                    size="lg"
                  >
                    {gameState === 'solving' ? 'Solving...' : 'Solve Maze'}
                  </Button>
                  
                  <Button
                    onClick={handleNewMaze}
                    variant="outline"
                    className="min-w-32"
                    size="lg"
                  >
                    New Maze
                  </Button>
                </div>
              </div>

              {/* Canvas */}
              <div className="bg-black/30 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  className="w-full h-96 rounded-lg"
                  style={{ maxWidth: '700px', maxHeight: '700px', margin: '0 auto', display: 'block' }}
                />
              </div>

              {/* Legend */}
              <div className="text-center text-sm text-gray-300 mt-4">
                <div className="flex justify-center items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-sm"></div>
                    <span>Start & Solution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-sm"></div>
                    <span>End Goal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 rounded-sm"></div>
                    <span>Walkable Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-700 rounded-sm"></div>
                    <span>Wall</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeSolverComponent;
