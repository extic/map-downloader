// import * as pimage from "pureimage";
// import { Bitmap } from "pureimage/types/bitmap";
// import { Readable } from "stream";
// import { MapData, UrlResult, UrlUsageType } from "./map.data";
//
// export const mapDataHaifa: MapData = {
//   name: "Haifa",
//
//   urlProvider: async (usageType: UrlUsageType, mapType: string, zoomLevel: number, row: number, col: number): Promise<UrlResult> => {
//     let zoomLevelStr = zoomLevel.toString();
//     const rowStr = row.toString();
//     const colStr = col.toString();
//     return { url: `https://gisserver.haifa.muni.il/arcgiswebadaptor/rest/services/Orthophoto_202204/MapServer/tile/${zoomLevelStr}/${rowStr}/${colStr}?blankTile=false` };
//   },
//
//   zoomLevelProvider: (zoomLevel: number): string => {
//     return zoomLevel.toString();
//   },
//
//   zoomFactorProvider: (zoomLevel: number, zoomIn: boolean): number => {
//     if (
//       (zoomLevel === 0 && zoomIn) ||
//       (zoomLevel === 1 && !zoomIn) ||
//       (zoomLevel === 5 && zoomIn) ||
//       (zoomLevel === 6 && !zoomIn)
//     ) {
//       return 1.5;
//       // } else if (((zoomLevel === 3 || zoomLevel === 6) && zoomIn) || ((zoomLevel === 4 || zoomLevel === 7) && !zoomIn)) {
//       //   return 2.5;
//     } else if ((zoomLevel === 3 && zoomIn) || (zoomLevel === 4 && !zoomIn)) {
//       return 1.25;
//     } else if ((zoomLevel === 4 && zoomIn) || (zoomLevel === 5 && !zoomIn)) {
//       return 1.33;
//     } else if ((zoomLevel === 7 && zoomIn) || (zoomLevel === 8 && !zoomIn)) {
//       return 2.5;
//     } else
//     return 2;
//   },
//
//   decode: async (mapType: string, buffer: Buffer): Promise<Bitmap> => {
//     return pimage.decodePNGFromStream(Readable.from(buffer));
//   },
//
//   supportedMapTypes: ["Satellite"],
//
//   showScale: false,
//
//   referer: undefined,
//
//   zoomLayers: [
//     {
//       scale: 0,
//       centerTileX: 1103,
//       centerTileY: 1254,
//       centerTileOffsetX: 30,
//       centerTileOffsetY: 88,
//     },
//     {
//       scale: 1,
//       centerTileX: 1654,
//       centerTileY: 1881,
//       centerTileOffsetX: 178,
//       centerTileOffsetY: 134,
//     },
//     {
//       scale: 2,
//       centerTileX: 3309,
//       centerTileY: 3763,
//       centerTileOffsetX: 98,
//       centerTileOffsetY: 11,
//     },
//     {
//       scale: 3,
//       centerTileX: 6618,
//       centerTileY: 7526,
//       centerTileOffsetX: 199,
//       centerTileOffsetY: 27,
//     },
//     {
//       scale: 4,
//       centerTileX: 8273,
//       centerTileY: 9407,
//       centerTileOffsetX: 118,
//       centerTileOffsetY: 165,
//     },
//     {
//       scale: 5,
//       centerTileX: 11031,
//       centerTileY: 12543,
//       centerTileOffsetX: 72,
//       centerTileOffsetY: 137,
//     },
//     {
//       scale: 6,
//       centerTileX: 16546,
//       centerTileY: 18815,
//       centerTileOffsetX: 237,
//       centerTileOffsetY: 77,
//     },
//     {
//       scale: 7,
//       centerTileX: 33093,
//       centerTileY: 37630,
//       centerTileOffsetX: 216,
//       centerTileOffsetY: 155,
//     },
//     {
//       scale: 8,
//       centerTileX: 82734,
//       centerTileY: 94076,
//       centerTileOffsetX: 154,
//       centerTileOffsetY: 130,
//     },
//     {
//       scale: 9,
//       centerTileX: 165469,
//       centerTileY: 188153,
//       centerTileOffsetX: 51,
//       centerTileOffsetY: 5,
//     },
//   ],
// };
