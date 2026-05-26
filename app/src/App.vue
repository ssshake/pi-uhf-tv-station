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

@media only screen and (min-width: 768px) {
  #app {
    height:100%;
  }

}

html {
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

/* Mobile: #app pins to viewport edges (do not set height: 100dvh — it is often shorter than the screen on iOS PWA and leaves a gap at the bottom). */
@media only screen and (max-width: 767px) {
  html,
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background:linear-gradient(
      280deg,
      rgba(201, 201, 201, 1) 32%,
      rgba(255, 255, 255, 1) 49%,
      rgba(255, 255, 255, 1) 55%,
      rgba(212, 212, 212, 1) 71%
    );
  }

  html[data-theme='dark'],
  html[data-theme='dark'] body {
    background: #1a1e24;
  }

  #app {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    display: block;
    background:rgb(253, 0, 211);
  }

  html[data-theme='dark'] #app {
    background: #1a1e24;
  }
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
