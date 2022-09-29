let debug = true; //define si muestra mensajes de depuración en console.log


/*  No tocar a partir de aquí */

let calculado = false; //para saber si se está mostrando el resultado
let history = ''; //guarda el historial de operaciones
const operadores = ['+','*','/']; //operadores
const signos = ['-']; //signos
const decimales = [',','.']; //caracteres de puntuación decimal
const noNumeric = ['x','X',':']; //Valores no numéricos permitidos
const operadores_signos = operadores.concat( signos );
const operadores_decimales = operadores.concat( decimales );
const operadores_signos_decimales = operadores.concat( signos, decimales );
const permitidos = operadores.concat( signos, decimales, noNumeric ); //Valores permitidos (todos los anteriores)

let operator = ''; //define la operación a realizar


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ac').addEventListener("click", ac);
    document.getElementById('dividir').addEventListener("click", dividir);
    document.getElementById('multiplicar').addEventListener("click", multiplicar);
    document.getElementById('restar').addEventListener("click", restar);
    document.getElementById('sumar').addEventListener("click", sumar);
    document.getElementById('igual').addEventListener("click", igual);
    document.getElementById('coma').addEventListener("click", coma);
    document.getElementById('nueve').addEventListener("click", nueve);
    document.getElementById('ocho').addEventListener("click", ocho);
    document.getElementById('siete').addEventListener("click", siete);
    document.getElementById('seis').addEventListener("click", seis);
    document.getElementById('cinco').addEventListener("click", cinco);
    document.getElementById('cuatro').addEventListener("click", cuatro);
    document.getElementById('tres').addEventListener("click", tres);
    document.getElementById('dos').addEventListener("click", dos);
    document.getElementById('uno').addEventListener("click", uno);
    document.getElementById('cero').addEventListener("click", cero);

    document.body.addEventListener('keyup', (e) => {
        if( debug ) console.log(`Tecla "${e.key}" liberada [event: keyup]`);
        
        if( !isNaN(e.key) ) { //si es un número, lo añadimos
            display_add(e.key);
        } else {
            switch ( e.key ) {
                case 'Backspace':
                    display_del();
                    break;
                case '/':
                    dividir();
                    break;
                case '*':
                case 'x':
                case 'X':
                    multiplicar();
                    break;
                case '-':
                    restar();
                    break;
                case '+':
                    sumar();
                    break;
                case ',':
                case '.':
                    coma();
                    break;
                case 'Enter':
                    igual();
                    break;
            }
        }
      });
});


// Añade un valor al display
function display_add( caracter ) {


    if( debug ) console.log( 'display value: ' + display.value );
    if( debug ) console.log( 'display value length: ' + display.value.length );
    if( debug ) console.log( 'display value last char: ' + display.value.charAt(display.length - 1) );


//comprobamos si hay historial para habilitar el botón
//if( history ) { document.getElementById('history').classList.add('active'); }

    if( !isNaN(caracter) ) {
        if( debug ) console.log( 'El carácter es un número: ' + caracter );
        if( calculado ) {
            if( debug ) console.log( 'Tenemos ya un resultado calculado. Borramos' );
            ac(false);
            calculado = false;
        }
        display.value = String(display.value) + String(caracter);
    } else {
        // Si no hay ningún número
        for( let element of permitidos ) {
            if( caracter == element ) {
                let display_value = display.value;
                if( calculado ) { display_value = display.value.substr(display_value.lastIndexOf("\n")+1); }
                let value_split = [display_value];
                let operator_found = false; //para saber si hay ya un operador
                let is_operator = false; // para saber si el carácter es un operador
                let decimal_found = false; //para saber si se ha encontrado un decimal
                let value_decimal = false; //para saber si ya tiene un decimal el último número introducido
                
                if( debug ) console.log('caracter a añadir: ' + element);
                
                for( let element2 of operadores_decimales ) {
                    // Si el último elemento es un caracter válido no numérico
                    if( !calculado && display_value.charAt( display_value.length - 1 ) == element2 ) {
                        
                        if( debug ) console.log('eliminando el caracter encontrado al final: ' + element2 + ' posición:' + display.value.indexOf(element2) );
                        
                        display_del(); //eliminamos el último caracter
                        display_value = display.value;
                        
                        //comprobamos si hay un retorno de carro y lo eliminamos
                        if( display_value.charAt( display_value.length - 1 ) == "\n" ) {
                            display_del();
                            display_value = display.value;
                        }
                        
                        if( debug ) console.log('display_value: ' + display_value );
                        break;
                    }
                }

                //comprobamos si ya hay algún operador
                for( let operadores_line of operadores ) {
                    if( display_value.indexOf(operadores_line) > 0 ) {
                        if( debug ) console.log( 'operador ya en display: ' + operadores_line + ' posición:' + display_value.indexOf(operadores_line) );
                        operator = operadores_line;
                        operator_found = true;
                        value_split = display_value.split(operadores_line);
                        break;
                    }
                }

                //comprobamos si ya hay un signo (+ ó -) en la cifra
                for( let signos_line of signos ) {
                    if( caracter == signos_line ) {
                        //recorremos la última cifra por si tiene algún signo ya
                        if( value_split[value_split.length-1].indexOf(caracter) > 0 ) {
                            if( debug ) console.log( 'Signo duplicado :' + caracter );
                            operator_found = true;
                            break;
                        }
                    }
                }


                //si es un operador, insertamos un salto de línea
                for( let operadores_signos_line of operadores_signos ) {
                    if( caracter == operadores_signos_line ) {
                        is_operator = true;
                    }
                }
                
                
                //comprobamos si ya hay algún decimal (en el último número introducido)
                for( let element2 of decimales ) {
                    if( caracter == element2 ) {
                        value_decimal = true;
                    }
                    if( element == element2 && value_split[value_split.length-1].indexOf(',') > 0 ) {
                        if( debug ) console.log( 'decimal encontrado: ' + element2 );
                        decimal_found = true;
                        break;
                    }
                }

                if( debug ) console.log('operador encontrado: ' + operator_found);
                if( debug ) console.log('operador: ' + operator);
                if( debug ) console.log('decimal encontrado: ' + decimal_found);
                if( debug ) console.log('valor decimal: ' + value_decimal);
                if( debug ) console.log('valueSplit: ' + value_split);
                
                if( (!operator_found && !value_decimal) | (value_decimal && !decimal_found) ) {
                    if( debug ) console.log('display value: ' + display_value + ' - añadir: ' + caracter);

                    calculado = false;

                    if( is_operator ) {
                        display.value = String(display_value) + String("\n"+caracter);
                    } else {
                        display.value = String(display_value) + String(caracter);
                    }

                }
                

                break;
            }
        };
        
        
    }
}

