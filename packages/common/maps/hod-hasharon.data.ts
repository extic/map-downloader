import * as pimage from "pureimage";
import { Bitmap } from "pureimage/types/bitmap";
import { Readable } from "stream";
import { MapData } from "./map.data";

export const mapDataHodHasharon: MapData = {
  name: "Hod Hasharon",

  urlProvider: (mapType: string, zoomLevel: number, row: number, col: number): string => {
    let zoomLevelStr = (zoomLevel + 3).toString();
    const rowStr = row.toString();
    const colStr = col.toString();
    const mapTypeStr = mapType === "Satellite" ? "Hod_Hasharon_2022:2022" : "Hod_Hasharon_SHP:Hod_Hasharon_Reka";
    return `https://v5.gis-net.co.il/proxy/proxy.ashx?http://10.237.72.70:8080/geoserver/gwc/service/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=${mapTypeStr}&STYLE=raster&FORMAT=image/jpeg&TILEMATRIXSET=Hod_Hasharon&TILEMATRIX=Hod_Hasharon:${zoomLevelStr}&TILEROW=${rowStr}&TILECOL=${colStr}`
  },

  zoomLevelProvider: (zoomLevel: number): string => {
    return zoomLevel.toString();
  },

  zoomFactorProvider: (zoomLevel: number, zoomIn: boolean): number => {
    return 2;
  },

  decode: async (mapType: string, buffer: Buffer): Promise<Bitmap> => {
    return await pimage.decodeJPEGFromStream(Readable.from(buffer));
  },

  supportedMapTypes: ["Satellite", "Street & Buildings"],

  zoomLayers: [
    {
      scale: 16000,
      centerTileX: 3,
      centerTileY: 4,
      centerTileOffsetX: 221,
      centerTileOffsetY: 216,
    },
    {
      scale: 8000,
      centerTileX: 7,
      centerTileY: 9,
      centerTileOffsetX: 184,
      centerTileOffsetY: 176,
    },
    {
      scale: 4000,
      centerTileX: 15,
      centerTileY: 19,
      centerTileOffsetX: 111,
      centerTileOffsetY: 96,
    },
    {
      scale: 2000,
      centerTileX: 30,
      centerTileY: 38,
      centerTileOffsetX: 223,
      centerTileOffsetY: 192,
    },
    {
      scale: 1000,
      centerTileX: 61,
      centerTileY: 77,
      centerTileOffsetX: 193,
      centerTileOffsetY: 129,
    },
    {
      scale: 500,
      centerTileX: 123,
      centerTileY: 155,
      centerTileOffsetX: 130,
      centerTileOffsetY: 3,
    },
    {
      scale: 250,
      centerTileX: 247,
      centerTileY: 310,
      centerTileOffsetX: 4,
      centerTileOffsetY: 6,
    },
  ],
};
