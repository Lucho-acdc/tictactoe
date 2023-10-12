const gameboard = document.querySelector("#gameboard");
const infoDisplay = document.querySelector("#info");
const elegir = document.querySelector("#elegir");
const elegirJugadores = document.querySelector("#elegirJugadores");
const botonX = document.querySelector("#x");
const botonO = document.querySelector("#o");
const botonA = document.querySelector("#a");
const botonB = document.querySelector("#b");
const inputJugador1 = document.querySelector("#jugador1");
const inputJugador2 = document.querySelector("#jugador2");

const startCells = ["", "", "", "", "", "", "", "", ""];

let jugador = {
    nombre: "",
    simbolo: null,
};

let jugadorConO = "";

let jugadorConX = "";

infoDisplay.textContent = "Quién empieza?";
let movimientosTotales = 0;

inputJugador1.addEventListener("input", () => {
    botonA.textContent = inputJugador1.value;
});

inputJugador2.addEventListener("input", () => {
    botonB.textContent = inputJugador2.value;
});

botonA.addEventListener("click", () => {
    jugador.nombre = document.querySelector("#jugador1").value;
    elegirSimbolo();
});
  
botonB.addEventListener("click", () => {
    jugador.nombre = document.querySelector("#jugador2").value;
    elegirSimbolo();
});


function elegirSimbolo() {
    infoDisplay.textContent = `${jugador.nombre}, elige tu símbolo (O o X)`;
    elegirJugadores.classList.remove("visible");
    elegirJugadores.classList.add("novisible");
    elegir.classList.remove("novisible");
    elegir.classList.add("visible");
};

function elegirO() {
    jugador.simbolo = "circulo";
    jugadorConO = jugador.nombre;
    infoDisplay.textContent = `${jugadorConO} va primero con circulo`;
    iniciarJuego();
}

function elegirX() {
    jugador.simbolo = "cruz";
    jugadorConX = jugador.nombre;
    infoDisplay.textContent = `${jugadorConX} va primero con cruz`;
    iniciarJuego();
}

botonO.addEventListener("click", elegirO);
botonX.addEventListener("click", elegirX);


function iniciarJuego() {
    if(jugador.simbolo === "circulo" || jugador.simbolo === "cruz") {
        elegir.classList.remove("visible");
        elegir.classList.add("novisible");
    }
};

createBoard = () => {
    startCells.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("square");
        cellElement.id = index;
        cellElement.addEventListener("click", addGo);
        gameboard.append(cellElement);
    });
};

checkScore = () => {
    const allSquares = document.querySelectorAll(".square");
    const winningCombos = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6], ];

    let gameWon = false;

    winningCombos.forEach(array => {
        const circleWins = array.every(cell => allSquares[cell].firstChild?.classList.contains("circulo"));
        const crossWins = array.every(cell => allSquares[cell].firstChild?.classList.contains("cruz"))

        if (circleWins) {
            infoDisplay.textContent = `Gano ${jugadorConO}`;
            gameWon = true;
            allSquares.forEach(square => square.replaceWith(square.cloneNode(true)));
            return;
        } else if (crossWins) {
            
            gameWon = true;
            infoDisplay.textContent = `Gano ${jugadorConX}`;
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
    goDisplay.classList.add(jugador.simbolo);
    e.target.append(goDisplay)
    jugador.simbolo = jugador.simbolo === "circulo" ? "cruz" : "circulo";
    jugador.nombre = jugador.simbolo === "circulo" ? jugadorConO : jugadorConX;
    infoDisplay.textContent = `Ahora el turno de ${jugador.nombre}`;
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

    jugador.simbolo = "";
    movimientosTotales = 0;

    elegirJugadores.classList.remove("novisible");
    elegirJugadores.classList.add("visible");
    elegir.classList.remove("visible");
    elegir.classList.add("novisible");
}

const botonReiniciar = document.querySelector("#reset");
botonReiniciar.addEventListener("click", reiniciarJuego);
