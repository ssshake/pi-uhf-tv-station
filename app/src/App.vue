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
html {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background: rgb(103,111,150);
  background: radial-gradient(circle, rgba(103,111,150,1) 0%, rgba(24,25,28,1) 100%);
  min-height: 100dvh;
  width: 100%;
  padding: 0;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

@media only screen and (min-width: 768px) {
  #app {
    height: 100%;
    min-height: 100vh;
  }
}

body{
  width: 100%;
  min-height: 100dvh;
  height: 100%;
  padding: 0;
  margin: 0;
}

*{
  box-sizing: border-box;
  touch-action: manipulation;
  user-select: none;
}

:focus {
outline: 0;
}
</style>
