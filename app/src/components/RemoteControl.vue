<template>
  <div class="remote" :class="{ 'theme-dark': darkMode }">

    <div class="button-invisible-group">
      <div class="logo">Pi TV Tuner</div>
      <button type="button" class="button pwr" :class="{ 'pwr-on': powerState }" @click="powerButton"><font-awesome-icon icon="power-off" fixed-width/></button>
    </div>

    <div class="now-playing">{{ lcdDisplay }}</div>

    <div class="remote-controls">
    <div class="button-group cols-4">

      <button class="button four-column" @click="button('prev')"><font-awesome-icon icon="fast-backward"  fixed-width/></button>
      <button class="button four-column" @click="button('rr')"><font-awesome-icon icon="backward" fixed-width /></button>
      <button class="button four-column" @click="button('ff')"><font-awesome-icon icon="forward"  fixed-width/></button>
      <button class="button four-column" @click="button('next')"><font-awesome-icon icon="fast-forward"  fixed-width/></button>

      <button class="button four-column" @click="button('volup')"><font-awesome-icon icon="volume-up"  fixed-width/></button>  
      <button class="button four-column" @click="button('pause')"><font-awesome-icon icon="pause"  fixed-width/></button>
      <button class="button four-column" @click="button('play')"><font-awesome-icon icon="play"  fixed-width/></button>
      <button class="button four-column ch-btn" @click="chup"><font-awesome-icon icon="chevron-up" fixed-width /></button>
    
      <button class="button four-column" @click="button('voldown')"><font-awesome-icon icon="volume-down"  fixed-width/></button>
      <button class="button four-column blank"></button>
      <button class="button four-column blank"></button>      
      <button class="button four-column ch-btn" @click="chdown"><font-awesome-icon icon="chevron-down" fixed-width /></button>
    </div>    

    <div class="button-group cols-3">
      <button class="button num three-column" @click="num(7)">7</button>
      <button class="button num three-column" @click="num(8)">8</button>
      <button class="button num three-column" @click="num(9)">9</button>
      <button class="button num three-column" @click="num(4)">4</button>
      <button class="button num three-column" @click="num(5)">5</button>
      <button class="button num three-column" @click="num(6)">6</button>
      <button class="button num three-column" @click="num(1)">1</button>
      <button class="button num three-column" @click="num(2)">2</button>
      <button class="button num three-column" @click="num(3)">3</button>
      <button class="button num three-column" @click="button('stop')"><font-awesome-icon icon="eject"  fixed-width/></button>
      <button class="button num three-column" @click="num(0)">0</button>
      <button class="button num three-column" @click="nowPlaying"><font-awesome-icon icon="retweet" fixed-width /></button>
    </div>
    <div class="button-group cols-3 footer">
      <button type="button" class="button" @click="button('shuffle')"><font-awesome-icon icon="question" fixed-width/></button>
      <span class="button blank" aria-hidden="true"></span>
      <button type="button" class="button theme-btn" :class="{ 'theme-btn--dark': darkMode }" @click="toggleTheme" :aria-label="darkMode ? 'Light mode' : 'Dark mode'">
        <font-awesome-icon :icon="darkMode ? 'sun' : 'moon'" fixed-width />
      </button>
    </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'RemoteControl',
  data: () => {
    return {
      //baseUrl: 'http://10.0.0.22:3000', //pull from config
      //baseUrl: 'http://10.0.10.158:3000', //pull from config
      baseUrl: `${window.location.protocol}//${window.location.hostname}:3000`,
      playlistName: '',
      episodeIndex: 0,
      lcd: '',
      isPlaying: false,
      powerState: false,
      number: '',
      numberDebounce: undefined,
      channelUpdateDebounce: undefined,
      darkMode: false,
    };
  },
  computed: {
    lcdDisplay(){
      if (!this.lcd.length){
        return this.playlistName;
      }
      return this.lcd
    }
  },
  methods: {
    get(action){
      return fetch(`${this.baseUrl}/${action}`)
      .then(response => response.text())
      .then((data) => {

        console.log(data)
        
        this.powerState = JSON.parse(data).powerState
        this.isPlaying = JSON.parse(data).playing
        this.episodeIndex = JSON.parse(data).episodeIndex
        
        if (!this.powerState){
          this.lcd = "Transmitter Offline";
          return;
        }

        if (!this.isPlaying){
          this.lcd = "Paused";
          return;
        } 

        this.playlistName = JSON.parse(data).playlistName;
        this.lcd = JSON.parse(data).nowPlaying;
        
      });
    },
    button(action){
      this.get(action)
    },
    nowPlaying(){
      this.get(`nowplaying`);
    },
    powerButton(){
      this.get(`power`);
      console.log("power button")
    },
    chup(){
      this.get(`chup`)
      .then(() => {
        clearTimeout(this.channelUpdateDebounce)
        this.channelUpdateDebounce = setTimeout(() => {
          this.nowPlaying()
        }, 4000)
      })
    },
    chdown(){
      this.get(`chdown`)
      .then(() => {
        clearTimeout(this.channelUpdateDebounce)
        this.channelUpdateDebounce = setTimeout(() => {
          this.nowPlaying()
        }, 4000)
      })      
    },
    ejectButton(){
      console.log("ejectButton button")
    },    
    stopButton(){
      console.log("stopButton button")
    },
    recordButton(){
      console.log("recordButton button")
    },
    volumeMuteButton(){
      console.log("volumeDownButton button")
    },
    num(num){
      console.log("num pressed")
      this.number = `${this.number}${num}`;
      this.lcd = this.number;

      clearTimeout(this.numberDebounce)
      this.numberDebounce = setTimeout(() => {
        console.log("APPLY NUMBER OF " + this.number)
        this.get(`number?number=${this.number}`)
        console.log("Clear Number")
        this.number="";
      }, 1000)
    },
    toggleTheme() {
      this.darkMode = !this.darkMode;
      this.applyTheme();
    },
    applyTheme() {
      const theme = this.darkMode ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      try {
        localStorage.setItem('pi-tv-theme', theme);
      } catch (e) {
        /* private mode */
      }
    },
  },
  mounted(){
    try {
      this.darkMode = localStorage.getItem('pi-tv-theme') === 'dark';
    } catch (e) {
      this.darkMode = false;
    }
    this.applyTheme();
    this.nowPlaying();
  }
}
</script>


