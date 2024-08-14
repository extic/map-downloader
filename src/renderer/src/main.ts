import './assets/main.css'

import router from './router'
import { createPinia } from 'pinia'
import { mapDataGovMap } from '../../common/maps/govmap.data'
import { useMapStore } from './store/map-store'
import draggable from './components/draggable.directive'
import { createApp } from 'vue'
import app from './app.vue'

export const pinia = createPinia()

createApp(app)
  .use(router)
  .use(pinia)
  .directive('draggable', draggable)
  .mount('#app')

const store = useMapStore()
store.setMap(mapDataGovMap)
