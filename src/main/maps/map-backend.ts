import { mapBackendDataGovMap } from './govmap.backend'
import { Bitmap } from 'pureimage'
import { mapBackendTelAviv } from './tel-aviv.backend'
import { mapBackendDataHaifa } from './haifa.backend'
import { mapBackendDataNetanya } from './netanya.backend'
import { mapBackendHodHasharon } from './hod-hasharon.backend'
import { mapBackendGalilTahton } from './galil-tahton.backend'
import { mapBackendMapy } from './mapy.backend'

export type MapBackendData = {
  name: string
  decode: (mapType: string, buffer: Buffer) => Promise<Bitmap>
}

const mapBackend = [
  mapBackendDataGovMap,
  mapBackendGalilTahton,
  mapBackendTelAviv,
  mapBackendDataHaifa,
  mapBackendHodHasharon,
  mapBackendDataNetanya,
  mapBackendMapy
]

export function getBackendData(mapName: string) {
  return mapBackend.find((it) => it.name === mapName)!
}
