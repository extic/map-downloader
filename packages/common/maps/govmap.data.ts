import * as pimage from "pureimage";
import { Bitmap } from "pureimage/types/bitmap";
import { Readable } from "stream";
import { MapData, UrlResult, UrlUsageType, ZoomLayer } from "./map.data";

export const mapDataGovMap: MapData = {
  name: "GovMap",

  urlProvider: async (usageType: UrlUsageType, mapType: string, zoomLevel: number, row: number, col: number): Promise<UrlResult> => {
    if (mapType === "1:25000" && (zoomLevel < 5 || zoomLevel > 9)) {
      return { url: "", unsupported: true };
    }
    let zoomLevelStr = (mapType === "1:25000" ? zoomLevel - 5 : zoomLevel).toString(10).padStart(2, "0");
    const rowStr = row.toString(16).padStart(8, "0");
    const colStr = col.toString(16).padStart(8, "0");
    const mapTypeStr = mapType === "Satellite" ? "020522B0B20R" : mapType === "Street & Buildings" ? "B0B2309BNTL" : "11072021MAP25K";
    const suffix = mapType === "Satellite" ? "jpg" : "png";
    const domain = mapType === "1:25000" ? "cdnil.govmap.gov.il" : "cdn.govmap.gov.il";
    return { url: `https://${domain}/${mapTypeStr}/L${zoomLevelStr}/R${rowStr}/C${colStr}.${suffix}` };
  },

  zoomLevelProvider: (zoomLevel: number): string => {
    return zoomLevel.toString();
  },

  zoomFactorProvider: (zoomLevel: number, zoomIn: boolean): number => {
    if ((zoomLevel === 0 && zoomIn) || (zoomLevel === 1 && !zoomIn)) {
      return 3;
    } else if (((zoomLevel === 3 || zoomLevel === 6) && zoomIn) || ((zoomLevel === 4 || zoomLevel === 7) && !zoomIn)) {
      return 2.5;
    }
    return 2;
  },

  decode: async (mapType: string, buffer: Buffer): Promise<Bitmap> => {
    return await (mapType === "Satellite" ? pimage.decodeJPEGFromStream(Readable.from(buffer)) : pimage.decodePNGFromStream(Readable.from(buffer)));
  },

  supportedMapTypes: ["Satellite", "Street & Buildings", "1:25000"],

  showScale: true,

  referer: undefined,

  zoomLayers: [
    {
      scale: 3000000,
      centerTileX: 27,
      centerTileY: 31,
      centerTileOffsetX: 122,
      centerTileOffsetY: 190,
    },
    {
      scale: 1000000,
      centerTileX: 82,
      centerTileY: 95,
      centerTileOffsetX: 113,
      centerTileOffsetY: 61,
    },
    {
      scale: 500000,
      centerTileX: 164,
      centerTileY: 190,
      centerTileOffsetX: 226,
      centerTileOffsetY: 120,
    },
    {
      scale: 250000,
      centerTileX: 329,
      centerTileY: 380,
      centerTileOffsetX: 193,
      centerTileOffsetY: 242,
    },
    {
      scale: 100000,
      centerTileX: 824,
      centerTileY: 952,
      centerTileOffsetX: 104,
      centerTileOffsetY: 96,
    },
    {
      scale: 50000,
      centerTileX: 1648,
      centerTileY: 1904,
      centerTileOffsetX: 209,
      centerTileOffsetY: 190,
    },
    {
      scale: 25000,
      centerTileX: 3297,
      centerTileY: 3809,
      centerTileOffsetX: 160,
      centerTileOffsetY: 119,
    },
    {
      scale: 10000,
      centerTileX: 8244,
      centerTileY: 9523,
      centerTileOffsetX: 22,
      centerTileOffsetY: 164,
    },
    {
      scale: 5000,
      centerTileX: 16488,
      centerTileY: 19047,
      centerTileOffsetX: 48,
      centerTileOffsetY: 70,
    },
    {
      scale: 2500,
      centerTileX: 32976,
      centerTileY: 38094,
      centerTileOffsetX: 95,
      centerTileOffsetY: 135,
    },
    {
      scale: 1250,
      centerTileX: 65952,
      centerTileY: 76189,
      centerTileOffsetX: 191,
      centerTileOffsetY: 12,
    },
  ],
};
