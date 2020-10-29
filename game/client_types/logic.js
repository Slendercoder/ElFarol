/**
 * # Logic type implementation of the game stages
 * Copyright(c) 2020 Edgar Andrade <edgar.andrade@urosario.edu.co>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

var ngc = require('nodegame-client');
var J = ngc.JSUS;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var node = gameRoom.node;
    var channel =  gameRoom.channel;

    // Must implement the stages here.

    stager.setOnInit(function() {
        // Initialize the client.
    });

    stager.extendStep('instructions', {
        cb: function() {
            console.log('Instructions.');
        }
    });

    stager.extendStep('eleccion', {
        cb: function() {
            console.log('\n%%%%%%%%%%%%%%%');
            console.log('Game round: ' + node.player.stage.round);
            var X;
            X = 0;
            node.on.data('done', function(msg) {
                var estado;
                estado = msg.data.estado;

                if (estado == 1) {
                  X += 1;
                  console.log('Jugador ' + msg.from + ' va al bar.');
                } else {
                  console.log('Jugador ' + msg.from + ' NO va al bar.');
                }
            // node.game.memory.add({
            //       ronda: node.player.stage.round,
            //       asistencia: X
            //     });
            node.game.asistencia.push(X)
            }); // End callback
        }
    });

    stager.extendStep('puntaje', {
        cb: function() {
          console.log('Puntaje...');
          var n;
          n = node.game.asistencia;
          lista_string = n.toString();
          // for (var i = 0; i<5; i++){
          //   asistencia.push(aux[i][value])
          // }
          // Loop through all connected players.
          node.game.pl.each(function(player) {
              // Get the value saved in the registry, and send it.
              node.say('ASISTENCIA', player.id, n);
          });
        }
    });

    stager.extendStep('end', {
        cb: function() {
            // Save data in the data/roomXXX directory.
            node.game.memory.save('data.json');
        }
    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
