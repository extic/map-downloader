<template>
  <div ref="map" class="map-view" v-draggable="{ dragged }" @wheel="zoom($event)">
    <div v-for="tile in tiles" :key="`${tile.indexX}:${tile.indexY}`" :style="{ left: tile.left + 'px', top: tile.top + 'px' }" class="tile" @mousemove="mouseMoved($event, tile)">
      <img v-if="!tile.unsupported" :src="tile.url" @error="noTileImage($event)" alt="map tile" referrerpolicy="origin"/>
      <img v-else src="../assets/images/unsupported.png"/>
    </div>
    <img v-if="layerUrl" class="layer-image" :src="layerUrl"/>
    <crop-area v-if="store.showCrop && !isCropAreaTooSmall" />
    <map-info/>
    <app-version/>
    <div class="crop-too-small" v-if="store.showCrop && isCropAreaTooSmall">Crop area too small to show - either zoom in or reset</div>
  </div>

</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, ref, watch } from "vue";
import { useMapStore } from "../store/map-store";
import CropArea from "./CropArea.vue";
import AppVersion from "./AppVersion.vue";
import MapInfo from "./MapInfo.vue";
import { UrlUsageType, Coordinates } from "../../../common/maps/map.data";

interface TileData {
  readonly left: number;
  readonly top: number;
  readonly url: string;
  readonly row: number;
  readonly col: number;
  readonly unsupported?: boolean;
  readonly indexX: number;
  readonly indexY: number;
}

