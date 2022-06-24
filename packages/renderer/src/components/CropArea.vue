<template>
  <div class="crop-area" :style="{ left: posX + 'px', top: posY + 'px', width: width + 'px', height: height + 'px' }">
    <div class="handle top-left" v-draggable:nw="dragged"></div>
    <div class="handle top-right" v-draggable:ne="dragged"></div>
    <div class="handle bottom-right" v-draggable:se="dragged"></div>
    <div class="handle bottom-left" v-draggable:sw="dragged"></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onBeforeUpdate, onMounted, ref, watch } from "vue";
import { useMapStore } from "../store/map-store";
import draggable from "./draggable.directive";

export default defineComponent({
  name: "CropArea",

  directives: { draggable },

  setup() {
    console.log(window.innerWidth);
    const posX = ref(window.innerWidth / 2 - 150);
    const posY = ref(window.innerHeight / 2 - 150);
    const width = ref(300);
    const height = ref(300);

    const dragged = (handle: string, deltaX: number, deltaY: number) => {
      switch (handle) {
        case "nw":
          posX.value += deltaX;
          posY.value += deltaY;
          if (width.value - deltaX > 50) {
            width.value -= deltaX;
          }
          if (height.value - deltaY > 50) {
            height.value -= deltaY;
          }
          break;

        case "ne":
          if (width.value + deltaX < 50) {
            posX.value += deltaX;
          } else {
            width.value = width.value + deltaX;
          }
          posY.value += deltaY;
          if (height.value - deltaY >= 50) {
            height.value -= deltaY;
          }
          break;

        case "sw":
          posX.value += deltaX;
          if (width.value - deltaX >= 50) {
            width.value -= deltaX;
          }
          if (height.value + deltaY < 50) {
            posY.value += deltaY;
          } else {
            height.value += deltaY;
          }
          break;

        case "se":
          if (width.value + deltaX >= 50) {
            width.value += deltaX;
          } else {
            posX.value += deltaX;
          }
          if (height.value + deltaY >= 50) {
            height.value += deltaY;
          } else {
            posY.value += deltaY;
          }
          break;
      }
    };

    return { dragged, posX, posY, height, width };
  },
});
</script>

<style lang="scss" scoped>
.crop-area {
  display: inline-block;
  border: 2px dashed lightblue;
  position: absolute;
  width: 300px;
  height: 300px;
  top: 300px;
  left: 300px;
  cursor: move;
  background-color: rgba(0, 0, 0, 0.3);

  .handle {
    position: absolute;
    border-color: lightblue;
    border-style: dashed;
    width: 20px;
    height: 20px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    &.top-left {
      top: 0;
      left: 0;
      cursor: nw-resize;
      border-width: 0 2px 2px 0;
    }

    &.top-right {
      top: 0;
      right: 0;
      cursor: ne-resize;
      border-width: 0 0 2px 2px;
    }

    &.bottom-right {
      bottom: 0;
      right: 0;
      cursor: se-resize;
      border-width: 2px 0 0 2px;
    }

    &.bottom-left {
      bottom: 0;
      left: 0;
      cursor: sw-resize;
      border-width: 2px 2px 0 0;
    }
  }
}
</style>
