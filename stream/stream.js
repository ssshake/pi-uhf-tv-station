const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 8081;
const HLS_DIR = path.join(__dirname, 'hls');
const VIEWER_PATH = path.join(__dirname, 'public', 'index.html');
const PLAYLIST_PATH = path.join(HLS_DIR, 'stream.m3u8');
const SEGMENT_PATTERN = path.join(HLS_DIR, 'seg_%03d.ts');

if (!fs.existsSync(HLS_DIR)) {
	fs.mkdirSync(HLS_DIR);
}

let ffmpeg = null;
let ffmpegGeneration = 0;
let sessionId = 0;

let state = {
	playing: false,
	paused: false,
	currentPath: null,
	nowPlaying: '',
};

let timing = {
	startedAt: null,
	pausedAt: null,
	offsetSec: 0,
};

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

app.use('/hls', (req, res, next) => {
	res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
	next();
}, express.static(HLS_DIR));

const sendStatus = (res, override = {}) => {
	return res.json({
		playing: state.playing,
		paused: state.paused,
		nowPlaying: state.nowPlaying,
		currentPath: state.currentPath,
		sessionId,
		...override,
	});
};

const basename = (filePath) => path.basename(filePath || '');

const clearHlsDir = () => {
	if (!fs.existsSync(HLS_DIR)) {
		fs.mkdirSync(HLS_DIR);
		return;
	}

	for (const file of fs.readdirSync(HLS_DIR)) {
		fs.unlinkSync(path.join(HLS_DIR, file));
	}
};

const resetTiming = (offsetSec = 0) => {
	timing = {
		startedAt: Date.now(),
		pausedAt: null,
		offsetSec,
	};
};

const getPositionSec = () => {
	if (!timing.startedAt) {
		return timing.offsetSec;
	}

	let elapsedMs = Date.now() - timing.startedAt;
	if (timing.pausedAt) {
		elapsedMs -= Date.now() - timing.pausedAt;
	}

	return timing.offsetSec + elapsedMs / 1000;
};

const probeVideoCodec = (videoPath) => {
	return new Promise((resolve) => {
		const proc = spawn('ffprobe', [
			'-v', 'error',
			'-select_streams', 'v:0',
			'-show_entries', 'stream=codec_name',
			'-of', 'csv=p=0',
			videoPath,
		]);

		let output = '';
		proc.stdout.on('data', (data) => { output += data; });
		proc.on('close', () => resolve(output.trim()));
		proc.on('error', () => resolve(''));
	});
};

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

const startFfmpeg = async (videoPath, startSec = 0) => {
	const videoCodec = await probeVideoCodec(videoPath);
	const inputArgs = startSec > 0
		? ['-ss', String(Math.floor(startSec)), '-re', '-i', videoPath]
		: ['-re', '-i', videoPath];

	const videoArgs = videoCodec === 'h264'
		? ['-c:v', 'copy']
		: ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23'];

	const args = [
		...inputArgs,
		...videoArgs,
		'-c:a', 'aac',
		'-b:a', '128k',
		'-ac', '2',
		'-avoid_negative_ts', 'make_zero',
		'-f', 'hls',
		'-hls_time', '4',
		'-hls_list_size', '0',
		'-hls_playlist_type', 'event',
		'-hls_flags', 'independent_segments+temp_file',
		'-hls_segment_filename', SEGMENT_PATTERN,
		PLAYLIST_PATH,
	];

	console.log('Starting ffmpeg for:', videoPath, startSec > 0 ? `@ ${Math.floor(startSec)}s` : '');
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
		if (!state.paused) {
			state.playing = false;
		}
	});

	state.currentPath = videoPath;
	state.nowPlaying = basename(videoPath).replace(/\./g, ' ').replace(/\//g, ' ');
	state.playing = true;
	state.paused = false;
};

const beginStream = async (videoPath, startSec = 0) => {
	await stopFfmpeg();
	clearHlsDir();
	sessionId++;
	resetTiming(startSec);
	await startFfmpeg(videoPath, startSec);
};

const loadVideo = async (videoPath) => {
	if (!videoPath || !fs.existsSync(videoPath)) {
		throw new Error(`Video not found: ${videoPath}`);
	}

	await beginStream(videoPath, 0);
};

const resumeStream = async () => {
	if (!state.currentPath) {
		return;
	}

	const positionSec = getPositionSec();
	await beginStream(state.currentPath, positionSec);
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

app.get('/play', async (req, res) => {
	try {
		if (state.paused) {
			await resumeStream();
		} else if (!ffmpeg && state.currentPath) {
			await beginStream(state.currentPath, getPositionSec());
		}
	} catch (err) {
		console.log(err.message);
	}

	return sendStatus(res);
});

app.get('/pause', async (req, res) => {
	if (ffmpeg && !state.paused) {
		timing.pausedAt = Date.now();
		state.paused = true;
		state.playing = false;
		await stopFfmpeg();
	}

	return sendStatus(res);
});

app.get('/stop', async (req, res) => {
	await stopFfmpeg();
	clearHlsDir();
	sessionId++;
	state.playing = false;
	state.paused = false;
	state.currentPath = null;
	state.nowPlaying = '';
	timing = { startedAt: null, pausedAt: null, offsetSec: 0 };
	return sendStatus(res);
});

app.listen(port, () => {
	console.log(`Stream API and viewer at http://localhost:${port}`);
});

process.on('SIGINT', async () => {
	await stopFfmpeg();
	process.exit();
});
