import * as pimage from "pureimage";
import * as fs from "fs";
import { Readable } from "stream";
import { BrowserWindow } from "electron";
import crypto from "crypto";
import fetch from 'electron-fetch'

type DownloadRequest = {
  zoomLevel: string;
  startX: number;
  startY: number;
  maxX: number;
  maxY: number;
  mapType: string;
};

export const downloadMap = async (win: BrowserWindow, request: DownloadRequest) => {
  if (!request) {
    return;
  }

  const overallImg = pimage.make(request.maxX * 256, request.maxY * 256, {});
  const overallCtx = overallImg.getContext("2d");

  for (let y = 0; y < request.maxY; y++) {
    const posY = (request.startY + y).toString(16).padStart(8, "0");
    for (let x = 0; x < request.maxX; x++) {
      const posX = (request.startX + x).toString(16).padStart(8, "0");
      const progress = (x + y * request.maxX) / (request.maxX * request.maxY);
      win.webContents.send("download-progress", progress);

      console.log(`Downloading images: ${(progress * 100).toFixed(2)}%, x=${x}/${request.maxX}, y=${y}/${request.maxY}`);

      const url = getTileUrl(request.zoomLevel, posY, posX, request.mapType);
      try {
        const response = await fetch(url)//, { responseType: "arraybuffer" });
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer);
        const img1 = await (request.mapType === "satellite"
          ? pimage.decodeJPEGFromStream(Readable.from(buffer))
          : pimage.decodePNGFromStream(Readable.from(buffer)));
        const ctx = img1.getContext("2d");
        let imageData = ctx.getImageData(0, 0, 256, 256);
        for (let j = 0; j < 256; j++) {
          for (let i = 0; i < 256; i++) {
            overallCtx.fillPixelWithColor(i + x * 256, j + y * 256, imageData.getPixelRGBA(i, j));
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
      require('child_process').exec(`start "" "${fileName}"`);
    })
    .catch((e) => {
      console.log("there was an error writing", e);
      win.webContents.send("download-done", false);
    });
};

const getTileUrl = (zoomLevel: string, posY: string, posX: string, mapType: string) => {
  if (mapType === "satellite") return `https://cdn.govmap.gov.il/020522B0B20R/L${zoomLevel}/R${posY}/C${posX}.jpg`;

  return `https://cdn.govmap.gov.il/B0B2309BNTL/L${zoomLevel}/R${posY}/C${posX}.png`;
};
