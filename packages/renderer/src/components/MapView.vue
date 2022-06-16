<template>
    <div ref="map" class="map-view"
         @mousedown="dragStart($event)"
         @mouseleave="dragEnd($event)"
         @mousemove="drag($event)"
         @mouseup="dragEnd($event)"
         @wheel="zoom($event)">
        <div v-for="tile in tiles"
             :key="tile.top * 100000 + tile.left"
             :style="{'left': tile.left + 'px', 'top': tile.top + 'px'}"
             class="tile"
             @dblclick="selectTile(tile)">
            <img v-if="mapType === 'satellite'" :src="'https://cdn.govmap.gov.il/020522B0B20R/' + tile.urlPart +'.jpg'" :class="{'selected': tile.selected}" @error="noTileImage($event)" alt="map tile"/>
            <img v-if="mapType === 'buildings'" :src="'https://cdn.govmap.gov.il/B0B2309BNTL/' + tile.urlPart +'.png'" :class="{'selected': tile.selected}" @error="noTileImage($event)" alt="map tile"/>
        </div>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, getCurrentInstance, onBeforeUpdate, onMounted, ref} from 'vue'
import {useMapStore} from "../store/map-store";

interface TileData {
    readonly left: number,
    readonly top: number,
    readonly urlPart: string,
    readonly selected: boolean
    readonly row: number,
    readonly col: number,
}

interface ZoomLayer {
    readonly zoomLevel: number
    readonly scale: number
    readonly centerTileX: number
    readonly centerTileY: number
    readonly centerTileOffsetX: number
    readonly centerTileOffsetY: number
}

