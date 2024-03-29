<template>
  <div
    class="crop-area"
    :class="{ disabled: !dragAllowed() }"
    :style="{ left: store.cropLeft + 'px', top: store.cropTop + 'px', width: store.cropWidth + 'px', height: store.cropHeight + 'px' }"
    v-draggable:c="{ dragged, dragAllowed }"
  >
    <div class="handle top-left" :class="{ hidden: !dragAllowed() }" v-draggable:nw="{ dragged, dragAllowed }"></div>
    <div class="handle top" :class="{ hidden: !dragAllowed() }" v-draggable:n="{ dragged, dragAllowed }"></div>
    <div class="handle top-right" :class="{ hidden: !dragAllowed() }" v-draggable:ne="{ dragged, dragAllowed }"></div>
    <div class="handle right" :class="{ hidden: !dragAllowed() }" v-draggable:e="{ dragged, dragAllowed }"></div>
    <div class="handle bottom-right" :class="{ hidden: !dragAllowed() }" v-draggable:se="{ dragged, dragAllowed }"></div>
    <div class="handle bottom" :class="{ hidden: !dragAllowed() }" v-draggable:s="{ dragged, dragAllowed }"></div>
    <div class="handle bottom-left" :class="{ hidden: !dragAllowed() }" v-draggable:sw="{ dragged, dragAllowed }"></div>
    <div class="handle left" :class="{ hidden: !dragAllowed() }" v-draggable:w="{ dragged, dragAllowed }"></div>
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

    const dragged = (deltaX: number, deltaY: number, event: MouseEvent, handle: string) => {
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
          event.preventDefault();
          event.stopPropagation();
          break;

        case "n":
          store.setCropTop(store.cropTop + deltaY);
          if (store.cropHeight - deltaY > 50) {
            store.setCropHeight(store.cropHeight - deltaY);
          }
          event.preventDefault();
          event.stopPropagation();
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
          event.preventDefault();
          event.stopPropagation();
          break;

        case "e":
          if (store.cropWidth + deltaX < 50) {
            store.setCropLeft(store.cropLeft + deltaX);
          } else {
            store.setCropWidth(store.cropWidth + deltaX);
          }
          event.preventDefault();
          event.stopPropagation();
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
          event.preventDefault();
          event.stopPropagation();
          break;

        case "s":
          if (store.cropHeight + deltaY < 50) {
            store.setCropTop(store.cropTop + deltaY);
          } else {
            store.setCropHeight(store.cropHeight + deltaY);
          }
          event.preventDefault();
          event.stopPropagation();
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
          event.preventDefault();
          event.stopPropagation();
          break;

        case "w":
          store.setCropLeft(store.cropLeft + deltaX);
          if (store.cropWidth - deltaX > 50) {
            store.setCropWidth(store.cropWidth - deltaX);
          }
          event.preventDefault();
          event.stopPropagation();
          break;

        case "c":
          store.setCropLeft(store.cropLeft + deltaX);
          store.setCropTop(store.cropTop + deltaY);
          event.preventDefault();
          event.stopPropagation();
          break;
      }
    };

    const dragAllowed = () => {
      return store.dragMode === "crop";
    };

    return { dragged, dragAllowed, store };
  },
});
</script>

<style lang="scss" scoped>
.crop-area {
  display: inline-block;
  border: 2px dashed lightblue;
  position: absolute;
  box-sizing: border-box;
  cursor: move;
  background-color: rgba(0, 0, 0, 0.3);

  &.disabled {
    cursor: inherit;
  }

  .handle {
    position: absolute;
    border-color: lightblue;
    border-style: dashed;

    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }

    &.top-left {
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      cursor: nw-resize;
      border-width: 0 1px 1px 0;
    }

    &.top {
      top: 0;
      left: 20px;
      right: 20px;
      height: 15px;
      cursor: n-resize;
      border-width: 0 0 1px 0;
    }

    &.top-right {
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
      cursor: ne-resize;
      border-width: 0 0 1px 1px;
    }

    &.right {
      top: 20px;
      bottom: 20px;
      right: 0;
      width: 15px;
      cursor: e-resize;
      border-width: 0 0 0 1px;
    }

    &.bottom-right {
      bottom: 0;
      right: 0;
      width: 20px;
      height: 20px;
      cursor: se-resize;
      border-width: 1px 0 0 1px;
    }

    &.bottom {
      bottom: 0;
      left: 20px;
      right: 20px;
      height: 15px;
      cursor: s-resize;
      border-width: 1px 0 0 0;
    }

    &.bottom-left {
      bottom: 0;
      left: 0;
      width: 20px;
      height: 20px;
      cursor: sw-resize;
      border-width: 1px 1px 0 0;
    }

    &.left {
      top: 20px;
      bottom: 20px;
      left: 0;
      width: 15px;
      cursor: w-resize;
      border-width: 0 1px 0 0;
    }

    &.hidden {
      border: 0;
      cursor: inherit;

      &:hover {
        background-color: transparent;
      }
    }
  }
}
</style>
