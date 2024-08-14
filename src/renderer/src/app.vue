<template>
  <router-view />
</template>

<script setup lang="ts">
import { useMapStore } from './store/map-store'

window.electron.ipcRenderer.on('app-version', (_event, version) => {
  const store = useMapStore()
  store.setAppVersion(version)
})
window.electron.ipcRenderer.send('get-app-version')
</script>
