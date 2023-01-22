import { BrowserWindow, ipcMain, App } from "electron";
import { downloadMap, downloadOptions } from "./downloader";
import { handleHttpRequest } from "./http-request.service";
import { setReferrer } from "./main-store";

export const eventRegistrar = {
  registerEvents: (win: BrowserWindow, app: App) => {
    ipcMain.on("download-map", (event, arg) => {
      downloadMap(win, arg);
    });

    ipcMain.on("cancel-download", () => {
      downloadOptions.canceled = true;
    });

    ipcMain.on("get-app-version", () => {
      win.webContents.send("app-version", app.getVersion());
    });

    ipcMain.on("set-referer", (event, arg) => {
      setReferrer(arg);
    });

    ipcMain.handle('http:request', handleHttpRequest);
  },
};
