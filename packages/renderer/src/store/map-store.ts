import { defineStore } from "pinia";
import { mapDataGisNetGalilTahton } from "../maps/gisnet-galil-tahton.data";
import { mapDataGovMap } from "../maps/govmap.data";
import { MapData } from "../maps/map.data";

export interface TileLocation {
  readonly x: number;
  readonly y: number;
}

export type MapType = "satellite" | "buildings";

export type MapState = {
  mapType: MapType;
  zoomLevel: number;
  scale: number;
  selectionStart: TileLocation | null;
  selectionEnd: TileLocation | null;
};

const startMap = mapDataGisNetGalilTahton;

export const useMapStore = defineStore("song", {
  state: () => ({
    _selectedMap: startMap,
    _mapType: "satellite" as MapType,
    _zoomLevel: 0,
    _selectionStart: null as TileLocation | null,
    _selectionEnd: null as TileLocation | null,
  }),

  getters: {
    selectedMap(state): MapData {
      return state._selectedMap;
    },

    mapType(state): MapType {
      return state._mapType;
    },

    zoomLevel(state): number {
      return state._zoomLevel;
    },

    selectionStart(state): TileLocation | null {
      return state._selectionStart;
    },

    selectionEnd(state): TileLocation | null {
      return state._selectionEnd;
    },
  },

  actions: {
    setSelectedMap(selectedMap: MapData): void {
      this._selectedMap = selectedMap;
    },

    setMapType(mapType: MapType): void {
      this._mapType = mapType;
    },

    setZoomLevel(zoomLevel: number): void {
      this._zoomLevel = zoomLevel;
    },

    setSelectionStart(selectionStart: TileLocation | null): void {
      this._selectionStart = selectionStart;
    },

    setSelectionEnd(selectionEnd: TileLocation | null): void {
      this._selectionEnd = selectionEnd;
    },
  },
});
