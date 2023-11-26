let input_dimension = document.getElementById("dimension");
let btn_generate = document.getElementById("generate");

let maze = document.getElementById("maze");
let dimension = null;
let position_start = null;
let position_end = null;

btn_generate.addEventListener("click", createGrid);

function createGrid() {
  dimension = input_dimension.value;
  let is_valid = isValid(dimension)
  if (!is_valid) {
    return false;
  }
  setCssColumns(dimension)
  insertGrid(maze, dimension)
}

function setCssColumns(dimension) {
  document.documentElement.style.setProperty("--columns", dimension);
}

function isValid(dimension) {
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

function insertGrid(maze, dimension) {
  let columns = dimension;
  let rows = dimension;
  for (let index_row = 0; index_row < columns; index_row++) {
    let column = document.createElement("div");
    column.className = "row";
    for (let index_col = 0; index_col < rows; index_col++) {
      let row = document.createElement("div");
      row.setAttribute("data-position", `${index_row}-${index_col}`);
      row.className = "column cell";
      column.appendChild(row);
    }
    maze.appendChild(column);
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
  let y = position.split("-")[0];
  let x = position.split("-")[1];
    if (position_start === null) {
    if (x != 0) {
      alert("La casilla inicial debe estar en la primera columna");
      return false;
    }
    element.classList.add("active");
    position_start = position;
    text_start.innerHTML = position;
    return true;
  }
  if (position_end === null) {
    if (x != dimension-1) {
      alert("La casilla final debe estar en la ultima columna");
      return false;
    }
    element.classList.add("active");
    position_end = position;
    text_end.innerHTML = position;
    return true;
  }
  alert("Posiciones iniciales ya escogidas.");
  return false;
}
