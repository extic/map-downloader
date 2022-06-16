import { BrowserWindow, ipcMain } from "electron";
import { downloadMap } from "./downloader";

export const utils = {
  aaa: (win: BrowserWindow) => {
    ipcMain.on("download-map", (event, arg) => {
      downloadMap(win, arg);
    });
  },
};
