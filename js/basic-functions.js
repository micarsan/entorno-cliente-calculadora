let debug = true; //define si muestra mensajes de depuración en console.log


/*  No tocar a partir de aquí */

let calculado = false; //para saber si se está mostrando el resultado
let history = ''; //guarda el historial de operaciones

const operadores = ['+', '*', '/']; //operadores
const signos = ['-']; //signos
const decimales = [',', '.']; //caracteres de puntuación decimal
const noNumeric = ['x', 'X', ':']; //Valores no numéricos permitidos
const operadores_signos = operadores.concat(signos);
const operadores_decimales = operadores.concat(decimales);
const operadores_signos_decimales = operadores.concat(signos, decimales);
const permitidos = operadores.concat(signos, decimales, noNumeric); //Valores permitidos (todos los anteriores)

// Asocia un caracter con el id de la tecla en cuestión
const keys_functions = {
    'm+':'mmas',
    'mr':'mr',
    'borrar':'borrar',
    '/':'dividir',
    '*':'multiplicar',
    '-':'restar',
    '+':'sumar',
    '=':'igual',
    ',':'coma',
    '9':'nueve',
    '8':'ocho',
    '7':'siete',
    '6':'seis',
    '5':'cinco',
    '4':'cuatro',
    '3':'tres',
    '2':'dos',
    '1':'uno',
    '0':'cero'
};

let operator = ''; //define la operación a realizar


window.addEventListener("load", windows_load);
window.addEventListener("resize", on_resize);

//ejecuciones cuando cargue la página
function windows_load() {
    
    // Cargamos fondo y transiciones
    change_background_image();
    
    // Ajustamos al centro centro el contenido
    on_resize();
    
    // Animamos el icono de información tras 1 segundo
    setTimeout(() => {
        document.getElementById('info').classList.add('animate');
    }, 1000);

    // Bloqueamos la pantalla en vertical
    screen.orientation.lock('portrait')
    .then( () => {
      console.log( 'Locked to portrait' );
    })
    .catch( (error) => {
        console.log( 'Locked to portrait error: ' + error );
    });

}


document.addEventListener('DOMContentLoaded', () => {
    
    // Recorremos keys_functions y generamos un evento para cada button
    for ( let key of Object.keys(keys_functions) ) {
        document.getElementById(keys_functions[key]).addEventListener("click", window[keys_functions[key]]);
        if (debug) console.log( 'Key registrada: ' + keys_functions[key] );
    }

    document.body.addEventListener('keyup', (e) => {
        if (debug) console.log(`Tecla "${e.key}" liberada [event: keyup]`);

        if (!isNaN(e.key)) { //si es un número, lo añadimos
            display_add(e.key);
        } else {
            switch (e.key) {
                case 'Backspace':
                case 'Delete':
                    borrar();
                    break;
                case '/':
                    key_effect('dividir');
                    dividir();
                    break;
                case '*':
                case 'x':
                case 'X':
                    key_effect('multiplicar');
                    multiplicar();
                    break;
                case '-':
                    key_effect('restar');
                    restar();
                    break;
                case '+':
                    key_effect('sumar');
                    sumar();
                    break;
                case ',':
                case '.':
                    key_effect('coma');
                    coma();
                    break;
                case 'Enter':
                    key_effect('igual');
                    igual();
                    break;
            }
        }
    });
});


