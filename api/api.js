const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

console.log(process.env.IFTTT_KEY);

let Omx = require('node-omxplayer');
let express = require('express');

const app = express();
const port = 3000;


const poweron = `https://maker.ifttt.com/trigger/uhf_power_on/with/key/${process.env.IFTTT_KEY}`;
const poweroff = `https://maker.ifttt.com/trigger/uhf_power_off/with/key/${process.env.IFTTT_KEY}`;
let powerstate = false;

app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
})

app.get('/', (req, res) => {
	res.json({ nowPlaying: currentVideo});
});

app.get('/nowplaying', (req, res) => {
	console.log("now playing")
	res.json({ nowPlaying: currentVideo});
});

app.get('/power', (req, res) => {

	let url = '';
	if (powerstate){
		url = poweron;
	}else{
		url = poweroff;
	}

	fetch(url).then(() => {
		powerstate = !powerstate;
		console.log("should power cycle");
		res.json({ nowPlaying: currentVideo});
	});

});



app.get('/prev', (req, res) => {
	playPrevVideo();
	res.json({ nowPlaying: currentVideo});
});

app.get('/next', (req, res) => {
	playNextVideo();
	res.json({ nowPlaying: currentVideo});
});

app.get('/ff', (req, res) => {
	player.fwd30();
	res.json({ nowPlaying: currentVideo});
});

app.get('/rr', (req, res) => {
	player.back30();
	res.json({ nowPlaying: currentVideo});
});

app.get('/play', (req, res) => {
	player.play();
	res.json({ nowPlaying: currentVideo});
});

app.get('/pause', (req, res) => {
	player.pause();
	res.json({ nowPlaying: currentVideo});
});

app.get('/volup', (req, res) => {
	player.volUp();
	res.json({ nowPlaying: currentVideo});
});
app.get('/voldown', (req, res) => {
	player.volDown();
	res.json({ nowPlaying: currentVideo});
});

app.get('/chup', (req, res) => {
	channelUp();
	res.json({ nowPlaying: currentVideo});
});
app.get('/chdown', (req, res) => {
	channelDown();
	res.json({ nowPlaying: currentVideo});
});

console.log('Starting Pi TV Station');

const basePath = "/media/video/TV/"
const playlists = [
	"Star Trek TNG/Star.Trek.The.Next.Generation.S01.NTSC.DVD.DD5.1.x264-JCH/",
	"Sonic",
	"Super Mario Bros/Super Mario Bros Super Show Vol2/SMBSS2 Disk 1",
	"Super Mario Bros/Super Mario Brothers 3",
	"Legend of Zelda",
	"Cosmos/Season 1",
	"Sliders/Sliders full/Season 1",
	"The Real Ghostbusters - Season 1-7/Season 1 - 13 eps - dvdrip - mer-der",
	"Cosmos Original",
	"Duckman",
	"ReBoot/Season 1",
	"Futurama/Futurama.COMPLETE.DVDRip.MiXED/Season Two",
]

let prevEpisodes = [];
let episodes = [];
let currentVideo = "";
let currentPlaylistIndex = 0;
let videoPath = "";


	videoPath = basePath + playlists[currentPlaylistIndex];

	fs.readdir(videoPath, function(err, files){
		if (err) {
			return console.log('unable to scan dir ' + err);
		}

		episodes = files.reverse();
		playNextVideo();
	});

const channelUp = () => {
	currentPlaylistIndex = (currentPlaylistIndex + 1) % playlists.length;
	loadPlaylist();
}

const channelDown = () => {
	currentPlaylistIndex = (currentPlaylistIndex - 1) % playlists.length;
	loadPlaylist();
}

const playNextVideo = () => {
	if (episodes.length <= 0){
		console.log('end of list');
		return;
	}
	let nextVideo = episodes.pop();

	console.log("Play Next Video");
	console.log(nextVideo);

	player.newSource(videoPath + nextVideo);
	if (currentVideo.length > 0){
		prevEpisodes.push(currentVideo);
	}
	currentVideo = nextVideo;
}

const playPrevVideo = () => {
	if (prevEpisodes.length <= 0){
		console.log('end of list');
		return;
	}
	let prevVideo = prevEpisodes.pop();

	console.log("Play Prev Video");
	console.log(prevVideo);

	player.newSource(videoPath + prevVideo);
        episodes.push(currentVideo);
	currentVideo = prevVideo;
}

let player = Omx();
player.info();
loadPlaylist();

app.listen(port, () => {
	console.log("tv station up on " + port);
});



