import { createApp } from "vue";
import App from "./App.vue";
import "./samples/node-api";
import router from "./router";
import { createPinia } from "pinia";
import draggable from "./components/draggable.directive";
import { useMapStore } from "./store/map-store";
import { mapDataGovMap } from "../../common/maps/govmap.data";
import { maps } from "../../common/maps/map.data";

await Promise.all(maps.map((it) => it.init()));

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