// Añade un valor al display
function display_add(caracter) {


    if (debug) console.log('caracter a añadir: ' + caracter);
    if (debug) console.log('display value: ' + display.value);


    // Si es un número el caracter introducido
    if (!isNaN(caracter)) {
        
        if (debug) console.log('El carácter es un número: ' + caracter);

        //animamos el botón
        for ( let key of Object.keys(keys_functions) ) {
            if( caracter == key ) {
                key_effect(keys_functions[key]);
            }
        }
    
        
        if (calculado) {
            if (debug) console.log('Tenemos ya un resultado calculado. Borramos');
            ac(false);
            calculado = false;
        }
        
        display.value = String(display.value) + String(caracter);
    
    } else {
        // Si no es un número el caracter introducido
        
        // Recorremos los carácteres permitidos
        for (let element of permitidos) {
            
            // Si es un carácter válido
            if (caracter == element) {

                let display_value = display.value; //guardamos el valor del display
                // Si el display tiene un resultado, cogemos sólo la última línea (para seguir interactuando)
                if (calculado) {
                    display_value = display.value.substr(display_value.lastIndexOf("\n") + 1);
                    display.value = display_value;
                }

                let introducir_caracter = true; // Si vamos a introducir el caracter que estamos analizando
                let value_split = [display_value]; //Array con el valor inicial
                let operator_found = false; //para saber si hay ya un operador
                let is_operator = false; // para saber si el carácter es un operador
                let decimal_found = false; //para saber si se ha encontrado un decimal
                let value_decimal = false; //para saber si ya tiene un decimal el último número introducido
                
                //guardamos el último carácter introducido ya que lo necesitaremos para comprobaciones
                let last_character;
                if( display_value.length > 0 ) {
                    last_character = display_value.charAt(display_value.length - 1);
                    if (debug) console.log('last_character: ' + last_character);
                }
                
                // Si está vacío el input y es un signo, lo introducimos y saltamos el resto de comprobaciones
                if( display_value.length == 0 ) {
                    for (let item of signos) {
                        if( item == caracter ) {
                            display.value = caracter;
                            return true;
                        }
                    }
                    if (debug) console.log('No se puede empezar por algo que no sea un signo o número');
                    return false;
                }
                
                if (debug) console.log('display value length: ' + display.value.length);

                // Si el último carácter es un signo, salimos (sólo puede haber un número)
                for ( let item of signos ) {
                    if( last_character == item ) {
                        if (debug) console.log('Tras un signo, sólo puede haber un número');
                        return false;
                    }
                }

                //si el carácter está repetido
                if( caracter == last_character ) {
                    if (debug) console.log('Omitiendo caracter repetido: ' + last_character);
                    return false;
                }


                // Recorremos los carácteres válidos
                for (let item of operadores_decimales) {
                    
                    // Si ya tenemos ese caracter introducido
                    if ( !calculado && last_character == item) {
                        
                        //comprobamos que no se está introduciendo un signo
                        for (let signos_item of signos) {
                            if( signos_item == caracter ) {
                                display.value = display.value + caracter;
                                return true;
                            }
                        }

                        if (debug) console.log('eliminando el caracter duplicado: ' + item + ' posición:' + display.value.indexOf(item));

                        display_del(); //eliminamos el último caracter

                        //volvemos a lanzar esta función para que se evalúe si se tiene que introducir
                        display_add(caracter);
                        return false;
                    }
                }

                //comprobamos si ya hay algún operador
                for (let line of operadores) {
                    
                    if ( display_value.indexOf(line).length > 0 ) {

                        if (debug) console.log('operador ya en display: ' + line + ' posición:' + display_value.indexOf(line));
                        operator = line;
                        operator_found = true;
                        value_split = display_value.split(line);
                        break;
                    }
                }

                //comprobamos si ya hay un signo (-) en la cifra
                for (let signos_line of signos) {
                    if (caracter == signos_line) {
                        //recorremos la última cifra por si tiene algún signo ya
                        if (value_split[value_split.length - 1].indexOf(caracter) > 0) {
                            if (debug) console.log('Signo duplicado :' + caracter);
                            operator_found = true;
                            break;
                        }
                    }
                }

                // Comprobamos si es un operador
                for (let operadores_signos_line of operadores_signos) {
                    if (caracter == operadores_signos_line) {
                        is_operator = true;
                    }
                }

                // Volvemos a partir por el retorno de carro para separar operandos
                value_split = display_value.split("\n");

                //comprobamos si ya hay algún decimal (en el último número introducido)
                for (let decimales_line of decimales) {
                    if (caracter == decimales_line) {
                        value_decimal = true;
                    }
                    if (element == decimales_line && value_split[value_split.length - 1].indexOf(',') > 0) {
                        if (debug) console.log('decimal encontrado: ' + decimales_line);
                        decimal_found = true;
                        break;
                    }
                }

                if (debug) console.log('operador encontrado: ' + operator_found);
                if (debug) console.log('operador: ' + operator);
                if (debug) console.log('decimal encontrado: ' + decimal_found);
                if (debug) console.log('valor decimal: ' + value_decimal);
                if (debug) console.log('valueSplit: ' + value_split);

                if ( ( (!operator_found && !value_decimal) | (value_decimal && !decimal_found) ) ) {
                    if (debug) console.log('display value: ' + display_value + ' - añadir: ' + caracter);

                    calculado = false;

                    // Si el carácter es un operador
                    if (is_operator) {

                        //comprobamos si hay más de 2 líneas
                        if( display.value.split("\n").length > 1 ) {
                            
                            // calculamos
                            calcular();
                            
                            // volvemos a lanzar esta función para que se evalúe si se tiene que introducir
                            display_add(caracter);
                            
                            return false;
                        }

                        display.value = String(display_value) + String("\n" + caracter);
                    
                    } else {
                        display.value = String(display_value) + String(caracter);
                    }

                }

                // Hemos encontrado y evaluado el caracter por lo que no seguimos 
                break;
            }
        };


    }
}

