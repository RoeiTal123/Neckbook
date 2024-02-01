<template>
    <section class="main-page-user-contacts">
        <div class="header">
            <span class="title">Contacts</span>
            <div class="actions">
                <SvgIcon :iconName="'search'" />
                <SvgIcon :iconName="'options'" />
            </div>
        </div>
        <div class="contact-list">
            <div v-for="contact in contacts" class="contact">
                <img :src="contact.avatar" />
                <span>{{ contact.fullName }}</span>
            </div>
        </div>
    </section>
</template>

<script>
import { userService } from '../services/userService';

import SvgIcon from './SvgIcon.vue';

export default {
    data() {
        return {
            user: {},
            contacts: []
        }
    },
    methods: {
        async updateFriends() {
            for (const id of this.user.friends) {
                const contact = await userService.getById(id)
                this.contacts.push(contact)
            }
        }
    },
    components: {
        SvgIcon
    },
    async created() {
        this.user = await userService.getLoggedinUser()
        this.updateFriends()
    }
}
</script>

<style lang="scss">

</style>