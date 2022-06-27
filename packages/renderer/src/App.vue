<template>
  <router-view />
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { defineComponent } from "vue";
import { useMapStore } from "./store/map-store";

export default defineComponent({
  name: "App",

  setup() {
    ipcRenderer.on("app-version", (_event, version) => {
      const store = useMapStore();
      store.setAppVersion(version);
    })
    ipcRenderer.send("get-app-version");
  }
});
</script>

<style lang="scss">
html {
  width: 100%;
  height: 100%;
  font-family: "Roboto", sans-serif;
}

body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
