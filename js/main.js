const gameboard = document.querySelector("#gameboard");
const infoDisplay = document.querySelector("#info");

const iniciar = document.querySelector("#iniciar");
const iniciarBoton = document.querySelector("#iniciarBoton");
const todosBotones = document.querySelector("#todosBotones");

const elegir = document.querySelector("#elegir");
const elegirJugadores = document.querySelector("#elegirJugadores");
const botonX = document.querySelector("#x");
const botonO = document.querySelector("#o");

const botonA = document.querySelector("#a");
const botonB = document.querySelector("#b");

const inputJugador1 = document.querySelector("#jugador1");
const inputJugador2 = document.querySelector("#jugador2");
inputJugador1.disabled = false;
inputJugador2.disabled = false;

let jugador1 = inputJugador1.value;
let jugador2 = inputJugador2.value;

let historialDeVictorias = {
    Empates: 0,
};

const startCells = ["", "", "", "", "", "", "", "", ""];

let jugador = {
    nombre: "",
    simbolo: null,
};

let jugadorConO = "";

let jugadorConX = "";

let movimientosTotales = 0;

let primerJugadorEligioSimbolo = false;

quienEmpieza = () => {

    jugadorConO = inputJugador1.value;
    jugadorConX = inputJugador2.value;

    infoDisplay.textContent = "Quién empieza?";

    elegirJugadores.classList.remove("novisible");
    elegirJugadores.classList.add("visible");

};

iniciar.addEventListener("click", quienEmpieza);

inputJugador1.addEventListener("input", () => {
    botonA.textContent = inputJugador1.value;
});

inputJugador2.addEventListener("input", () => {
    botonB.textContent = inputJugador2.value;
});

botonA.addEventListener("click", () => {
    jugador.nombre = inputJugador1.value;
    elegirSimbolo();
});
  
botonB.addEventListener("click", () => {
    jugador.nombre = inputJugador2.value;
    elegirSimbolo();
});

function elegirSimbolo() {
    return new Promise((resolve, reject) => {
        infoDisplay.textContent = `${jugador.nombre}, elige tu símbolo (O o X)`;
        elegirJugadores.classList.remove("visible");
        elegirJugadores.classList.add("novisible");
        elegir.classList.remove("novisible");
        elegir.classList.add("visible");
        botonX.disabled = false;
        botonO.disabled = false;

        botonO.addEventListener("click", () => {
            jugador.simbolo = "circulo";
            resolve("circulo");
            iniciar.classList.remove("visible");
            iniciar.classList.add("novisible");
        });

        botonX.addEventListener("click", () => {
            jugador.simbolo = "cruz";
            resolve("cruz");
            iniciar.classList.remove("visible");
            iniciar.classList.add("novisible");
        });
    });
}

