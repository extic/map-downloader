import { mapDataGovMap } from './govmap.data'
import { mapDataTelAviv } from './tel-aviv.data'
import { mapDataHaifa } from './haifa.data'
import { mapDataNetanya } from './netanya.data'

export type ZoomLayer = {
  readonly scale: number
  readonly centerTileX: number
  readonly centerTileY: number
  readonly centerTileOffsetX: number
  readonly centerTileOffsetY: number
}

export enum UrlUsageType {
  VIEW,
  DOWNLOAD
}

export type UrlResult = {
  url: string
  unsupported?: boolean
}

export type MapData = {
  name: string
  urlProvider: (usageType: UrlUsageType, mapType: string, zoomLevel: number, row: number, col: number) => Promise<UrlResult>
  getDownloaderHeaders?: () => any
  zoomLevelProvider: (zoomLevel: number) => string
  zoomFactorProvider: (zoomLevel: number, zoomIn: boolean) => number
  supportedMapTypes: string[]
  showScale: boolean
  referer: string | undefined
  zoomLayers: ZoomLayer[]
}

export const maps = [
  mapDataGovMap,
  // mapDataGalilTahton,
  mapDataTelAviv,
  mapDataHaifa,
  // mapDataHodHasharon,
  mapDataNetanya,
  // mapDataMapy
]
