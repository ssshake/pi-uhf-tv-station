const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const VIDEO_FILE = '/home/pi/video/Short Circuitz/Beyond the Mind\'s Eye - 05 Transformers-CdU_qId1maI.webm';
const HLS_DIR = path.join(__dirname, 'hls');

if (!fs.existsSync(HLS_DIR)) {
    fs.mkdirSync(HLS_DIR);
}

const ffmpeg = spawn('ffmpeg', [
    '-re',
    '-stream_loop', '-1',
    '-i', VIDEO_FILE,

    '-c:v', 'libx264',
    '-preset', 'ultrafast',

    '-c:a', 'aac',
    '-b:a', '128k',

    '-f', 'hls',
    '-hls_time', '2',
    '-hls_list_size', '5',
    '-hls_flags', 'delete_segments',

    path.join(HLS_DIR, 'stream.m3u8')
]);

ffmpeg.stderr.on('data', data => {
    console.log(data.toString());
});

ffmpeg.on('exit', code => {
    console.log(`FFmpeg exited: ${code}`);
});

const app = express();

app.use('/hls', express.static(HLS_DIR));

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<body>
<video controls autoplay width="640">
    <source src="/hls/stream.m3u8" type="application/x-mpegURL">
</video>
</body>
</html>
`);
});

app.listen(8081, () => {
    console.log('Open: http://localhost:8080');
});

process.on('SIGINT', () => {
    ffmpeg.kill('SIGTERM');
    process.exit();
});
