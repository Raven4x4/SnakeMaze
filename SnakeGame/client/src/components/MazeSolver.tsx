import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { MazeGenerator, MazeSolver, Point, MazeConfig } from '../lib/mazeAlgorithms';
import { useCanvas } from '../hooks/useCanvas';

const MazeSolverComponent: React.FC = () => {
  const [maze, setMaze] = useState<boolean[][]>([]);
  const [solutionPath, setSolutionPath] = useState<Point[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [gameState, setGameState] = useState<'ready' | 'solving' | 'solved'>('ready');
  const animationRef = useRef<number>();

  // Maze configuration
  const config: MazeConfig = {
    width: 29, // Odd numbers work better for maze generation
    height: 29,
    cellSize: 20
  };

  const start: Point = { x: 0, y: 0 };
  const end: Point = { x: config.width - 2, y: config.height - 2 };

  // Generate a new maze
  const generateMaze = useCallback(() => {
    const generator = new MazeGenerator(config.width, config.height);
    const newMaze = generator.generate();
    setMaze(newMaze);
    setSolutionPath([]);
    setAnimationStep(0);
    setIsAnimating(false);
    setGameState('ready');
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [config.width, config.height]);

  // Solve the maze with animation
  const solveMaze = useCallback(() => {
    if (maze.length === 0 || isAnimating) return;

    const solution = MazeSolver.solve(maze, start, end);
    
    if (solution.length === 0) {
      alert('No solution found for this maze!');
      return;
    }

    setSolutionPath(solution);
    setGameState('solving');
    setIsAnimating(true);
    setAnimationStep(0);

    // Animate the solution path
    let step = 0;
    const animate = () => {
      if (step < solution.length) {
        setAnimationStep(step);
        step++;
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setGameState('solved');
      }
    };

    animate();
  }, [maze, isAnimating, start, end]);

  // Draw function for the canvas
  const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Always fill the entire canvas with black background first
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (maze.length === 0) return;

    const cellSize = Math.min(
      Math.floor(canvas.width / config.width),
      Math.floor(canvas.height / config.height)
    );

    const offsetX = (canvas.width - config.width * cellSize) / 2;
    const offsetY = (canvas.height - config.height * cellSize) / 2;

    // Draw maze
    for (let x = 0; x < config.width; x++) {
      for (let y = 0; y < config.height; y++) {
        const pixelX = offsetX + x * cellSize;
        const pixelY = offsetY + y * cellSize;

        ctx.fillStyle = maze[x][y] ? '#ffffff' : '#000000';
        ctx.fillRect(pixelX, pixelY, cellSize, cellSize);
      }
    }

    // Draw animated solution path
    if (solutionPath.length > 0) {
      ctx.fillStyle = '#00ff00';
      for (let i = 0; i < Math.min(animationStep + 1, solutionPath.length); i++) {
        const point = solutionPath[i];
        const pixelX = offsetX + point.x * cellSize;
        const pixelY = offsetY + point.y * cellSize;
        ctx.fillRect(pixelX, pixelY, cellSize, cellSize);
      }
    }

    // Draw start point (green)
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(offsetX + start.x * cellSize, offsetY + start.y * cellSize, cellSize, cellSize);

    // Draw end point (red)
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(offsetX + end.x * cellSize, offsetY + end.y * cellSize, cellSize, cellSize);

  }, [maze, solutionPath, animationStep, config.width, config.height, start, end]);

  const { canvasRef } = useCanvas(draw, [maze, solutionPath, animationStep]);

  // Generate initial maze
  useEffect(() => {
    generateMaze();
  }, [generateMaze]);

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
        return 'Click "Solve Maze" to find the path from green to red!';
      case 'solving':
        return 'Finding path...';
      case 'solved':
        return 'Path found! Click "New Maze" to try another one.';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Interactive Maze Solver
        </h1>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <canvas
            ref={canvasRef}
            className="w-full h-96 border-2 border-gray-300 rounded bg-black"
            style={{ maxWidth: '600px', maxHeight: '600px', margin: '0 auto', display: 'block' }}
          />
        </div>

        <div className="text-center mb-6">
          <p className="text-lg text-gray-700 mb-4">
            {getStatusMessage()}
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={solveMaze}
              disabled={isAnimating || gameState === 'solved'}
              className="min-w-32"
              variant={gameState === 'ready' ? 'default' : 'secondary'}
            >
              {gameState === 'solving' ? 'Solving...' : 'Solve Maze'}
            </Button>
            
            <Button
              onClick={handleNewMaze}
              variant="outline"
              className="min-w-32"
            >
              New Maze
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 border border-gray-400"></div>
              <span>Start & Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 border border-gray-400"></div>
              <span>End</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-gray-400"></div>
              <span>Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-black border border-gray-400"></div>
              <span>Wall</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeSolverComponent;
