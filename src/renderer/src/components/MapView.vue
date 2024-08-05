<template>
  <div ref="map" class="map-view" v-draggable="{ dragged }" @wheel="zoom($event)">
    <div v-for="tile in tiles" :key="tile.top * 100000 + tile.left" :style="{ left: tile.left + 'px', top: tile.top + 'px' }" class="tile">
      <img v-if="!tile.unsupported" :src="tile.url" referrerpolicy="origin" alt="map tile" @error="noTileImage"/>
      <img v-else src="../assets/images/unsupported.png"/>
    </div>
    <crop-area v-if="store.showCrop && !isCropAreaTooSmall" />
    <div class="map-info">
      <div>Zoom:</div>
      <span>{{ store.map.zoomLevelProvider(store.zoomLevel) }}</span>
      <div v-if="store.map.showScale" class="scale">
        <div class="gap">Scale:</div>
        <span>1:{{ store.map.zoomLayers[store.zoomLevel].scale }}</span>
      </div>
    </div>
    <div class="app-version">Version: v{{ store.appVersion }}</div>
    <div v-if="store.showCrop && isCropAreaTooSmall" class="crop-too-small">Crop area too small to show - either zoom in or reset</div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUpdate, onMounted, ref, watch } from "vue";
import { useMapStore } from "../store/map-store";
import CropArea from "./CropArea.vue";
import { MapData, UrlUsageType } from "../../../common/maps/map.data";

interface TileData {
  readonly left: number
  readonly top: number
  readonly url: string
  readonly row: number
  readonly col: number
  readonly unsupported?: boolean
}

const store = useMapStore()

const tiles = ref([] as TileData[])
const map = ref(null as HTMLDivElement | null)

const isCropAreaTooSmall = computed(() => {
  return store.cropWidth < 50 || store.cropHeight < 50
})

const mod = (n: number, m: number): number => {
  return ((n % m) + m) % m;
}

async function updateTiles() {
  const zoomLayers = store.map.zoomLayers
  const layer = zoomLayers[store.zoomLevel]
  const mapWidth = map.value!.clientWidth
  const mapHeight = map.value!.clientHeight
  const tilesX = Math.ceil(mapWidth / 256) + 2
  const tilesY = Math.ceil(mapHeight / 256) + 2

  const modPosX = mod(store.posLeft, 256)
  const modPosY = mod(store.posTop, 256)

  tiles.value = []
  for (let j = 0; j < tilesY; j++) {
    const row = layer.centerTileY + Math.floor(store.posTop / 256) - Math.floor(tilesY / 2) + j + 1
    const top = Math.floor(mapHeight / 2) - layer.centerTileOffsetY - (Math.floor(tilesY / 2) - j) * 256 - modPosY + 256
    for (let i = 0; i < tilesX; i++) {
      const col = layer.centerTileX + Math.floor(store.posLeft / 256) - Math.floor(tilesX / 2) + i + 1
      const left = Math.floor(mapWidth / 2) - layer.centerTileOffsetX - (Math.floor(tilesX / 2) - i) * 256 - modPosX + 256
      const { url, unsupported } = await store.map.urlProvider(UrlUsageType.VIEW, store.mapType, store.zoomLevel, row, col)
      tiles.value.push({ left, top, url, row, col, unsupported })
    }
  }
}

function updateMapDimensions() {
  const mapWidth = map.value!.clientWidth;
  const mapHeight = map.value!.clientHeight;
  store.setMapDimensions(mapWidth, mapHeight);
}

