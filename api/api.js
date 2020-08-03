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

const debounceDelay = 750;

const poweron = `https://maker.ifttt.com/trigger/uhf_power_on/with/key/${process.env.IFTTT_KEY}`;
const poweroff = `https://maker.ifttt.com/trigger/uhf_power_off/with/key/${process.env.IFTTT_KEY}`;

let state = {
	powerstate: true,
	playing: false,
	playlistIndex: 0,
	playlists: [],
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
	let nowPlaying = "";
	if (calculatedCurrentVideo()){
		nowPlaying = calculatedCurrentVideo().name
	}
		
	const response = { 
		nowPlaying: nowPlaying,
		powerState: state.powerstate,
		playing: state.playing,
		...override
	};
	response.nowPlaying = response.nowPlaying.replace(/\./g, ' ').replace(/\//g, ' ')

	return res.json(response)
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

	if (req.query.number <= currentPlaylist().videos.length && req.query.number > 0) {
		setVideoIndexOnPlaylist(req.query.number - 1)
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
	state.playlistIndex = (state.playlistIndex + 1) % state.playlists.length;
	queueChannelChange();
	return sendDefaultResponse (res, { nowPlaying: currentPlaylist().name })
});

app.get('/chdown', (req, res) => {
	state.playlistIndex--;
	if (state.playlistIndex < 0){
		state.playlistIndex = state.playlists.length - 1;
	}

	queueChannelChange();
	return sendDefaultResponse (res, { nowPlaying: currentPlaylist().name })
});

app.get('/next', (req, res) => {
	playNextVideo();
	return sendDefaultResponse (res);
});

app.get('/prev', (req, res) => {
		
	let newIndex = getVideoIndexFromPlaylist() - 1;

	if (newIndex < 0) {
		newIndex = currentPlaylist().videos.length -1;
	}
	
	setVideoIndexOnPlaylist(newIndex) //new
	
	queueEpisodeChange();
	return sendDefaultResponse (res);
});

const playNextVideo = () => {
	setVideoIndexOnPlaylist((getVideoIndexFromPlaylist() + 1) % currentPlaylist().videos.length) //new

	queueEpisodeChange();
}

const queueChannelChange = () => {
	clearTimeout(state.channelDebounce)
	state.channelDebounce = setTimeout(() => {
	
		console.log("INPUT DEBOUNCE")
		loadPlaylist();

	}, debounceDelay)
}

const currentPlaylist = () => {
	return state.playlists[state.playlistIndex];
}

const setVideoIndexOnPlaylist = (index) => {
	state.playlists[state.playlistIndex].index = index;
}

const getVideoIndexFromPlaylist = () => {
	return state.playlists[state.playlistIndex].index;
}

const calculatedCurrentVideo = () => {
	return currentPlaylist().videos[currentPlaylist().index];
}

const queueEpisodeChange = () => {
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

	let playlistPath = config.basePath + currentPlaylist().name + "/";
	

	if (!currentPlaylist().videos.length){

		console.log("No videos yet so lets get some")
		
		currentPlaylist().videos = videoFinder.getVideosInFolder(playlistPath);

	}

	console.dir(state.playlists)

	loadVideo();
}


const loadVideo = () => {
	state.playing = true;
	
	player.newSource(calculatedCurrentVideo().fullPath);
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
