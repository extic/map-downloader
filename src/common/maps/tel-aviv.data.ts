import { MapData, UrlResult, UrlUsageType } from './map.data'

//https://gisn.tel-aviv.gov.il/iview2js4/index.aspx?zoom=13000&device=desktop&extent=3871525,3773988,3874992,3775421&layers=577&back=1&year=2023&opacity=0.9&filters=
export const mapDataTelAviv: MapData = {
  name: 'Tel-Aviv',

  urlProvider: async (_usageType: UrlUsageType, _mapType: string, zoomLevel: number, row: number, col: number): Promise<UrlResult> => {
    const zoomLevelStr = zoomLevel + 13
    const rowStr = row.toString(10)
    const colStr = col.toString(10)
    return { url: `https://gisn.tel-aviv.gov.il/arcgis/rest/services/WM/IView2Ortho2023WM/MapServer/tile/${zoomLevelStr}/${rowStr}/${colStr}?blankTile=false` }
  },

  zoomLevelProvider: (zoomLevel: number): string => {
    return zoomLevel.toString()
  },

  zoomFactorProvider: (_zoomLevel: number, _zoomIn: boolean): number => {
    return 2
  },

  supportedMapTypes: ['Satellite'],

  showScale: true,

  referer: undefined,

  zoomLayers: [
    {
      scale: 72000,
      centerTileX: 4887,
      centerTileY: 3324,
      centerTileOffsetX: 169,
      centerTileOffsetY: 99
    },
    {
      scale: 36000,
      centerTileX: 9775,
      centerTileY: 6648,
      centerTileOffsetX: 81,
      centerTileOffsetY: 201
    },
    {
      scale: 18000,
      centerTileX: 19550,
      centerTileY: 13297,
      centerTileOffsetX: 164,
      centerTileOffsetY: 141
    },
    {
      scale: 9000,
      centerTileX: 39101,
      centerTileY: 26595,
      centerTileOffsetX: 70,
      centerTileOffsetY: 25
    },
    {
      scale: 4500,
      centerTileX: 78202,
      centerTileY: 53190,
      centerTileOffsetX: 138,
      centerTileOffsetY: 51
    },
    {
      scale: 2250,
      centerTileX: 156405,
      centerTileY: 106380,
      centerTileOffsetX: 22,
      centerTileOffsetY: 100
    },
    {
      scale: 1125,
      centerTileX: 312810,
      centerTileY: 212760,
      centerTileOffsetX: 47,
      centerTileOffsetY: 200
    },
    {
      scale: 563,
      centerTileX: 625620,
      centerTileY: 425521,
      centerTileOffsetX: 94,
      centerTileOffsetY: 147
    },
    {
      scale: 281,
      centerTileX: 1251240,
      centerTileY: 851043,
      centerTileOffsetX: 194,
      centerTileOffsetY: 51
    }
  ]
}
