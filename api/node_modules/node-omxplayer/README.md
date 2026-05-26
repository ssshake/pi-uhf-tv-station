# Node-Omxplayer

A library for controlling the Raspberry Pi [omxplayer](https://github.com/popcornmix/omxplayer) from Node.js.

## Get Started

```js
// Import the module.
var Omx = require('node-omxplayer');

// Create an instance of the player with the source.
var player = Omx('my-video.mp4');

// Control video/audio playback.
player.pause();
player.volUp();
player.quit();
```

**Warning**: If you quit node before quitting the player, there is a chance of a zombie process being created, which will persist until the current audio/video track ends.

## Installation

```
npm install node-omxplayer
```

This module does not require any third party Node.js libraries, but does rely on omxplayer being installed. On the default version of Raspbian it is installed by default, but on the Lite version you will have to install it:

```
sudo apt-get install omxplayer
```

## API

### Omx(*[source]*, *[output]*, *[loop]*, *[initialVolume]*)

The constructor method, used to launch omxplayer with a source.

- `source` (optional): The playback source, any audio or video file (or stream) that omxplayer is capable of playing. If left blank, the player will initialise and wait for a source to be added later with the `newSource` method.

- `output` (optional): The audio output, if left blank will default to 'local', can be one of:
    + local - the analog output (3.5mm jack).
    + hdmi - the HDMI port audio output.
    + both - both of the above outputs.
    
- `loop` (optional): Loop state, if set to true, will loop file if it is seekable. If left blank will default to false.

    **Warning**: As stated above, if you quit node before quitting the player, a zombie process may be created. If this occurs when the loop option is in place, the `omxplayer` process may run indefinitely.

- `initialVolume` (optional): The initial volume, omxplayer will start with this value (in millibels). If left blank will default to 0.

### player.newSource(*source*, *[output]*, *[loop]*, *[initialVolume]*)

Starts playback of a new source, the arguments are identical to those of the `Omx` constructor method described above. If a file is currently playing, ends this playback and begins the new source.

### player.play()

Resumes playback.

### player.pause()

Pauses playback.

### player.volUp()

Increases the volume.

### player.volDown()

Decreases the volume.

### player.fastFwd()

Fast forwards playback.

### player.rewind()

Rewinds playback.

### player.fwd30()

Skips playback forward by 30 seconds.

### player.back30()

Skips playback backward by 30 seconds.

### player.fwd600()

Skips playback forward by 600 seconds.

### player.back600()

Skips playback backward by 600 seconds.

### player.quit()

Quits the player.

### player.subtitles()

Toggle subtitles.

### player.info()

Provides info on the currently playing file.

### player.incSpeed()

Increases playback speed.

### player.decSpeed()

Decreases playback speed.

### player.prevChapter()

Skips to previous chapter.

### player.nextChapter()

Skips to next chapter.

### player.prevAudio()

Skips to previous audio stream.

### player.nextAudio()

Skips to next audio stream.

### player.prevSubtitle()

Skips to previous subtitle stream.

### player.nextSubtitle()

Skips to next subtitle stream.

### player.decSubDelay()

Decrease subtitle delay by 250ms.

### player.incSubDelay()

Increase subtitle delay by 250ms.

### player.running

Boolean giving the playback status, `true` if the player is still active, `false` if it has ended or the player has quit.

## Events

### 'close'

Fired when playback has finished.

### 'error'

Occurs when there is a problem with omxplayer. Includes a message with more information about the error.

## Errors

### 'Output <foo> not allowed.'

Incorrect audio output type passed to the player, see `Omx` in the API section above. Can occur for the `Omx` constructor and the `newSource` method.

### 'Player is closed.'

An attempt has been made to send a command to the player after it has closed. Prevent this from happening by checking if it is still running using the `running` getter method. Can occur for any of the player methods except `newSource`.
