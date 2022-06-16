import { createMemoryHistory, createRouter, RouteRecordRaw } from "vue-router";
import MapContainer from "../views/MapContainer.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "map",
  },
  {
    path: "/map",
    name: "map",
    component: MapContainer,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "map"
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
