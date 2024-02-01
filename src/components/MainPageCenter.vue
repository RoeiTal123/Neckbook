<template>
    <section class="main-page-center">
        <div v-if="user && fullPath !== null">
            <PostCreation :user="user" :fullPath="fullPath"/>
        </div>
        <PostList :posts="posts" />
    </section>
</template>

<script>
import { userService } from '../services/userService';

import PostList from './PostList.vue';
import PostCreation from './PostCreation.vue';

export default {
    props: {
        posts: {
            type: Array,
            required: true
        }
    }, data() {
        return {
            user: {},
            paths: [],
            fullPath: null
        }
    },
    methods: {
        updateRoutes() {
            this.paths = []
            this.fullPath = null
            const currentPath = this.$route.path;
            this.fullPath = currentPath
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            // console.log(this.paths)
        },
        extractName() {
            if (this.user === undefined) return
            const nameParts = this.user.fullName.split(' ');
            if (nameParts.length > 1) {
                const name = nameParts[0].trim();
                return name;
            } else {
                return this.user.fullName.trim();
            }
        }
    },
    components: {
        PostList,
        PostCreation
    },
    async created() {
        this.user = await userService.getLoggedinUser()
        this.updateRoutes()
    }
}
</script>

<style lang="scss">

</style>