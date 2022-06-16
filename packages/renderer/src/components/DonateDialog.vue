<template>
    <GenericDialog ref="genericDialog" :modal="true" @dialogAppeared="dialogAppeared()" @enterPressed="ok()" class="donate-dialog">
        <template #dialog-title>
            <span>Please Consider Supporting Me!</span>
        </template>
        <template #dialog-content>
            <div class="donate-dialog-content">
                <div class="dialog-content">
                    <div>Are you enjoying this tool?</div>
                    <div>Please consider supporting it as it takes some time and effort continuing developing and maintaining it.</div>
                    <div>With your help I will try to keep this site running, add useful features and more sources.</div>
                    <div>Thank you!</div>
                    <div class="amounts">
                        <div>NIS (₪)</div>
                        <button class="amount-button" :class="{'selected': amount === 5}" @click="amount = 5">5</button>
                        <button class="amount-button" :class="{'selected': amount === 10}" @click="amount = 10">10</button>
                        <button class="amount-button" :class="{'selected': amount === 20}" @click="amount = 20">20</button>
                        <button class="amount-button" :class="{'selected': amount === 50}" @click="amount = 50">50</button>
                        <button class="amount-button" :class="{'selected': amount === null}" @click="amount = null">Other</button>
                    </div>

                    <div class="donate-container">
                        <form action="https://www.paypal.com/donate" method="post" target="_top">
                            <input type="hidden" name="business" value="R4VGRL3MHAWCY" />
                            <input type="hidden" name="amount" :value="amount" v-if="amount"/>
                            <input type="hidden" name="no_recurring" value="0" />
                            <input type="hidden" name="item_name" value="Map images for Orienteering Israel" />
                            <input type="hidden" name="currency_code" value="ILS" />
                            <input type="image" src="https://www.paypalobjects.com/en_US/IL/i/btn/btn_donateCC_LG.gif" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
<!--                            <img alt="" border="0" src="https://www.paypal.com/en_IL/i/scr/pixel.gif" width="1" height="1" />-->
                        </form>
                    </div>

                    <a class="later" @click="ok">Thanks, maybe later...</a>
                </div>
            </div>
        </template>
    </GenericDialog>
</template>

<script lang="ts">
import {createApp, defineComponent, ref} from "vue"
import GenericDialog, {createDialogMountingPoint, focusOnModalOnly} from "./GenericDialog.vue"
import DonateDialog from "./DonateDialog.vue"


export default defineComponent({
    name: "DonateDialog",
    components: {
        GenericDialog
    },

    setup() {
        const amount = ref(10 as number | null)

        const dialogAppeared = () => {
            //do nothing
        }

        return { amount, dialogAppeared }
    },

    methods: {
        ok() {
            const genericDialog = this.$refs.genericDialog as unknown as typeof GenericDialog
            genericDialog.close()
        }
    }
})


export function openDonateDialog(): void {
    createApp(DonateDialog).mount(createDialogMountingPoint())
    focusOnModalOnly(".donate-dialog")
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

        .amounts {
            display: flex;
            align-items: center;
            gap: 1em;
            margin: 3em auto 2em auto;

            .amount-button {
                padding: 0.3em 1em;
                border: 1px solid #555;
                border-radius: 5px;
                cursor: pointer;

                &.selected {
                    background-color: #d3fdff;
                }
            }
        }

        .donate-container {
            text-align: center;
            margin-bottom: 2em;
        }

        .later {
            color: #666;
            cursor: pointer;
        }

    }
}
</style>
