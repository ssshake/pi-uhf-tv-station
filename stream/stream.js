const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 8081;
const HLS_DIR = path.join(__dirname, 'hls');
const PUBLIC_DIR = path.join(__dirname, 'public');
const VIEWER_PATH = path.join(PUBLIC_DIR, 'index.html');
const PLAYLIST_PATH = path.join(HLS_DIR, 'stream.m3u8');

if (!fs.existsSync(HLS_DIR)) {
	fs.mkdirSync(HLS_DIR);
}

let ffmpeg = null;
let ffmpegGeneration = 0;
let state = {
	playing: false,
	paused: false,
	currentPath: null,
	nowPlaying: '',
};

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

app.use('/hls', express.static(HLS_DIR));

const sendStatus = (res, override = {}) => {
	return res.json({
		playing: state.playing,
		paused: state.paused,
		nowPlaying: state.nowPlaying,
		currentPath: state.currentPath,
		...override,
	});
};

const basename = (filePath) => path.basename(filePath || '');

const stopFfmpeg = () => {
	return new Promise((resolve) => {
		if (!ffmpeg) {
			return resolve();
		}

		ffmpegGeneration++;
		const proc = ffmpeg;
		ffmpeg = null;

		proc.once('exit', () => resolve());
		proc.kill('SIGTERM');
		setTimeout(resolve, 3000);
	});
};

const startFfmpeg = (videoPath) => {
	const args = [
		'-re',
		'-i', videoPath,
		'-c:v', 'libx264',
		'-preset', 'ultrafast',
		'-c:a', 'aac',
		'-b:a', '128k',
		'-f', 'hls',
		'-hls_time', '2',
		'-hls_list_size', '5',
		'-hls_flags', 'delete_segments',
		PLAYLIST_PATH,
	];

	console.log('Starting ffmpeg for:', videoPath);
	const generation = ++ffmpegGeneration;
	ffmpeg = spawn('ffmpeg', args);

	ffmpeg.stderr.on('data', (data) => {
		process.stdout.write(data);
	});

	ffmpeg.on('exit', (code) => {
		console.log(`FFmpeg exited: ${code}`);
		if (generation !== ffmpegGeneration) {
			return;
		}
		ffmpeg = null;
		state.playing = false;
		state.paused = false;
	});
	state.currentPath = videoPath;
	state.nowPlaying = basename(videoPath).replace(/\./g, ' ').replace(/\//g, ' ');
	state.playing = true;
	state.paused = false;
};

const loadVideo = async (videoPath) => {
	if (!videoPath || !fs.existsSync(videoPath)) {
		throw new Error(`Video not found: ${videoPath}`);
	}

	await stopFfmpeg();
	startFfmpeg(videoPath);
};

app.get('/', (req, res) => {
	res.sendFile(VIEWER_PATH);
});

app.get('/status', (req, res) => {
	return sendStatus(res);
});

app.get('/load', async (req, res) => {
	const videoPath = req.query.path;

	try {
		await loadVideo(videoPath);
		return sendStatus(res);
	} catch (err) {
		console.log(err.message);
		return res.status(400).json({ error: err.message });
	}
});

app.get('/play', (req, res) => {
	if (ffmpeg && state.paused) {
		ffmpeg.kill('SIGCONT');
		state.paused = false;
		state.playing = true;
	}

	return sendStatus(res);
});

app.get('/pause', (req, res) => {
	if (ffmpeg && state.playing && !state.paused) {
		ffmpeg.kill('SIGSTOP');
		state.paused = true;
		state.playing = false;
	}

	return sendStatus(res);
});

app.get('/stop', async (req, res) => {
	await stopFfmpeg();
	state.playing = false;
	state.paused = false;
	return sendStatus(res);
});

app.listen(port, () => {
	console.log(`Stream API and viewer at http://localhost:${port}`);
});

process.on('SIGINT', async () => {
	await stopFfmpeg();
	process.exit();
});
