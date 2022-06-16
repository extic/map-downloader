<template>
    <div class="generic-dialog">
        <transition name="dialog-veil">
            <div v-show="visible" :style="{'z-index': componentVeilZIndex}" class="full-screen-veil"></div>
        </transition>
        <transition name="dialog-container" @after-enter="afterEnter()" @after-leave="remove()">
            <div v-show="visible" ref="dialogContainer" :style="{'z-index': componentVeilZIndex + 1}" class="dialog-container" @click="onVeilClicked()">
                <div class="dialog" @click.stop>
                    <div class="header">
                        <div class="header-title">
                            <slot name="dialog-title"/>
                        </div>
                        <button class="close-dialog" @click="close()"/>
                    </div>
                    <slot name="dialog-content"/>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"

let veilZIndex = 9000

export function createDialogMountingPoint(): HTMLDivElement {
    const mountingElement = document.createElement("div")
    let container = document.getElementById("modal-container")
    if (!container) {
        container = document.body
    }
    container.appendChild(mountingElement)
    return mountingElement
}

export function focusOnModalOnly(modalSelector: string): void {
    const modal = document.querySelector(modalSelector) as HTMLElement // select the modal by it's id

    const  focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    let modalFocusableElements = modal.querySelectorAll(focusableElements) as unknown as HTMLElement[]
    const focusableContent = modalFocusableElements;
    const firstFocusableElement = modalFocusableElements[0]; // get first element to be focused inside modal
    const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal


    document.addEventListener('keydown', function(e) {
        let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

        if (!isTabPressed) {
            return;
        }

        if (e.shiftKey) { // if shift key pressed for shift + tab combination
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus(); // add focus for the last focusable element
                e.preventDefault();
            }
        } else { // if tab key is pressed
            if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
                firstFocusableElement.focus(); // add focus for the first focusable element
                e.preventDefault();
            }
        }
    });

    firstFocusableElement.focus();
}

export default defineComponent({
    name: "GenericDialog",
    props: {
        modal: Boolean,
        escapeCloses: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            componentVeilZIndex: veilZIndex += 2,
            visible: false
        }
    },

    mounted() {
        document.addEventListener("keyup", this.handleKey)

        this.$nextTick(() => {
            this.visible = true
        })
    },

    methods: {

        close() {
            this.visible = false
            this.$emit("closed")
        },

        handleKey(e: KeyboardEvent) {
            switch (e.key) {
                case "Escape":
                    if (this.escapeCloses) {
                        this.close()
                    }
                    break

                case "Enter":
                    this.$emit("enterPressed")
                    break
            }
        },

        onVeilClicked() {
            if (!this.modal) {
                this.close()
            }
        },

        remove() {
            document.removeEventListener("keyup", this.handleKey)
            const parent = this.$el.parentElement
            parent.removeChild(this.$el)
            parent.parentElement.removeChild(parent)
        },

        afterEnter() {
            this.$emit("dialogAppeared")
        }
    }
})
</script>

<style lang="scss" scoped>
//@import '../styles/variables';

@mixin full-screen($padding: 0) {
    position: fixed;
    top: $padding;
    bottom: $padding;
    left: $padding;
    right: $padding
}

.generic-dialog {
    font-size: 1rem;

    .full-screen-veil {
        @include full-screen();
        opacity: 0.6;
        background-color: black;

        &.dialog-veil-enter-active {
            animation: veilIn 0.3s;
        }
        &.dialog-veil-leave-active {
            animation: veilOut 0.3s;
        }
    }

    .dialog-container {
        @include full-screen();
        display: flex;
        align-items: center;
        justify-content: center;

        &.dialog-container-enter-active {
            animation: dialogIn 0.3s cubic-bezier(0.790, -0.490, 0.330, 1.460);
        }
        &.dialog-container-leave-active {
            animation: dialogOut 0.3s cubic-bezier(0.790, -0.490, 0.330, 1.460);
        }

        .dialog {
            display: flex;
            flex-direction: column;
            background-color: white;
            border-radius: 5px;
            transition: width 0.2s;

            .header {
                background: white;
                color: black;
                padding: 1em;
                border-radius: 5px 5px 0 0;
                display: flex;
                align-items: center;
                flex-shrink: 0;

                .header-title {
                    flex-grow: 1;
                    font-size: 1.7em;
                    margin-left: 0.5em;
                }

                .close-dialog {
                    //@include pressable();
                    outline: none;
                    background: url(../assets/images/dialog-close-button.svg) no-repeat 50% 50%;
                    width: 2.4em;
                    height: 2.4em;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    flex-shrink: 0;

                    &:hover {
                        background-color: #53adcd;
                    }

                    &:focus {
                        border: 1px solid black;
                        background-color: #53adcd;
                    }
                }
            }
        }
    }
}

@keyframes veilIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 0.6;
    }
}
@keyframes veilOut {
    from {
        opacity: 0.6;
    }
    to {
        opacity: 0;
    }
}

@keyframes dialogIn {
    from {
        opacity: 0;
        transform: scale(0.5);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
@keyframes dialogOut {
    from {
        opacity: 1;
        transform: scale(1);
    }
    to {
        opacity: 0;
        transform: scale(0.5);
    }
}

</style>
