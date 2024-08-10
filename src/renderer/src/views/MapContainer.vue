<template>
  <div class="map-container">
    <header-bar></header-bar>
    <map-view class="map"></map-view>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '../components/HeaderBar.vue'
import MapView from '../components/MapView.vue'
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .map {
    flex-grow: 1;
  }
}
</style>
