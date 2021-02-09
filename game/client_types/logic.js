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
            node.on.data('done', function(msg) {
                var estado;
                estado = msg.data.estado;
                if (estado == 1) {
                  console.log('Jugador ' + msg.from + ' va al bar.');
                } else {
                  console.log('Jugador ' + msg.from + ' NO va al bar.');
                }
            }); // End on.data 'done'
        }
    });

    stager.extendStep('puntaje', {
        cb: function() {
          var ronda = node.player.stage.round;
          console.log('Puntaje ronda ' + ronda + '...');
          // CODIGO EDGAR
          // Obtiene asistencia como lista
          var n = node.game.memory.select('estado').fetch();
          // console.log(n);
          var asistencia = [];
          var p;
          for (var r = 1; r <= ronda; r++) {
            p = 0;
            n.forEach((item, i) => {
              if (item['stage']['round'] == r) {
                if (item['estado'] == '1') {
                  p += 1;
                }
              }
            }); // End forEach
            asistencia.push(p);
          } // End for
          // Loop through all connected players.
          node.game.pl.each(function(player) {
              // find whether player went to bar
              n = node.game.memory.select('estado').and('player','=',player.id).fetch();
              // console.log(n);
              var puntaje=[];
              for (var r = 1; r <= ronda; r++) {
                n.forEach((item, i) => {
                  if (item['stage']['round'] == r) {
                    // Hacer todas las consideraciones para incluir
                    // el umbral y sacar el puntaje
                    puntaje.push(item['estado']);
                  }
                }); // End forEach
              } // End for
              // Get the value saved in the registry, and send it.
              node.say('ASISTENCIA', player.id, [asistencia.toString(), puntaje.toString()]);
          });

          // // Obtiene asistencia como lista
          // var n = node.game.memory.select('estado').fetch(); // Select in the memory the raw data that contains "estado"
          // var groupedByPlayer=groupBy(n, 'player') // Dictionary: Agrupation by player
          // console.log(groupedByPlayer);
          // // console.log(n);
          // var asistencias ={} // Saves Player : [Estado_1,...,Estado_r]
          // var asistencia = [];
          // var p;
          // for(var player in groupedByPlayer){
          //
          //   var player_stages = groupedByPlayer[player] // Is a JSON
          //
          //   for (var i = 0; i < player_stages.length;i++ ){
          //
          //     var player_stage = player_stages[i]
          //     var estado = player_stage['estado']
          //
          //
          //     if(asistencias[player]){ // If there exist already the key
          //       asistencias[player].push(estado)
          //     } else { // If not create the key:array
          //       asistencias[player] = [estado]
          //     }
          //
          //   }
          // }
          // console.log(asistencias)
          // for (var r = 1; r <= ronda; r++) {
          //   p = 0;
          //   n.forEach((item, i) => {
          //     if (item['stage']['round'] == r) {
          //       if (item['estado'] == '1') {
          //         p += 1;
          //       }
          //     }
          //   }); // End forEach
          //   asistencia.push(p);
          // } // End for
          // // Loop through all connected players.
          // node.game.pl.each(function(player) {
          //     // Get the value saved in the registry, and send it.
          //     node.say('ASISTENCIA', player.id, asistencia.toString());
          //     node.say('ASISTENCIAS',player.id, JSON.stringify(asistencias))
          // });

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

var groupBy = function(xs, key) { // Function that agroup values by key
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
