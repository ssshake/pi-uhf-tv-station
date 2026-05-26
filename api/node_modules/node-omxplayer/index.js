'use strict';

// ----- Requires ----- //

let spawn = require('child_process').spawn;
let EventEmitter = require('events');


// ----- Setup ----- //

// The permitted audio outputs, local means via the 3.5mm jack.
let ALLOWED_OUTPUTS = ['hdmi', 'local', 'both', 'alsa'];


// ----- Functions ----- //

// Creates an array of arguments to pass to omxplayer.
function buildArgs (source, givenOutput, loop, initialVolume, showOsd) {
	let output = '';

	if (givenOutput) {

		if (ALLOWED_OUTPUTS.indexOf(givenOutput) === -1) {
			throw new Error(`Output ${givenOutput} not allowed.`);
		}

		output = givenOutput;

	} else {
		output = 'local';
	}

	let osd = false;
	if (showOsd) {
		osd = showOsd;
	}

	let args = [source, '-o', output, '--blank', osd ? '' : '--no-osd'];

	// Handle the loop argument, if provided
	if (loop) {
		args.push('--loop');
	}

	// Handle the initial volume argument, if provided
	if (Number.isInteger(initialVolume)) {
		args.push('--vol', initialVolume);
	}

	return args;

}


// ----- Omx Class ----- //

function Omx (source, output, loop, initialVolume, showOsd) {

	// ----- Local Vars ----- //

	let omxplayer = new EventEmitter();
	let player = null;
	let open = false;

	// ----- Local Functions ----- //

	// Marks player as closed.
	function updateStatus () {

		open = false;
		omxplayer.emit('close');

	}

	// Emits an error event, with a given message.
	function emitError (message) {

		open = false;
		omxplayer.emit('error', message);

	}

	// Spawns the omxplayer process.
	function spawnPlayer (src, out, loop, initialVolume, showOsd) {

		let args = buildArgs(src, out, loop, initialVolume, showOsd);
		console.log('args for omxplayer:', args);
		let omxProcess = spawn('omxplayer', args);
		open = true;

		omxProcess.stdin.setEncoding('utf-8');
		omxProcess.on('close', updateStatus);

		omxProcess.on('error', () => {
			emitError('Problem running omxplayer, is it installed?.');
		});

		return omxProcess;

	}

	// Simulates keypress to provide control.
	function writeStdin (value) {

		if (open) {
			player.stdin.write(value);
		} else {
			throw new Error('Player is closed.');
		}

	}

	// ----- Setup ----- //

	if (source) {
		player = spawnPlayer(source, output, loop, initialVolume, showOsd);
	}

	// ----- Methods ----- //

	// Restarts omxplayer with a new source.
	omxplayer.newSource = (src, out, loop, initialVolume, showOsd) => {

		if (open) {

			player.on('close', () => { player = spawnPlayer(src, out, loop, initialVolume, showOsd); });
			player.removeListener('close', updateStatus);
			writeStdin('q');

		} else {

			player = spawnPlayer(src, out, loop, initialVolume, showOsd);

		}

	};

	omxplayer.play = () => { writeStdin('p'); };
	omxplayer.pause = () => { writeStdin('p'); };
	omxplayer.volUp = () => { writeStdin('+'); };
	omxplayer.volDown = () => { writeStdin('-'); };
	omxplayer.fastFwd = () => { writeStdin('>'); };
	omxplayer.rewind = () => { writeStdin('<'); };
	omxplayer.fwd30 =() => { writeStdin('\u001b[C'); };
	omxplayer.back30 = () => { writeStdin('\u001b[D'); };
	omxplayer.fwd600 = () => { writeStdin('\u001b[A'); };
	omxplayer.back600 = () => { writeStdin('\u001b[B'); };
	omxplayer.quit = () => { writeStdin('q'); };
	omxplayer.subtitles = () => { writeStdin('s'); };
	omxplayer.info = () => { writeStdin('z'); };
	omxplayer.incSpeed = () => { writeStdin('1'); };
	omxplayer.decSpeed = () => { writeStdin('2'); };
	omxplayer.prevChapter = () => { writeStdin('i'); };
	omxplayer.nextChapter = () => { writeStdin('o'); };
	omxplayer.prevAudio = () => { writeStdin('j'); };
	omxplayer.nextAudio = () => { writeStdin('k'); };
	omxplayer.prevSubtitle = () => { writeStdin('n'); };
	omxplayer.nextSubtitle = () => { writeStdin('m'); };
	omxplayer.decSubDelay = () => { writeStdin('d'); };
	omxplayer.incSubDelay = () => { writeStdin('f'); };

	Object.defineProperty(omxplayer, 'running', {
		get: () => { return open; }
	});

	// ----- Return Object ----- //

	return omxplayer;

}


// ----- Module Exports ----- //

module.exports = Omx;
