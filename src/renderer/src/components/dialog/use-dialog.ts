import { type Component, createVNode, getCurrentInstance, render } from 'vue'

export function useDialog() {
  const { appContext } = getCurrentInstance()!

  function show(dialog: Component, props: any) {
    const dialogContainer = document.createElement('div')
    document.body.appendChild(dialogContainer)

    const dialogInstance = createVNode(dialog, {
      ...props,
      onClose: () => {
        render(null, dialogContainer)
        dialogContainer.remove()
      }
    })

    dialogInstance.appContext = appContext
    render(dialogInstance, dialogContainer)
  }

  return { show }
}
