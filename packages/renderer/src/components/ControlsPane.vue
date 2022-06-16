<template>
  <div class="controls-pane">
    <div class="left-pane">
      <div class="field">
        <label>Source:</label>
        <select>
          <option>GovMap</option>
        </select>
      </div>
      <div class="field">
        <div class="vertical">
          <div>
            <input id="mapTypeSatellite" type="radio" value="satellite" v-model="mapType" />
            <label for="mapTypeSatellite">Satellite</label>
          </div>
          <div>
            <input id="mapTypeBuildings" type="radio" value="buildings" v-model="mapType" />
            <label for="mapTypeBuildings">Street & Buildings</label>
          </div>
        </div>
      </div>
      <div class="field">
        <label>Scale:</label>
        <div>1:{{ scale }}</div>
      </div>
      <div class="field">
        <label>Zoom Level:</label>
        <div>{{ zoomLevel }}</div>
      </div>
      <div class="field">
        <label>Selected Tiles:</label>
        <div v-if="selectedTiles">{{ selectedTiles }}</div>
        <div v-else>No Selection Yet</div>
      </div>
      <button @click="download">Download</button>
    </div>
    <div class="right-pane">
      <button @click="contact">Contact</button>
      <button @click="donate">Donate</button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, WritableComputedRef } from "vue";
import { openDonateDialog } from "./DonateDialog.vue";
import { isProduction } from "../utils";
import { openContactDialog } from "./ContactDialog.vue";
import { openDownloadDialog } from "./DownloadDialog.vue";
import { MapType, useMapStore } from "../store/map-store";
import { ipcRenderer } from "electron";

export default defineComponent({
  name: "ControlsPane",

  setup() {
    const store = useMapStore();

    const zoomLevel = computed(() => {
      return store.zoomLevel;
    });

    const scale = computed(() => {
      return store.scale;
    });

    const selectionStart = computed(() => {
      return store.selectionStart;
    });

    const selectionEnd = computed(() => {
      return store.selectionEnd;
    });

    const selectedTiles = computed((): number | null => {
      const selectionStart = store.selectionStart;
      const selectionEnd = store.selectionEnd;

      if (selectionStart === null || selectionEnd === null) {
        return null;
      }

      return (selectionEnd.x - selectionStart.x + 1) * (selectionEnd.y - selectionStart.y + 1);
    });

    const download = async () => {
      const selectionStart = store.selectionStart;
      const selectionEnd = store.selectionEnd;

      if (selectionStart === null || selectionEnd === null) {
        return;
      }

      openDownloadDialog({
        zoomLevel: zoomLevel.value,
        startX: selectionStart.x,
        startY: selectionStart.y,
        maxX: selectionEnd.x,
        maxY: selectionEnd.y,
        mapType: store.mapType,
      });

      ipcRenderer.send("download-map", {
        zoomLevel: zoomLevel.value.toString().padStart(2, '0'),
        startX: selectionStart.x,
        startY: selectionStart.y,
        maxX: selectionEnd.x - selectionStart.x + 1,
        maxY: selectionEnd.y - selectionStart.y + 1,
        mapType: store.mapType,
      });
      //
      //
      // const url = "/api/download"
      // const response = await axios.get(url, {
      //     params: {
      //         "zoom": zoomLevel.value,
      //         "colStart": selectionStart.x.toString(16),
      //         "rowStart": selectionStart.y.toString(16),
      //         "colEnd": selectionEnd.x.toString(16),
      //         "rowEnd": selectionEnd.y.toString(16)
      //     },
      //     responseType: 'arraybuffer'
      // })
      //
      // const type = response.headers['content-type']
      // const blob = new Blob([response.data], {type: type})
      // const link = document.createElement('a')
      // link.href = window.URL.createObjectURL(blob)
      // link.download = 'map.png'
      // link.click()
    };

    const donate = () => {
      openDonateDialog();
    };

    const contact = async () => {
      openContactDialog();
    };

    const mapType: WritableComputedRef<MapType> = computed({
      get(): MapType {
        return store.mapType;
      },

      set(mapType: MapType) {
        store.setMapType(mapType);
      },
    });

    return { zoomLevel, scale, selectionStart, selectionEnd, selectedTiles, download, contact, donate, mapType };
  },

  mounted() {
    if (isProduction()) {
      this.donate();
    }
  },
});
</script>

<style lang="scss" scoped>
.controls-pane {
  display: flex;
  align-items: center;
  padding: 1em;
  color: #333;
  width: 100%;

  .left-pane {
    gap: 2em;
    display: flex;
    align-items: center;
    flex-grow: 1;
  }

  .right-pane {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 1em;
  }

  .field {
    display: flex;
    align-items: center;
    gap: 0.5em;

    select {
      padding: 0.3em 1em;
      border-radius: 4px;
    }

    .vertical {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }

  button {
    padding: 0.3em 2em;
  }
}
</style>
