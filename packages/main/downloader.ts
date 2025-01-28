import * as pimage from "pureimage";
import * as fs from "fs";
import { BrowserWindow } from "electron";
import crypto from "crypto";
import fetch from "electron-fetch";
import { MapData, maps, UrlResult, UrlUsageType } from "../common/maps/map.data";
import { DownloadData } from "../common/download";
import { Readable } from "stream";

export const downloadOptions = {
  canceled: false,
};

export const downloadMap = async (win: BrowserWindow, request: DownloadData) => {
  if (!request) {
    return;
  }

  downloadOptions.canceled = false;

  const maxX = request.endCol - request.startCol + 1;
  const maxY = request.endRow - request.startRow + 1;

  console.log(`Starting download of ${maxX * maxY} tiles`);

  const map = maps.find((it) => it.name === request.mapName)!!;

  const croppedWidth = maxX * 256 - request.startX - (256 - request.endX);
  const croppedHeight = maxY * 256 - request.startY - (256 - request.endY);
  const overallImg = pimage.make(croppedWidth, croppedHeight, {});
  const overallCtx = overallImg.getContext("2d");

  const headers = map.getDownloaderHeaders ? map.getDownloaderHeaders() : {};

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      if (downloadOptions.canceled) {
        console.log("Download canceled");
        return;
      }

      const progress = (x + y * maxX) / (maxX * maxY);
      win.webContents.send("download-progress", progress, "Downloading Map...");

      console.log(`Downloading images: ${(progress * 100).toFixed(2)}%, x=${x}/${maxX}, y=${y}/${maxY}`);

      const { url, unsupported } = await getTileUrl(map, request.zoomLevel, request.startRow + y, request.startCol + x, request.mapType);
      try {
        if (!unsupported) {
          // const response = await fetch(url, headers); //, { responseType: "arraybuffer" });
          // const arrayBuffer = await response.arrayBuffer();
          // const buffer = Buffer.from(arrayBuffer);
          // const img1 = await map.decode(request.mapType, buffer);
          // const ctx = img1.getContext("2d");
          // let imageData = ctx.getImageData(0, 0, 256, 256);
          // for (let j = 0; j < 256; j++) {
          //   const posY = j + y * 256 - request.startY;
          //   if (posY >= 0) {
          //     for (let i = 0; i < 256; i++) {
          //       const posX = i + x * 256 - request.startX;
          //       if (posX >= 0) {
          //         overallCtx.fillPixelWithColor(posX, posY, imageData.getPixelRGBA(i, j));
          //       }
          //     }
          //   }
          // }
        }
      } catch (error) {
        // if (error instanceof AxiosError && error.response) {
        //   if (error.response.status !== 500 && error.response.status !== 503) {
        //     console.log(error);
        //   }
        // } else {
        console.log(error);
        // }
      }
    }
  }


  const chunkSize = 2048;
  if (request.cropWidth !== undefined && request.cropHeight !== undefined) {
    const maxX = Math.floor(request.cropWidth / chunkSize) + 1;
    const maxY = Math.floor(request.cropHeight / chunkSize) + 1;
    console.log(request, maxX, maxY);
    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < maxX; x++) {
        console.log("x=", x, "y=", y, Math.floor(request.cropWidth / chunkSize) + 1, Math.floor(request.cropHeight / chunkSize) + 1);
        const chunkWidth = Math.min(chunkSize, request.cropWidth - x * chunkSize);
        const chunkHeight = Math.min(chunkSize, request.cropHeight - y * chunkSize);

        // const layerStartX = request.posLeft - chunkWidth / 2 + request.cropWidth / 2 + request.cropLeft!;
        // const layerStartY = request.posTop - chunkHeight / 2 + request.cropHeight / 2 + request.cropTop!;
        const layerStartX = request.posLeft + request.cropWidth / 2 + request.cropLeft!;
        const layerStartY = request.posTop + request.cropHeight / 2 + request.cropTop!;

        // layerStartX: store.posLeft - mapWidth / 2 + store.cropWidth / 2 + store.cropLeft,
        // layerStartY: store.posTop - mapHeight / 2 + store.cropHeight / 2 + store.cropTop,
        const layerUrl = getLayerUrl(map, request.zoomLevel, chunkWidth, chunkHeight, layerStartX! + x * chunkSize, layerStartY! + y * chunkSize);

        const progress = (x + y * maxX) / (maxX * maxY);
        console.log(progress, x, y, maxX, maxY, chunkWidth, chunkHeight);
        win.webContents.send("download-progress", progress, "Downloading Contour Lines...");
        console.log(layerUrl);
        if (layerUrl) {
          const response = await fetch(layerUrl, headers); //, { responseType: "arraybuffer" });
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const img1 = await pimage.decodePNGFromStream(Readable.from(buffer))
          const ctx = img1.getContext("2d");
          let imageData = ctx.getImageData(0, 0, chunkWidth, chunkHeight);
          for (let j = 0; j < chunkHeight; j++) {
            for (let i = 0; i < chunkWidth; i++) {
              overallCtx.fillPixelWithColor(x * chunkSize + i, y * chunkSize + j, imageData.getPixelRGBA(i, j));
            }
          }
        }
      }
    }

    // const layerUrl = getLayerUrl(map, request.zoomLevel, request.layerMapWidth!, request.layerMapHeight!, request.layerStartX!, request.layerStartY!);
    // if (layerUrl) {
    //   const response = await fetch(layerUrl, headers); //, { responseType: "arraybuffer" });
    //   const arrayBuffer = await response.arrayBuffer();
    //   const buffer = Buffer.from(arrayBuffer);
    //   const img1 = await pimage.decodePNGFromStream(Readable.from(buffer))
    //   const ctx = img1.getContext("2d");
    //   let imageData = ctx.getImageData(0, 0, request.layerMapWidth!, request.layerMapHeight!);
    //   for (let j = 0; j < request.layerMapHeight!; j++) {
    //     for (let i = 0; i < request.layerMapWidth!; i++) {
    //       overallCtx.fillPixelWithColor(i, j, imageData.getPixelRGBA(i, j));
    //     }
    //   }
    // }
  }



  console.log(`Downloading done`);

  const fileName = `map-${crypto.randomUUID()}.png`;
  pimage
    .encodePNGToStream(overallImg, fs.createWriteStream(fileName))
    .then(() => {
      win.webContents.send("download-done", true);
      require("child_process").exec(`start "" "${fileName}"`);
    })
    .catch((e) => {
      console.log("there was an error writing", e);
      win.webContents.send("download-done", false);
    });
};

const getTileUrl = async (map: MapData, zoomLevel: number, row: number, col: number, mapType: string): Promise<UrlResult> => {
  return await map.urlProvider(UrlUsageType.DOWNLOAD, mapType, zoomLevel, row, col);
};

const getLayerUrl = (map: MapData, zoomLevel: number, mapWidth: number, mapHeight: number, posLeft: number, posTop: number): string | undefined => {
  return map.layerUrlProvider?.(map.zoomLayers[zoomLevel], mapWidth, mapHeight, posLeft, posTop) || undefined;
};
