<template>
  <div
    v-draggable:c="{ dragged, dragAllowed }"
    class="crop-area"
    :class="{ disabled: !dragAllowed() }"
    :style="{ left: store.cropLeft + 'px', top: store.cropTop + 'px', width: store.cropWidth + 'px', height: store.cropHeight + 'px' }"
  >
    <div v-draggable:nw="{ dragged, dragAllowed }" class="handle top-left" :class="{ hidden: !dragAllowed() }"></div>
    <div v-draggable:n="{ dragged, dragAllowed }" class="handle top" :class="{ hidden: !dragAllowed() }"></div>
    <div v-draggable:ne="{ dragged, dragAllowed }" class="handle top-right" :class="{ hidden: !dragAllowed() }"></div>
    <div v-draggable:e="{ dragged, dragAllowed }" class="handle right" :class="{ hidden: !dragAllowed() }"></div>
    <div v-draggable:se="{ dragged, dragAllowed }" class="handle bottom-right" :class="{ hidden: !dragAllowed() }"></div>
    <div v-draggable:s="{ dragged, dragAllowed }" class="handle bottom" :class="{ hidden: !dragAllowed() }"></div>
    <div v-draggable:sw="{ dragged, dragAllowed }" class="handle bottom-left" :class="{ hidden: !dragAllowed() }"></div>
    <div v-draggable:w="{ dragged, dragAllowed }" class="handle left" :class="{ hidden: !dragAllowed() }"></div>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '../store/map-store'

const store = useMapStore()

const dragged = (deltaX: number, deltaY: number, event: MouseEvent, handle: string) => {
  switch (handle) {
    case 'nw':
      store.cropLeft = store.cropLeft + deltaX
      store.cropTop = store.cropTop + deltaY
      if (store.cropWidth - deltaX > 50) {
        store.cropWidth = store.cropWidth - deltaX
      }
      if (store.cropHeight - deltaY > 50) {
        store.cropHeight = store.cropHeight - deltaY
      }
      event.preventDefault()
      event.stopPropagation()
      break

    case 'n':
      store.cropTop = store.cropTop + deltaY
      if (store.cropHeight - deltaY > 50) {
        store.cropHeight = store.cropHeight - deltaY
      }
      event.preventDefault()
      event.stopPropagation()
      break

    case 'ne':
      if (store.cropWidth + deltaX < 50) {
        store.cropLeft = store.cropLeft + deltaX
      } else {
        store.cropWidth = store.cropWidth + deltaX
      }
      store.cropTop = store.cropTop + deltaY
      if (store.cropHeight - deltaY >= 50) {
        store.cropHeight = store.cropHeight - deltaY
      }
      event.preventDefault()
      event.stopPropagation()
      break

    case 'e':
      if (store.cropWidth + deltaX < 50) {
        store.cropLeft = store.cropLeft + deltaX
      } else {
        store.cropWidth = store.cropWidth + deltaX
      }
      event.preventDefault()
      event.stopPropagation()
      break

    case 'sw':
      store.cropLeft = store.cropLeft + deltaX
      if (store.cropWidth - deltaX >= 50) {
        store.cropWidth = store.cropWidth - deltaX
      }
      if (store.cropHeight + deltaY < 50) {
        store.cropTop = store.cropTop + deltaY
      } else {
        store.cropHeight = store.cropHeight + deltaY
      }
      event.preventDefault()
      event.stopPropagation()
      break

    case 's':
      if (store.cropHeight + deltaY < 50) {
        store.cropTop = store.cropTop + deltaY
      } else {
        store.cropHeight = store.cropHeight + deltaY
      }
      event.preventDefault()
      event.stopPropagation()
      break

    case 'se':
      if (store.cropWidth + deltaX >= 50) {
        store.cropWidth = store.cropWidth + deltaX
      } else {
        store.cropLeft = store.cropLeft + deltaX
      }
      if (store.cropHeight + deltaY >= 50) {
        store.cropHeight = store.cropHeight + deltaY
      } else {
        store.cropTop = store.cropTop + deltaY
      }
      event.preventDefault()
      event.stopPropagation()
      break

    case 'w':
      store.cropLeft = store.cropLeft + deltaX
      if (store.cropWidth - deltaX > 50) {
        store.cropWidth = store.cropWidth - deltaX
      }
      event.preventDefault()
      event.stopPropagation()
      break

    case 'c':
      store.cropLeft = store.cropLeft + deltaX
      store.cropTop = store.cropTop + deltaY
      event.preventDefault()
      event.stopPropagation()
      break
  }
}

function dragAllowed() {
  return store.dragMode === 'crop'
}
</script>

<style scoped>
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
