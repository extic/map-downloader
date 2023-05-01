<template>
  <div class="app-version">
    Version: v{{appVersion}}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useMapStore } from "../store/map-store";

export default defineComponent({
  name: "AppVersion",

  setup() {
    const store = useMapStore();

    const appVersion = computed(() => {
      return store.appVersion;
    });

    return { appVersion };
  },
});
</script>

<style lang="scss" scoped>
.app-version {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  border: 1px solid gray;
  border-radius: 10px 0 0 0;
  color: white;
  padding: 0.2em 2em;
  background-color: rgba(0, 0, 0, 0.5);
  border-bottom: 0;
  border-right: 0;
}
</style>
