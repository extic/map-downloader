import { Bitmap } from "pureimage/types/bitmap"
import { mapDataTelAviv } from "./tel-aviv.data"
import { mapDataGalilTahton } from "./galil-tahton.data"
import { mapDataHaifa } from "./haifa.data"
import { mapDataGovMap } from "./govmap.data"
import { mapDataHodHasharon } from "./hod-hasharon.data"
import { mapDataMapy } from "./mapy.data"
import { mapDataNetanya } from "./netanya.data"

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

export type UrlResult = {
  url: string;
  unsupported?: boolean;
}

export type MapData = {
  name: string;
  init: () => void,
  urlProvider: (usageType: UrlUsageType, mapType: string, zoomLevel: number, row: number, col: number) => Promise<UrlResult>;
  getDownloaderHeaders?: () => any,
  zoomLevelProvider: (zoomLevel: number) => string,
  zoomFactorProvider: (zoomLevel: number, zoomIn: boolean) => number,
  decode: (mapType: string, buffer: Buffer) => Promise<Bitmap>
  supportedMapTypes: string[],
  showScale: boolean,
  referer: string | undefined,
  zoomLayers: ZoomLayer[],
  showCoordinates: boolean,
  coordinateProvider: ((zoomLayer: ZoomLayer, pixelCoordinates: Coordinates) => Coordinates) | undefined,
  supportLayer: (zoomLayer: ZoomLayer) => boolean,
  layerUrlProvider: ((zoomLayer: ZoomLayer, mapWidth: number, mapHeight: number, posLeft: number, posTop: number) => string | undefined) | undefined,
}

export const maps = [
  mapDataGovMap,
  mapDataGalilTahton,
  mapDataTelAviv,
  mapDataHaifa,
  mapDataHodHasharon,
  mapDataNetanya,
  mapDataMapy,
]

export type Coordinates = {
  x: number;
  y: number;
}
