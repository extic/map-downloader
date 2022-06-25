<template>
  <div
    ref="map"
    class="map-view"
    @mousedown="dragStart($event)"
    @mouseleave="dragEnd($event)"
    @mousemove="drag($event)"
    @mouseup="dragEnd($event)"
    @wheel="zoom($event)"
  >
    <div v-for="tile in tiles" :key="tile.top * 100000 + tile.left" :style="{ left: tile.left + 'px', top: tile.top + 'px' }" class="tile">
      <img :src="tile.url" @error="noTileImage($event)" alt="map tile" />
    </div>
    <crop-area />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onBeforeUpdate, onMounted, ref, watch } from "vue";
import { useMapStore } from "../store/map-store";
import CropArea from "./CropArea.vue";

interface TileData {
  readonly left: number;
  readonly top: number;
  readonly url: string;
  readonly row: number;
  readonly col: number;
}

export default defineComponent({
  name: "MapView",

  components: { CropArea },

  setup() {
    const store = useMapStore();

    const tiles = ref([] as TileData[]);
    const map = ref(null as HTMLDivElement | null);

    let dragging = false;
    let posX = 0;
    let posY = 0;
    let lastPosX = 0;
    let lastPosY = 0;

    const selectedMap = computed(() => {
      return store.map;
    });

    const mapType = computed(() => {
      return store.mapType;
    });

    const zoomLevel = computed(() => {
      return store.zoomLevel;
    });

    // const selectedStart = computed(() => {
    //   return store.selectionStart;
    // });

    // const selectedEnd = computed(() => {
    //   return store.selectionEnd;
    // });

    const mod = (n: number, m: number): number => {
      return ((n % m) + m) % m;
    };

    const updateTiles = () => {
      const selectedMap = store.map;
      const zoomLayers = store.map.zoomLayers;
      const mapWidth = map.value!.clientWidth;
      const mapHeight = map.value!.clientHeight;
      const tilesX = Math.ceil(mapWidth / 256) + 2;
      const tilesY = Math.ceil(mapHeight / 256) + 2;

      const layer = zoomLayers[zoomLevel.value];

      const modPosX = mod(posX, 256);
      const modPosY = mod(posY, 256);

      tiles.value = [];
      for (let j = 0; j < tilesY; j++) {
        const row = layer.centerTileY + Math.floor(posY / 256) - Math.floor(tilesY / 2) + j;
        const top = Math.floor(mapHeight / 2) - layer.centerTileOffsetY - (Math.floor(tilesY / 2) - j) * 256 - modPosY;
        for (let i = 0; i < tilesX; i++) {
          const col = layer.centerTileX + Math.floor(posX / 256) - Math.floor(tilesX / 2) + i;
          const left = Math.floor(mapWidth / 2) - layer.centerTileOffsetX - (Math.floor(tilesX / 2) - i) * 256 - modPosX;
          const url = selectedMap.urlProvider(mapType.value, zoomLevel.value, row, col);
          tiles.value.push({ left, top, url, row, col });
        }
      }
    };

    onMounted(() => {
      updateTiles();

      watch(
        () => [store.map, store.mapType],
        () => {
          posX = 0;
          posY = 0;
          lastPosX = 0;
          lastPosY = 0;
          instance!.proxy!.$forceUpdate();
        }
      );
    });

    onBeforeUpdate(() => {
      console.log("posX", posX);
      updateTiles();
    });

    const dragStart = (event: MouseEvent) => {
      dragging = true;
      lastPosX = event.x;
      lastPosY = event.y;
      event.preventDefault();
    };

    const instance = getCurrentInstance();
    const drag = (event: MouseEvent) => {
      if (dragging) {
        posX -= event.x - lastPosX;
        posY -= event.y - lastPosY;
        lastPosX = event.x;
        lastPosY = event.y;

        event.preventDefault();
        instance!.proxy!.$forceUpdate();
      }
    };

    const dragEnd = (event: MouseEvent) => {
      dragging = false;
      event.preventDefault();
    };

    const zoom = (event: WheelEvent) => {
      const zoomIn = event.deltaY < 0;
      let zoom = zoomLevel.value + (zoomIn ? 1 : -1);
      if (zoom >= 0 && zoom <= selectedMap.value.zoomLayers.length - 1) {
        const factor = selectedMap.value.zoomFactorProvider(zoomLevel.value, zoomIn);

        if (zoomIn) {
          posX *= factor;
          posY *= factor;
        } else {
          posX /= factor;
          posY /= factor;
        }

        store.setZoomLevel(zoom);
        store.setSelectionStart(null);
        store.setSelectionEnd(null);

        instance!.proxy!.$forceUpdate();
      }
    };

    // const selectTile = (tile: TileData) => {
    //   if (selectedStart.value === null) {
    //     store.setSelectionStart({ x: tile.col, y: tile.row });
    //     store.setSelectionEnd({ x: tile.col, y: tile.row });
    //   } else if (selectedStart.value.x === tile.col && selectedStart.value.y === tile.row) {
    //     store.setSelectionStart(selectedEnd.value);
    //     store.setSelectionEnd(null);
    //   } else if (selectedEnd.value === null || !(selectedEnd.value.x === tile.col && selectedEnd.value.y === tile.row)) {
    //     store.setSelectionEnd({ x: tile.col, y: tile.row });
    //   } else {
    //     store.setSelectionEnd(null);
    //   }

    //   if (selectedStart.value !== null && selectedEnd.value != null) {
    //     if (selectedStart.value.x > selectedEnd.value.x) {
    //       const temp = selectedStart.value.x;
    //       store.setSelectionStart({ x: selectedEnd.value.x, y: selectedStart.value.y });
    //       store.setSelectionEnd({ x: temp, y: selectedEnd.value.y });
    //     }
    //     if (selectedStart.value.y > selectedEnd.value.y) {
    //       const temp = selectedStart.value.y;
    //       store.setSelectionStart({ x: selectedStart.value.x, y: selectedEnd.value.y });
    //       store.setSelectionEnd({ x: selectedEnd.value.x, y: temp });
    //     }
    //   }

    //   instance!.proxy!.$forceUpdate();
    // };

    const noTileImage = (e: any) => {
      e.path[0].classList.add("hidden");
    };

    return { tiles, map, dragStart, drag, dragEnd, zoom, noTileImage, mapType, selectedMap };
  },
});
</script>

<style lang="scss" scoped>
.map-view {
  position: relative;
  overflow: hidden;

  .tile {
    position: absolute;
    width: 256px;
    height: 256px;
    box-sizing: content-box;
    border: 1px solid red;

    & > img {
      &.hidden {
        visibility: hidden;
      }
    }
  }
}
</style>
