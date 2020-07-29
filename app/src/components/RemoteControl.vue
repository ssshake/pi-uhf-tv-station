<template>
  <div class="remote">
    Now Playing: {{ nowplaying }}
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
    }
  },
  mounted(){
    this.nowPlaying();
  }
}
</script>


<style scoped>
  .remote {
    background-image: url('../assets/woodgrain.jpg')
  }
</style>
