import { defineStore } from "pinia";

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

export const useMapStore = defineStore("song", {
  state: () => ({
    _mapType: "satellite" as MapType,
    _zoomLevel: 0,
    _scale: 0,
    _selectionStart: null as TileLocation | null,
    _selectionEnd: null as TileLocation | null,
  }),

  getters: {
    mapType(state): MapType {
      return state._mapType;
    },

    zoomLevel(state): number {
      return state._zoomLevel;
    },

    scale(state): number {
      return state._scale;
    },

    selectionStart(state): TileLocation | null {
      return state._selectionStart;
    },

    selectionEnd(state): TileLocation | null {
      return state._selectionEnd;
    },
  },

  actions: {
    setMapType(mapType: MapType): void {
      this._mapType = mapType;
    },

    setZoomLevel(zoomLevel: number): void {
      this._zoomLevel = zoomLevel;
    },

    setScale(scale: number): void {
      this._scale = scale;
    },

    setSelectionStart(selectionStart: TileLocation | null): void {
      this._selectionStart = selectionStart;
    },

    setSelectionEnd(selectionEnd: TileLocation | null): void {
      this._selectionEnd = selectionEnd;
    },
  },
});
