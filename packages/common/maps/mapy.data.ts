import * as pimage from "pureimage";
import { Bitmap } from "pureimage/types/bitmap";
import { Readable } from "stream";
import { MapData, UrlResult, UrlUsageType } from "./map.data";

export const mapDataMapy: MapData = {
  name: "Mapy",

  urlProvider: async (usageType: UrlUsageType, mapType: string, zoomLevel: number, row: number, col: number): Promise<UrlResult> => {
    const sourceType = mapType === "Street" ? "base-en" : "bing";
    return { url: `https://mapserver.mapy.cz/${sourceType}/${zoomLevel + 7}-${col}-${row}` };
  },

  getDownloaderHeaders: () => {
    return {
      headers: {
        referer: "https://en.mapy.cz/",
      },
    };
  },

  zoomLevelProvider: (zoomLevel: number): string => {
    return zoomLevel.toString();
  },

  zoomFactorProvider: (zoomLevel: number, zoomIn: boolean): number => {
    return 2;
  },

  decode: async (mapType: string, buffer: Buffer): Promise<Bitmap> => {
    return await (mapType === "Street" ? pimage.decodePNGFromStream(Readable.from(buffer)) : pimage.decodeJPEGFromStream(Readable.from(buffer)));
  },

  supportedMapTypes: ["Satellite", "Street"],

  showScale: false,

  referer: "https://en.mapy.cz/",

  zoomLayers: [
    {
      scale: 1,
      centerTileX: 76,
      centerTileY: 51,
      centerTileOffsetX: 94,
      centerTileOffsetY: 241,
    },
    {
      scale: 2,
      centerTileX: 152,
      centerTileY: 103,
      centerTileOffsetX: 201,
      centerTileOffsetY: 178,
    },
    {
      scale: 3,
      centerTileX: 305,
      centerTileY: 207,
      centerTileOffsetX: 121,
      centerTileOffsetY: 196,
    },
    {
      scale: 4,
      centerTileX: 610,
      centerTileY: 415,
      centerTileOffsetX: 241,
      centerTileOffsetY: 136,
    },
    {
      scale: 5,
      centerTileX: 1221,
      centerTileY: 831,
      centerTileOffsetX: 235,
      centerTileOffsetY: 19,
    },
    {
      scale: 6,
      centerTileX: 2443,
      centerTileY: 1662,
      centerTileOffsetX: 212,
      centerTileOffsetY: 49,
    },
    {
      scale: 7,
      centerTileX: 4887,
      centerTileY: 3324,
      centerTileOffsetX: 169,
      centerTileOffsetY: 98,
    },
    {
      scale: 8,
      centerTileX: 9775,
      centerTileY: 6648,
      centerTileOffsetX: 82,
      centerTileOffsetY: 197,
    },
    {
      scale: 9,
      centerTileX: 19550,
      centerTileY: 13297,
      centerTileOffsetX: 164,
      centerTileOffsetY: 140,
    },
    {
      scale: 10,
      centerTileX: 39101,
      centerTileY: 26595,
      centerTileOffsetX: 73,
      centerTileOffsetY: 24,
    },
    {
      scale: 11,
      centerTileX: 78202,
      centerTileY: 53190,
      centerTileOffsetX: 191,
      centerTileOffsetY: 12,
    },
    {
      scale: 12,
      centerTileX: 156405,
      centerTileY: 106380,
      centerTileOffsetX: 38,
      centerTileOffsetY: 99,
    },
    {
      scale: 13,
      centerTileX: 312810,
      centerTileY: 212760,
      centerTileOffsetX: 70,
      centerTileOffsetY: 212,
    },
  ],
};
