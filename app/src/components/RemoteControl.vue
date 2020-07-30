<template>
  <div class="remote">
    <div style="height: 1px"> </div>

    <div class="now-playing">{{ nowplaying }}</div>

    <div class="button-group">   
      <button class="button" @click="ejectButton"><font-awesome-icon icon="eject"  fixed-width/></button>
      <button class="button" @click="powerButton"><font-awesome-icon icon="power-off" fixed-width/></button>
    </div>

    <div class="button-group">

      <button class="button" @click="volumeUpButton"><font-awesome-icon icon="volume-up"  fixed-width/></button>  
      <button class="button" @click="pauseButton"><font-awesome-icon icon="pause"  fixed-width/></button>
      <button class="button" @click="playButton"><font-awesome-icon icon="play"  fixed-width/></button>
      <button class="button" @click="channelUpButton"><font-awesome-icon icon="sort-up" fixed-width /></button>
    
      <button class="button" @click="volumeDownButton"><font-awesome-icon icon="volume-down"  fixed-width/></button>
      <button class="button" @click="recordButton"><font-awesome-icon icon="circle" style="color:red;" fixed-width/></button>
      <button class="button" @click="stopButton"><font-awesome-icon icon="stop"  fixed-width/></button>
      <button class="button" @click="channelDownButton"><font-awesome-icon icon="sort-down"  fixed-width/></button>

      <button class="button" @click="prevButton"><font-awesome-icon icon="fast-backward"  fixed-width/></button>
      <button class="button" @click="backwardButton"><font-awesome-icon icon="backward" fixed-width /></button>
      <button class="button" @click="forwardButton"><font-awesome-icon icon="forward"  fixed-width/></button>
      <button class="button" @click="nextButton"><font-awesome-icon icon="fast-forward"  fixed-width/></button>

    </div>    

    <div class="button-group">
      <button class="button num" @click="num">7</button>
      <button class="button num" @click="num">8</button>
      <button class="button num" @click="num">9</button>
      <button class="button num" @click="num">4</button>
      <button class="button num" @click="num">5</button>
      <button class="button num" @click="num">6</button>
      <button class="button num" @click="num">1</button>
      <button class="button num" @click="num">2</button>
      <button class="button num" @click="num">3</button>
      <button class="button num" @click="num">*</button>
      <button class="button num" @click="num">0</button>
      <button class="button num" @click="num">#</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RemoteControl',
  data: () => {
    return {
      baseUrl: 'http://10.0.0.20:3000',
      nowplaying: '',
      isPlaying: false,
      powerState: false,
    };
  },
  methods: {
    genericGet(url){
      return fetch(url)
      .then(response => response.text())
      .then((data) => {
        console.log(data)
        this.powerState = JSON.parse(data).powerState
        this.isPlaying = JSON.parse(data).playing
        
        if (this.powerState && this.isPlaying){
          this.nowplaying = JSON.parse(data).nowPlaying
        } else if (this.powerState && !this.isPlaying){
          this.nowplaying = "Paused";
        } else {
          this.nowplaying = "Transmitter Offline";        
        }
      }) 
    },
    num(){
      console.log("num pressed")
    },
    nowPlaying(){
      this.genericGet(`${this.baseUrl}/nowplaying`);
    },
    ejectButton(){
      console.log("ejectButton button")
    },
    powerButton(){
      this.genericGet(`${this.baseUrl}/power`);
      this.pauseButton();
      console.log("power button")
    },
    backwardButton(){
      this.genericGet(`${this.baseUrl}/rr`);
      console.log("backwardButton button")
    },
    playButton(){
      this.genericGet(`${this.baseUrl}/play`);
      console.log("playButton button")
    },            
    pauseButton(){
      this.genericGet(`${this.baseUrl}/pause`);
      console.log("pauseButton button")
    },
    forwardButton(){
      this.genericGet(`${this.baseUrl}/ff`);
      console.log("forwardButton button")
    },
    prevButton(){
      this.genericGet(`${this.baseUrl}/prev`);
      console.log("prevButton button")
    },
    stopButton(){
      console.log("stopButton button")
    },
    recordButton(){
      console.log("recordButton button")
    },
    nextButton(){
      this.genericGet(`${this.baseUrl}/next`);
      console.log("nextButton button")
    },
    volumeUpButton(){
      this.genericGet(`${this.baseUrl}/volup`);
      console.log("volumeUpButton button")
    },
    volumeDownButton(){
      this.genericGet(`${this.baseUrl}/voldown`);
      console.log("volumeDownButton button")
    },
    channelUpButton(){
      this.genericGet(`${this.baseUrl}/chup`);
      console.log("channelUpButton button")
    },
    channelDownButton(){
      this.genericGet(`${this.baseUrl}/chdown`);
      console.log("channelDownButton button")
    },
    volumeMuteButton(){
      console.log("volumeDownButton button")
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
    src: url('../assets/fonts/digital-7.ttf');
    font-weight: normal;
    font-style: normal;
  }

  .num {
    width: 70px;
  }
  .remote {
    //background-image: url('../assets/woodgrain.jpg');
    background: rgb(255,255,255);
    background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(172,175,181,1) 100%);
    background-size: cover;
    box-sizing: border-box;
    border-radius: 5px;
    box-shadow: inset 0px 0px 2px 0px rgba(0,0,0,0.75), 1px 1px 2px 0px rgba(255,255,255,0.2), -1px -2px 2px 0px rgba(0,0,0,0.3);
  }

.now-playing{
  color: white;
  text-shadow: 1px 1px black;
  padding: 10px;
  font-size: 10pt;
  overflow: hidden;
  font-family: 'test';
  color: #0099CC;
  background-color: black;
  margin: 15px;
  border-radius: 3px;
  min-height: 60px;
}

.button-group{
background: rgb(111,111,111);
background: radial-gradient(circle, rgba(111,111,111,1) 0%, rgba(0,0,0,1) 100%);
  border-radius: 5px;
  margin: 20px 15px;
  padding: 14px;
  display:flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  box-shadow: inset 0px 0px 2px 0px rgba(0,0,0,0.75), 1px 1px 2px 0px rgba(255,255,255,0.2), -1px -2px 2px 0px rgba(0,0,0,0.3);
}

.button {
	box-shadow:inset 0px 1px 3px 0px #91b8b3;
	background:linear-gradient(to bottom, #768d87 5%, #6c7c7c 100%);
	background-color:#768d87;
	border-radius:2px;
	border:1px solid #566963;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:18px;
	font-weight:bold;
	padding:4px 12px;
	text-decoration:none;
	text-shadow:0px -1px 0px #2b665e;
  margin: 4px 0px;
  

}
.button:hover {
	background:linear-gradient(to bottom, #6c7c7c 5%, #768d87 100%);
	background-color:#6c7c7c;
}
.button:active {
	position:relative;
	top:1px;
}
</style>