function calcular() {

    // Si no hay nada que calcular, salimos
    if( display.value.length < 1 ) {
        if (debug) console.log('No hay contenido para calcular.');
        return false;
    }

    // Si hemos calculado y no hay cambios, salimos
    if( calculado ) {
        if (debug) console.log('Ya se ha calculado.');
        return false;
    }

    if (debug) console.log('línea de cálculo: ' + String(display.value.replace(',', '.')).replace(',', '.'));
    
    // Evaluamos el contenido reemplazando las comas por puntos
    let resultado = eval(String(display.value.replace(',', '.')).replace(',', '.'));
    
    if (debug) console.log('eval: ' + resultado);

    // Insertamos el resultado reemplazando los puntos por comas
    display.value = display.value + "\n" + String(String(resultado).replace('.', ',')).replace('.', ',');

    history += display.value + "\n\n";
    if (debug) console.log('history: ' + history);

    calculado = true;

    //Habilitamos el botón del historial
    document.getElementById('history').classList.add('active');

}

// Elimina el último carácter del display
function display_del() {
    if (display.value.length > 0) {
        if (debug) console.log('Borrando último carácter: ' + display.value.charAt(display.value.length - 1));
        display.value = display.value.slice(0, -1);

        //comprobamos si el último carácter que queda es un retorno de carro y lo eliminamos
        while( display.value.charAt(display.value.length - 1) == "\n" ) {
            display.value = display.value.slice(0, -1);
        }
    } else {
        key_effect('ac');
        if (debug) console.log('No hay nada más que borrar');
    }
}

// Limpiar display y poner todo a cero
function ac( history_clear = true ) {
    
    key_effect('ac');
    
    display.value = '';
    operator = '';
    calculado = false;
    
    if (history_clear) {
        history = '';
        document.getElementById('history').classList.remove('active');
    }
}

function borrar() {
    key_effect('borrar');
    display_del();
}

function mmas() {
    key_effect('mmas');
}
function mr() {
    key_effect('mr');
}

function dividir() {
    display_add('/');
    key_effect('dividir');
}
function multiplicar() {
    display_add('*');
    key_effect('multiplicar');
}
function restar() {
    display_add('-');
    key_effect('restar');
}
function sumar() {
    display_add('+');
    key_effect('sumar');
}
function igual() {
    calcular();
    key_effect('igual');
}
function coma() {
    display_add(',');
    key_effect('coma');
}
function nueve() {
    display_add(9);
    key_effect('nueve');
}
function ocho() {
    display_add(8);
    key_effect('ocho');
}
function siete() {
    display_add(7);
    key_effect('siete');
}
function seis() {
    display_add(6);
    key_effect('seis');
}
function cinco() {
    display_add(5);
    key_effect('cinco');
}
function cuatro() {
    display_add(4);
    key_effect('cuatro');
}
function tres() {
    display_add(3);
    key_effect('tres');
}
function dos() {
    display_add(2);
    key_effect('dos');
}
function uno() {
    display_add(1);
    key_effect('uno');
}
function cero() {
    display_add(0);
    key_effect('cero');
}


/**
 * ======= a partir de aquí, estética e interacción con la UI ========
 */


function key_effect(key) {
    if (debug) console.log('key_effect: ' + key);
    document.getElementById(key).classList.add('active');
    setTimeout(() => {
        document.getElementById(key).classList.remove('active');
    }, 150);
}

/**
 * Ajustar la posición de la calculadora (centrala)
 */

 let calculadora = document.getElementById('calculadora');

 //para reajustar la posición de la calculadora siempre al centro
 function on_resize() {
 
     if (debug) console.log('on_resize launched');
 
     let calculadora_position = document.getElementById('calculadora').getBoundingClientRect();
 
     //Calculamos el alto y centramos:
     calculadora.style.position = 'absolute';
     calculadora.style.left = (window.innerWidth - calculadora_position['width']) / 2 + 'px';
     calculadora.style.top = (window.innerHeight - 26 - calculadora_position['height']) / 2 + 'px';
 
     reajusta_modal();
 }
 
 
