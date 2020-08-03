const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const express = require('express');
const Omx = require('./lib/omx.js');
const videoFinder = require('./lib/videofinder.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const config = require('./config.json');

const playlists = config.playlists

const debounceDelay = 750;

const poweron = `https://maker.ifttt.com/trigger/uhf_power_on/with/key/${process.env.IFTTT_KEY}`;
const poweroff = `https://maker.ifttt.com/trigger/uhf_power_off/with/key/${process.env.IFTTT_KEY}`;

let state = {
	powerstate: true,
	playing: false,
	playlistIndex: 0,
	playlistName: "",
	playlists: [],
	episodes: [],
	videoIndex: 0,
	currentVideo: "",
	videoPath: "",
	channelDebounce: undefined,
	episodeDebounce: undefined,
}

state.playlists = config.playlists.map((name) => {
	return {
		name: name,
		index: 0,
		videos: [],

	}
});



let player = Omx();

const sendDefaultResponse = (res, override = {}) => {
	return res.json({ 
		nowPlaying: state.currentVideo,
		playlistName: state.playlistName,
		powerState: state.powerstate,
		playing: state.playing,
		episodeIndex: state.videoIndex,
		...override
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

app.get('/number', (req, res) => {
	console.log("requested episode #" + req.query.number)

	if (req.query.number <= state.episodes.length && req.query.number > 0) {
		state.videoIndex = req.query.number - 1
		loadVideo();
	}

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
	state.playlistIndex = (state.playlistIndex + 1) % playlists.length;
	queueChannelChange();
	return sendDefaultResponse (res);
});
app.get('/chdown', (req, res) => {
	state.playlistIndex--;
	if (state.playlistIndex < 0){
		state.playlistIndex = playlists.length - 1;
	}
	queueChannelChange();
	return sendDefaultResponse (res);
});

app.get('/next', (req, res) => {
	playNextVideo();
	return sendDefaultResponse (res);
});

app.get('/prev', (req, res) => {
	state.videoIndex--;
	if (state.videoIndex < 0){
		state.videoIndex = state.episodes.length - 1;
	}
	queueEpisodeChange();
	return sendDefaultResponse (res);
});

const playNextVideo = () => {
	state.videoIndex = (state.videoIndex + 1) % state.episodes.length;
	queueEpisodeChange();
}

const queueChannelChange = () => {
	state.playlistName = playlists[state.playlistIndex].replace(/\./g, ' ').replace(/\//g, ' ');
	state.currentVideo = "";

	clearTimeout(state.channelDebounce)
	state.channelDebounce = setTimeout(() => {
	
		console.log("INPUT DEBOUNCE")
		loadPlaylist();

	}, debounceDelay)
}

const queueEpisodeChange = () => {
	state.currentVideo = state.episodes[state.videoIndex];

	clearTimeout(state.episodeDebounce)
	state.episodeDebounce = setTimeout(() => {
	
		console.log("EPISODE DEBOUNCE")
		loadVideo();

	}, debounceDelay)
}

app.get('/eject', (req, res) => {
	sendDefaultResponse (res);
	quit();
});

app.get('/stop', (req, res) => {
	player.quit();
	sendDefaultResponse (res);
});


const loadPlaylist = () => {

	state.videoPath = config.basePath + playlists[state.playlistIndex] + "/";
	
	if (!state.playlists[state.playlistIndex].videos.length){

		console.log("No videos yet so lets get some")
		
		state.playlists[state.playlistIndex].videos = videoFinder.getVideosInFolder(state.videoPath);

	}

	fs.readdir(state.videoPath, function(err, files){
		if (err) {
			return console.log('unable to scan dir ' + err);
		}

		state.episodes = files.filter((file) => {
			let regex = /\.nfo$/
			return !regex.test(file)
		}).sort();

		state.videoIndex = 0;

		loadVideo();
	});
}


const loadVideo = () => {
	state.playing = true;
	let nextVideo = state.episodes[state.videoIndex];
	player.newSource(state.videoPath + nextVideo);
	state.currentVideo = nextVideo;
}

const quit = () => {
	console.log("Shut down requested")
	process.exit();
}


player.on('error', (error) => {
	console.log("An error occured")
	console.log(error)
})

player.on('close', () => {
	console.log("Playback has ended")
	playNextVideo();
})


app.listen(port, () => {
	console.log("tv station up on " + port);
});

process.on('SIGINT', function() {
	quit();
});


loadPlaylist();
fetch(poweron);
