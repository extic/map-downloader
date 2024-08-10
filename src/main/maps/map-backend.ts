import { mapBackendDataGovMap } from './govmap.backend'
import { Bitmap } from 'pureimage'

export type MapBackendData = {
  name: string
  decode: (mapType: string, buffer: Buffer) => Promise<Bitmap>
}

const mapBackend = [
  mapBackendDataGovMap,
  // mapDataGalilTahton,
  // mapDataTelAviv,
  // mapDataHaifa,
  // mapDataHodHasharon,
  // mapDataNetanya,
  // mapDataMapy
]

export function getBackendData(mapName: string) {
  return mapBackend.find((it) => it.name === mapName)!
}
