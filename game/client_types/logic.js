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
function findPlAttendances(n,ronda) {
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
		for (var i = player_stages.length; i < ronda; i++){
	    if(asistencias[player]){ // If there exist already the key
	      asistencias[player].push(0);
	    } else { // If not create the key:array
	      asistencias[player] = 0;
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

    stager.setOnInit(function() {
        // Initialize the client.
    });

		stager.extendStep('consentimiento', {
        cb: function() {
            console.log('Consentimiento Informado...');
        }
    });

    stager.extendStep('instructions', {
        cb: function() {
            console.log('Instrucciones...');
						// var n_players = node.game.pl.pcounter;
						var n_players = settings.N_PLAYERS;
						var umbral = settings.THRESHOLD;
						var threshold = Math.floor(umbral*n_players);
						node.game.pl.each(function(player) {
							node.say('Nplayers', player.id, [n_players, threshold, settings.REPEAT, settings.REJILLA, settings.TIMER.eleccion]);
						});
        }
    });

		stager.extendStep('retroalimentacion', {
        cb: function() {
            console.log('Retroalimentacion...');
        }
    });

		stager.extendStep('pantalla', {
        cb: function() {
            console.log('Pantalla...');
        }
    });

		stager.extendStep('pagos', {
        cb: function() {
            console.log('Pagos...');
						node.game.pl.each(function(player) {
							node.say('pagos', player.id, [settings.SHOWUP, settings.PAGO]);
						});
        }
    });

    stager.extendStep('eleccion', {
        cb: function() {
            console.log('\n%%%%%%%%%%%%%%%');
            console.log('Game round: ' + node.player.stage.round);
        }
    });

    stager.extendStep('puntaje', {
        cb: function() {
					var treat = settings.REJILLA;
          var ronda = node.player.stage.round;
          console.log('Puntaje ronda ' + ronda + '...');
					// var n_players = node.game.pl.pcounter;
					var n_players = settings.N_PLAYERS;
					// console.log('Juego con ' + n_players + ' jugadores');
					var n_players_conectados = node.game.pl.size();
					// console.log('Hay conectados ' + n_players_conectados + ' jugadores');
					if (n_players_conectados == n_players) {
	          var n = node.game.memory.select('estado').fetch();// Select in the memory the raw data that contains "estado"
						var asistencia = findAttendance(n,ronda);
						// console.log('Asistencia al bar', asistencia);
						var umbral = settings.THRESHOLD;
						var overcrowed = findOvercrowded(asistencia,umbral*n_players,ronda);
						// console.log('Sobrecupo del bar', overcrowed);
						var asistencias = findPlAttendances(n,ronda);
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
					} else {
						node.game.gotoStep('end');
					}
        }
    });

    stager.extendStep('end', {
      cb: function() {
        var ronda = settings.REPEAT; // Obtaining round
				// var n_players = node.game.pl.pcounter;
				var n_players = settings.N_PLAYERS;
				var n_players_conectados = node.game.pl.size();
				// Determining if there are disconnections
				if (n_players_conectados < n_players) {
					var desconexion = true;
				} else {
					var desconexion = false;
				}
				var n = node.game.memory.select('estado').fetch();// Select in the memory the raw data that contains "estado"
				var asistencia = findAttendance(n,ronda);
				// console.log('asistencia', asistencia);
				var umbral = settings.THRESHOLD;
				// console.log('umbral jugadores', umbral*n_players);
				var overcrowed = findOvercrowded(asistencia,umbral*n_players,ronda);
				// console.log('rondas overcrowded', overcrowed);
				var asistencias = findPlAttendances(n,ronda);
        node.game.pl.each(function(player) {
					if (player.disconnected == false) {
						var players_attendance = asistencias[player.id];
						// console.log('asistencia jugador', player.id, players_attendance);
						var puntaje = findScore(players_attendance,overcrowed,ronda);
						// console.log('puntaje', player.id, puntaje);
	          //Sum puntaje
	          var sumpuntaje = puntaje.reduce((a, b) => a + b, 0); // summing all the list values of puntajes
	          // console.log("sumpuntaje", sumpuntaje);
	          var dineropuntaje = Math.max(sumpuntaje*settings.PAGO,-10000); // Payment formula
	          var dinerototal = Math.max(5000,dineropuntaje+15000);
	          dinerototal = dinerototal.toString();
	          dinerototal.concat(" $");
	          // console.log("Dinero Total",dinerototal);
						// Create random identifier: one letter plus three numbers
						var codigo = J.randomString(1, 'A').concat(J.randomString(3, '1'));
	          // Get the value saved in the registry, and send it.
	          node.say('SUMPUNTAJE', player.id, [sumpuntaje, dineropuntaje, dinerototal, settings.SHOWUP, codigo, desconexion]);
						// Include payment data
						node.game.memory.add({
						    player: player.id,
								codigo: codigo,
						    stage: { stage: 5},
						    recompensa: dinerototal,
						});
					}
				});
				// Save data in the data/ directory.
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
