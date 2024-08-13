import * as pimage from 'pureimage'
import { Bitmap } from 'pureimage'
import { Readable } from 'stream'
import { MapBackendData } from './map-backend'

export const mapBackendMapy: MapBackendData = {
  name: 'Mapy',

  decode: async (mapType: string, buffer: Buffer): Promise<Bitmap> => {
    return await (mapType === 'Street' ? pimage.decodePNGFromStream(Readable.from(buffer)) : pimage.decodeJPEGFromStream(Readable.from(buffer)))
  }
}
