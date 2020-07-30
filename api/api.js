const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const express = require('express');
const Omx = require('node-omxplayer');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const config = require('./config.json');

const playlists = config.playlists

const poweron = `https://maker.ifttt.com/trigger/uhf_power_on/with/key/${process.env.IFTTT_KEY}`;
const poweroff = `https://maker.ifttt.com/trigger/uhf_power_off/with/key/${process.env.IFTTT_KEY}`;

let state = {
	powerstate: true,
	prevEpisodes: [],
	episodes: [],
	videoIndex: 0,
	currentVideo: "",
	playlistIndex: 0,
	videoPath: "",
	playing: false,
}

let player = Omx();

const sendDefaultResponse = (res) => {
	return res.json({ 
		nowPlaying: state.currentVideo,
		powerState: state.powerstate,
		playing: state.playing,
	});
}

app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
})

app.get('/', (req, res) => {
	return sendDefaultResponse (res);
});

app.get('/nowplaying', (req, res) => {
	console.log("now playing")
	return sendDefaultResponse (res);
});

app.get('/power', (req, res) => {

	let url = state.powerstate ? poweroff : poweron;

	fetch(url).then(() => {
		state.powerstate = !state.powerstate;
		console.log("should power cycle to" + state.powerstate);
		return sendDefaultResponse (res);
	});

});


app.get('/prev', (req, res) => {
	playPrevVideo();
	return sendDefaultResponse (res);
});

app.get('/next', (req, res) => {
	playNextVideo();
	return sendDefaultResponse (res);
});

app.get('/ff', (req, res) => {
	player.fwd30();
	return sendDefaultResponse (res);
});

app.get('/rr', (req, res) => {
	player.back30();
	return sendDefaultResponse (res);
});

app.get('/play', (req, res) => {
	state.playing = !state.playing;
	player.play();
	return sendDefaultResponse (res);
});

app.get('/pause', (req, res) => {
	state.playing = !state.playing;
	player.pause();
	return sendDefaultResponse (res);
});

app.get('/volup', (req, res) => {
	player.volUp();
	return sendDefaultResponse (res);
});
app.get('/voldown', (req, res) => {
	player.volDown();
	return sendDefaultResponse (res);
});

app.get('/chup', (req, res) => {
	res.json({ nowPlaying: channelUp(), powerState: state.powerstate, playing: state.playing });//smell
});
app.get('/chdown', (req, res) => {
	res.json({ nowPlaying: channelDown(), powerState: state.powerstate, playing: state.playing });//smell
});


const loadPlaylist = () => {
	state.videoPath = config.basePath + playlists[state.playlistIndex] + "/";

	fs.readdir(state.videoPath, function(err, files){
		if (err) {
			return console.log('unable to scan dir ' + err);
		}

		state.episodes = files.filter((file) => {
			let regex = /\.nfo$/
			return !regex.test(file)
		}).reverse();

		state.videoIndex = 0;

		playNextVideo();
	});
}

const channelUp = () => {
	state.playlistIndex = (state.playlistIndex + 1) % playlists.length;

	loadPlaylist();
	return playlists[state.playlistIndex].replace(/\./g, ' ').replace(/\//g, ' ');
}

const channelDown = () => {
	state.playlistIndex--;
	if (state.playlistIndex < 0){
		state.playlistIndex = playlists.length - 1;
	}

	loadPlaylist();
	return playlists[state.playlistIndex].replace(/\./g, ' ').replace(/\//g, ' ');
}


const playNextVideo = () => {
	state.videoIndex = (state.videoIndex + 1) % state.episodes.length;

	loadVideo();
}

const playPrevVideo = () => {
	state.videoIndex--;
	if (state.videoIndex < 0){
		state.videoIndex = state.episodes.length - 1;
	}

	loadVideo();
}

const loadVideo = () => {
	state.playing = true;
	let nextVideo = state.episodes[state.videoIndex];
	player.newSource(state.videoPath + nextVideo);
	state.currentVideo = nextVideo;
}


player.on('error', (error) => {
	console.log("An error occured")
	console.log(error)
})

player.on('close', () => {
	console.log("Playback has ended")
	playNextVideo();
})

loadPlaylist();

fetch(poweron);

app.listen(port, () => {
	console.log("tv station up on " + port);
});

process.on('SIGINT', function() {
	console.log("Shut down requested")
	player.quit();
	//fetch(poweroff);
	process.exit();
});


