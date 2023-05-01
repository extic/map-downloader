import { ipcRenderer } from "electron";
import * as pimage from "pureimage";
import { Bitmap } from "pureimage/types/bitmap";
import { Readable } from "stream";
import { Coordinates, MapData, UrlResult, UrlUsageType, ZoomLayer } from "./map.data";

let heightLineId = 0;

export const mapDataGovMap: MapData = {
  name: "GovMap",

  init: async () => {
    const response = await ipcRenderer.invoke("http:request", 'https://ags.govmap.gov.il/proxy/proxy.ashx?http://govmap/arcgis/rest/services/AdditionalData/MapServer?f=json');

    const heightLines = response.layers.find((it: any) => it.name === "קווי גובה");
    heightLineId = heightLines.id;
  },

  urlProvider: async (usageType: UrlUsageType, mapType: string, zoomLevel: number, row: number, col: number): Promise<UrlResult> => {
    if (mapType === "1:25000" && (zoomLevel < 5 || zoomLevel > 9)) {
      return { url: "", unsupported: true };
    }

    if (mapType === "Street & Buildings" && zoomLevel == 11) {
      return { url: "", unsupported: true };
    }

    let zoomLevelStr = (mapType === "1:25000" ? zoomLevel - 5 : zoomLevel).toString(10).padStart(2, "0");
    const rowStr = row.toString(16).padStart(8, "0");
    const colStr = col.toString(16).padStart(8, "0");
    const mapTypeStr = mapType === "Satellite" ? "LPD0BBK2022" : mapType === "Street & Buildings" ? "B0B2309BNTL" : "11072021MAP25K";
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
    } else if (((zoomLevel === 3 || zoomLevel === 6 || zoomLevel == 10) && zoomIn) || ((zoomLevel === 4 || zoomLevel === 7 || zoomLevel == 11) && !zoomIn) ) {
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
    {
      scale: 500,
      centerTileX: 164881,
      centerTileY: 190472,
      centerTileOffsetX: 230,
      centerTileOffsetY: 155,
    },
  ],

  showCoordinates: true,

  coordinateProvider: (zoomLayer: ZoomLayer, pixelCoordinates: Coordinates): Coordinates => {
    const zoomScale = zoomLayer.scale / 500;

    const coordinateX = pixelCoordinates.x * coordRatioX * zoomScale + centerXCoordinate;
    const coordinateY = pixelCoordinates.y * coordRatioY * zoomScale + centerYCoordinate;

    return { x: coordinateX, y: coordinateY }
  },

  supportLayer: (zoomLayer: ZoomLayer): boolean => {
    if (zoomLayer.scale > 50000) {
      return false;
    }
    return true;
  },

  layerUrlProvider: (zoomLayer: ZoomLayer, mapWidth: number, mapHeight: number, posLeft: number, posTop: number): string | undefined => {
    if (zoomLayer.scale > 50000) {
      return undefined;
    } else {
      const topLeftPixelCoordinates: Coordinates = {
        x: posLeft - Math.floor(mapWidth / 2),
        y: posTop - Math.floor(mapHeight / 2),
      };
      const bottomRightPixelCoordinates: Coordinates = {
        x: posLeft + Math.floor(mapWidth / 2),
        y: posTop + Math.floor(mapHeight / 2),
      };
      const topLeftCoordinates = mapDataGovMap.coordinateProvider!!(zoomLayer, topLeftPixelCoordinates);
      const bottomRightCoordinates = mapDataGovMap.coordinateProvider!!(zoomLayer, bottomRightPixelCoordinates);
      const layerCoordinates = `${topLeftCoordinates.x},${bottomRightCoordinates.y},${bottomRightCoordinates.x},${topLeftCoordinates.y}`

      return `https://ags.govmap.gov.il/proxy/proxy.ashx?http://govmap/arcgis/rest/services/AdditionalData/MapServer/export?dynamicLayers=%5B%7B%22id%22%3A175%2C%22name%22%3A%22%D7%A7%D7%95%D7%95%D7%99%20%D7%92%D7%95%D7%91%D7%94%22%2C%22source%22%3A%7B%22type%22%3A%22mapLayer%22%2C%22mapLayerId%22%3A175%7D%2C%22minScale%22%3A50000%2C%22maxScale%22%3A0%7D%5D&dpi=96&transparent=true&format=png32&layers=show%3A175&bbox=${layerCoordinates}&bboxSR=2039&imageSR=2039&size=${mapWidth}%2C${mapHeight}&f=image`
    };
  },
};


//https://cdn.govmap.gov.il/LPD0BBK2022/L11/R00030884/C000285c9.jpg
const refPoint: ZoomLayer = {
  scale: 500,
  centerTileX: 165321,
  centerTileY: 198788,
  centerTileOffsetX: 78,
  centerTileOffsetY: 14,
}

const centerXCoordinate = 180312;
const centerYCoordinate = 666015;
const refXCoordinate = 195193;
const refYCoordinate = 384398;

const diffInPixelsX = (refPoint.centerTileX - mapDataGovMap.zoomLayers[11].centerTileX) * 256 + refPoint.centerTileOffsetX - mapDataGovMap.zoomLayers[11].centerTileOffsetX;
const diffInPixelsY = (refPoint.centerTileY - mapDataGovMap.zoomLayers[11].centerTileY) * 256 + refPoint.centerTileOffsetY - mapDataGovMap.zoomLayers[11].centerTileOffsetY;

const diffInCoordsX = refXCoordinate - centerXCoordinate;
const diffInCoordsY = refYCoordinate - centerYCoordinate;

const coordRatioX = diffInCoordsX / diffInPixelsX;
const coordRatioY = diffInCoordsY / diffInPixelsY;
