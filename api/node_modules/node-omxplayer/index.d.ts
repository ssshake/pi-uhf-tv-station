declare var Omx: NodeOmxPlayerStatic;

declare module 'node-omxplayer' {
	export = Omx;
}

interface NodeOmxPlayerStatic {
	/**
	 * The constructor method, used to launch omxplayer with a source.
	 * @param source (optional): The playback source, any audio or video file (or stream) that omxplayer is capable of playing. If left blank, the player will initialise and wait for a source to be added later with the newSource method.
	 * @param output (optional): The audio output, if left blank will default to 'local', can be one of: "local", "hdmi", "both"
	 * @param loop (optional): Loop state, if set to true, will loop file if it is seekable. If left blank will default to false.
	 * @param initialVolume (optional): The initial volume, omxplayer will start with this value (in millibels). If left blank will default to 0.
	 */
	(source?: String, output?: String, loop?: Boolean, initialVolume?: Number, showOsd?: Boolean): NodeOmxPlayer;
}

interface NodeOmxPlayer extends Event {
	/**
	 * Starts playback of a new source, the arguments are identical to those of the Omx constructor method described above. If a file is currently playing, ends this playback and begins the new source.
	 * @param source (optional): The playback source, any audio or video file (or stream) that omxplayer is capable of playing. If left blank, the player will initialise and wait for a source to be added later with the newSource method.
	 * @param output (optional): The audio output, if left blank will default to 'local', can be one of: "local", "hdmi", "both"
	 * @param loop (optional): Loop state, if set to true, will loop file if it is seekable. If left blank will default to false.
	 * @param initialVolume (optional): The initial volume, omxplayer will start with this value (in millibels). If left blank will default to 0.
	 */
	newSource(source: String, output?: String, loop?: Boolean, initialVolume?: Number): void;

	/**
	 * Resumes playback.
	 */
	play(): void;

	/**
	 * Pauses playback.
	 */
	pause(): void;

	/** 
	 * Increases the volume.
	 */
	volUp(): void;

	/**
	 * Decreases the volume.
	 */
	volDown(): void;

	/**
	 * Fast forwards playback.
	 */
	fastFwd(): void;

	/**
	 * Rewinds playback.
	 */
	rewind(): void;

	/**
	 * Skips playback forward by 30 seconds.
	 */
	fwd30(): void;

	/**
	 * Skips playback backward by 30 seconds.
	 */
	back30(): void;

	/**
	 * Skips playback forward by 600 seconds.
	 */
	fwd600(): void;

	/**
	 * Skips playback backward by 600 seconds.
	 */
	back600(): void;

	/**
	 * Quits the player.
	 */
	quit(): void;

	/**
	 * Toggle subtitles.
	 */
	subtitles(): void;

	/**
	 * Provides info on the currently playing file.
	 */
	info(): void;

	/**
	 * Increases playback speed.
	 */
	incSpeed(): void;

	/**
	 * Decreases playback speed.
	 */
	decSpeed(): void;

	/**
	 * Skips to previous chapter.
	 */
	prevChapter(): void;

	/**
	 * Skips to next chapter.
	 */
	nextChapter(): void;

	/**
	 * Skips to previous audio stream.
	 */
	prevAudio(): void;

	/**
	 * Skips to next audio stream.
	 */
	nextAudio(): void;

	/**
	 * Skips to previous subtitle stream.
	 */
	prevSubtitle(): void;

	/**
	 * Skips to next subtitle stream.
	 */
	nextSubtitle(): void;

	/**
	 * Decrease subtitle delay by 250ms.
	 */
	decSubDelay(): void;

	/**
	 * Increase subtitle delay by 250ms.
	 */
	incSubDelay(): void;

	/**
	 * Boolean giving the playback status, true if the player is still active, false if it has ended or the player has quit.
	 */
	running: Boolean;
}
