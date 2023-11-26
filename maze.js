function createMaze(rows, cols, start, end) {
  const maze = initializeMaze(rows, cols);
  const stack = [];
  let current = start;

  function initializeMaze(rows, cols) {
    const maze = [];
    for (let i = 0; i < rows; i++) {
      maze[i] = [];
      for (let j = 0; j < cols; j++) {
        maze[i][j] = 0; // 0 representa un camino
      }
    }
    return maze;
  }

  function isValid(x, y) {
    return x >= 0 && x < rows && y >= 0 && y < cols && maze[x][y] === 0;
  }

  function getNeighbors(x, y) {
    const neighbors = [];
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // derecha, abajo, izquierda, arriba

    for (const [dx, dy] of directions) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;
      if (isValid(nx, ny)) {
        neighbors.push([nx, ny]);
      }
    }

    return neighbors;
  }

  function connectCells(a, b) {
    const [ax, ay] = a;
    const [bx, by] = b;
    maze[(ax + bx) / 2][(ay + by) / 2] = 0; // 0 representa un camino
  }

  function generateMaze() {
    stack.push(current);

    while (stack.length > 0) {
      maze[current[0]][current[1]] = 1; // 1 representa un camino visitado
      const neighbors = getNeighbors(current[0], current[1]);

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        connectCells(current, next);
        stack.push(next);
        current = next;
      } else {
        current = stack.pop();
      }
    }
  }

  generateMaze();

  // Marcar el inicio y el final
  maze[start[0]][start[1]] = 'S'; // 'S' representa el inicio
  maze[end[0]][end[1]] = 'E'; // 'E' representa el final

  return maze;
}

const maze = createMaze(4, 4, [0, 0], [2, 3]);
console.log(maze);
