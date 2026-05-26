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

/* Mobile: fill the screen */
@media only screen and (max-width: 767px) {
  html,
  body,
  #app {
    height: 100%;
    height: 100dvh;
    min-height: 100dvh;
  }

  #app {
    padding: 0;
    align-items: stretch;
    justify-content: stretch;
  }

  #app > * {
    flex: 1;
    width: 100%;
    min-height: 0;
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
