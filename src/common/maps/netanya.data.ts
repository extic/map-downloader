import { MapData, UrlResult, UrlUsageType } from './map.data'

//https://v5.gis-net.co.il/v5/netanya?layers=248
export const mapDataNetanya: MapData = {
  name: 'Netanya',

  urlProvider: async (_usageType: UrlUsageType, mapType: string, zoomLevel: number, row: number, col: number): Promise<UrlResult> => {
    const zoomLevelStr = (zoomLevel + 3).toString()
    const rowStr = row.toString()
    const colStr = col.toString()
    const mapTypeStr = mapType === 'Satellite' ? 'Netanya_2022:2022' : 'Netanya_SHP:Netanya_Reka'
    return {
      url: `https://v5.gis-net.co.il/proxy/proxy.ashx?http://10.237.72.71:8080/geoserver/gwc/service/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=${mapTypeStr}&STYLE=raster&FORMAT=image/jpeg&TILEMATRIXSET=Netanya&TILEMATRIX=Netanya:${zoomLevelStr}&TILEROW=${rowStr}&TILECOL=${colStr}`
    }
  },

  zoomLevelProvider: (zoomLevel: number): string => {
    return zoomLevel.toString()
  },

  zoomFactorProvider: (_zoomLevel: number, _zoomIn: boolean): number => {
    return 2
  },

  supportedMapTypes: ['Satellite', 'Street & Buildings'],

  showScale: true,

  referer: 'https://v5.gis-net.co.il/v5/netanya',

  zoomLayers: [
    {
      scale: 32000,
      centerTileX: 3,
      centerTileY: 3,
      centerTileOffsetX: 183,
      centerTileOffsetY: 64
    },
    {
      scale: 16000,
      centerTileX: 7,
      centerTileY: 6,
      centerTileOffsetX: 109,
      centerTileOffsetY: 133
    },
    {
      scale: 8000,
      centerTileX: 14,
      centerTileY: 13,
      centerTileOffsetX: 221,
      centerTileOffsetY: 9
    },
    {
      scale: 4000,
      centerTileX: 29,
      centerTileY: 26,
      centerTileOffsetX: 184,
      centerTileOffsetY: 18
    },
    {
      scale: 2000,
      centerTileX: 59,
      centerTileY: 52,
      centerTileOffsetX: 112,
      centerTileOffsetY: 39
    },
    {
      scale: 1000,
      centerTileX: 118,
      centerTileY: 104,
      centerTileOffsetX: 224,
      centerTileOffsetY: 76
    },
    {
      scale: 500,
      centerTileX: 237,
      centerTileY: 208,
      centerTileOffsetX: 192,
      centerTileOffsetY: 150
    },
    {
      scale: 250,
      centerTileX: 475,
      centerTileY: 417,
      centerTileOffsetX: 128,
      centerTileOffsetY: 44
    },
    {
      scale: 125,
      centerTileX: 950,
      centerTileY: 834,
      centerTileOffsetX: 255,
      centerTileOffsetY: 90
    }
  ]
}
