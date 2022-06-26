import { defineStore } from "pinia";
import { MapData, maps } from "../../../common/maps/map.data";
import { DownloadData } from "../../../common/download";

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
  mapType: '',
});


export const useMapStore = defineStore("map", {
  state: () => ({
    _map: maps[0],
    _mapType: maps[0].supportedMapTypes[0],
    _zoomLevel: 0,
    _posLeft: 0,
    _posTop: 0,
    _cropLeft: 0,
    _cropTop: 0,
    _cropWidth: 0,
    _cropHeight: 0,
    _downloadData: resetDownloadData() as DownloadData,
  }),

  getters: {
    map: (state): MapData => state._map,
    mapType: (state): string => state._mapType,
    zoomLevel: (state): number => state._zoomLevel,
    posLeft: (state): number => state._posLeft,
    posTop: (state): number => state._posTop,
    cropLeft: (state): number => state._cropLeft,
    cropTop: (state): number => state._cropTop,
    cropWidth: (state): number => state._cropWidth,
    cropHeight: (state): number => state._cropHeight,
    downloadData: (state): DownloadData => state._downloadData,
  },

  actions: {
    setMap(map: MapData): void {
      this._map = map;
      this._mapType = map.supportedMapTypes[0];
      this._zoomLevel = 0;
      this._cropLeft = 0;
      this._cropTop = 0;
      this._cropWidth = 300;
      this._cropHeight = 300;
      this._downloadData = resetDownloadData();
    },

    setMapType(mapType: string): void {
      this._mapType = mapType;
    },

    setZoomLevel(zoomLevel: number): void {
      this._zoomLevel = zoomLevel;
    },

    setPosLeft(posLeft: number): void {
      this._posLeft = posLeft;
    },

    setPosTop(posTop: number): void {
      this._posTop = posTop;
    },

    setCropLeft(cropLeft: number): void {
      this._cropLeft = cropLeft;
    },

    setCropTop(cropTop: number): void {
      this._cropTop = cropTop;
    },

    setCropWidth(cropWidth: number): void {
      this._cropWidth = cropWidth;
    },

    setCropHeight(cropHeight: number): void {
      this._cropHeight = cropHeight;
    },

    setDownloadData(downloadData: DownloadData): void {
      this._downloadData = downloadData;
    },
  },
});
