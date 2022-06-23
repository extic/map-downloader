import { Bitmap } from "pureimage/types/bitmap"
import { mapDataTelAviv } from "./tel-aviv"
import { mapDataGisNetGalilTahton } from "./galil-tahton.data"
import { mapDataGovMap } from "./govmap.data"

export type ZoomLayer = {
  readonly scale: number
  readonly centerTileX: number
  readonly centerTileY: number
  readonly centerTileOffsetX: number
  readonly centerTileOffsetY: number
}

export type MapData = {
  name: string;
  urlProvider: (mapType: string, zoomLevel: number, row: number, col: number) => string;
  zoomLevelProvider: (zoomLevel: number) => string,
  zoomFactorProvider: (zoomLevel: number, zoomIn: boolean) => number,
  decode: (mapType: string, buffer: Buffer) => Promise<Bitmap>
  supportedMapTypes: string[],
  zoomLayers: ZoomLayer[];
}

export const maps = [
  mapDataGovMap,
  mapDataGisNetGalilTahton,
  mapDataTelAviv,
]
