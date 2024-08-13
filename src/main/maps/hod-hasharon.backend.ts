import * as pimage from 'pureimage'
import { Bitmap } from 'pureimage'
import { Readable } from 'stream'
import { MapBackendData } from './map-backend'

export const mapBackendHodHasharon: MapBackendData = {
  name: 'Hod Hasharon',

  decode: async (_mapType: string, buffer: Buffer): Promise<Bitmap> => {
    return await pimage.decodeJPEGFromStream(Readable.from(buffer))
  }
}
