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



console.log('Starting Pi TV Station');

const videoPath = "/media/video/TV/Star Trek TNG/Star.Trek.The.Next.Generation.S01.NTSC.DVD.DD5.1.x264-JCH/";

const shows = [
	"Star Trek TNG",
	"Futurama",
]

let prevEpisodes = [];
let episodes = [];
let currentVideo = "";

fs.readdir(videoPath, function(err, files){
	if (err) {
		return console.log('unable to scan dir ' + err);
	}

	episodes = files.reverse();
	
	//files.forEach(function(file) {
	//	console.log(file);
	//	episodes.push(file);
	//});

	playNextVideo();
});

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
app.listen(port, () => {
	console.log("tv station up on " + port);
});


