import { BrowserWindow, ipcMain } from "electron";
import { downloadMap, downloadOptions } from "./downloader";

export const utils = {
  aaa: (win: BrowserWindow) => {
    ipcMain.on("download-map", (event, arg) => {
      downloadMap(win, arg);
    });

    ipcMain.on("cancel-download", () => {
      downloadOptions.canceled = true;
    })
  },
};
