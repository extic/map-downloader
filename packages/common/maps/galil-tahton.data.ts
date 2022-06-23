import * as pimage from "pureimage";
import { Bitmap } from "pureimage/types/bitmap";
import { Readable } from "stream";
import { MapData } from "./map.data";

export const mapDataGalilTahton: MapData = {
  name: "Galil Tahton",

  urlProvider: (mapType: string, zoomLevel: number, row: number, col: number): string => {
    const zoomLevelStr = (zoomLevel + 4).toString();
    return `https://v5.gis-net.co.il/proxy/proxy.ashx?http://10.237.72.71:8080/geoserver/gwc/service/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=Galil_tachton_2020:2020&STYLE=raster&FORMAT=image/jpeg&TILEMATRIXSET=Galil_tachton&TILEMATRIX=Galil_tachton:${zoomLevelStr}&TILEROW=${row}&TILECOL=${col}`;
  },

  zoomLevelProvider: (zoomLevel: number): string => {
    return (zoomLevel + 4).toString();
  },

  zoomFactorProvider: (zoomLevel: number, zoomIn: boolean): number => {
    return 2;
  },

  decode: async (mapType: string, buffer: Buffer): Promise<Bitmap> => {
    return pimage.decodeJPEGFromStream(Readable.from(buffer));
  },

  supportedMapTypes: ["satellite"],

  zoomLayers: [
    {
      scale: 32000,
      centerTileX: 8,
      centerTileY: 7,
      centerTileOffsetX: 117,
      centerTileOffsetY: 61,
    },
    {
      scale: 16000,
      centerTileX: 16,
      centerTileY: 14,
      centerTileOffsetX: 234,
      centerTileOffsetY: 122,
    },
    {
      scale: 8000,
      centerTileX: 33,
      centerTileY: 28,
      centerTileOffsetX: 213,
      centerTileOffsetY: 247,
    },
    {
      scale: 4000,
      centerTileX: 67,
      centerTileY: 57,
      centerTileOffsetX: 171,
      centerTileOffsetY: 239,
    },
    {
      scale: 2000,
      centerTileX: 135,
      centerTileY: 115,
      centerTileOffsetX: 87,
      centerTileOffsetY: 219,
    },
    {
      scale: 1000,
      centerTileX: 270,
      centerTileY: 231,
      centerTileOffsetX: 179,
      centerTileOffsetY: 190,
    },
    {
      scale: 500,
      centerTileX: 541,
      centerTileY: 463,
      centerTileOffsetX: 108,
      centerTileOffsetY: 129,
    },
    {
      scale: 250,
      centerTileX: 1082,
      centerTileY: 927,
      centerTileOffsetX: 219,
      centerTileOffsetY: 5,
    }
  ],
};
