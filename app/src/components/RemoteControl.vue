<template>
  <div class="remote">

    <div class="button-invisible-group">
      <div class="logo">Pi TV Tuner</div>
      <button class="button pwr" @click="powerButton"><font-awesome-icon icon="power-off" fixed-width/></button>
    </div>

    <div class="now-playing">{{ lcdDisplay }}</div>

    <div class="button-group cols-4">

      <button class="button" @click="button('prev')"><font-awesome-icon icon="fast-backward"  fixed-width/></button>
      <button class="button" @click="button('rr')"><font-awesome-icon icon="backward" fixed-width /></button>
      <button class="button" @click="button('ff')"><font-awesome-icon icon="forward"  fixed-width/></button>
      <button class="button" @click="button('next')"><font-awesome-icon icon="fast-forward"  fixed-width/></button>

      <button class="button" @click="button('volup')"><font-awesome-icon icon="volume-up"  fixed-width/></button>
      <button class="button" @click="button('pause')"><font-awesome-icon icon="pause"  fixed-width/></button>
      <button class="button" @click="button('play')"><font-awesome-icon icon="play"  fixed-width/></button>
      <button class="button" @click="chup"><font-awesome-icon icon="sort-up" fixed-width /></button>

      <button class="button" @click="button('voldown')"><font-awesome-icon icon="volume-down"  fixed-width/></button>
      <button class="button blank" aria-hidden="true" tabindex="-1"></button>
      <button class="button blank" aria-hidden="true" tabindex="-1"></button>
      <button class="button" @click="chdown"><font-awesome-icon icon="sort-down"  fixed-width/></button>
    </div>

    <div class="button-group cols-3">
      <button class="button num" @click="num(7)">7</button>
      <button class="button num" @click="num(8)">8</button>
      <button class="button num" @click="num(9)">9</button>
      <button class="button num" @click="num(4)">4</button>
      <button class="button num" @click="num(5)">5</button>
      <button class="button num" @click="num(6)">6</button>
      <button class="button num" @click="num(1)">1</button>
      <button class="button num" @click="num(2)">2</button>
      <button class="button num" @click="num(3)">3</button>
      <button class="button num" @click="button('stop')"><font-awesome-icon icon="eject"  fixed-width/></button>
      <button class="button num" @click="num(0)">0</button>
      <button class="button num" @click="nowPlaying"><font-awesome-icon icon="retweet" fixed-width /></button>
    </div>
    <div class="button-group cols-3 button-group--footer">
      <button class="button num" @click="button('shuffle')"><font-awesome-icon icon="question"  fixed-width/></button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'RemoteControl',
  data: () => {
    return {
      baseUrl: 'http://10.0.0.22:3000', //pull from config
      playlistName: '',
      episodeIndex: 0,
      lcd: '',
      isPlaying: false,
      powerState: false,
      number: '',
      numberDebounce: undefined,
      channelUpdateDebounce: undefined,
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
  },
  mounted(){
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

  .logo{
    font-family: sega;
    color:rgb(143, 143, 143);
    color:#909fa277;
    margin-left: 15px;
  }

  .blank {
    visibility: hidden;
    pointer-events: none;
  }

  .remote {
    background: rgb(201,201,201);
    background: linear-gradient(280deg, rgba(201,201,201,1) 32%, rgba(255,255,255,1) 49%, rgba(255,255,255,1) 55%, rgba(212,212,212,1) 71%);
    background-size: cover;
    box-sizing: border-box;
    border-radius: 5px;
    box-shadow: inset 0px 0px 2px 0px rgba(0,0,0,0.75), 1px 1px 2px 0px rgba(255,255,255,0.2), -1px -2px 2px 0px rgba(0,0,0,0.3);
    width: 100%;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .now-playing{
    color: #0099CC;
    text-shadow: 1px 1px black;
    padding: 10px;
    font-size: 13pt;
    overflow: hidden;
    font-family: 'test';
    background-color: black;
    margin: 15px;
    border-radius: 3px;
    min-height: 68px;
    max-height: 68px;
    line-height: 2rem;
    flex-shrink: 0;
  }

  .button-group{
    background: rgb(111,111,111);
    background: radial-gradient(circle, rgba(111,111,111,1) 0%, rgba(0,0,0,1) 100%);
    border-radius: 5px;
    margin: 12px 15px;
    padding: 14px;
    flex: 1 1 0;
    min-height: 0;
    box-shadow: inset 0px 0px 2px 0px rgba(0,0,0,0.75), 1px 1px 2px 0px rgba(255,255,255,0.2), -1px -2px 2px 0px rgba(0,0,0,0.3);
  }

  .button-group.cols-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 8px;
  }

  .button-group.cols-3:not(.button-group--footer) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 8px;
  }

  .button-group.button-group--footer.cols-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .button-group--footer {
    flex: 0 0 auto;
    margin-bottom: max(12px, env(safe-area-inset-bottom));
  }

  .button-invisible-group {
    margin: 5px 5px 2px 5px;
    padding: 10px 16px 2px 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
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
    display: flex;
    align-items: center;
    justify-content: center;
    cursor:pointer;
    color:#ffffff;
    font-family:Arial;
    font-size:18px;
    font-weight:bold;
    padding: 4px 8px;
    text-decoration:none;
    text-shadow:0px -1px 0px #353535;
    margin: 0;
    width: 100%;
    min-height: 44px;
  }

  .button-group.cols-4 .button {
    min-height: 0;
    height: 100%;
  }

  .button-group.cols-3 .button {
    min-height: 0;
    height: 100%;
  }

  .button:active {
    position:relative;
    top:1px;
  }

  @media only screen and (min-width: 768px) {
    .remote {
      width: 500px;
      min-height: auto;
      flex: none;
      padding-top: 10px;
      padding-bottom: 180px;
    }

    .button-group {
      flex: none;
      margin: 20px 15px;
    }

    .button-group.cols-4 .button,
    .button-group.cols-3 .button {
      min-height: 60px;
      height: auto;
    }

    .button {
      font-size: 24pt;
    }

    .now-playing{
      font-size: 20pt;
      min-height: 96px;
      max-height: 120px;
    }

    .logo {
      font-size: 17pt;
    }

    .pwr {
      padding: 10px 25px !important;
    }
  }

</style>
