export interface Point {
  x: number;
  y: number;
}

export interface MazeConfig {
  width: number;
  height: number;
  cellSize: number;
}

export interface MazeStats {
  pathLength: number;
  solutionTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  deadEnds: number;
}

export class MazeGenerator {
  private maze: boolean[][];
  private visited: boolean[][];
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.maze = Array(width).fill(null).map(() => Array(height).fill(false));
    this.visited = Array(width).fill(null).map(() => Array(height).fill(false));
  }

  generate(): boolean[][] {
    // Reset arrays - Initialize with all false (walls)
    this.maze = Array(this.width).fill(null).map(() => Array(this.height).fill(false));
    this.visited = Array(this.width).fill(null).map(() => Array(this.height).fill(false));

    const stack: Point[] = [{ x: 0, y: 0 }];

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      this.visited[current.x][current.y] = true;
      this.maze[current.x][current.y] = true; // Mark as walkable path

      const neighbors = this.getUnvisitedNeighbors(current);

      if (neighbors.length > 0) {
        const nextCell = neighbors[Math.floor(Math.random() * neighbors.length)];
        stack.push(nextCell);

        // Remove wall between current and next cell (create path)
        const wallX = Math.floor((current.x + nextCell.x) / 2);
        const wallY = Math.floor((current.y + nextCell.y) / 2);
        this.maze[wallX][wallY] = true;
      } else {
        stack.pop();
      }
    }

    // Ensure we have a connected path from start to potential end positions
    // Force walkable paths at corners for better maze connectivity
    if (this.width > 2 && this.height > 2) {
      this.maze[this.width - 1][this.height - 1] = true; // Bottom-right corner
      this.maze[this.width - 2][this.height - 1] = true; // Connect to paths
      this.maze[this.width - 1][this.height - 2] = true; // Connect to paths
    }

    return this.maze;
  }

  private getUnvisitedNeighbors(point: Point): Point[] {
    // Check neighbors at distance 2 (standard maze generation pattern)
    const directions = [
      { x: 0, y: -2 }, // Up
      { x: 2, y: 0 },  // Right  
      { x: 0, y: 2 },  // Down
      { x: -2, y: 0 }  // Left
    ];

    return directions
      .map(dir => ({ x: point.x + dir.x, y: point.y + dir.y }))
      .filter(neighbor => 
        neighbor.x >= 0 && 
        neighbor.x < this.width && 
        neighbor.y >= 0 && 
        neighbor.y < this.height && 
        !this.visited[neighbor.x][neighbor.y]
      );
  }
}

export class MazeSolver {
  static solve(maze: boolean[][], start: Point, end: Point): Point[] {
    if (!maze || maze.length === 0 || !maze[0]) {
      return [];
    }

    // Validate start and end points
    if (!this.isValidPoint(maze, start) || !this.isValidPoint(maze, end)) {
      return [];
    }

    if (!maze[start.x][start.y] || !maze[end.x][end.y]) {
      return [];
    }

    // Use A* algorithm for optimal pathfinding
    return this.aStar(maze, start, end);
  }

  private static isValidPoint(maze: boolean[][], point: Point): boolean {
    return point.x >= 0 && point.x < maze.length && 
           point.y >= 0 && point.y < maze[0].length;
  }

  private static aStar(maze: boolean[][], start: Point, end: Point): Point[] {
    const openSet = new Set<string>();
    const closedSet = new Set<string>();
    const cameFrom = new Map<string, Point>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    const startKey = `${start.x},${start.y}`;
    const endKey = `${end.x},${end.y}`;

    openSet.add(startKey);
    gScore.set(startKey, 0);
    fScore.set(startKey, this.heuristic(start, end));

    while (openSet.size > 0) {
      // Find node with lowest fScore
      let current = '';
      let lowestF = Infinity;
      
      openSet.forEach(node => {
        const f = fScore.get(node) || Infinity;
        if (f < lowestF) {
          lowestF = f;
          current = node;
        }
      });

      if (current === endKey) {
        return this.reconstructPath(cameFrom, current);
      }

      openSet.delete(current);
      closedSet.add(current);

      const [x, y] = current.split(',').map(Number);
      const currentPoint = { x, y };

      const directions = [
        { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
      ];

      for (const dir of directions) {
        const neighbor = { x: x + dir.x, y: y + dir.y };
        const neighborKey = `${neighbor.x},${neighbor.y}`;

        if (!this.isValidPoint(maze, neighbor) || 
            !maze[neighbor.x][neighbor.y] || 
            closedSet.has(neighborKey)) {
          continue;
        }

        const tentativeG = (gScore.get(current) || 0) + 1;

        if (!openSet.has(neighborKey)) {
          openSet.add(neighborKey);
        } else if (tentativeG >= (gScore.get(neighborKey) || Infinity)) {
          continue;
        }

        cameFrom.set(neighborKey, currentPoint);
        gScore.set(neighborKey, tentativeG);
        fScore.set(neighborKey, tentativeG + this.heuristic(neighbor, end));
      }
    }

    return []; // No solution found
  }

  private static heuristic(a: Point, b: Point): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  private static reconstructPath(cameFrom: Map<string, Point>, current: string): Point[] {
    const path: Point[] = [];
    const [x, y] = current.split(',').map(Number);
    path.push({ x, y });

    let currentKey = current;
    while (cameFrom.has(currentKey)) {
      const point = cameFrom.get(currentKey)!;
      path.unshift(point);
      currentKey = `${point.x},${point.y}`;
    }

    return path;
  }

  static calculateStats(maze: boolean[][], solutionPath: Point[], solutionTime: number): MazeStats {
    const deadEnds = this.countDeadEnds(maze);
    const pathLength = solutionPath.length;
    
    let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy';
    if (pathLength > 100 && deadEnds > 50) difficulty = 'Hard';
    else if (pathLength > 50 && deadEnds > 25) difficulty = 'Medium';

    return {
      pathLength,
      solutionTime,
      difficulty,
      deadEnds
    };
  }

  private static countDeadEnds(maze: boolean[][]): number {
    let deadEnds = 0;
    
    for (let x = 1; x < maze.length - 1; x++) {
      for (let y = 1; y < maze[0].length - 1; y++) {
        if (maze[x][y]) {
          let wallCount = 0;
          const directions = [
            { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
          ];
          
          for (const dir of directions) {
            const nx = x + dir.x;
            const ny = y + dir.y;
            if (!maze[nx] || !maze[nx][ny]) wallCount++;
          }
          
          if (wallCount === 3) deadEnds++;
        }
      }
    }
    
    return deadEnds;
  }
}
