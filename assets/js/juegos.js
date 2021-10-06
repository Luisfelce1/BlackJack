
/**Función anónima autoinvocada 
   crea un scok que no podrá ser 
   llamado desde la consola.
   de esta manera estiamos protegiendo
   nuestro codigo
 **/
const miModulo = (() => {
    'use strict';

    //Estableciendo el arreglo de cartas 
    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'];
    const especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];

    //REferencias del HTML 
    const btnPedir = document.querySelector('#btnPedir');
    const btnDetener = document.querySelector('#btnDetener');
    const btnNuevo = document.querySelector('#btnNuevo');


    const divCartasJugadores = document.querySelectorAll('.divCartas');
    const puntosHTML = document.querySelectorAll('small');


    // inicializa el juego o la baraja
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }
        puntosHTML.forEach(elem => elem.innerHTML = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }
    //Creando una nueva baraja
    const crearDeck = () => {
        deck = []; //Reinicializando el la baraja
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }
        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo)
            }
        }
        //Desordenando el arreglo de cartas
        return _.shuffle(deck);
    }

    //Esta  función permite pedir una carta
    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    }

    // Creando la lógica del valor que tiene cada carta 
    const valorCarta = (carta) => {

        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) ?
            (valor === 'A') ? 11 : 10 :
            valor * 1;
    }

    //turno: 0 = primer jugador y el ultimo es la computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta); //sumar las cartas que van saliendo
        puntosHTML[turno].innerText = puntosJugadores[turno]; //imprimir la puntuacion en el html indicado (small en posicion 0)
        return puntosJugadores[turno];
    }

    // creamos la función de las carta de cada jugador y aparecerá dependiendo del [turno]
    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img'); //creo la img
        imgCarta.src = `./assets/cartas/${carta}.png`;// le agrego la ruta de la carta a la imagen 
        imgCarta.classList.add('carta') //agrego el styilo de ccss llamado carta
        divCartasJugadores[turno].append(imgCarta);
    }

    //Turno de la computadora
    const turnoBot = (puntosMinimos) => {

        let puntosBot = 0;
        do {
            const carta = pedirCarta();
            puntosBot = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);

        } while ((puntosBot < puntosMinimos) && puntosMinimos <= 21);
        determinarGanador();
    };

    // nueva función para determinar el jugador.
    const determinarGanador = () => {
        const [puntosMinimos, puntosBot] = puntosJugadores; //creo una contstate y la desestructuro de la función puntosJugadores
        setTimeout(() => {
            if (puntosBot === puntosMinimos) {
                alert('Nadie gana :(');
            } else if (puntosMinimos > 21) {
                alert('BOt gana :(');
            } else if (puntosBot >= 22) {
                alert('Has Ganado!!!');
            } else {
                alert('BOt gana :(');
            }
        }, 70);
    }
    // escuchar los Eventos de los Botones
    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0);

        //Controlar los puntos 
        if (puntosJugador > 21) {
            console.warn('Perdiste');
            btnPedir.disabled = true; //bloquear boton al cumplirse la condición
            btnDetener.disabled = true;
            turnoBot(puntosJugador);

        } else if (puntosJugador === 21) {
            console.warn('21, Genial!!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoBot(puntosJugador);
        }
    });

    // evento de detener juego
    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoBot(puntosJugadores[0]);
    })

    btnNuevo.addEventListener('click', () => {

        inicializarJuego();
    });

    /*LO que se retorna aquí es lo unico que 
      va a ser público en todo mi código */
   // return {
   //     nuevoJuego: inicializarJuego
   // }

})();

