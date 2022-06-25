<template>
  <div class="crop-area" :style="{ left: store.cropLeft + 'px', top: store.cropTop + 'px', width: store.cropWidth + 'px', height: store.cropHeight + 'px' }">
    <div class="handle top-left" v-draggable:nw="dragged"></div>
    <div class="handle top-right" v-draggable:ne="dragged"></div>
    <div class="handle bottom-right" v-draggable:se="dragged"></div>
    <div class="handle bottom-left" v-draggable:sw="dragged"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMapStore } from "../store/map-store";
import draggable from "./draggable.directive";

export default defineComponent({
  name: "CropArea",

  directives: { draggable },

  setup() {
    const store = useMapStore();

    const dragged = (handle: string, deltaX: number, deltaY: number) => {
      switch (handle) {
        case "nw":
          store.setCropLeft(store.cropLeft + deltaX);
          store.setCropTop(store.cropTop + deltaY);
          if (store.cropWidth - deltaX > 50) {
            store.setCropWidth(store.cropWidth - deltaX);
          }
          if (store.cropHeight - deltaY > 50) {
            store.setCropHeight(store.cropHeight - deltaY);
          }
          break;

        case "ne":
          if (store.cropWidth + deltaX < 50) {
            store.setCropLeft(store.cropLeft + deltaX);
          } else {
            store.setCropWidth(store.cropWidth + deltaX);
          }
          store.setCropTop(store.cropTop + deltaY);
          if (store.cropHeight - deltaY >= 50) {
            store.setCropHeight(store.cropHeight - deltaY);
          }
          break;

        case "sw":
          store.setCropLeft(store.cropLeft + deltaX);
          if (store.cropWidth - deltaX >= 50) {
            store.setCropWidth(store.cropWidth - deltaX);
          }
          if (store.cropHeight + deltaY < 50) {
            store.setCropTop(store.cropTop + deltaY);
          } else {
            store.setCropHeight(store.cropHeight + deltaY);
          }
          break;

        case "se":
          if (store.cropWidth + deltaX >= 50) {
            store.setCropWidth(store.cropWidth + deltaX);
          } else {
            store.setCropLeft(store.cropLeft + deltaX);
          }
          if (store.cropHeight + deltaY >= 50) {
            store.setCropHeight(store.cropHeight + deltaY);
          } else {
            store.setCropTop(store.cropTop + deltaY);
          }
          break;
      }
    };

    return { dragged, store }
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
