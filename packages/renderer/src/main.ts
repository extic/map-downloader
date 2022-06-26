import { createApp } from "vue";
import App from "./App.vue";
import "./samples/node-api";
import router from "./router";
import { createPinia } from "pinia";
import draggable from "./components/draggable.directive";
import { useMapStore } from "./store/map-store";
import { mapDataGovMap } from "../../common/maps/govmap.data";

export const pinia = createPinia();

const app = createApp(App)

app
  .use(router)
  .use(pinia)
  .directive('draggable', draggable)
  .mount("#app")
  .$nextTick(window.removeLoading);

const store = useMapStore();
store.setMap(mapDataGovMap);
