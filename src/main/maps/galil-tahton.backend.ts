import * as pimage from 'pureimage'
import { Bitmap } from 'pureimage'
import { Readable } from 'stream'
import { MapBackendData } from './map-backend'

export const mapBackendGalilTahton: MapBackendData = {
  name: 'Galil Tahton',

  decode: async (_mapType: string, buffer: Buffer): Promise<Bitmap> => {
    return pimage.decodeJPEGFromStream(Readable.from(buffer))
  }
}