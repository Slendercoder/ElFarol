/**
 * # Game setup
 * Copyright(c) 2020 Edgar Andrade <edgar.andrade@urosario.edu.co>
 * MIT Licensed
 *
 * This file includes settings that are shared amongst all client types
 *
 * Setup settings are passed by reference and can be modified globally
 * by any instance executing on the server (but not by remote instances).
 *
 * http://www.nodegame.org
 * ---
 */
module.exports = function(settings, stages) {

    var setup;
    setup = {};

		// setup.debug = true;
		setup.debug = false;

		// setup.verbosity = 1;
		setup.verbosity = 0;

    setup.window = {
			// Block right-clicking.
	    disableRightClick: true,
	    // Display a message if a user tries to close the browser.
	    promptOnleave: true,
	    // Disable the back button.
	    disableBackButton: true
			// promptOnleave: !setup.debug
    };

    // Metadata.
    // By default are as in package.json, but can be overwritten.
    //
    // setup.metadata = {
    //    name: 'another name',
    //    version: 'another version',
    //    description: 'another descr'
    // };

    // Environment variables. Can be retrieved via `node.env('foo')`,
    // or be used to conditionally execute a function:
    // `node.env('foo', function(foo) { ... })`.
    //
    // setup.env = {
    //    foo: false
    // };

    return setup;
};
