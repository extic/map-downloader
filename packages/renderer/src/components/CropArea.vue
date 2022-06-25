<template>
  <div class="crop-area" :style="{ left: cropLeft + 'px', top: cropTop + 'px', width: cropWidth + 'px', height: cropHeight + 'px' }">
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
    const store = useMapStore();
    const cropLeft = computed({
      get(): number {
        return store.cropLeft;
      },
      set(newValue: number) {
        store.setCropLeft(newValue);
      },
    });

    const cropTop = computed({
      get(): number {
        return store.cropTop;
      },
      set(newValue: number) {
        store.setCropTop(newValue);
      },
    });

    const cropWidth = computed({
      get(): number {
        return store.cropWidth;
      },
      set(newValue: number) {
        store.setCropWidth(newValue);
      },
    });

    const cropHeight = computed({
      get(): number {
        return store.cropHeight;
      },
      set(newValue: number) {
        store.setCropHeight(newValue);
      },
    });

    const dragged = (handle: string, deltaX: number, deltaY: number) => {
      switch (handle) {
        case "nw":
          cropLeft.value += deltaX;
          cropTop.value += deltaY;
          if (cropWidth.value - deltaX > 50) {
            cropWidth.value -= deltaX;
          }
          if (cropHeight.value - deltaY > 50) {
            cropHeight.value -= deltaY;
          }
          break;

        case "ne":
          if (cropWidth.value + deltaX < 50) {
            cropLeft.value += deltaX;
          } else {
            cropWidth.value = cropWidth.value + deltaX;
          }
          cropTop.value += deltaY;
          if (cropHeight.value - deltaY >= 50) {
            cropHeight.value -= deltaY;
          }
          break;

        case "sw":
          cropLeft.value += deltaX;
          if (cropWidth.value - deltaX >= 50) {
            cropWidth.value -= deltaX;
          }
          if (cropHeight.value + deltaY < 50) {
            cropTop.value += deltaY;
          } else {
            cropHeight.value += deltaY;
          }
          break;

        case "se":
          if (cropWidth.value + deltaX >= 50) {
            cropWidth.value += deltaX;
          } else {
            cropLeft.value += deltaX;
          }
          if (cropHeight.value + deltaY >= 50) {
            cropHeight.value += deltaY;
          } else {
            cropTop.value += deltaY;
          }
          break;
      }
    };

    return { dragged, cropLeft, cropTop, cropWidth, cropHeight }
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
