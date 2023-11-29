let input_dimension = document.getElementById("dimension");
let btn_generate = document.getElementById("generate");
let input_timming = document.getElementById("timming");
let maze_container = document.getElementById("maze_container");
let dimension = null;
let timming_animation = null;
let position_start = null;
let position_end = null;
let maze = null;
let current, rows, cols;
let stack = [];

btn_generate.addEventListener("click", createGrid);

function createGrid() {
  dimension = input_dimension.value;
  input_timming.value ? (timming_animation = input_timming.value) : (timming_animation = 500);
  let is_valid = isInputValid(dimension)
  if (!is_valid) {
    return false;
  }
  setCssColumns(dimension)
  insertGrid(maze_container, dimension)
}

function setCssColumns(dimension) {
  document.documentElement.style.setProperty("--columns", dimension);
}

function isInputValid(dimension) {
  if (dimension.length <= 0) {
    alert("Please enter a valid dimension");
    return false;
  }
  if (Number(dimension) != dimension) {
    alert("Please enter a valid dimension");
    return false;
  }
  return true;
}

function insertGrid(maze_container, dimension) {
  maze_container.innerHTML = "";
  cols = Number(dimension);
  rows = Number(dimension);
  for (let index_row = 0; index_row < cols; index_row++) {
    let row = document.createElement("div");
    row.className = "row";
    for (let index_col = 0; index_col < rows; index_col++) {
      let col = document.createElement("div");
      col.setAttribute("data-position", `${index_row}-${index_col}`);
      col.innerHTML = `${index_row}-${index_col}`;
      col.className = "column cell";
      row.appendChild(col);
    }
    maze_container.appendChild(row);
    eventPosition(dimension);
  }
}
function eventPosition() {
  let cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.addEventListener("click", getPosition);
  });
}

function getPosition() {
  let element = this;
  let position = element.getAttribute("data-position");
  let text_start = document.getElementById("start");
  let text_end = document.getElementById("end");

  let x = position.split("-")[0];
  let y = position.split("-")[1];

  if (position_start === null) {
    if (y != 0) {
      alert("La casilla inicial debe estar en la primera columna");
      return false;
    }
    element.classList.add("active");
    position_start = [Number(x), Number(y)];
    current = position_start;
    text_start.innerHTML = position;
    return true;
  }
  if (position_end === null) {
    if (y != dimension - 1) {
      alert("La casilla final debe estar en la ultima columna");
      return false;
    }
    element.classList.add("active");
    position_end = [Number(x), Number(y)];
    text_end.innerHTML = position;
    return true;
  }
  alert("Posiciones iniciales ya escogidas.");
  return false;
}

function createMaze() {
  const rows = dimension;
  const cols = dimension;
  if (!position_start || !position_end) {
    alert("Por favor, selecciona las posiciones iniciales y finales del laberinto.");
    return;
  }
  maze = initializeMaze(rows, cols);
  generateMaze();
}

function initializeMaze(rows, cols) {
  const maze = [];
  for (let i = 0; i < rows; i++) {
    maze[i] = [];
    for (let j = 0; j < cols; j++) {
      maze[i][j] = 1; // 1 representa una pared
    }
  }
  return maze;
}

function isCellValid(x, y) {
  // Verifica si la coordenada x está dentro de los límites del laberinto
  const isXWithinBounds = x >= 0 && x < rows;

  // Verifica si la coordenada y está dentro de los límites del laberinto
  const isYWithinBounds = y >= 0 && y < cols;

  // Verifica si la celda en la posición (x, y) es un camino válido (valor 1)
  /* const isCellPath = maze[x][y] === 1; */

  // Devuelve true si todas las condiciones son verdaderas, indicando que la celda es válida
  //return isXWithinBounds && isYWithinBounds && isCellPath;
  return isXWithinBounds && isYWithinBounds;
}
function isCellValid2(x, y) {
  // Verifica si la coordenada x está dentro de los límites del laberinto
  const isXWithinBounds = x >= 0 && x < rows;

  // Verifica si la coordenada y está dentro de los límites del laberinto
  const isYWithinBounds = y >= 0 && y < cols;

  // Verifica si la celda en la posición (x, y) es un camino válido (valor 0)
  const isCellPath = maze[x][y] === 0;

  // Devuelve true si todas las condiciones son verdaderas, indicando que la celda es válida
  return isXWithinBounds && isYWithinBounds && isCellPath;
}
function getNeighbors(x, y) {
  const current_x = x;
  const current_y = y;
  const neighbors = [];
  const up = [0, 1];
  const down = [0, -1];
  const left = [-1, 0];
  const right = [1, 0];
  const directions = [down, right, up, left]; // derecha, abajo, izquierda, arriba

  for (const [direction_x, direction_y] of directions) {
    const nuevo_x = current_x + direction_x;
    const nuevo_y = current_y + direction_y;
    if (isCellValid(nuevo_x, nuevo_y)) {
      neighbors.push([nuevo_x, nuevo_y]);
    }
  }
  return neighbors;
}


