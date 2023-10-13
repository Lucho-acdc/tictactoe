const gameboard = document.querySelector("#gameboard");
const infoDisplay = document.querySelector("#info");
const elegir = document.querySelector("#elegir");
const elegirJugadores = document.querySelector("#elegirJugadores");
const botonX = document.querySelector("#x");
const botonO = document.querySelector("#o");

const botonA = document.querySelector("#a");
const botonB = document.querySelector("#b");
botonA.disabled = true;
botonB.disabled = true;

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


infoDisplay.textContent = "Quién empieza?";
let movimientosTotales = 0;

inputJugador1.addEventListener("input", () => {
    botonA.textContent = inputJugador1.value;
    botonA.disabled = false;
});

inputJugador2.addEventListener("input", () => {
    botonB.textContent = inputJugador2.value;
    botonB.disabled = false;
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
    botonX.disabled = false;
    botonO.disabled = false;
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
    inputJugador1.disabled = true;
    inputJugador2.disabled = true;
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
    let ganador = null;

    winningCombos.forEach(array => {
        const circleWins = array.every(cell => allSquares[cell].firstChild?.classList.contains("circulo"));
        const crossWins = array.every(cell => allSquares[cell].firstChild?.classList.contains("cruz"))

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

    return {gameWon, ganador};
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

    // Cambiar el símbolo y el nombre del jugador
    jugador.simbolo = jugador.simbolo === "circulo" ? "cruz" : "circulo";
    jugador.nombre = jugador.simbolo === "circulo" ? jugadorConO : jugadorConX;

    // Actualizar el texto en la interfaz
    infoDisplay.textContent = `Ahora el turno de ${jugador.nombre}`;

    // Deshabilitar el clic en el cuadro actual
    e.target.removeEventListener("click", addGo);

    // Incrementar el contador de movimientos
    movimientosTotales++;

    const resultado = checkScore();
    if (resultado.gameWon) {
        const ganador = resultado.ganador;

        // Actualizar el historial de victorias
        actualizarHistorial(ganador);

        infoDisplay.textContent = `Gano ${ganador}`;
    } else {
        // Si no hay ganador, verificar empate
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

    inputJugador1.disabled = false;
    inputJugador2.disabled = false;
};

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

    botonA.textContent = 1;
    botonB.textContent = 2;

    inputJugador1.value = ""; 
    inputJugador2.value = ""; 
    inputJugador1.setAttribute('placeholder', 'Jugador1');
    inputJugador2.setAttribute('placeholder', 'Jugador2'); 

    elegirJugadores.classList.remove("novisible");
    elegirJugadores.classList.add("visible");
    elegir.classList.remove("visible");
    elegir.classList.add("novisible");

    botonA.disabled = true;
    botonB.disabled = true;

    inputJugador1.disabled = false;
    inputJugador2.disabled = false;

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
    contenedorHistorial.innerHTML = ""; // Borra el contenido anterior

    // Supongamos que historialDeVictorias es un objeto con los datos del historial
    for (const jugador in historialDeVictorias) {
        if (historialDeVictorias.hasOwnProperty(jugador)) {
            const victorias = historialDeVictorias[jugador];

            // Crea un elemento div para mostrar el nombre del jugador y sus victorias
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