/**
 * Modal
 */

//reajusta el tamaño del modal para que se ajuste a la calculadora
function reajusta_modal() {

    let calculadora_position = document.getElementById('calculadora').getBoundingClientRect();

    let modal = document.getElementsByClassName('modal-content')[0];
    let modal_body = document.getElementById('modal-body');

    modal.style.left = (window.innerWidth - calculadora_position['width']) / 2 + 'px';
    modal.style.top = (window.innerHeight - 26 - calculadora_position['height']) / 2 + 'px';

    modal.style.width = calculadora_position['width'] - 2;
    modal.style.height = calculadora_position['height'];
    modal_body.style.height = calculadora_position['height'] - 46;
}

// muestra el modal con la cabecera y cuerpo recibidos
function show_modal(header, body) {

    //reajustamos posición (por si lo necesita)
    reajusta_modal();

    //cabecera
    document.getElementById('modal-title').innerHTML = header;
    
    //cuerpo
    document.getElementById('modal-body').innerHTML = body;

    //mostramos y animamos
    document.getElementById('modal').style.display = 'block';
    setTimeout(() => {
        document.getElementById('modal').classList.add('active');
    }, 50);
}


/**
 * Historial
 */

function show_history() {

    let header = 'Historial';
    let body = '<pre id="history_data">Sin historial</pre>';

    //si hay historial, actualizamos body
    if (history) {
        body = '<pre id="history_data">' + history + '</pre>';
    }

    show_modal(header, body);
}

/**
 * Información
 */
 function show_info() {
    
    let header = 'Acerca de';
    let body =    '<p style="margin-top: 0;">Disfrute de un nuevo fondo cada vez que cargue la página.</p>' 
                + '<p style="margin-bottom: 0;">Aprecie las transiciones:</p>'
                    + '<ul style="margin-top: 0;"><li>Al cargar la página.</li><li>Al redimensionar.</li><li>El corazón de la barra inferior.</li><li>Al mostrar este modal.</li><li>Y otras más...</li></ul>'
                + '<p>Puede utilizar el ratón pero, para su comodidad, utilice el teclado (la tecla retroceso borra &#128521;).</p>'
                + '<p><a href="https://github.com/micarsan/entorno-cliente-calculadora">Código en github</a><br><a href="http://miguelcarmona.com">Sobre mi</a></p>'
                + '<p>Licencia MIT.</p>'
                + '<p>Imágenes con <a href="https://unsplash.com/es/licencia">licencia copyleft unsplash</a>.</p>';

    show_modal(header, body);
}


//cerramos al hacer click fuera del modal (cuando se esté mostrando)
window.onclick = function (event) {
    if (event.target == document.getElementById('modal')) {
        close_modal(event);
    }
}

//cierra el modal (con su animación)
function close_modal() {
    document.getElementById('modal').classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none'
    }, 600);
}

/**
 * Nueva ventana
 */
function new_window() {

    let calculadora_position = document.getElementById('calculadora').getBoundingClientRect();
    let width = calculadora_position['width'] + 60;
    let height = calculadora_position['height'] + 100;

    window.open(
        window.location.href,
        'Calculadora' + Date.now(),
        'width=' + width + ',height=' + height
    );
}


/**
 * Cambios de imagen de fondo (con transiciones)
 */
function change_background_image() {

    //Generamos un entero aleatorio entre 0 y 17 (tenemos 18 imágenes contando la 00)
    var random = Math.floor(Math.random() * 18);
    if (random < 10) random = '0' + random;
    console.log('random: ' + random);

    console.log('background-image: url("css/img/bg0' + random + '.webp")');

    document.getElementById('loading').style["background-image"] = 'url("css/img/bg' + random + '.webp")';


    /// Animaciones de carga de contenido

    setTimeout(() => {
        document.getElementById('black').classList.add('close');
    }, 50);
    setTimeout(() => {
        document.getElementById('black').style.display = 'none';
    }, 350);

    setTimeout(() => {
        document.getElementById('loading').classList.add('close');
    }, 200);
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 700);

    document.body.style["background-image"] = 'url("css/img/bg' + random + '.webp")';
}

