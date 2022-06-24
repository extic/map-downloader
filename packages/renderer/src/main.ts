import { createApp } from "vue";
import App from "./App.vue";
import "./samples/node-api";
import router from "./router";
import { createPinia } from "pinia";
import draggable from "./components/draggable.directive";

const app = createApp(App)

app
  .use(router)
  .use(createPinia())
  .directive('draggable', draggable)
  .mount("#app")
  .$nextTick(window.removeLoading);
