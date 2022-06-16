<template>
    <div class="header-bar">
        <img class="logo" src="../assets/images/i_love_orienteering.png" alt="I Love Orienteering" title="I Love Orienteering">
        <div class="separator"></div>
        <controls-pane></controls-pane>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import ControlsPane from "./ControlsPane.vue"

export default defineComponent({
    name: "HeaderBar",
    components: { ControlsPane }
});
</script>

<style lang="scss" scoped>
.header-bar {
    display: flex;
    align-items: center;
    gap: 2em;
    border-bottom: 1px solid black;

    .logo {
        width: 5em;
        padding: 0 1em;
        margin-left: 2em;
    }

    .separator {
        width: 1px;
        height: 100%;
        border-right: 1px solid black;
    }
}
</style>
