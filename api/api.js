const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

let Omx = require('node-omxplayer');
let express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const poweron = `https://maker.ifttt.com/trigger/uhf_power_on/with/key/${process.env.IFTTT_KEY}`;
const poweroff = `https://maker.ifttt.com/trigger/uhf_power_off/with/key/${process.env.IFTTT_KEY}`;

const config = require('./config.json');

const playlists = config.playlists

let state = {
	powerstate: false,
	prevEpisodes: [],
	episodes: [],
	currentVideo: "",
	currentPlaylistIndex: 0,
	videoPath: "",
}

const sendDefaultResponse = (res) => {
	return res.json({ 
		nowPlaying: state.currentVideo,
		powerState: state.powerstate,
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

	let url = '';
	if (state.powerstate){
		url = poweron;
	}else{
		url = poweroff;
	}

	fetch(url).then(() => {
		state.powerstate = !state.powerstate;
		console.log("should power cycle");
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
	player.play();
	return sendDefaultResponse (res);
});

app.get('/pause', (req, res) => {
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
	res.json({ nowPlaying: channelUp(), powerState: state.powerstate });//smell
});
app.get('/chdown', (req, res) => {
	res.json({ nowPlaying: channelDown(), powerState: state.powerstate });//smell
});


const loadPlaylist = () => {
	state.videoPath = config.basePath + playlists[state.currentPlaylistIndex] + "/";

	fs.readdir(state.videoPath, function(err, files){
		if (err) {
			return console.log('unable to scan dir ' + err);
		}

		state.episodes = files.filter((file) => {
			let regex = /\.nfo$/
			return !regex.test(file)
		}).reverse();
		playNextVideo();
	});
}

const channelUp = () => {
	state.currentPlaylistIndex = (state.currentPlaylistIndex + 1) % playlists.length;
	loadPlaylist();
	return playlists[state.currentPlaylistIndex].replace(/\./g, ' ').replace(/\//g, ' ');
}

const channelDown = () => {
	state.currentPlaylistIndex = (state.currentPlaylistIndex - 1) % playlists.length;
	loadPlaylist();
	return playlists[state.currentPlaylistIndex].replace(/\./g, ' ').replace(/\//g, ' ');
}

const playNextVideo = () => {
	if (state.episodes.length <= 0){
		console.log('end of list');
		return;
	}
	let nextVideo = state.episodes.pop();

	console.log("Play Next Video");
	console.log(nextVideo);

	player.newSource(state.videoPath + nextVideo);
	if (state.currentVideo.length > 0){
		state.prevEpisodes.push(state.currentVideo);
	}
	state.currentVideo = nextVideo;
}

const playPrevVideo = () => {
	if (state.prevEpisodes.length <= 0){
		console.log('end of list');
		return;
	}
	let prevVideo = state.prevEpisodes.pop();

	console.log("Play Prev Video");
	console.log(prevVideo);

	player.newSource(state.videoPath + prevVideo);
        state.episodes.push(state.currentVideo);
	state.currentVideo = prevVideo;
}

console.log('Starting Pi TV Station');
let player = Omx();
loadPlaylist();

app.listen(port, () => {
	console.log("tv station up on " + port);
});



