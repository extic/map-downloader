<template>
    <GenericDialog ref="genericDialog" :modal="true" @dialogAppeared="dialogAppeared()" class="contact-dialog">
        <template #dialog-title>
            <span>Send me a message!</span>
        </template>
        <template #dialog-content>
            <div class="contact-dialog-content">
                <div class="dialog-content">
                    <label>Content (upto 250 characters):</label>
                    <textarea ref="message" class="message" maxlength="250"></textarea>
                </div>
                <div class="buttons">
                    <button @click="cancel()">Cancel</button>
                    <button class="primary" @click="ok()" ref="okButton">Ok</button>
                </div>
            </div>
        </template>
    </GenericDialog>
</template>

<script lang="ts">
import {createApp, defineComponent, ref} from "vue"
import GenericDialog, {createDialogMountingPoint, focusOnModalOnly} from "./GenericDialog.vue"
import ContactDialog from "./ContactDialog.vue"


export default defineComponent({
    name: "ContactDialog",
    components: {
        GenericDialog
    },

    setup() {
        const amount = ref(10)

        const dialogAppeared = () => {
            //do nothing
        }

        return { amount, dialogAppeared }
    },

    methods: {
        async ok() {
            const genericDialog = this.$refs.genericDialog as unknown as typeof GenericDialog
            genericDialog.close()

            const emailBody = (this.$refs.message as HTMLTextAreaElement).value
            const url = "/api/email"
            // await axios.post(url, { emailBody })
            //     .then(response => console.log(response));
        },

        cancel() {
            const genericDialog = this.$refs.genericDialog as unknown as typeof GenericDialog
            genericDialog.close()
        }
    }
})


export function openContactDialog(): void {
    createApp(ContactDialog).mount(createDialogMountingPoint())
    focusOnModalOnly(".contact-dialog")
}

</script>

<style lang="scss" scoped>

.contact-dialog-content {
    padding: 2em;

    .dialog-content {
        width: 40vw;
        min-width: 20em;
        display: flex;
        flex-direction: column;

        .message {
            height: 15em;
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
