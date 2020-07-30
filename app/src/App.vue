<template>
  <div id="app">
    <RemoteControl/>
  </div>
</template>

<script>
import RemoteControl from './components/RemoteControl.vue'

export default {
  name: 'App',
  components: {
    RemoteControl
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background: rgb(103,111,150);
  background: radial-gradient(circle, rgba(103,111,150,1) 0%, rgba(24,25,28,1) 100%);
  padding: 15px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

body{
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
}

*{
  box-sizing: border-box;
  touch-action: manipulation;
}
</style>
