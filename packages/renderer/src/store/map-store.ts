import { defineStore } from "pinia";
import { MapData, maps } from "../../../common/maps/map.data";

export type TileLocation = {
  readonly x: number;
  readonly y: number;
}

const startMap = maps[1];

export const useMapStore = defineStore("map", {
  state: () => ({
    _map: startMap,
    _mapType: startMap.supportedMapTypes[0],
    _zoomLevel: 0,
    _selectionStart: null as TileLocation | null,
    _selectionEnd: null as TileLocation | null,
  }),

  getters: {
    map: (state): MapData => state._map,
    mapType: (state): string => state._mapType,
    zoomLevel: (state): number => state._zoomLevel,
    selectionStart: (state): TileLocation | null => state._selectionStart,
    selectionEnd: (state): TileLocation | null => state._selectionEnd,
  },

  actions: {
    setMap(map: MapData): void {
      this._map = map;
      this._mapType = map.supportedMapTypes[0];
      this._zoomLevel = 0;
      this._selectionStart = null;
      this._selectionEnd = null;
    },

    setMapType(mapType: string): void {
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