onMounted(async () => {
  updateMapDimensions()
  store.resetCropArea()
  updateDownloadData()
  await updateTiles()

  watch(
    () => [store.map, store.mapType],
    ([newMap, newMapType], [oldMap, oldMapType]) => {
      if (newMap !== oldMap) {
        store.posLeft = 0
        store.posTop = 0
      }

      if (oldMap !== newMap) {
        store.resetCropArea()
        updateDownloadData()
      } else if (newMapType !== oldMapType) {
        updateDownloadData()
      }
  //     instance!.proxy!.$forceUpdate();
    }
  )
  //
  // watch(
  //   () => [store.cropLeft, store.cropTop, store.cropWidth, store.cropHeight, store.mapType],
  //   () => {
  //     updateDownloadData();
  //   }
  // );

  watch(
    () => [store.zoomLevel, store.posLeft, store.posTop, store.map, store.mapType],
    async () => {
      await updateTiles()
    }
  )
  //
  // (document.getElementsByTagName("BODY")[0] as HTMLElement).onresize = () => {
  //   updateMapDimensions()
  // }
})

function dragged(deltaX: number, deltaY: number) {
  store.posLeft = store.posLeft - deltaX
  store.posTop = store.posTop - deltaY
  store.cropLeft = store.cropLeft + deltaX
  store.cropTop = store.cropTop + deltaY
  updateDownloadData()
  // instance!.proxy!.$forceUpdate()
}

const updateDownloadData = () => {
  // const zoomLayers = store.map.zoomLayers;
  // const layer = zoomLayers[store.zoomLevel];
  // const mapWidth = map.value!.clientWidth;
  // const mapHeight = map.value!.clientHeight;

  // const startX = store.cropLeft + store.posLeft - Math.floor(mapWidth / 2) + layer.centerTileOffsetX;
  // const startY = store.cropTop + store.posTop - Math.floor(mapHeight / 2) + layer.centerTileOffsetY;
  //
  // store.setDownloadData({
  //   zoomLevel: store.zoomLevel,
  //   startCol: Math.floor(startX / 256) + layer.centerTileX,
  //   startRow: Math.floor(startY / 256) + layer.centerTileY,
  //   endCol: Math.floor((startX + store.cropWidth) / 256) + layer.centerTileX,
  //   endRow: Math.floor((startY + store.cropHeight) / 256) + layer.centerTileY,
  //   startX: mod(startX, 256),
  //   startY: mod(startY, 256),
  //   endX: mod(startX + store.cropWidth, 256),
  //   endY: mod(startY + store.cropHeight, 256),
  //   mapName: store.map.name,
  //   mapType: store.mapType,
  // });
};

// const instance = getCurrentInstance();

function zoom(event: WheelEvent) {
  const zoomIn = event.deltaY < 0
  const zoom = store.zoomLevel + (zoomIn ? 1 : -1)
  if (zoom >= 0 && zoom <= store.map.zoomLayers.length - 1) {
    let factor = store.map.zoomFactorProvider(store.zoomLevel, zoomIn)
    if (!zoomIn) {
      factor = 1 / factor
    }

    store.posLeft = store.posLeft * factor
    store.posTop = store.posTop * factor
    store.zoomLevel = zoom

    const mapWidth = map.value!.clientWidth
    const mapHeight = map.value!.clientHeight
    const cropLeft = store.cropLeft - Math.floor(mapWidth / 2)
    const cropTop = store.cropTop - Math.floor(mapHeight / 2)
    store.cropLeft = Math.floor(mapWidth / 2) + cropLeft * factor
    store.cropTop = Math.floor(mapHeight / 2) + cropTop * factor
    store.cropWidth = store.cropWidth * factor
    store.cropHeight = store.cropHeight * factor

//   instance!.proxy!.$forceUpdate();
  }
}

function noTileImage(e: any) {
  e.currentTarget.classList.add('hidden')
  // e.path[0].classList.add('hidden')
}
</script>

<style scoped>
.map-view {
  position: relative;
  overflow: hidden;

  .tile {
    position: absolute;
    width: 256px;
    height: 256px;
    box-sizing: content-box;

    & > img {
      &.hidden {
        visibility: hidden;
      }
    }
  }

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
  }

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
}
</style>
