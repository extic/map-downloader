import { defineStore } from "pinia";
import { MapData, maps } from "../../../common/maps/map.data";
import { DownloadData } from "../../../common/download";
import { string } from "yargs";

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
  mapType: '',
});


export const useMapStore = defineStore("map", {
  state: () => ({
    _map: maps[0],
    _mapType: maps[0].supportedMapTypes[0],
    _zoomLevel: 0,
    _posLeft: 0,
    _posTop: 0,
    _showCrop: true,
    _cropLeft: 0,
    _cropTop: 0,
    _cropWidth: 0,
    _cropHeight: 0,
    _dragMode: "map" as DragMode,
    _downloadData: resetDownloadData() as DownloadData,
    _mapWidth: 0,
    _mapHeight: 0,
    _tooLarge: false,
    _appVersion: "",
    _coordinateX: 0,
    _coordinateY: 0,
    _showElevationLines: false,
  }),

  getters: {
    map: (state): MapData => state._map,
    mapType: (state): string => state._mapType,
    zoomLevel: (state): number => state._zoomLevel,
    posLeft: (state): number => state._posLeft,
    posTop: (state): number => state._posTop,
    showCrop: (state): boolean => state._showCrop,
    cropLeft: (state): number => state._cropLeft,
    cropTop: (state): number => state._cropTop,
    cropWidth: (state): number => state._cropWidth,
    cropHeight: (state): number => state._cropHeight,
    dragMode: (state): DragMode => state._dragMode,
    downloadData: (state): DownloadData => state._downloadData,
    mapWidth: (state): number => state._mapWidth,
    mapHeight: (state): number => state._mapHeight,
    tooLarge: (state): boolean => state._tooLarge,
    appVersion: (state): string => state._appVersion,
    coordinateX: (state): number => state._coordinateX,
    coordinateY: (state): number => state._coordinateY,
    showElevationLines: (state): boolean => state._showElevationLines,
  },

  actions: {
    setMap(map: MapData): void {
      this._map = map;
      this._mapType = map.supportedMapTypes[0];
      this._zoomLevel = 0;
      this._showCrop = false;
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

    setShowCrop(showCrop: boolean): void {
      this._showCrop = showCrop;
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

    setDragMode(dragMode: DragMode): void {
      this._dragMode = dragMode;
    },

    setDownloadData(downloadData: DownloadData): void {
      this._downloadData = downloadData;

      const tilesX = downloadData.endCol - downloadData.startCol + 1;
      const tilesY = downloadData.endRow - downloadData.startRow + 1;
      this._tooLarge = tilesX * tilesY > 2500
    },

    setMapDimensions(mapWidth: number, mapHeight: number): void {
      this._mapWidth = mapWidth;
      this._mapHeight = mapHeight;
    },

    resetCropArea() {
      this.setCropLeft(Math.floor(this.mapWidth / 2) - 150);
      this.setCropTop(Math.floor(this.mapHeight / 2) - 150);
      this.setCropWidth(300);
      this.setCropHeight(300);
    },

    setAppVersion(version: string): void {
      this._appVersion = version;
    },

    setCoordinates(coordinateX: number, coordinateY: number): void {
      this._coordinateX = coordinateX;
      this._coordinateY = coordinateY;
    },

    setShowElevationLines(show: boolean): void {
      this._showElevationLines = show;
    },
  },
});
