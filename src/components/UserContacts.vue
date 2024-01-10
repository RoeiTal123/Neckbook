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
import { userService } from '@/services/userService';

import SvgIcon from '../components/SvgIcon.vue';

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
.main-page-user-contacts {
    position: sticky;
    top: 4.75em;
    flex-grow: 1;
    height: 100%;
    max-width: 22.5em;
    min-width: 18.125em;
    padding: 0 0.5em;
    margin-block-start: 1em;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1em;
        padding-block-end: 0.75em;

        .title {
            color: #65676B;
            font-family: 'Helvetica-Bold';
        }

        .actions {
            display: flex;

            i {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 2.25em;
                width: 2.25em;
                padding: 0.5em;
                border-radius: 50%;

            }
        }
    }

    .contact-list {
        display: flex;
        flex-direction: column;
        height: fit-content;
        .contact {
            display: flex;
            align-items: center;
            gap: 0.75em;
            padding-inline-start: 1em;
            img {
                height: 2.25em;
                width: 2.25em;
                border-radius: 50%;
                object-fit: cover;
                margin-block: 0.5em;

            }
        }
    }
}

@media (max-width:900px) {
    .main-page-user-contacts {
        display: none;
    }
}
</style>