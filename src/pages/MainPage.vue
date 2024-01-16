<template>
    <section class="main-page">
        <section class="sticky">
            <UserOptions />

            <MainPageCenter :posts="posts" />

            <UserContacts />
        </section>
    </section>
</template>

<script>
import UserOptions from '../components/UserOptions.vue'
import MainPageCenter from '../components/MainPageCenter.vue'
import UserContacts from '../components/UserContacts.vue'
import { postService } from '../services/postService'
import { groupService } from '../services/groupService'

export default {
    data() {
        return {
            posts: []
        }
    },
    components: {
        UserOptions,
        MainPageCenter,
        UserContacts
    },
    async created() {
        this.posts = await postService.query()
    }
}
</script>

<style lang="scss">
.main-page {
    .sticky {
        display: flex;
        justify-content: space-between;
        background-color: #f0f2f5;
        position: sticky;
        top: 0;
    }
}
</style>