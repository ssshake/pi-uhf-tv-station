import Vue from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faBackward, faFastBackward, faForward, faFastForward, faPlay, faPause, faStop, faEject, 
  faPowerOff, faVolumeUp, faVolumeDown, faVolumeMute, faSortUp, faSortDown, faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBackward)
library.add(faFastBackward)
library.add(faForward)
library.add(faFastForward)
library.add(faPlay)
library.add(faPause)
library.add(faStop)
library.add(faEject)

library.add(faPowerOff)
library.add(faVolumeUp)
library.add(faVolumeDown)
library.add(faVolumeMute)
library.add(faSortUp)
library.add(faSortDown)
library.add(faCircle)


Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
