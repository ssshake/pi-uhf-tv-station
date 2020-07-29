const path = require('path');

const fs = require('fs');

let Omx = require('node-omxplayer');
let express = require('express');

const app = express();
const port = 3000;

const template = `
<br>
<a href="/prev">Prev</a>
<br>
<a href="/rr">Rewind</a>
<br>
<a href="/pause">Play / Pause</a>
<br>
<a href="/ff">Fast Forward</a>
<br>
<a href="/next">Next</a>
<br>
`;

app.get('/', (req, res) => {
	res.send(currentVideo + template);
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
