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

const template = `
<style>
	body {
		background: rgb(63,76,143);
		background: radial-gradient(circle, rgba(63,76,143,1) 0%, rgba(13,35,66,1) 100%);
		color: white;
		font-family: arial;
		font-weight: bold;
	}

	a {
		border: 2px solid black;
		padding: 4px;
		margin: 4px;
		text-decoration: none;
		color: white
		font-family: arial;
		display: inline-block;
		background-color: black;
	}

	a:visited {
		color: white;
	}
</style>
<div>	
	<a href="/power">Power ${powerstate}</a>
	<a href="/prev">Prev</a>
	<a href="/rr">Rewind</a>
	<a href="/pause">Play / Pause</a>
	<a href="/ff">Fast Forward</a>
	<a href="/next">Next</a>
</div>
`;

app.get('/', (req, res) => {
	res.send(currentVideo + template);
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
		res.send(currentVideo + template);
	});

});

app.get('/prev', (req, res) => {
	playPrevVideo();
	res.send(currentVideo + template);
});

app.get('/next', (req, res) => {
	playNextVideo();
	res.send(currentVideo + template);
});

app.get('/ff', (req, res) => {
	player.fwd30();
	res.send(currentVideo + template);
});

app.get('/rr', (req, res) => {
	player.back30();
	res.send(currentVideo + template);
});

app.get('/play', (req, res) => {
	player.play();
	res.send(currentVideo + template);
});

app.get('/pause', (req, res) => {
	player.pause();
	res.send(currentVideo + template);
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


