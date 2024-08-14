import * as pimage from 'pureimage'
import { Bitmap } from 'pureimage'
import { Readable } from 'stream'
import { MapBackendData } from './map-backend'

export const mapBackendTelAviv: MapBackendData = {
  name: 'Tel-Aviv',

  decode: async (_: string, buffer: Buffer): Promise<Bitmap> => {
    return pimage.decodeJPEGFromStream(Readable.from(buffer))
  }
}
