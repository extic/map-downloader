<template>
  <div class="map-info">
    <div>Zoom:</div>
    <span>{{ selectedMap.zoomLevelProvider(zoomLevel) }}</span>
    <div class="scale" v-if="selectedMap.showScale">
      <div class="gap">Scale:</div>
      <span>1:{{ selectedMap.zoomLayers[zoomLevel].scale }}</span>
    </div>
    <div class="coordinates" :class="{ show: selectedMap.showCoordinates }">
      <div class="gap">X:</div>
      <span>{{ coordinateX }}</span>
      <div class="gap">Y:</div>
      <span>{{ coordinateY }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onBeforeUpdate, onMounted, ref, watch } from "vue";
import { useMapStore } from "../store/map-store";
import { MapData, UrlUsageType } from "../../../common/maps/map.data";

export default defineComponent({
  name: "MapInfo",

  setup() {
    const store = useMapStore();

    const selectedMap = computed(() => {
      return store.map;
    });

    const zoomLevel = computed(() => {
      return store.zoomLevel;
    });

    const coordinateX = computed(() => {
      return store.coordinateX;
    });

    const coordinateY = computed(() => {
      return store.coordinateY;
    });

    return { selectedMap, zoomLevel, coordinateX, coordinateY, };
  },
});
</script>

<style lang="scss" scoped>
.map-info {
  position: absolute;
  bottom: 0;
  display: flex;
  border: 1px solid gray;
  border-radius: 0 10px 0 0;
  color: white;
  padding: 0.2em 2em;
  background-color: rgba(0, 0, 0, 0.5);
  border-bottom: 0;
  border-left: 0;

  .gap {
    margin-left: 2em;
  }

  .scale {
    display: flex;
  }

  .coordinates {
    display: none;

    &.show {
      display: flex;
    }
  }
}
</style>
