<template>
  <div class="header-bar">
    <img class="logo" src="../assets/images/i_love_orienteering.png" alt="I Love Orienteering" title="I Love Orienteering" />
    <div class="separator"></div>
    <controls-pane></controls-pane>
  </div>
</template>

<script setup lang="ts">
import ControlsPane from '../components/controls-pane.vue'
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  gap: 2em;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  background-color: #2b669b;

  .logo {
    width: 5em;
    padding: 0.5em 1em;
    margin-left: 2em;
    background-color: #00000020;
    border-radius: 5px;
    border: 1px solid darkslategray;
  }

  .separator {
    width: 1px;
    height: 100%;
    border-right: 1px solid black;
  }
}
</style>
