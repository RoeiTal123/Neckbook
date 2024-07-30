<template>
    <section class="videos-page">
        <SideNavbar />
        <div v-if="!paths[1]" class="container">
            <div class="video-post-list">
                <PostList :posts="posts" />
            </div>
        </div>
        <router-view></router-view>
    </section>
</template>

<script>
import SideNavbar from '../components/SideNavbar.vue';
import PostList from '../components/PostList.vue';
import { postService } from '../services/postService';
export default {

    data() {
        return {
            paths: [],
            user: {},
            posts: []
        }
    },
    methods: {
        updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path;
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            if (this.paths[0] !== 'videos') {
                this.render = true
            }
            // console.log(this.paths)
        },
        async updateUser() {
            this.user = await userService.getLoggedinUser()
        },
        async retrievePosts() {
            this.posts = []
            if(this.user){
                const allPosts = await postService.query()
                for (let post of allPosts){
                    if(postService.isVideoPost(post)) this.posts.push ({...post})
                }
            }
        }
    },
    components: {
        SideNavbar,
        PostList
    },
    async created() {
        this.updateRoutes()
        this.updateUser().then(() => this.retrievePosts())
    }
}
</script>

<style lang="scss"></style>