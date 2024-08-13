import { mapBackendDataGovMap } from './govmap.backend'
import { Bitmap } from 'pureimage'
import { mapBackendTelAviv } from './tel-aviv.backend'
import { mapBackendDataHaifa } from './haifa.backend'
import { mapBackendDataNetanya } from './netanya.backend'

export type MapBackendData = {
  name: string
  decode: (mapType: string, buffer: Buffer) => Promise<Bitmap>
}

const mapBackend = [
  mapBackendDataGovMap,
  // mapDataGalilTahton,
  mapBackendTelAviv,
  mapBackendDataHaifa,
  // mapDataHodHasharon,
  mapBackendDataNetanya
  // mapDataMapy
]

export function getBackendData(mapName: string) {
  return mapBackend.find((it) => it.name === mapName)!
}
