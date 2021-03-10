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

// Function to find total attendance
function findAttendance(n,ronda) {
	var asistencia = [];
	var p; // Inicializa variable de asistencia total en ronda
	for (var r = 1; r <= ronda; r++) {
		p = 0;
		n.forEach((item, i) => {
			if (item['stage']['round'] == r) {
				if (item['estado'] == '1') {
					p += 1; // item contiene una asistencia que se adiciona
				}
			}
		}); // End forEach
		asistencia.push(p);
	}
	return asistencia;
}; // end function findAttendance

// Finction to find assistencias per player
function findPlAttendances(n) {
	var groupedByPlayer = groupBy(n,'player'); // Dictionary: Agrupation by player
	var asistencias = {};
	for(var player in groupedByPlayer){
	  var player_stages = groupedByPlayer[player]; // Is a JSON
	  for (var i = 0; i < player_stages.length; i++){
	    var player_stage = player_stages[i];
	    var estado = player_stage['estado'];
	    if(asistencias[player]){ // If there exist already the key
	      asistencias[player].push(estado);
	    } else { // If not create the key:array
	      asistencias[player] = [estado];
	    }
	  }
	}
	return asistencias;
}

// Function to find bar overcrowed
function findOvercrowded(asistencia,umbral,ronda) {
	var overcrowed = [];
	for (var r = 0; r < ronda; r++) {
		if (asistencia[r] > umbral) {
			overcrowed.push(1);
		} else {
			overcrowed.push(0);
		}
	}
	return overcrowed;
}; // end function findOvercrowded

function findScore(players_attendance,overcrowed,ronda) {
	var score = [];
	for (var r = 0; r < ronda; r++) {
		if (players_attendance[r] == 0) {
			score.push(0);
		} else {
			if (overcrowed[r] == 0) {
				score.push(1);
			} else {
				score.push(-1);
			}
		}
	}
	return score;
}; // end function findScore

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var node = gameRoom.node;
    var channel =  gameRoom.channel;

    // Must implement the stages here.

    stager.setOnInit(function() {
        // Initialize the client.
    });

    stager.extendStep('instructions', {
        cb: function() {
            console.log('Instrucciones...');
						var n_players = node.game.pl.pcounter;
						node.game.pl.each(function(player) {
							node.say('Nplayers', player.id, [n_players, settings.REPEAT, settings.REJILLA, settings.TIMER.eleccion]);
						});
        }
    });

		stager.extendStep('pagos', {
        cb: function() {
            console.log('Pagos...');
						node.game.pl.each(function(player) {
							node.say('pagos', player.id, settings.PAGO);
						});
        }
    });

    stager.extendStep('eleccion', {
        cb: function() {
            console.log('\n%%%%%%%%%%%%%%%');
            console.log('Game round: ' + node.player.stage.round);
            // node.on.data('done', function(msg) {
            //     var estado;
            //     estado = msg.data.estado;
            //     if (estado == 1) {
            //       console.log('Jugador ' + msg.from + ' va al bar.');
            //     } else {
            //       console.log('Jugador ' + msg.from + ' NO va al bar.');
            //     }
            // }); // End on.data 'done'
        }
    });

    stager.extendStep('puntaje', {
        cb: function() {
					var treat = settings.REJILLA;
          // var treat = node.game.settings.REJILLA;
          var ronda = node.player.stage.round;
          console.log('Puntaje ronda ' + ronda + '...');
					var n_players = node.game.pl.pcounter;
          var n = node.game.memory.select('estado').fetch();// Select in the memory the raw data that contains "estado"
					var asistencia = findAttendance(n,ronda);
					// console.log('Asistencia al bar', asistencia);
					var overcrowed = findOvercrowded(asistencia,0.5*n_players,ronda);
					// console.log('Sobrecupo del bar', overcrowed);
					var asistencias = findPlAttendances(n);
          node.game.pl.each(function(player) {
							var players_attendance = asistencias[player.id];
							// console.log('Asistencia del jugador', player.id, players_attendance);
              var puntaje = findScore(players_attendance,overcrowed,ronda);
							// console.log('Puntaje jugador', player.id, puntaje);
              var rondas = [];
							for (var r = 1; r <= ronda; r++) {
								rondas.push(r);
							}
              node.say('PUNTAJE', player.id, JSON.stringify([rondas,puntaje]));
              node.say('ASISTENCIAS',player.id, JSON.stringify([asistencias,overcrowed,player.id,treat]));
          });
        }
    });

    stager.extendStep('end', {
      cb: function() {
        var ronda = settings.REPEAT; // Obtaining round - ERROR, no obtiene las rondas generadas anteriormente
				var n_players = node.game.pl.pcounter;
				var n = node.game.memory.select('estado').fetch();// Select in the memory the raw data that contains "estado"
				var asistencia = findAttendance(n,ronda);
				var overcrowed = findOvercrowded(asistencia,0.5*n_players,ronda);
				var asistencias = findPlAttendances(n);
        node.game.pl.each(function(player) {
					var players_attendance = asistencias[player.id];
					var puntaje = findScore(players_attendance,overcrowed,ronda);
          //Sum puntaje
          var sumpuntaje = puntaje.reduce((a, b) => a + b, 0); // summing all the list values of puntajes
          // console.log("sumpuntaje",sumpuntaje);
          var dineropuntaje = Math.max(0,sumpuntaje*settings.PAGO); // Payment formula
          var dinerototal = dineropuntaje + 10000;
          dinerototal = dinerototal.toString();
          dinerototal.concat(" $");
          // console.log("Dinero Total",dinerototal);
          // End fors
          // Get the value saved in the registry, and send it.
          node.say('SUMPUNTAJE', player.id, [sumpuntaje, dineropuntaje, dinerototal]);
					// Include payment data
					node.game.memory.add({
					    player: player.id,
					    stage: { stage: 4},
					    recompensa: dinerototal
					});
				});
					// Save data in the data/roomXXX directory.
          var numero = node.nodename.slice(node.nodename.length - 4, node.nodename.length);
          var archivo = channel.getGameDir();
					// archivo += '/data/' + node.nodename;
					archivo += '/data';
          archivo += '/data_' + numero + '.json';
          node.game.memory.save(archivo);
          console.log('Data saved to ' + archivo);
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
