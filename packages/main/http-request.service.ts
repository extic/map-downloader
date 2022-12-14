import { IpcMainInvokeEvent } from "electron";
import fetch from "electron-fetch";

export async function handleHttpRequest(event: IpcMainInvokeEvent, url: string): Promise<ArrayBuffer> {
  console.log("Getting", url);
  const response = await fetch(url, {
    headers: {
      referer: "https://en.mapy.cz/"
    }
  });
  const arrayBuffer = await response.arrayBuffer()
  return arrayBuffer;

  // const buffer = Buffer.from(await response.arrayBuffer());
  // const base64String = buffer.toString('base64');


  // // console.log("data:image/gif;base64," + base64String);


  // return "data:image/gif;base64," + base64String;
}

