const path = require('path');

const fs = require('fs');

let Omx = require('node-omxplayer');
let express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
	playNextVideo();
	res.send("next episode");
});

console.log('Starting Pi TV Station');

const videoPath = "/media/video/TV/Star Trek TNG/Star.Trek.The.Next.Generation.S01.NTSC.DVD.DD5.1.x264-JCH/";

const shows = [
	"Star Trek TNG",
	"Futurama",
]

let episodes = [];


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
	let nextVideo = episodes.pop();
	console.log("Play Next Video");
	console.log(nextVideo);
	player.newSource(videoPath + nextVideo);
	//player.info();
	//player.play();
}


let player = Omx();
app.listen(port, () => {
	console.log("tv station up on " + port);
});
