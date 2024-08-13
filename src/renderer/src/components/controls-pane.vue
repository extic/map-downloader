<template>
  <div class="controls-pane">
    <div class="left-pane">
      <div class="field">
        <label>Source:</label>
        <select v-model="selectedMap">
          <option v-for="map in maps" :key="map.name" :value="map">{{ map.name }}</option>
        </select>
      </div>
      <div v-if="store.map.supportedMapTypes.length > 1" class="field">
        <div class="vertical">
          <div v-for="(type, index) in store.map.supportedMapTypes" :key="index" class="vertical-item">
            <input :id="`mapType${index}`" v-model="store.mapType" type="radio" :value="type" />
            <label :for="`mapType${index}`">{{ type }}</label>
          </div>
        </div>
      </div>
      <div class="crop-controls">
        <div class="crop-controls-title">Crop Area</div>
        <div class="field">
          <button @click="toggleShowCrop">{{ store.showCrop ? 'Hide' : 'Show' }}</button>
          <button @click="resetCropArea">Reset</button>
        </div>
      </div>
      <div v-if="store.showCrop" title="Press <ctrl> to toggle drag mode" class="drag-mode">
        <div class="drag-mode-title">Mode</div>
        <div class="field">
          <div class="drag-mode-toggle-container" @click="toggleDragMode">
            <div class="drag-mode-toggle" :class="{ selected: store.dragMode == 'crop' }"></div>
          </div>
          <div class="move-options">
            <div class="move-option" @click="store.dragMode = 'map'">Move Map</div>
            <div class="move-option" @click="store.dragMode = 'crop'">Move Crop Area</div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-pane">
      <button :disabled="!store.showCrop" @click="download">Download</button>
      <button @click="donate">Donate</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '../store/map-store'
import { MapData, maps } from '../../../common/maps/map.data'
import { computed, onMounted } from 'vue'
import { useDialog } from './dialog/use-dialog'
import DownloadDialog from './dialog/download-dialog.vue'
import { isProduction } from '../utils'

const store = useMapStore()
const dialog = useDialog()

const selectedMap = computed({
  get(): MapData {
    return store.map
  },
  set(newValue: MapData) {
    store.setMap(newValue)

    window.electron.ipcRenderer.send('set-referer', newValue.referer)
  }
})

function toggleShowCrop() {
  store.showCrop = !store.showCrop
}

function resetCropArea() {
  store.resetCropArea()
}

function toggleDragMode() {
  store.dragMode = store.dragMode === 'map' ? 'crop' : 'map'
}

function download() {
  dialog.show(DownloadDialog, { mapWidth: store.mapWidth, mapHeight: store.mapHeight })
}

function donate() {
  window.open(
    'https://www.paypal.com/donate/?business=R4VGRL3MHAWCY&no_recurring=0&item_name=Maps+Downloader+-+I+welcome+your+support+as+it+takes+some+time+and+effort+continuing+developing+and+maintaining+it.+Thank+you%21&currency_code=ILS'
  )
}

onMounted(() => {
  if (isProduction()) {
    donate()
  }

  document.onkeydown = (event) => {
    if (event.key === 'Control') {
      store.dragMode = 'crop'
    }
  }

  document.onkeyup = (event) => {
    if (event.key === 'Control') {
      store.dragMode = 'map'
    }
  }
})
</script>

<style scoped>
.controls-pane {
  display: flex;
  align-items: center;
  padding: 1em;
  color: rgb(228, 228, 228);
  width: 100%;

  .left-pane {
    gap: 1em;
    display: flex;
    align-items: center;
    flex-grow: 1;

    .crop-controls {
      display: flex;
      border: 1px solid lightgray;
      border-radius: 4px;
      position: relative;
      padding: 0.5em;
      height: 2.5em;

      .crop-controls-title {
        position: absolute;
        font-size: 0.8em;
        top: -0.6em;
        left: 0.5em;
        background-color: #2b669b;
        padding: 0 0.4em;
      }

      button {
        width: 7em;
      }
    }

    .drag-mode {
      display: flex;
      border: 1px solid lightgray;
      border-radius: 4px;
      position: relative;
      padding: 0.5em;
      width: 10em;
      height: 2.5em;
      .drag-mode-title {
        position: absolute;
        font-size: 0.8em;
        top: -0.6em;
        left: 0.5em;
        background-color: #2b669b;
        padding: 0 0.4em;
      }

      .drag-mode-toggle-container {
        margin-left: 1em;
        border: 1px solid lightgray;
        width: 1em;
        height: 2em;
        border-radius: 10px;
        background-color: rgb(143 143 143);
        cursor: pointer;
        position: relative;

        .drag-mode-toggle {
          width: 1em;
          height: 1em;
          border: 1px solid gray;
          position: absolute;
          box-sizing: border-box;
          border-radius: 10px;
          background-color: white;
          transition: bottom 0.2s;
          bottom: 1em;

          &.selected {
            bottom: 0;
          }
        }
      }

      .move-options {
        text-align: left;

        .move-option {
          cursor: pointer;
        }
      }
    }
  }

  .right-pane {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-items: center;
    gap: 0.5em;
    margin-left: 1em;
  }

  .vertical {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .vertical-item {
      white-space: pre;
    }
  }

  .field {
    display: flex;
    align-items: center;
    gap: 0.5em;

    .field-label {
      margin-right: 0.5em;
    }

    select {
      padding: 0.3em 1em;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
      background-color: rgb(228, 228, 228);

      &:hover {
        background-color: white;
      }
    }
  }

  button {
    padding: 0.3em 2em;
    border-radius: 4px;
    border: 1px solid lightgray;
    cursor: pointer;
    transition: background-color 0.2s;
    background-color: rgb(228, 228, 228);

    &:hover {
      background-color: white;
    }
  }
}
</style>
