const gameboard = document.querySelector("#gameboard");
const infoDisplay = document.querySelector("#info");
const elegir = document.querySelector("#elegir");
const botonX = document.querySelector("#x");
const botonO = document.querySelector("#o");

const startCells = ["", "", "", "", "", "", "", "", ""]


let go = "";
infoDisplay.textContent = "Elige quien empieza";
let movimientosTotales = 0;

function elegirO() {
        go = "circulo"
        infoDisplay.textContent = "Circulo va primero";
        iniciarJuego();
};       

function elegirX() {
        go = "cruz"
        infoDisplay.textContent = "Cruz va primero";
        iniciarJuego();
};

botonO.addEventListener("click", elegirO);
botonX.addEventListener("click", elegirX);

function iniciarJuego() {
    if(go === "circulo" || go === "cruz") {
        elegir.classList.remove("visible");
        elegir.classList.add("novisible");
    }
}

createBoard = () => {
    startCells.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("square");
        cellElement.id = index;
        cellElement.addEventListener("click", addGo);
        gameboard.append(cellElement);
    });
}

checkScore = () => {
    const allSquares = document.querySelectorAll(".square");
    const winningCombos = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6], ];

    let gameWon = false;

    winningCombos.forEach(array => {
        const circleWins = array.every(cell => allSquares[cell].firstChild?.classList.contains("circulo"));
        const crossWins = array.every(cell => allSquares[cell].firstChild?.classList.contains("cruz"))

        if (circleWins) {
            infoDisplay.textContent = "Gano circulo!";
            gameWon = true;
            allSquares.forEach(square => square.replaceWith(square.cloneNode(true)));
            return;
        } else if (crossWins) {
            infoDisplay.textContent = "Gano cruz!";
            gameWon = true;
            allSquares.forEach(square => square.replaceWith(square.cloneNode(true)));
            return;
        }
    });

    return gameWon;
};


function empate() {
    if (movimientosTotales === 9 && !checkScore()) {
        infoDisplay.textContent = "Empate";
    }
}

addGo = (e) => {
    const goDisplay = document.createElement("div");
    goDisplay.classList.add(go);
    e.target.append(goDisplay)
    go = go === "circulo" ? "cruz" : "circulo";
    infoDisplay.textContent = "Ahora el turno de " + go;
    e.target.removeEventListener("click", addGo);

    movimientosTotales++;

    const hayGanador = checkScore();
    if (!hayGanador) {
        empate();
    }
};

createBoard();


function reiniciarJuego() {
    const todosLosCuadrados = document.querySelectorAll(".square");

    todosLosCuadrados.forEach(cell => {
        cell.classList.remove("circulo", "cruz");
        cell.textContent = "";
        cell.addEventListener("click", addGo);
    });

    infoDisplay.textContent = "Elige quien empieza";

    go = "";

    elegir.classList.remove("novisible");
    elegir.classList.add("visible");
}

const botonReiniciar = document.querySelector("#reset");
botonReiniciar.addEventListener("click", reiniciarJuego);