function calcular() {
    if( debug ) console.log( 'línea de cálculo: ' + String(display.value.replace(',','.')).replace(',','.') );
    let resultado = eval( String(display.value.replace(',','.')).replace(',','.') );
    if( debug ) console.log( 'eval: ' + resultado );
    
    display.value = display.value + "\n" + String(String(resultado).replace('.',',')).replace('.',',');
    
    history += display.value + "\n\n"
    if( debug ) console.log( 'history: ' + history );

    calculado = true;

    //Habilitamos el botón del historial
    document.getElementById('history').classList.add('active');

}

// Elimina el último carácter del display
function display_del() {
    if( display.value.length > 0 ) {
        display.value = display.value.slice(0, -1);
    }
}

function ac( history_clear = true ) {
    display.value = '';
    operator = '';
    calculado = false;
    if( history_clear ) {
        history = '';
        document.getElementById('history').classList.remove('active');
        document.getElementById('history_data').innerHTML = 'Sin historial';
    }
//location.reload();
}
function dividir() {
    display_add('/');
}
function multiplicar() {
    display_add('*');
}
function restar() {
    display_add('-');
}
function sumar() {
    display_add('+');
}
function igual() {
    calcular();
}
function coma() {
    display_add(',');
}
function nueve() {
    display_add(9);
}
function ocho() {
    display_add(8);
}
function siete() {
    display_add(7);
}
function seis() {
    display_add(6);
}
function cinco() {
    display_add(5);
}
function cuatro() {
    display_add(4);
}
function tres() {
    display_add(3);
}
function dos() {
    display_add(2);
}
function uno() {
    display_add(1);
}
function cero() {
    display_add(0);
}


/**
 * Posición de la calculadora (centrala)
 */

let calculadora_position = document.getElementById('calculadora').getBoundingClientRect();
let calculadora = document.getElementById('calculadora');


//para reajustar la posición de la calculadora siempre al centro
function onresize() {
    
    if( debug ) console.log('onresize launched');
    
    calculadora_position = calculadora.getBoundingClientRect();

    //Calculamos el alto y centramos:
    calculadora.style.position = 'absolute';
    let pageWidth = window.innerWidth;
    calculadora.style.left = (pageWidth - calculadora_position['width'])/2 +'px';
    let pageHeight = window.innerHeight;
    calculadora.style.top = (pageHeight - 26 - calculadora_position['height'])/2 +'px';

    reajusta_modal();
}
window.addEventListener("load", onresize);
window.addEventListener("resize", onresize);



/**
 * Modal History
 */

//reajusta el tamaño del modal para que se ajuste a la calculadora
function reajusta_modal() {
    
    calculadora_position = calculadora.getBoundingClientRect();
    
    let history_modal = document.getElementsByClassName('modal-content')[0];
    let history_modal_body = document.getElementsByClassName('modal-body')[0];
    
    history_modal.style.left = calculadora_position['left'];
    history_modal.style.top = calculadora_position['top'];
    history_modal.style.width = calculadora_position['width'] - 2;
    history_modal.style.height = calculadora_position['height'];
    history_modal_body.style.height = calculadora_position['height'] - 46;
}

//muestra el modal con el historial
function show_history() {
    
    //reajustamos posición (por si lo necesita)
    reajusta_modal();

    //insertamos contenido
    if( history ) {
        document.getElementById('history_data').innerHTML = history;
    }

    //mostramos y animamos
    document.getElementById('history_modal').style.display = 'block';
    setTimeout(() => {
        document.getElementById('history_modal').classList.add('active')
    }, 50);
}

//cerramos al hacer click fuera del modal (cuando se esté mostrando)
window.onclick = function(event) { 
    if ( event.target == document.getElementById('history_modal') ) {
        close_modal(event);
    }
}

//cierra el modal (con su animación)
function close_modal() {
    document.getElementById('history_modal').classList.remove('active');
    setTimeout(() => {
        history_modal.style.display = 'none'
    }, 600);
}

/**
 * Nueva ventana
 */
function new_window() {
   
    let width = calculadora_position['width'] + 40;
    let height = calculadora_position['height'] + 80;

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
    var random = Math.floor( Math.random() * 18 );
    if( random < 10 ) random = '0'+random;
    console.log('random: ' + random);

    console.log('background-image: url("css/img/bg0' + random + '.webp")');
    //document.body.style.background( "url('img/bg0" + random + ".webp') no-repeat center center fixed" );
    document.getElementById('loading').style["background-image"] = 'url("css/img/bg' + random + '.webp")';
    // document.getElementById('black').classList.add('close');
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

change_background_image();