async function iniciarJuego() {
    inputJugador1.disabled = true;
    inputJugador2.disabled = true;
    
    const primerSimbolo = await elegirSimbolo();

    if (firstPlayerSymbolSelected) {
        jugadorConX = jugador.nombre;
        jugadorConO = jugador1;
    } else {
        jugadorConO = jugador.nombre;
        jugadorConX = jugador1;
        firstPlayerSymbolSelected = true;
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
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    let gameWon = false;
    let ganador = null;

    winningCombos.forEach(array => {
        const circleWins = array.every(cell => allSquares[cell].firstChild?.classList.contains("circulo"));
        const crossWins = array.every(cell => allSquares[cell].firstChild?.classList.contains("cruz"));

        if (circleWins) {
            infoDisplay.textContent = `Gano ${jugadorConO}`;
            gameWon = true;
            ganador = jugadorConO;
            allSquares.forEach(square => square.replaceWith(square.cloneNode(true)));
            return;
        } else if (crossWins) {
            gameWon = true;
            ganador = jugadorConX;
            infoDisplay.textContent = `Gano ${jugadorConX}`;
            allSquares.forEach(square => square.replaceWith(square.cloneNode(true)));
            return;
        }
    });

    return { gameWon, ganador };
};

function empate() {
    if (movimientosTotales === 9 && !checkScore().gameWon) {
        infoDisplay.textContent = "Empate";
        historialDeVictorias.Empates++;
    }
}

addGo = (e) => {
    const goDisplay = document.createElement("div");
    goDisplay.classList.add(jugador.simbolo);
    e.target.append(goDisplay);

    jugador.simbolo = jugador.simbolo === "circulo" ? "cruz" : "circulo";
    jugador.nombre = jugador.simbolo === "circulo" ? jugadorConO : jugadorConX;

    infoDisplay.textContent = `Ahora el turno de ${jugador.nombre}`;

    e.target.removeEventListener("click", addGo);

    movimientosTotales++;

    const resultado = checkScore();
    if (resultado.gameWon) {
        const ganador = resultado.ganador;

        actualizarHistorial(ganador);

        infoDisplay.textContent = `Gano ${ganador}`;
    } else {
        empate();
    }
};

function actualizarHistorial(ganador) {
    if (ganador) {
        if (!historialDeVictorias[ganador]) {
            historialDeVictorias[ganador] = 0;
        }
        historialDeVictorias[ganador]++;
    } else {
        if (!historialDeVictorias["Empates"]) {
            historialDeVictorias["Empates"] = 0;
        }
        historialDeVictorias["Empates"]++;
    }
};

createBoard();

function volverAJugar() {
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

    iniciarBoton.classList.remove("novisible");
    iniciarBoton.classList.add("visible");

    inputJugador1.disabled = false;
    inputJugador2.disabled = false;
}

function reiniciarEstadisticas() {
    const todosLosCuadrados = document.querySelectorAll(".square");

    todosLosCuadrados.forEach(cell => {
        cell.classList.remove("circulo", "cruz");
        cell.textContent = "";
        cell.addEventListener("click", addGo);
    });

    historialDeVictorias = {
        Empates: 0,
    };

    jugador = {
        nombre: "",
        simbolo: null,
    };

    jugadorConO = "";

    jugadorConX = "";

    infoDisplay.textContent = "Quién empieza?";
    movimientosTotales = 0;

    inputJugador1.value = ""; 
    inputJugador2.value = ""; 
    inputJugador1.setAttribute('placeholder', 'Ingresa jugador 1');
    inputJugador2.setAttribute('placeholder', 'Ingresa jugador 2'); 

    inputJugador1.disabled = false;
    inputJugador2.disabled = false;

    elegirJugadores.classList.remove("visible");
    elegirJugadores.classList.add("novisible");

    elegir.classList.remove("visible");
    elegir.classList.add("novisible");
    
    iniciarBoton.classList.remove("novisible");
    iniciarBoton.classList.add("visible");
};


const botonReiniciar = document.querySelector("#reset");
botonReiniciar.addEventListener("click", volverAJugar);

const botonReiniciarEstadisticas = document.querySelector("#resetTodo");
botonReiniciarEstadisticas.addEventListener("click", reiniciarEstadisticas);

const verHistorial = document.getElementById("verHistorial");
const modal = document.getElementById("modal");
const cerrarHistorialFlotante = document.getElementById("cerrarHistorialFlotante");
const contenedorHistorial = document.getElementById("contenedorHistorial");

verHistorial.addEventListener("click", () => {
    modal.style.display = "block";
    mostrarHistorial();
});

cerrarHistorialFlotante.addEventListener("click", () => {
    modal.style.display = "none";
});

const mostrarHistorial = () => {
    contenedorHistorial.innerHTML = "";

    for (const jugador in historialDeVictorias) {
        if (historialDeVictorias.hasOwnProperty(jugador)) {
            const victorias = historialDeVictorias[jugador];

            const card = document.createElement("div");
            card.classList.add("cardHistorial");
            card.innerHTML = `
                <div>
                    <h6>${jugador} ${victorias}</h6>
                </div>`;

            contenedorHistorial.appendChild(card);
        }
    }
};