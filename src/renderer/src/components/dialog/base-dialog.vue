<template>
  <dialog ref="dialog" @click.self="closeDialog">
    <header class="dialog-header">
      <slot name="header"></slot>
      <button class="dialog-close" @click="closeDialog">
        <img src="../../assets/images/dialog-close-button.svg" />
      </button>
    </header>
    <div class="dialog-body">
      <slot></slot>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits(['close'])
const dialog = ref<HTMLDialogElement>()

const closeDialog = () => {
  dialog.value!.close()
  emit('close')
}

const openDialog = () => {
  dialog.value!.showModal()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDialog()
  }
}

defineExpose({
  closeDialog
})

onMounted(() => {
  openDialog()
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
dialog {
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  box-shadow: 3px 4px 9px 2px #0000008a;
  width: 40vw;
  min-width: 20em;

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.41);
  }

  header {
    background: white;
    color: black;
    padding: 1em 0;
    border-radius: 5px 5px 0 0;
    display: flex;
    align-items: center;

    .dialog-close {
      outline: none;
      width: 2.4em;
      height: 2.4em;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      flex-shrink: 0;
      padding: 0;
      background: transparent;

      img {
        width: 1.3em;
        height: 1.3em;
        position: relative;
        top: 1px;
      }
    }
  }
}
</style>