export default defineComponent({
    name: 'MapView',

    setup() {
        const zoomLayers: ZoomLayer[] = [{
            zoomLevel: 0,
            scale: 3000000,
            centerTileX: 27,
            centerTileY: 31,
            centerTileOffsetX: 122,
            centerTileOffsetY: 190
        }, {
            zoomLevel: 1,
            scale: 1000000,
            centerTileX: 82,
            centerTileY: 95,
            centerTileOffsetX: 113,
            centerTileOffsetY: 61
        }, {
            zoomLevel: 2,
            scale: 500000,
            centerTileX: 164,
            centerTileY: 190,
            centerTileOffsetX: 226,
            centerTileOffsetY: 120
        }, {
            zoomLevel: 3,
            scale: 250000,
            centerTileX: 329,
            centerTileY: 380,
            centerTileOffsetX: 193,
            centerTileOffsetY: 242
        }, {
            zoomLevel: 4,
            scale: 100000,
            centerTileX: 824,
            centerTileY: 952,
            centerTileOffsetX: 104,
            centerTileOffsetY: 96
        }, {
            zoomLevel: 5,
            scale: 50000,
            centerTileX: 1648,
            centerTileY: 1904,
            centerTileOffsetX: 209,
            centerTileOffsetY: 190
        }, {
            zoomLevel: 6,
            scale: 25000,
            centerTileX: 3297,
            centerTileY: 3809,
            centerTileOffsetX: 160,
            centerTileOffsetY: 119
        }, {
            zoomLevel: 7,
            scale: 10000,
            centerTileX: 8244,
            centerTileY: 9523,
            centerTileOffsetX: 22,
            centerTileOffsetY: 164
        }, {
            zoomLevel: 8,
            scale: 5000,
            centerTileX: 16488,
            centerTileY: 19047,
            centerTileOffsetX: 48,
            centerTileOffsetY: 70
        }, {
            zoomLevel: 9,
            scale: 2500,
            centerTileX: 32976,
            centerTileY: 38094,
            centerTileOffsetX: 95,
            centerTileOffsetY: 135
        }, {
            zoomLevel: 10,
            scale: 1250,
            centerTileX: 65952,
            centerTileY: 76189,
            centerTileOffsetX: 191,
            centerTileOffsetY: 12
        }]

        const store = useMapStore()

        const tiles = ref([] as TileData[])
        const map = ref(null as HTMLDivElement | null)

        // let zoomLevel = ref(0)
        let dragging = false
        let posX = 0
        let posY = 0
        let lastPosX = 0
        let lastPosY = 0
        // let selectStartX = -1
        // let selectStartY = -1
        // let selectEndX = -1
        // let selectEndY = -1

        const zoomLevel = computed(() => {
            return store.zoomLevel
        })

        const selectedStart = computed(() => {
            return store.selectionStart
        })

        const selectedEnd = computed(() => {
            return store.selectionEnd
        })


        const mod = (n: number, m: number): number => {
            return ((n % m) + m) % m;
        }

        const updateTiles = () => {
            const mapWidth = map.value!.clientWidth
            const mapHeight = map.value!.clientHeight
            const tilesX = Math.ceil(mapWidth / 256) + 2
            const tilesY = Math.ceil(mapHeight / 256) + 2

            const layer = zoomLayers[zoomLevel.value]

            let modPosX = mod(posX, 256)
            let modPosY = mod(posY, 256)
            let zoomLevelStr = zoomLevel.value.toString(10).padStart(2, '0')
            tiles.value = []
            for (let j = 0; j < tilesY; j++) {
                const row = layer.centerTileY + Math.floor(posY / 256) - Math.floor(tilesY / 2) + j
                const rowStr = row.toString(16).padStart(8, '0')
                const top = Math.floor(mapHeight / 2) - layer.centerTileOffsetY - (Math.floor(tilesY / 2) - j) * 256 - modPosY
                for (let i = 0; i < tilesX; i++) {
                    const col = layer.centerTileX + Math.floor(posX / 256) - Math.floor(tilesX / 2) + i
                    const colStr = col.toString(16).padStart(8, '0')
                    const left = Math.floor(mapWidth / 2) - layer.centerTileOffsetX - (Math.floor(tilesX / 2) - i) * 256 - modPosX
                    const selected = selectedStart.value !== null && selectedEnd.value !== null && col >= selectedStart.value.x && col <= selectedEnd.value.x && row >= selectedStart.value.y && row <= selectedEnd.value.y
                    let urlPart = `L${zoomLevelStr}/R${rowStr}/C${colStr}`
                    tiles.value.push({left, top, urlPart, selected, row, col})
                }
            }
        }

        onMounted(() => {
            updateTiles()

            const layer = zoomLayers[zoomLevel.value]
            store.setZoomLevel(layer.zoomLevel)
            store.setScale(layer.scale)
        })

        onBeforeUpdate(() => {
            updateTiles()
        })

        const dragStart = (event: MouseEvent) => {
            dragging = true
            lastPosX = event.x
            lastPosY = event.y
            event.preventDefault()
        }

        const instance = getCurrentInstance()
        const drag = (event: MouseEvent) => {
            if (dragging) {
                posX -= event.x - lastPosX
                posY -= event.y - lastPosY
                lastPosX = event.x
                lastPosY = event.y

                event.preventDefault()
                instance!.proxy!.$forceUpdate()
            }
        }

        const dragEnd = (event: MouseEvent) => {
            dragging = false
            event.preventDefault()
        }

        const zoom = (event: WheelEvent) => {
            const zoomIn = event.deltaY < 0
            let zoom = zoomLevel.value + (zoomIn ? 1 : -1)
            if (zoom >= 0 && zoom <= 10) {
                let factor = 2
                if (((zoomLevel.value === 0) && zoomIn) || ((zoomLevel.value === 1) && !zoomIn)) {
                    factor = 3
                } else if (((zoomLevel.value === 3 || zoomLevel.value === 6) && zoomIn) || ((zoomLevel.value === 4 || zoomLevel.value === 7) && !zoomIn)) {
                    factor = 2.5
                }

                if (zoomIn) {
                    posX *= factor
                    posY *= factor
                } else {
                    posX /= factor
                    posY /= factor
                }

                store.setZoomLevel(zoom)
                store.setScale(zoomLayers.find(it => it.zoomLevel === zoom)!.scale)
                store.setSelectionStart(null)
                store.setSelectionEnd(null)

                instance!.proxy!.$forceUpdate()
            }
        }

        const selectTile = (tile: TileData) => {
            if (selectedStart.value === null) {
                store.setSelectionStart({ x: tile.col, y: tile.row })
                store.setSelectionEnd({ x: tile.col, y: tile.row })
            } else if (selectedStart.value.x === tile.col && selectedStart.value.y === tile.row) {
                store.setSelectionStart(selectedEnd.value)
                store.setSelectionEnd(null)
            } else if (selectedEnd.value === null || !(selectedEnd.value.x === tile.col && selectedEnd.value.y === tile.row)) {
                store.setSelectionEnd({ x: tile.col, y: tile.row })
            } else {
                store.setSelectionEnd(null)
            }

            if (selectedStart.value !== null && selectedEnd.value != null) {
                if (selectedStart.value.x > selectedEnd.value.x) {
                    const temp = selectedStart.value.x
                    store.setSelectionStart({x: selectedEnd.value.x, y: selectedStart.value.y})
                    store.setSelectionEnd({x: temp, y: selectedEnd.value.y})
                }
                if (selectedStart.value.y > selectedEnd.value.y) {
                    const temp = selectedStart.value.y
                    store.setSelectionStart({x: selectedStart.value.x, y: selectedEnd.value.y})
                    store.setSelectionEnd({x: selectedEnd.value.x, y: temp})
                }
            }

            instance!.proxy!.$forceUpdate()
        }

        const noTileImage = (e: any) => {
            e.path[0].classList.add("hidden")
        }

        const mapType = computed(() => {
            return store.mapType
        })

        return {tiles, map, dragStart, drag, dragEnd, zoom, selectTile, noTileImage, mapType}
    }

});
</script>

<style lang="scss" scoped>
.map-view {
    position: relative;
    overflow: hidden;

    .tile {
        position: absolute;
        width: 256px;
        height: 256px;
        box-sizing: content-box;
        opacity: 0.8;

        &:hover {
            opacity: 1;
            //border: 1px solid red;
        }

        & > img {
            opacity: 0.5;
            filter: grayscale(1);

            &.hidden {
                visibility: hidden;
            }
        }

        & > img.selected {
            opacity: 1;
            filter: grayscale(0);
        }
    }
}
</style>