export default defineComponent({
  name: "MapView",

  components: { CropArea, AppVersion, MapInfo },

  setup() {
    const store = useMapStore();

    const tiles = ref([] as TileData[]);
    const map = ref(null as HTMLDivElement | null);
    const layerUrl = ref<string | undefined>(undefined);

    const isCropAreaTooSmall = computed(() => {
      return store.cropWidth < 50 || store.cropHeight < 50;
    });

    const mod = (n: number, m: number): number => {
      return ((n % m) + m) % m;
    };

    let layerTimeoutHandle: NodeJS.Timeout | undefined = undefined;

    const updateTiles = async () => {
      const selectedMap = store.map;
      const zoomLayers = store.map.zoomLayers;
      const layer = zoomLayers[store.zoomLevel];
      const mapWidth = map.value!.clientWidth;
      const mapHeight = map.value!.clientHeight;
      const tilesX = Math.ceil(mapWidth / 256) + 1;
      const tilesY = Math.ceil(mapHeight / 256) + 1;

      const modPosX = mod(store.posLeft, 256);
      const modPosY = mod(store.posTop, 256);

      let startLeft = Math.ceil(mapWidth / 2) - layer.centerTileOffsetX - modPosX;
      let startIndexX =  Math.floor(store.posLeft / 256);
      while (startLeft > 0) {
        startLeft -= 256;
        startIndexX--;
      }
      let startTop = Math.ceil(mapHeight / 2) - layer.centerTileOffsetY - modPosY;
      let startIndexY =  Math.floor(store.posTop / 256);
      while (startTop > 0) {
        startTop -= 256;
        startIndexY--;
      }

      const newTiles: TileData[] = [];
      for (let j = 0; j < tilesY; j++) {
        const indexY = startIndexY + j;
        const row = layer.centerTileY + indexY;
        const top = startTop + j * 256;
        for (let i = 0; i < tilesX; i++) {
          const indexX = startIndexX + i;
          const col = layer.centerTileX + indexX;
          const left = startLeft + i * 256;
          const { url, unsupported } = await selectedMap.urlProvider(UrlUsageType.VIEW, store.mapType, store.zoomLevel, row, col);
          newTiles.push({ left, top, url, row, col, unsupported, indexX, indexY });
        }
      }

      tiles.value = newTiles;

      handleShowElevationLines();
    };

    const handleShowElevationLines = () => {
      if (layerTimeoutHandle) {
        clearTimeout(layerTimeoutHandle);
      }
      layerTimeoutHandle = setTimeout(() => {
        if (store.showElevationLines) {
          const selectedMap = store.map;
          const mapWidth = map.value!.clientWidth;
          const mapHeight = map.value!.clientHeight;
          layerUrl.value = selectedMap.layerUrlProvider?.(selectedMap.zoomLayers[store.zoomLevel], mapWidth, mapHeight, store.posLeft, store.posTop) || undefined;
        } else {
          layerUrl.value = undefined;
        }
      }, 1000);
    };

    const updateMapDimensions = () => {
      const mapWidth = map.value!.clientWidth;
      const mapHeight = map.value!.clientHeight;
      store.setMapDimensions(mapWidth, mapHeight);
    };

    onMounted(async () => {
      updateMapDimensions();
      store.resetCropArea();
      updateDownloadData();
      await updateTiles();

      watch(
        () => [store.map, store.mapType],
        ([newMap, newMapType], [oldMap, oldMapType]) => {
          if (newMap !== oldMap) {
            store.setPosLeft(0);
            store.setPosTop(0);
          }

          if (oldMap !== newMap) {
            store.resetCropArea();
            updateDownloadData();
          } else if (newMapType !== oldMapType) {
            updateDownloadData();
          }

          instance!.proxy!.$forceUpdate();
        }
      );

      watch(
        () => [store.cropLeft, store.cropTop, store.cropWidth, store.cropHeight, store.mapType],
        () => {
          updateDownloadData();
        }
      );

      watch(
        () => [store.zoomLevel, store.posLeft, store.posTop, store.map, store.mapType],
        async ([newZoomLevel], [oldZoomLevel]) => {
          if (newZoomLevel !== oldZoomLevel) {
            tiles.value = [];
          }
          layerUrl.value = undefined;
          await updateTiles();
        }
      );

      watch(
        () => [store.showElevationLines],
        () => {
          handleShowElevationLines();
        }
      );

      (document.getElementsByTagName("BODY")[0] as HTMLElement).onresize = (event) => {
        updateMapDimensions();
      };
    });

    const dragged = (deltaX: number, deltaY: number, handle: string) => {
      store.setPosLeft(store.posLeft - deltaX);
      store.setPosTop(store.posTop - deltaY);
      store.setCropLeft(store.cropLeft + deltaX);
      store.setCropTop(store.cropTop + deltaY);
      updateDownloadData();
      instance!.proxy!.$forceUpdate();
    };

    const updateDownloadData = () => {
      const zoomLayers = store.map.zoomLayers;
      const layer = zoomLayers[store.zoomLevel];
      const mapWidth = map.value!.clientWidth;
      const mapHeight = map.value!.clientHeight;

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
        layerMapWidth: store.cropWidth,
        layerMapHeight: store.cropHeight,
        layerStartX: store.posLeft - mapWidth / 2 + store.cropWidth / 2 + store.cropLeft,
        layerStartY: store.posTop - mapHeight / 2 + store.cropHeight / 2 + store.cropTop,
      });

      console.log(store.cropLeft, store.cropTop, store.cropWidth, store.cropHeight);
    };

    const instance = getCurrentInstance();

    const zoom = (event: WheelEvent) => {
      const selectedMap = store.map;
      const zoomIn = event.deltaY < 0;
      let zoom = store.zoomLevel + (zoomIn ? 1 : -1);
      if (zoom >= 0 && zoom <= selectedMap.zoomLayers.length - 1) {
        let factor = selectedMap.zoomFactorProvider(store.zoomLevel, zoomIn);
        if (!zoomIn) {
          factor = 1 / factor;
        }

        store.setPosLeft(store.posLeft * factor);
        store.setPosTop(store.posTop * factor);
        store.setZoomLevel(zoom);

        const mapWidth = map.value!.clientWidth;
        const mapHeight = map.value!.clientHeight;
        const cropLeft = store.cropLeft - Math.floor(mapWidth / 2);
        const cropTop = store.cropTop - Math.floor(mapHeight / 2);
        store.setCropLeft(Math.floor(mapWidth / 2) + cropLeft * factor);
        store.setCropTop(Math.floor(mapHeight / 2) + cropTop * factor);
        store.setCropWidth(store.cropWidth * factor);
        store.setCropHeight(store.cropHeight * factor);

        instance!.proxy!.$forceUpdate();
      }
    };

    const noTileImage = (e: any) => {
      e.path[0].classList.add("hidden");
    };

    const mouseMoved = (event: MouseEvent, tile: TileData) => {
      const selectedMap = store.map;
      if (selectedMap.showCoordinates) {
        const zoomLayer = selectedMap.zoomLayers[store.zoomLevel];
        const pixelCoordinates: Coordinates = {
          x: event.offsetX + tile.indexX * 256 - zoomLayer.centerTileOffsetX,
          y: event.offsetY + tile.indexY * 256 - zoomLayer.centerTileOffsetY,
        };
        const coordinates = selectedMap.coordinateProvider!!(zoomLayer, pixelCoordinates);
        store.setCoordinates(Math.round(coordinates.x), Math.round(coordinates.y));
      }
    };

    return {
      store,
      tiles,
      map,
      dragged,
      zoom,
      noTileImage,
      isCropAreaTooSmall,
      mouseMoved,
      layerUrl,
    };
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
    // border: 1px solid red;

    & > img {
      &.hidden {
        visibility: hidden;
      }
    }
  }

  .crop-too-small {
    position: absolute;
    top: 0;
    left: calc(50% - 15em);
    width: 30em;
    background-color: rgba(130, 0, 0, 0.7);
    color: white;
    padding: 0.5em 0;
    border: 1px solid #d32929;
    border-top: none;
    border-radius: 0 0 10px 10px;
  }

  .layer-image {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
  }
}
</style>
