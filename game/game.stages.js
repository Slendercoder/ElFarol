/**
 * # Game stages definition file
 * Copyright(c) 2020 Edgar Andrade <edgar.andrade@urosario.edu.co>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(stager, settings) {

     stager // Stager define a sequence of steps on that particular stage
			.next('consentimiento')
			.next('instructions')
			.next('retroalimentacion')
			.next('pantalla')
			.next('pagos')
      .repeat('game', settings.REPEAT) // Repeat as the settings was passed on the function
      .next('end')
      .gameover();

      stager.extendStage('game', {
        steps: [
                'eleccion',
                'puntaje'
                ]
        });

    // Modify the stager to skip one stage.
		// stager.skip('consentimiento');
		// stager.skip('instructions');
		// stager.skip('retroalimentacion');
		// stager.skip('pantalla');
		// stager.skip('pagos');
		// stager.skip('game');

    // To skip a step within a stage use:
    // stager.skip('stageName', 'stepName');
    // Notice: here all stages have just one step.
};
