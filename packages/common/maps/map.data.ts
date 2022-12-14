import { Bitmap } from "pureimage/types/bitmap"
import { mapDataTelAviv } from "./tel-aviv.data"
import { mapDataGalilTahton } from "./galil-tahton.data"
import { mapDataHaifa } from "./haifa.data"
import { mapDataGovMap } from "./govmap.data"
import { mapDataMapy } from "./mapy.data"
import { viewDepthKey } from "vue-router"

export type ZoomLayer = {
  readonly scale: number
  readonly centerTileX: number
  readonly centerTileY: number
  readonly centerTileOffsetX: number
  readonly centerTileOffsetY: number
}

export enum UrlUsageType {
  VIEW,
  DOWNLOAD,
}

export type MapData = {
  name: string;
  urlProvider: (usageType: UrlUsageType, mapType: string, zoomLevel: number, row: number, col: number) => Promise<string>;
  getDownloaderHeaders?: () => any,
  zoomLevelProvider: (zoomLevel: number) => string,
  zoomFactorProvider: (zoomLevel: number, zoomIn: boolean) => number,
  decode: (mapType: string, buffer: Buffer) => Promise<Bitmap>
  supportedMapTypes: string[],
  showScale: boolean,
  zoomLayers: ZoomLayer[];
}

export const maps = [
  mapDataGovMap,
  mapDataGalilTahton,
  mapDataHaifa,
  mapDataTelAviv,
  mapDataMapy,
]
