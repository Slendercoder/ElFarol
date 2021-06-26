/**
 * # Game settings definition file
 * Copyright(c) 2020 Edgar Andrade <edgar.andrade@urosario.edu.co>
 * MIT Licensed
 *
 * The variables in this file will be sent to each client and saved under:
 *
 *   `node.game.settings`
 *
 * The name of the chosen treatment will be added as:
 *
 *    `node.game.settings.treatmentName`
 *
 * http://www.nodegame.org
 * ---
 */
module.exports = {

    // Variables shared by all treatments.

    // #nodeGame properties:

    /**
     * ### TIMER (object) [nodegame-property]
     *
     * Maps the names of the steps of the game to timer durations
     *
     * If a step name is found here, then the value of the property is
     * used to initialize the game timer for the step.
     */
    TIMER: {
			instructions: 180000,
			pagos: 60000,
			pantalla: 45000,
			eleccion: 30000,
			puntaje: 30000
			// eleccion: 1000,
			// puntaje: 1000
    },

    // treatments:{
    //     rejilla:{
    //         description: 'Puede ver rejilla',
    //         treatmentName: "rejilla_treatment",
    //         REJILLA: true
    //     },
    //     norejilla:{
    //         description: 'No puede ver rejilla',
    //         treatmentName: "norejilla_treatment",
    //         REJILLA:false
    //     }
    // },

    // # Game specific properties

		// Determines the number of players
		// Must coincide with GROUP_SIZE in waitroom.settings.js
		N_PLAYERS: 5,
		// Determines the threshold for overcrowed bar
		THRESHOLD: .6,
    // Number of game rounds repetitions.
    REPEAT: 50,
		// Whether to show attendance information to players or not
		REJILLA: true,
		// How much is each earned point worth
		PAGO: 1500,
		// Showup fee
		SHOWUP: 15000
};
