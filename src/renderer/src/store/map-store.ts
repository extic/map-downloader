import { defineStore } from 'pinia'
import { MapData, maps } from '../../../common/maps/map.data'
import { DownloadData } from '../../../common/download'
import { ref } from 'vue'

export type DragMode = 'map' | 'crop'

const resetDownloadData = (): DownloadData => ({
  zoomLevel: 0,
  startRow: 0,
  startCol: 0,
  endRow: 0,
  endCol: 0,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  mapName: '',
  mapType: ''
})

export const useMapStore = defineStore('map', () => {
  const map = ref(maps[0])
  const mapType = ref(maps[0].supportedMapTypes[0])
  const zoomLevel = ref(0)
  const posLeft = ref(0)
  const posTop = ref(0)
  const showCrop = ref(true)
  const cropLeft = ref(0)
  const cropTop = ref(0)
  const cropWidth = ref(0)
  const cropHeight = ref(0)
  const dragMode = ref<DragMode>('map')
  const downloadData = ref<DownloadData>(resetDownloadData())
  const mapWidth = ref(0)
  const mapHeight = ref(0)
  // const tooLarge = ref(false)
  const appVersion = ref('')

  function setMap(mapData: MapData): void {
      map.value = mapData
      mapType.value = mapData.supportedMapTypes[0]
      zoomLevel.value = 0
      showCrop.value = false
      cropLeft.value = 0
      cropTop.value = 0
      cropWidth.value = 300
      cropHeight.value = 300
      downloadData.value = resetDownloadData()
    }

    // setDownloadData(downloadData: DownloadData): void {
    //   this._downloadData = downloadData
    //
    //   const tilesX = downloadData.endCol - downloadData.startCol + 1
    //   const tilesY = downloadData.endRow - downloadData.startRow + 1
    //   this._tooLarge = tilesX * tilesY > 2500
    // },
    //
  function setMapDimensions(newMapWidth: number, newMapHeight: number) {
    mapWidth.value = newMapWidth
    mapHeight.value = newMapHeight
  }

  function resetCropArea() {
    cropLeft.value = Math.floor(mapWidth.value / 2) - 150
    cropTop.value = Math.floor(mapHeight.value / 2) - 150
    cropWidth.value = 300
    cropHeight.value = 300
  }

  function setAppVersion(version: string): void {
    appVersion.value = version
  }

  return {
    map,
    mapType,
    zoomLevel,
    posLeft,
    posTop,
    showCrop,
    cropLeft,
    cropTop,
    cropWidth,
    cropHeight,
    dragMode,
    downloadData,
    mapWidth,
    mapHeight,
    // tooLarge,
    appVersion,
    setMap,
    setMapDimensions,
    resetCropArea,
    setAppVersion
  }
})
