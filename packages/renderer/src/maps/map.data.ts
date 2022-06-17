import { MapType } from "../store/map-store"
import { mapDataGisNetGalilTahton } from "./gisnet-galil-tahton.data"
import { mapDataGovMap } from "./govmap.data"

export type ZoomLayer = {
  readonly zoomLevel: number
  readonly scale: number
  readonly centerTileX: number
  readonly centerTileY: number
  readonly centerTileOffsetX: number
  readonly centerTileOffsetY: number
}

export type MapData = {
  name: string;
  urlProvider: (mapType: MapType, zoomLevel: number, row: number, col: number) => string;
  zoomLevelProvider: (zoomLevel: number) => string,
  zoomLayers: ZoomLayer[];
}

export const maps = [
  mapDataGovMap,
  mapDataGisNetGalilTahton
]
