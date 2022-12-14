import * as pimage from "pureimage";
import * as fs from "fs";
import { BrowserWindow } from "electron";
import crypto from "crypto";
import fetch from "electron-fetch";
import { MapData, maps, UrlUsageType } from "../common/maps/map.data";
import { DownloadData } from "../common/download";

export const downloadOptions = {
  canceled: false,
}

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

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      if (downloadOptions.canceled) {
        console.log("Download canceled");
        return;
      }

      const progress = (x + y * maxX) / (maxX * maxY);
      win.webContents.send("download-progress", progress);

      console.log(`Downloading images: ${(progress * 100).toFixed(2)}%, x=${x}/${maxX}, y=${y}/${maxY}`);

      const url = await getTileUrl(map, request.zoomLevel, request.startRow + y, request.startCol + x, request.mapType);
      try {
        const headers = map.getDownloaderHeaders ? map.getDownloaderHeaders() : {};

        const response = await fetch(url, headers); //, { responseType: "arraybuffer" });
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const img1 = await map.decode(request.mapType, buffer);
        const ctx = img1.getContext("2d");
        let imageData = ctx.getImageData(0, 0, 256, 256);
        for (let j = 0; j < 256; j++) {
          const posY = j + y * 256 - request.startY;
          if (posY >= 0) {
            for (let i = 0; i < 256; i++) {
              const posX = i + x * 256 - request.startX;
              if (posX >= 0) {
                overallCtx.fillPixelWithColor(posX, posY, imageData.getPixelRGBA(i, j));
              }
            }
          }
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

const getTileUrl = async (map: MapData, zoomLevel: number, row: number, col: number, mapType: string) => {
  return await map.urlProvider(UrlUsageType.DOWNLOAD, mapType, zoomLevel, row, col);
};