<style scoped>

  @font-face {
    font-family: 'test';
    src: url('../assets/fonts/digital-7 (mono).ttf');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'sega';
    src: url('../assets/fonts/sega.ttf');
    font-weight: normal;
    font-style: normal;
  }

  .remote {
    --logo-color: #4a5058;
    --lcd-color: #0099CC;
    /* Original silver remote gradient (desktop + mobile light) */
    --remote-bg: linear-gradient(
      280deg,
      rgb(180, 180, 180) 28%,
      rgba(255, 255, 255, 1) 49%,
      rgb(224, 224, 224) 55%,
      rgb(185, 185, 185) 71%
    );
    --theme-accent: #676f96;
  }

  .remote.theme-dark {
    --logo-color:rgb(255, 255, 255);
    --remote-bg: linear-gradient(
      280deg,
      #3d434d 0%,
      #525a68 38%,
      #2c3139 55%,
      #1a1e24 71%
    );
    --theme-accent: #8b9dc3;
  }

  .logo{
    font-family: sega;
    color: var(--logo-color);
    margin-left: 15px;
    font-size: clamp(14px, 3vh, 17pt);
  }

  .num {
    width: 70px;
    font-size: 1.75rem !important;
  }

  .blank {
    width: 50px;
    height: 30px;
    visibility: hidden;
  }

  .hidden {
    visibility: nohiddenne;
  }

  .remote {
    background: rgb(201, 201, 201);
    background: var(--remote-bg);
    background-size: cover;
    box-sizing: border-box;
    border-radius: 5px;
    box-shadow: inset 0px 0px 2px 0px rgba(0,0,0,0.75), 1px 1px 2px 0px rgba(255,255,255,0.2), -1px -2px 2px 0px rgba(0,0,0,0.3);
  }

  .remote.theme-dark {
    box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, 0.9), 1px 1px 2px 0 rgba(255, 255, 255, 0.06), -1px -2px 2px 0 rgba(0, 0, 0, 0.5);
  }

  .now-playing{
    color: var(--lcd-color);
    text-shadow: 1px 1px black;
    padding: 10px;
    font-size: clamp(12px, 2.6vh, 14pt);
    overflow: hidden;
    font-family: 'test';
    background-color: black;
    margin: 15px;
    border-radius: 3px;
    line-height: 1.3;
    box-sizing: border-box;
    height: calc(3 * 1.3em + 20px);
    min-height: calc(3 * 1.3em + 20px);
    max-height: calc(3 * 1.3em + 20px);
  }

  .button-group{
    background: rgb(111,111,111);
    background: 
    linear-gradient(
      280deg,
      rgb(31, 31, 31) 32%,
      rgb(85, 85, 85) 49%,
      rgb(53, 53, 53) 55%,
      rgb(24, 24, 24) 71%
    );
    border-radius: 5px;
    margin: 20px 15px;
    padding: 14px;
    display:flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    box-shadow: inset 0px 0px 2px 0px rgba(0,0,0,0.75), 1px 1px 2px 0px rgba(255,255,255,0.2), -1px -2px 2px 0px rgba(0,0,0,0.3);
  }

  .button-group.footer {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .button-group.footer .button,
  .button-group.footer .blank {
    width: 100%;
    margin: 0;
  }

  .button-invisible-group {
    margin: 5px 5px 2px 5px;
    padding: 10px 16px 2px 5px;
    display:flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    /* flex-direction: row-reverse; */
  }

  .button-label{
    font-size: 7pt;
    position: absolute;
    top: 50%;
  }

  .button {
    position: relative; 
    box-shadow:inset 0px 1px 3px 0px #0c0c0c;
    background:linear-gradient(to bottom, #525554 5%, #575858 100%);
    background-color:#474948;
    border-radius:2px;
    border:1px solid #353535;
    display:inline-block;
    cursor:pointer;
    color:#ffffff;
    font-family:Arial;
    font-size:18px;
    font-weight:bold;
    padding:4px 12px;
    text-decoration:none;
    text-shadow:0px -1px 0px #353535;
    margin: 4px 0px;
  }

  .button:active {
    position:relative;
    top:1px;
  }

  .pwr {
    padding: 6px 18px !important;
    font-size: 27px;
  }

  .pwr.pwr-on {
    color: var(--lcd-color);
    text-shadow: 1px 1px black;
  }

  .button.ch-btn {
    font-size: 1.35em;
  }

  .theme-btn--dark {
    color: var(--theme-accent);
  }

  @media only screen and (max-width: 767px) {
    .remote {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      border-radius: 0;
      box-shadow: none;
      box-sizing: border-box;
      padding-top: env(safe-area-inset-top, 0);
      padding-bottom: env(safe-area-inset-bottom, 0);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: rgb(201, 201, 201);
      background: var(--remote-bg);
      background-size: cover;
      background-position: center top;
    }

    .button-invisible-group,
    .now-playing {
      flex-shrink: 0;
    }

    .logo {
      font-size: clamp(15px, 3.2vh, 18pt);
    }

    .now-playing {
      margin: 8px 12px;
      font-size: clamp(12px, 2.8vh, 15pt);
    }

    .remote-controls {
      --btn-gap: 8px;
      --section-gap: clamp(8px, 1.5vh, 14px);
      --btn-h: clamp(36px, 6vh, 48px);
      --numpad-btn-h: clamp(42px, 6.8vh, 54px);
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--section-gap);
      padding: 0 12px;
    }

    .button-group {
      flex: 0 0 auto;
      margin: 0;
      padding: 14px;
    }

    .button-group.cols-4 {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      grid-template-rows: repeat(3, var(--btn-h));
      gap: var(--btn-gap);
    }

    .button-group.cols-3 {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--btn-gap);
    }

    .button-group.cols-3:not(.footer) {
      grid-template-rows: repeat(4, var(--numpad-btn-h));
    }

    .button-group.footer {
      grid-template-rows: var(--btn-h);
    }

    .button-group.cols-4 .button,
    .button-group.cols-3 .button {
      width: 100%;
      height: var(--btn-h);
      max-height: var(--btn-h);
      min-height: 0;
      margin: 0;
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .button-group.cols-3:not(.footer) .button {
      height: var(--numpad-btn-h);
      max-height: var(--numpad-btn-h);
    }

    .num {
      width: auto;
    }

    .blank {
      width: 100%;
      height: var(--btn-h);
    }
  }

  @media only screen and (min-width: 768px) {
    .remote-controls {
      display: block;
    }

    .button {
      margin: 8px 10px;
      font-size: 24pt;
    }

    .four-column {
      flex-grow: 1;
      width: calc( 100% * (1/4) - 20px);
      height: 60px;
    }

    .three-column {
      flex-grow: 1;
      width: calc( 100% * (1/3) - 20px);
      height: 60px;
    }

    .remote {
      width: 500px;
      /* height: 100%; */
      padding-top: 10px;
      padding-bottom: 180px;
    }

    .now-playing{
      font-size: 20pt;
    }

    .logo {
      font-size: 17pt;
    }

    .pwr {
      padding: 15px 38px !important;
      font-size: 36pt;
    }

  }

</style>
