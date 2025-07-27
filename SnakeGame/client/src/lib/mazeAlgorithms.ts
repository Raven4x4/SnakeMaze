export interface Point {
  x: number;
  y: number;
}

export interface MazeConfig {
  width: number;
  height: number;
  cellSize: number;
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
    const stack: { point: Point; path: Point[] }[] = [{ point: start, path: [start] }];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const { point: current, path } = stack.pop()!;
      const key = `${current.x},${current.y}`;

      if (current.x === end.x && current.y === end.y) {
        return path;
      }

      if (visited.has(key)) {
        continue;
      }

      visited.add(key);

      const directions = [
        { x: 0, y: -1 }, // Up
        { x: 1, y: 0 },  // Right
        { x: 0, y: 1 },  // Down
        { x: -1, y: 0 }  // Left
      ];

      for (const dir of directions) {
        const next = { x: current.x + dir.x, y: current.y + dir.y };
        const nextKey = `${next.x},${next.y}`;

        if (
          next.x >= 0 && 
          next.x < maze.length && 
          next.y >= 0 && 
          next.y < maze[0].length && 
          maze[next.x][next.y] && 
          !visited.has(nextKey)
        ) {
          stack.push({ point: next, path: [...path, next] });
        }
      }
    }

    return []; // No solution found
  }
}
