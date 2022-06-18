import * as pimage from "pureimage";
import { Bitmap } from "pureimage/types/bitmap";
import { Readable } from "stream";
import { MapData } from "./map.data";

export const mapDataGisNetGalilTahton: MapData = {
  name: "GISNET - Galil Tahton",

  urlProvider: (mapType: string, zoomLevel: number, row: number, col: number): string => {
    const zoomLevelStr = (zoomLevel + 4).toString();
    return `https://v5.gis-net.co.il/proxy/proxy.ashx?http://10.237.72.71:8080/geoserver/gwc/service/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=Galil_tachton_2020:2020&STYLE=raster&FORMAT=image/jpeg&TILEMATRIXSET=Galil_tachton&TILEMATRIX=Galil_tachton:${zoomLevelStr}&TILEROW=${row}&TILECOL=${col}`;
  },

  zoomLevelProvider: (zoomLevel: number): string => {
    return (zoomLevel + 4).toString();
  },

  decode: async (mapType: string, buffer: Buffer): Promise<Bitmap> => {
    return pimage.decodeJPEGFromStream(Readable.from(buffer));
  },

  supportedMapTypes: ["satellite"],

  zoomLayers: [
    {
      zoomLevel: 3,
      scale: 32000,
      centerTileX: 8,
      centerTileY: 7,
      centerTileOffsetX: 122,
      centerTileOffsetY: 190,
    },
    {
      zoomLevel: 3,
      scale: 32000,
      centerTileX: 8,
      centerTileY: 7,
      centerTileOffsetX: 122,
      centerTileOffsetY: 190,
    },
    {
      zoomLevel: 3,
      scale: 32000,
      centerTileX: 8,
      centerTileY: 7,
      centerTileOffsetX: 122,
      centerTileOffsetY: 190,
    },
  ],
};
