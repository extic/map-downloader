import { Bitmap } from "pureimage/types/bitmap"
import { mapDataTelAviv } from "./tel-aviv.data"
import { mapDataGalilTahton } from "./galil-tahton.data"
import { mapDataHaifa } from "./haifa.data"
import { mapDataGovMap } from "./govmap.data"
import { mapDataHodHasharon } from "./hod-hasharon.data"
import { mapDataMapy } from "./mapy.data"

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
  referer: string | undefined,
  zoomLayers: ZoomLayer[];
}

export const maps = [
  mapDataGovMap,
  mapDataGalilTahton,
  mapDataHaifa,
  mapDataTelAviv,
  mapDataHodHasharon,
  mapDataMapy,
]
