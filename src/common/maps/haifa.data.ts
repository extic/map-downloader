import { MapData, UrlResult, UrlUsageType } from './map.data'

//https://experience.arcgis.com/experience/fbbaf8ced1a54fa394d47cdea28ca1b3
export const mapDataHaifa: MapData = {
  name: 'Haifa',

  urlProvider: async (_usageType: UrlUsageType, _mapType: string, zoomLevel: number, row: number, col: number): Promise<UrlResult> => {
    if (zoomLevel < 3) {
      return { url: '', unsupported: true }
    }

    const zoomLevelStr = zoomLevel.toString()
    const rowStr = row.toString()
    const colStr = col.toString()

    return { url: `https://gisserver.haifa.muni.il/arcgiswebadaptor/rest/services/Orthophoto_202402/MapServer/tile/${zoomLevelStr}/${rowStr}/${colStr}?blankTile=false` }
  },

  zoomLevelProvider: (zoomLevel: number): string => {
    return zoomLevel.toString()
  },

  zoomFactorProvider: (zoomLevel: number, zoomIn: boolean): number => {
    if ((zoomLevel === 0 && zoomIn) || (zoomLevel === 1 && !zoomIn) || (zoomLevel === 5 && zoomIn) || (zoomLevel === 6 && !zoomIn)) {
      return 1.5
      // } else if (((zoomLevel === 3 || zoomLevel === 6) && zoomIn) || ((zoomLevel === 4 || zoomLevel === 7) && !zoomIn)) {
      //   return 2.5;
    } else if ((zoomLevel === 3 && zoomIn) || (zoomLevel === 4 && !zoomIn)) {
      return 1.25
    } else if ((zoomLevel === 4 && zoomIn) || (zoomLevel === 5 && !zoomIn)) {
      return 1.33
    } else if ((zoomLevel === 7 && zoomIn) || (zoomLevel === 8 && !zoomIn)) {
      return 2.5
    } else return 2
  },

  supportedMapTypes: ['Satellite'],

  showScale: false,

  referer: undefined,

  zoomLayers: [
    {
      scale: 0,
      centerTileX: 1,
      centerTileY: 1,
      centerTileOffsetX: 1,
      centerTileOffsetY: 1
    },
    {
      scale: 1,
      centerTileX: 1,
      centerTileY: 1,
      centerTileOffsetX: 1,
      centerTileOffsetY: 1
    },
    {
      scale: 2,
      centerTileX: 1,
      centerTileY: 1,
      centerTileOffsetX: 1,
      centerTileOffsetY: 1
    },
    {
      scale: 3,
      centerTileX: 1,
      centerTileY: 1,
      centerTileOffsetX: 132,
      centerTileOffsetY: 205
    },
    {
      scale: 4,
      centerTileX: 3,
      centerTileY: 3,
      centerTileOffsetX: 6,
      centerTileOffsetY: 152
    },
    {
      scale: 5,
      centerTileX: 6,
      centerTileY: 7,
      centerTileOffsetX: 10,
      centerTileOffsetY: 47
    },
    {
      scale: 6,
      centerTileX: 12,
      centerTileY: 14,
      centerTileOffsetX: 17,
      centerTileOffsetY: 93
    },
    {
      scale: 7,
      centerTileX: 24,
      centerTileY: 28,
      centerTileOffsetX: 34,
      centerTileOffsetY: 188
    },
    {
      scale: 8,
      centerTileX: 48,
      centerTileY: 57,
      centerTileOffsetX: 66,
      centerTileOffsetY: 119
    },
    {
      scale: 9,
      centerTileX: 96,
      centerTileY: 114,
      centerTileOffsetX: 132,
      centerTileOffsetY: 239
    },
    {
      scale: 10,
      centerTileX: 193,
      centerTileY: 229,
      centerTileOffsetX: 5,
      centerTileOffsetY: 222
    }
  ]
}
