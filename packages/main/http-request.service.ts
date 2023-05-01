import { IpcMainInvokeEvent } from "electron";
import fetch from "electron-fetch";

export async function handleHttpRequest(event: IpcMainInvokeEvent, url: string): Promise<any> {
  console.log("Getting", url);
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

