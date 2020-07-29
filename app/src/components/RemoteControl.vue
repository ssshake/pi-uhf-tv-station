<template>
  <div class="remote">
    <div style="height: 1px"> </div>

    <div class="button-group">
      <button class="button" @click="powerButton"><font-awesome-icon icon="eject"  fixed-width/></button>
      <button class="button" @click="powerButton"><font-awesome-icon icon="power-off" fixed-width/></button>
    </div>

    <div class="button-group">

      <button class="button" @click="powerButton"><font-awesome-icon icon="backward" fixed-width /></button>
      <button class="button" @click="powerButton"><font-awesome-icon icon="play"  fixed-width/></button>
      <button class="button" @click="powerButton"><font-awesome-icon icon="pause"  fixed-width/></button>
      <button class="button" @click="powerButton"><font-awesome-icon icon="forward"  fixed-width/></button>
      <button class="button" @click="powerButton"><font-awesome-icon icon="fast-backward"  fixed-width/></button>
      <button class="button" @click="powerButton"><font-awesome-icon icon="stop"  fixed-width/></button>
      <button class="button" @click="powerButton"><font-awesome-icon icon="circle" style="color:red;" fixed-width/></button>
      <button class="button" @click="powerButton"><font-awesome-icon icon="fast-forward"  fixed-width/></button>
    </div>

    <div class="button-group">
      <button class="button" @click="powerButton"><font-awesome-icon icon="volume-up"  fixed-width/></button>  
      
      <button class="button" @click="powerButton"><font-awesome-icon icon="volume-mute" fixed-width /></button>
      <div style="width: 60px;"></div>    
      <button class="button" @click="powerButton"><font-awesome-icon icon="sort-up" fixed-width /></button>
      
      <button class="button" @click="powerButton"><font-awesome-icon icon="volume-down"  fixed-width/></button>
      <button class="button" @click="powerButton"><font-awesome-icon icon="sort-down"  fixed-width/></button>
    </div>    
    <div class="now-playing">
      {{ nowplaying }}
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
    };
  },
  methods: {
    nowPlaying(){
      fetch(`${this.baseUrl}/nowplaying`)
      .then(response => response.text())
      .then((data) => {
        console.log(data)
        this.nowplaying = JSON.parse(data).nowPlaying
      }) 
    },
    powerButton(){
      console.log("power button")
    }
  },
  mounted(){
    this.nowPlaying();
  }
}
</script>


<style scoped>
  .remote {
    background-image: url('../assets/woodgrain.jpg');
    background-size: cover;
    box-sizing: border-box;
    height: 100%;
    border-radius: 5px;
  }

.now-playing{
  color: lightgrey;
  text-shadow: 1px 1px black;

}

.button-group{
  background: rgb(103,111,150);
  background: radial-gradient(circle, rgba(60,71,80,1) 0%, rgba(24,25,28,1) 100%);
  border-radius: 5px;
  margin: 20px 10px;
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
