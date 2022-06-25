<template>
  <div ref="map" class="map-view" v-draggable="dragged" @wheel="zoom($event)">
    <div v-for="tile in tiles" :key="tile.top * 100000 + tile.left" :style="{ left: tile.left + 'px', top: tile.top + 'px' }" class="tile">
      <img :src="tile.url" @error="noTileImage($event)" alt="map tile" />
      <div style="position: absolute; top: 2px; left: 2px; color: white">{{tile.col}} : {{tile.row}}</div>
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

    const selectedMap = computed(() => {
      return store.map;
    });

    const mapType = computed(() => {
      return store.mapType;
    });

    const zoomLevel = computed(() => {
      return store.zoomLevel;
    });

    const mod = (n: number, m: number): number => {
      return ((n % m) + m) % m;
    };

    const updateTiles = () => {
      const selectedMap = store.map;
      const zoomLayers = store.map.zoomLayers;
      const layer = zoomLayers[zoomLevel.value];
      const mapWidth = map.value!.clientWidth;
      const mapHeight = map.value!.clientHeight;
      const tilesX = Math.ceil(mapWidth / 256) + 2;
      const tilesY = Math.ceil(mapHeight / 256) + 2;


      const modPosX = mod(store.posLeft, 256);
      const modPosY = mod(store.posTop, 256);

      tiles.value = [];
      for (let j = 0; j < tilesY; j++) {
        const row = layer.centerTileY + Math.floor(store.posTop / 256) - Math.floor(tilesY / 2) + j;
        const top = Math.floor(mapHeight / 2) - layer.centerTileOffsetY - (Math.floor(tilesY / 2) - j) * 256 - modPosY;
        for (let i = 0; i < tilesX; i++) {
          const col = layer.centerTileX + Math.floor(store.posLeft / 256) - Math.floor(tilesX / 2) + i;
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
          store.setPosLeft(0);
          store.setPosTop(0);
          instance!.proxy!.$forceUpdate();
        }
      );

      watch(
        () => [store.cropLeft, store.cropTop, store.cropWidth, store.cropHeight],
        () => { updateDownloadData() }
      )
    });

    onBeforeUpdate(() => {
      updateTiles();
    });

    const dragged = (deltaX: number, deltaY: number, handle: string) => {
      store.setPosLeft(store.posLeft - deltaX);
      store.setPosTop(store.posTop - deltaY);
      updateDownloadData();
      instance!.proxy!.$forceUpdate();
    }

    const updateDownloadData = () => {
      const selectedMap = store.map;
      const zoomLayers = store.map.zoomLayers;
      const layer = zoomLayers[zoomLevel.value];
      const mapWidth = map.value!.clientWidth;
      const mapHeight = map.value!.clientHeight;
      const tilesX = Math.ceil(mapWidth / 256) + 2;
      const tilesY = Math.ceil(mapHeight / 256) + 2;

      const startX = store.cropLeft + store.posLeft - Math.floor(mapWidth / 2) + layer.centerTileOffsetX;
      const startY = store.cropTop + store.posTop - Math.floor(mapHeight / 2) + layer.centerTileOffsetY;

      store.setDownloadData({
        zoomLevel: store.zoomLevel,
        startCol: Math.floor(startX / 256) + layer.centerTileX,
        startRow: Math.floor(startY / 256) + layer.centerTileY,
        endCol: Math.floor((startX + store.cropWidth) / 256) + layer.centerTileX,
        endRow: Math.floor((startY + store.cropHeight) / 256) + layer.centerTileY,
        startX: mod(startX, 256),
        startY: mod(startY, 256),
        endX: mod(startX + store.cropWidth, 256),
        endY: mod(startY + store.cropHeight, 256),
        mapName: store.map.name,
        mapType: store.mapType,
      });
    }

    const instance = getCurrentInstance();

    const zoom = (event: WheelEvent) => {
      const zoomIn = event.deltaY < 0;
      let zoom = zoomLevel.value + (zoomIn ? 1 : -1);
      if (zoom >= 0 && zoom <= selectedMap.value.zoomLayers.length - 1) {
        let factor = selectedMap.value.zoomFactorProvider(zoomLevel.value, zoomIn);
        if (!zoomIn) {
          factor = 1 / factor;
        }

        store.setPosLeft(store.posLeft * factor);
        store.setPosTop(store.posTop * factor);

        store.setZoomLevel(zoom);
        store.setSelectionStart(null);
        store.setSelectionEnd(null);

        instance!.proxy!.$forceUpdate();
      }
    };

    const noTileImage = (e: any) => {
      e.path[0].classList.add("hidden");
    };

    return { tiles, map, dragged, zoom, noTileImage, mapType, selectedMap };
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
