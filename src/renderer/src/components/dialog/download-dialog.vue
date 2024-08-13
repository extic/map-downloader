<template>
  <base-dialog ref="base">
    <template #header>
      <span class="title">{{ error ? 'Error' : 'Creating Map...' }}</span>
    </template>
    <template #default>
      <div class="donate-dialog-content">
        <div class="dialog-content">
          <div v-if="!error">
            <div>Progress</div>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: progress * 100 + '%' }"></div>
              <div class="progress-value">{{ progressValue() }}%</div>
            </div>
          </div>
          <div v-else class="error">{{ error }}</div>
        </div>
        <div class="buttons">
          <button @click="cancel">{{ error ? 'Close' : 'Cancel' }}</button>
        </div>
      </div>
    </template>
  </base-dialog>
</template>

<script setup lang="ts">
import BaseDialog from './base-dialog.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { useMapStore } from '../../store/map-store'
import { DownloadData } from '../../../../common/download'
import { mod } from '../../utils'

const base = ref<typeof BaseDialog>()
const error = ref(null as string | null)
const progress = ref(0)
const store = useMapStore()

const props = defineProps({
  mapWidth: Number,
  mapHeight: Number
})

function progressValue() {
  return (progress.value * 100).toFixed(2)
}

function cancel() {
  window.electron.ipcRenderer.send('cancel-download', {})
  base.value!.closeDialog()
}

function onDownloadProgress(_: any, downloadProgress: number) {
  progress.value = downloadProgress
}

function onDownloadDone(_: any, result: boolean) {
  progress.value = 1
  if (result) {
    base.value!.closeDialog()
  } else {
    error.value = 'There was an error while downloading. Please try again.'
  }
}

let downloadProgressEventTargetRef: (() => void) | null = null
let downloadDoneEventTargetRef: (() => void) | null = null

onMounted(() => {
  const zoomLayers = store.map.zoomLayers
  const layer = zoomLayers[store.zoomLevel]
  const mapWidth = props.mapWidth!
  const mapHeight = props.mapHeight!

  const startX = store.cropLeft + store.posLeft - Math.floor(mapWidth / 2) + layer.centerTileOffsetX
  const startY = store.cropTop + store.posTop - Math.floor(mapHeight / 2) + layer.centerTileOffsetY

  const downloadData: DownloadData = {
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
    mapType: store.mapType
  }

  const tilesX = downloadData.endCol - downloadData.startCol + 1
  const tilesY = downloadData.endRow - downloadData.startRow + 1
  const tooLarge = tilesX * tilesY > 2500
  if (tooLarge) {
    error.value = 'Content to download is too large, please down-size the crop area.'
  } else {
    downloadProgressEventTargetRef = window.electron.ipcRenderer.on('download-progress', onDownloadProgress)
    downloadDoneEventTargetRef = window.electron.ipcRenderer.on('download-done', onDownloadDone)

    window.electron.ipcRenderer.send('download-map', downloadData)
  }
})

onUnmounted(() => {
  downloadProgressEventTargetRef?.()
  downloadDoneEventTargetRef?.()
})
</script>

<style scoped>
.title {
  flex-grow: 1;
  font-size: 1.3em;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  margin: 1em 0 3em 0;

  .progress-bar-container {
    border: 1px solid gray;
    border-radius: 5px;
    position: relative;
    height: 1.5em;
    overflow: hidden;
    margin-top: 5px;

    .progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      background: #65b3ff;
      height: 1.5em;
    }

    .progress-value {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1.5em;
      line-height: 1.5em;
      text-align: center;
    }
  }

  .error {
    margin-bottom: 2em;
  }
}

.buttons {
  margin-top: 2em;
  display: flex;
  align-items: center;
  gap: 1em;
  justify-content: flex-end;

  button {
    padding: 0.3em 1em;
    border: 1px solid #555;
    border-radius: 5px;
    cursor: pointer;
    width: 10em;

    &.primary {
      background-color: #65b3ff;
      color: white;
    }
  }
}
</style>