async function generateMaze() {
  await addStack(current)

  while (stack.length > 0) {
    let current_x = current[0];
    let current_y = current[1];
    maze[current_x][current_y] = 0; // 0 representa un camino

    // Verificar si la posición actual coincide con la posición final
    if (current_x === position_end[0] && current_y === position_end[1]) {
      break;
    }
    /*  console.log("Current");
     console.log(current); */
    const neighbors = getNeighbors(current_x, current_y);


    // Filtrar vecinos no visitados
   /*  console.log("Current");
    console.log(current);
    console.log("Neighbors");
    console.log(neighbors); */

    const unvisited_neighbors = neighbors.filter(([nx, ny]) => maze[nx][ny] === 1);
   /*  console.log("Neighbors Validos");
    unvisited_neighbors.forEach(element => {
      console.log(element);
    }); */
    if (unvisited_neighbors.length > 0) {
      // Elegir aleatoriamente un vecino no visitado
      const random_index = Math.floor(Math.random() * unvisited_neighbors.length);
      const next = unvisited_neighbors[random_index];
      /* console.log("Next");
      console.log(next); */
      /* const next = unvisited_neighbors.shift(); */

      const next_x = next[0];
      const next_y = next[1];
      maze[next_x][next_y] = 0;
      await addStack(next)
      current = next;
    } else {
      current = await popStack(current);
    }
  }

  return maze;
}
function printStack() {
  stack.forEach(element => {
    console.log(element);
  });
}
function printMaze() {
  maze.forEach(element => {
    console.log(element);
  });
}
async function addStack(position) {
  return new Promise((resolve, reject) => {
    let position_x = position[0];
    let position_y = position[1];
    let element = document.querySelector(`[data-position="${position_x}-${position_y}"]`);
    element.classList.add("active");
    stack.push(position);
    /* console.log("Añadiendo Stack");
    printStack(); */
    setTimeout(() => {
      resolve(true);
    }, timming_animation);
  });
}

async function popStack(current) {
  return new Promise((resolve, reject) => {
    let current_x = current[0];
    let current_y = current[1];
    maze[current_x][current_y] = 2; // 1 representa una pared
   /*  console.log("Maze");
    printMaze(); */
    let element = document.querySelector(`[data-position="${current_x}-${current_y}"]`);
    element.classList.remove("active");
/* 
    console.log("Elemento a quitar del stack");
    console.log(element);
 */
    let position = stack.pop();
   /*  console.log("Pop");
    console.log(position); */
    let position_x = position[0];
    let position_y = position[1];
    //Todo: Check if position is same current
    if (position_x == current_x && position_y == current_y) {
      position = stack.pop();
      position_x = position[0];
      position_y = position[1];
     /*  console.log("Otro pop");
      console.log(position); */
      element = document.querySelector(`[data-position="${position_x}-${position_y}"]`);
      element.classList.remove("active");
      /* console.log("Elemento a quitar del stack");
      console.log(element); */
    }
    /* console.log("Removiendo Stack");
    printStack(); */

    setTimeout(() => {
      resolve(position);
    }, timming_animation);
  });

}

function showResult() {
  //Replace all 2 for 1 on maze
  maze.forEach((row, index_row) => {
    row.forEach((cell, index_cell) => {
      if (cell == 2) {
        maze[index_row][index_cell] = 1;
      }
    });
  });
  // Llamar a la función para resolver el laberinto
  solveMaze();
}


async function solveMaze() {
  stack = [];
  current = position_start;
  await addStack2(current)

  while (stack.length > 0) {
    let current_x = current[0];
    let current_y = current[1];
console.log("current");
console.log(current);


    // Verificar si la posición actual coincide con la posición final
    if (current_x === position_end[0] && current_y === position_end[1]) {
      break;
    }
    
    const neighbors = getNeighbors2(current_x, current_y);
    console.log(neighbors);
    
    
    console.log("valid_neighbors");
    neighbors.forEach(element => {
      console.log(element);
    });
    
    if (neighbors.length > 0) {
      const next = neighbors.shift();
      console.log("next");
      console.log(next);
      await addStack2(next)
      current = next;
    } else {
      current = await popStack2();
    }
  }

  return maze;
}

async function addStack2(position) {
  return new Promise((resolve, reject) => {
    let position_x = position[0];
    let position_y = position[1];
    maze[position_x][position_y] = 2;
    let element = document.querySelector(`[data-position="${position_x}-${position_y}"]`);
    element.classList.add("road");
    stack.push(position);
    setTimeout(() => {
      resolve(true);
    }, timming_animation);
  });
}

async function popStack2() {
  return new Promise((resolve, reject) => {
    let current_x = current[0];
    let current_y = current[1];
    maze[current_x][current_y] = 1; // 1 representa una pared
    let element = document.querySelector(`[data-position="${current_x}-${current_y}"]`);
    element.classList.remove("road");

    let position = stack.pop();
    setTimeout(() => {
      resolve(position);
    }, timming_animation);
  });

}
function getNeighbors2(x, y) {
  const current_x = x;
  const current_y = y;
  const neighbors = [];
  const up = [0, 1];
  const down = [0, -1];
  const left = [-1, 0];
  const right = [1, 0];
  const directions = [down, right, up, left]; // derecha, abajo, izquierda, arriba

  for (const [direction_x, direction_y] of directions) {
    const nuevo_x = current_x + direction_x;
    const nuevo_y = current_y + direction_y;
    if (isCellValid2(nuevo_x, nuevo_y)) {
      neighbors.push([nuevo_x, nuevo_y]);
    }
  }
  return neighbors;
}