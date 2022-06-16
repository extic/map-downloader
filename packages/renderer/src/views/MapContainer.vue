<template>
    <div class="map-container">
        <header-bar></header-bar>
        <map-view class="map"></map-view>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import MapView from "../components/MapView.vue"
import HeaderBar from "../components/HeaderBar.vue"

export default defineComponent({
    name: 'MapContainer',
    components: {MapView, HeaderBar}
});
</script>

<style lang="scss" scoped>
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
