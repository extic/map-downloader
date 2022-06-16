<template>
    <GenericDialog ref="genericDialog" :modal="true" @dialogAppeared="dialogAppeared()" :escape-closes="false" class="download-dialog">
        <template #dialog-title>
            <span>Creating Map...</span>
        </template>
        <template #dialog-content>
            <div class="donate-dialog-content">
                <div class="dialog-content">
                    <div>Progress</div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" :style="{'width': (progress * 100) + '%'}"></div>
                        <div class="progress-value">{{ progressValue() }}%</div>
                    </div>
                </div>
                <div class="buttons">
                    <button @click="cancel()">Cancel</button>
                </div>
            </div>
        </template>
    </GenericDialog>
</template>

<script lang="ts">
import {createApp, defineComponent, onMounted, PropType, ref} from "vue"
import GenericDialog, {createDialogMountingPoint, focusOnModalOnly} from "./GenericDialog.vue"
import DownloadDialog from "./DownloadDialog.vue"
import { MapType } from "../store/map-store"


export interface DownloadDialogOptions {
    readonly zoomLevel: number
    readonly startX: number
    readonly startY: number
    readonly maxX: number
    readonly maxY: number
    readonly mapType: MapType
}


export default defineComponent({
    name: "DownloadDialog",
    components: {
        GenericDialog
    },
    props: {
        options: Object as PropType<DownloadDialogOptions>
    },

    setup(props) {
        const timeoutId = ref(0)
        const progress = ref(0)
        const genericDialog = ref("genericDialog")
        const uuid = ref("")

        const dialogAppeared = () => {
            //do nothing
        }

        const progressValue = () => {
            return (progress.value * 100).toFixed(2)
        }

        onMounted(async () => {
            // const response = await mapService.downloadMap(
            //     props.options!.zoomLevel,
            //     props.options!.startX,
            //     props.options!.startY,
            //     props.options!.maxX,
            //     props.options!.maxY,
            //     props.options!.mapType
            // )

            // uuid.value = response.uuid

            // const checkProgress = () => {
            //     timeoutId.value = setTimeout(async () => {
            //         const statusResponse = await mapService.getStatus(uuid.value);
            //         progress.value = statusResponse.progress
            //         if (progress.value === -1) {
            //             console.log("an error has occurred")
            //         } if (progress.value === 1) {
            //             const { contentType, data } = await mapService.getImage(uuid.value)
            //             const blob = new Blob([data], { type: contentType })
            //             const link = document.createElement('a')
            //             link.href = window.URL.createObjectURL(blob)
            //             link.download = 'map.png'
            //             link.click()

            //             const genericDialogInstance = genericDialog.value as unknown as typeof GenericDialog
            //             genericDialogInstance.close()
            //         } else {
            //             checkProgress()
            //         }
            //     }, 1000)
            // }
            // checkProgress()
        })

        return { timeoutId, progress, uuid, dialogAppeared, progressValue, genericDialog }
    },

    methods: {
        cancel() {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId)
            }

            // if (this.uuid !== "0") {
            //     mapService.clearRequest(this.uuid)
            // }

            const genericDialog = this.$refs.genericDialog as unknown as typeof GenericDialog
            genericDialog.close()
        }
    }
})


export function openDownloadDialog(options: DownloadDialogOptions): void {
    createApp(DownloadDialog, { options }).mount(createDialogMountingPoint())
    focusOnModalOnly(".download-dialog")
}

</script>

<style lang="scss" scoped>

.donate-dialog-content {
    padding: 2em;

    .dialog-content {
        width: 40vw;
        min-width: 20em;
        display: flex;
        flex-direction: column;

        .progress-bar-container {
            border: 1px solid gray;
            border-radius: 5px;
            position: relative;
            height: 2em;
            overflow: hidden;

            .progress-bar {
                position: absolute;
                top: 0;
                left: 0;
                background: #65b3ff;
                height: 2em;
            }

            .progress-value {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2em;
                line-height: 2em;
                text-align: center;
            }
        }
    }

    .buttons {
        margin-top: 2em;
        display: flex;
        align-items: center;
        gap: 1em;
        justify-content: flex-end;

        button {
            padding: 0.3em 1em;
            border: 1px solid #555;
            border-radius: 5px;
            cursor: pointer;
            width: 10em;

            &.primary {
                background-color: #65b3ff;
                color: white;
            }
        }
    }
}
</style>
