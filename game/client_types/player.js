/**
 * # Player type implementation of the game stages
 * Copyright(c) 2020 Edgar Andrade <edgar.andrade@urosario.edu.co>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    stager.setOnInit(function() {

        // Initialize the client.

        var header, frame;

        // Bid is valid if it is a number between 0 and 100.
        this.isValidBid = function(n) {
            return node.JSUS.isInt(n, -1, 101);
        };

        // Setup page: header + frame.
        header = W.generateHeader();
        frame = W.generateFrame();

        // Add widgets.
        this.visualRound = node.widgets.append('VisualRound', header);
        this.visualTimer = node.widgets.append('VisualTimer', header);
        this.doneButton = node.widgets.append('DoneButton', header);

        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)
    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm',
				donebutton: false,
				cb: function() {
					node.on.data('Nplayers', function(msg){
						var n_jugadores = msg.data[0];
						var umbral = msg.data[1];
						var rondas = msg.data[2];
						var informacion = msg.data[3];
						var segundos = Math.floor(Number(msg.data[4])/1000);
						W.setInnerHTML('personas', n_jugadores);
						W.setInnerHTML('umbral1', umbral);
						W.setInnerHTML('umbral2', umbral);
						W.setInnerHTML('rondas', rondas);
						W.setInnerHTML('segundos1', segundos);
						W.setInnerHTML('segundos2', segundos);
						if (informacion == true) {
							W.setInnerHTML('informacion', 'la asistencia al bar, así como ');
						};
					});
					// Continue Boton
					var boton_done = W.gid('continuar');
					boton_done.onclick = function() {
						node.done();
					};
				}
    });

		stager.extendStep('pagos', {
        frame: 'pagos.htm',
				cb: function() {
					node.on.data('pagos', function(msg){
						var pago = Number(msg.data)/1000;
						W.setInnerHTML('pago', pago);
					});
				}
    });

    stager.extendStep('eleccion', {
        donebutton: false,
        frame: 'game.htm',
        cb: function() {
            var boton_ir, boton_quedarse;

            // W.gid = W.getElementById.
            boton_ir = W.gid('boton_ir');
            boton_quedarse = W.gid('boton_quedarse');

            // Listen on click event.
            boton_ir.onclick = function() {
                var decision;
                decision = 1
                boton_ir.disabled = true;
                boton_quedarse.disabled = true;

                // Mark the end of the round, and
                // store the decision in the server.
                node.done({ estado: decision });
            };

            // Listen on click event.
            boton_quedarse.onclick = function() {
                var decision;
                decision = 0
                boton_ir.disabled = true;
                boton_quedarse.disabled = true;

                // Mark the end of the round, and
                // store the decision in the server.
                node.done({ estado: decision });
            };

        },
		timeup: function() { //Me Parece este codigo no tiene funcionalidad (PREGUNTAR)
        var decision;
        // Generate random decision.
        decision = J.randomInt(-1,1);
					node.done({ estado: decision });
        }
    });

    stager.extendStep('puntaje', {
        donebutton: true,
        frame: 'puntaje.htm',
        cb: function() {
            node.on.data('PUNTAJE', function(msg){
              //W.setInnerHTML('canvas_container1', msg.data);
              node.emit('drawScore', msg.data);
            });

            node.on.data('ASISTENCIAS', function(msg){
              //W.setInnerHTML('canvas_container2', msg.data);
              node.emit('drawAsistencia', msg.data);
            });
            // Continue Boton
            var boton_done = W.gid('continuar');
            boton_done.onclick = function() {
							node.done();
            };

        }
    });

    stager.extendStep('end', {
        donebutton: false,
        frame: 'end.htm',
        cb: function() {
            node.on.data('SUMPUNTAJE', function(msg){
							W.setInnerHTML('canvas_container_puntaje', msg.data[0]);
							W.setInnerHTML('canvas_container_dinero_puntaje', msg.data[1]);
							W.setInnerHTML('canvas_container_dinero_total', msg.data[2]);
                //node.emit('sumScore', msg.data);
              });

            node.game.visualTimer.setToZero();
        }
    });
};
