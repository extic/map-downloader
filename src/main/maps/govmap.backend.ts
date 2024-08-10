import * as pimage from 'pureimage'
import { Bitmap } from 'pureimage'
import { Readable } from 'stream'
import { MapBackendData } from './map-backend'

export const mapBackendDataGovMap: MapBackendData = {
  name: 'GovMap',

  decode: async (mapType: string, buffer: Buffer): Promise<Bitmap> => {
    return await (mapType === 'Satellite' ? pimage.decodeJPEGFromStream(Readable.from(buffer)) : pimage.decodePNGFromStream(Readable.from(buffer)))
  }
}
