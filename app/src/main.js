import '@/assets/css/tailwind.css'
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api';
import App from './App.vue'
import router from './router'
import store from './store'
import vClickOutside from 'v-click-outside'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronLeft, faChevronRight, faPlus, faTimes, faGlobe, faGlobeAmericas, faExpandAlt, faMinus, faSyncAlt, faMobile, faDesktop, faRedo, faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


Vue.use(VueCompositionApi);


library.add(faChevronLeft, faChevronRight, faPlus, faTimes, faGlobe, faGlobeAmericas, faExpandAlt, faMinus, faSyncAlt, faMobile, faDesktop, faRedo, faCog)

Vue.component('icon', FontAwesomeIcon)

Vue.use(vClickOutside)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
