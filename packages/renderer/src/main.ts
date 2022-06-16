import { createApp } from "vue";
import App from "./App.vue";
import "./samples/node-api";
import router from "./router";
import { createPinia } from "pinia";

createApp(App)
  .use(router)
  .use(createPinia())
  .mount("#app")
  .$nextTick(window.removeLoading);
