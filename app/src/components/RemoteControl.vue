<template>
  <div class="remote">

    <div class="now-playing">{{ nowplaying }}</div>

    <div class="button-group">   
      <button class="button" @click="ejectButton"><font-awesome-icon icon="eject"  fixed-width/></button>
      <button class="button" @click="powerButton"><font-awesome-icon icon="power-off" fixed-width/></button>
    </div>

    <div class="button-group">
      <button class="button" @click="button('volup')"><font-awesome-icon icon="volume-up"  fixed-width/></button>  
      <button class="button" @click="button('pause')"><font-awesome-icon icon="pause"  fixed-width/></button>
      <button class="button" @click="button('play')"><font-awesome-icon icon="play"  fixed-width/></button>
      <button class="button" @click="button('chup')"><font-awesome-icon icon="sort-up" fixed-width /></button>
    
      <button class="button" @click="button('voldown')"><font-awesome-icon icon="volume-down"  fixed-width/></button>
      <button class="button" @click="recordButton"><font-awesome-icon icon="circle" style="color:red;" fixed-width/></button>
      <button class="button" @click="stopButton"><font-awesome-icon icon="stop"  fixed-width/></button>
      <button class="button" @click="button('chdown')"><font-awesome-icon icon="sort-down"  fixed-width/></button>

      <button class="button" @click="button('prev')"><font-awesome-icon icon="fast-backward"  fixed-width/></button>
      <button class="button" @click="button('rr')"><font-awesome-icon icon="backward" fixed-width /></button>
      <button class="button" @click="button('ff')"><font-awesome-icon icon="forward"  fixed-width/></button>
      <button class="button" @click="button('next')"><font-awesome-icon icon="fast-forward"  fixed-width/></button>
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
      baseUrl: 'http://10.0.0.20:3000', //pull from config
      nowplaying: '',
      isPlaying: false,
      powerState: false,
    };
  },
  methods: {
    get(action){
      return fetch(`${this.baseUrl}/${action}`)
      .then(response => response.text())
      .then((data) => {

        console.log(data)
        
        this.powerState = JSON.parse(data).powerState
        this.isPlaying = JSON.parse(data).playing
        
        if (!this.powerState){
          this.nowplaying = "Transmitter Offline";
          return;
        }

        if (!this.isPlaying){
          this.nowplaying = "Paused";
          return;
        } 

        this.nowplaying = JSON.parse(data).nowPlaying;
        
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
      this.pauseButton();
      console.log("power button")
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
    num(){
      console.log("num pressed")
    },                                             
  },
  mounted(){
    this.nowPlaying();

    document.addEventListener('touchmove', function (event) {
      if (event.scale !== 1) { event.preventDefault(); }
    }, false);
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
