import { IpcMainInvokeEvent } from 'electron'
import fetch from 'electron-fetch'

export async function handleHttpRequest(_: IpcMainInvokeEvent, url: string): Promise<ArrayBuffer> {
  console.log('Getting', url)
  const response = await fetch(url, {
    headers: {
      referer: 'https://en.mapy.cz/'
    }
  })
  return await response.arrayBuffer()
}
