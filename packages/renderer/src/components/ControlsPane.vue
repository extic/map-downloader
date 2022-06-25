<template>
  <div class="controls-pane">
    <div class="left-pane">
      <div class="field">
        <label>Source:</label>
        <select v-model="selectedMap">
          <option v-for="map in allMaps" :value="map">{{ map.name }}</option>
        </select>
      </div>
      <div v-if="selectedMap.supportedMapTypes.length > 1" class="field">
        <div class="vertical">
          <div v-for="(type, index) in selectedMap.supportedMapTypes" :key="index" class="vertical-item">
            <input :id="`mapType${index}`" type="radio" :value="type" v-model="mapType" />
            <label :for="`mapType${index}`">{{ type }}</label>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="vertical">
          <div class="vertical-item">
            <label class="field-label">Scale:</label>
            <span>1:{{ selectedMap.zoomLayers[zoomLevel].scale }}</span>
          </div>
          <div class="vertical-item">
            <label class="field-label">Zoom:</label>
            <span>{{ selectedMap.zoomLevelProvider(zoomLevel) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="right-pane">
      <button @click="download">Download</button>
      <button @click="donate">Donate</button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "vue";
import { isProduction } from "../utils";
import { openDownloadDialog } from "./DownloadDialog.vue";
import { useMapStore } from "../store/map-store";
import { ipcRenderer } from "electron";
import { MapData, maps } from "../../../common/maps/map.data";

export default defineComponent({
  name: "ControlsPane",

  setup() {
    const store = useMapStore();

    const zoomLevel = computed(() => {
      return store.zoomLevel;
    });

    const selectedMap = computed({
      get(): MapData {
        return store.map;
      },
      set(newValue: MapData) {
        store.setMap(newValue);
      },
    });

    const mapType = computed({
      get(): string {
        return store.mapType;
      },

      set(mapType: string) {
        store.setMapType(mapType);
      },
    });

    const allMaps = computed(() => {
      return maps;
    });

    watch(
      () => [store.downloadData],
      ([downloadData]) => {
        console.log("cropLeft, posLeft, data", store.cropLeft, store.posLeft, downloadData.endY);
      }
    );

    const download = async () => {
      openDownloadDialog();
      ipcRenderer.send("download-map", {
        zoomLevel: store.downloadData.zoomLevel,
        startRow: store.downloadData.startRow,
        startCol: store.downloadData.startCol,
        endRow: store.downloadData.endRow,
        endCol: store.downloadData.endCol,
        startX: store.downloadData.startX,
        startY: store.downloadData.startY,
        endX: store.downloadData.endX,
        endY: store.downloadData.endY,
        mapName: store.downloadData.mapName,
        mapType: store.downloadData.mapType,
      });

      store.downloadData;
    };

    const donate = () => {
      window.open(
        "https://www.paypal.com/donate/?business=R4VGRL3MHAWCY&no_recurring=0&item_name=Maps+Downloader+-+I+welcome+your+support+as+it+takes+some+time+and+effort+continuing+developing+and+maintaining+it.+Thank+you%21&currency_code=ILS"
      );
    };

    return { zoomLevel, download, donate, mapType, allMaps, selectedMap };
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
  color: rgb(228, 228, 228);
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
    flex-direction: column;
    align-items: stretch;
    justify-items: center;
    gap: 0.5em;
  }

  .vertical {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3em;

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
