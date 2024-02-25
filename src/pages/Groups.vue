<template>
    <section class="groups-page">
        <SideNavbar />
        <div v-if="!paths[1]" class="container">
            <div class="group-post-list">
                <PostList :posts="posts" />
            </div>
        </div>
        <router-view></router-view>
    </section>
</template>

<script>
import SideNavbar from '../components/SideNavbar.vue';
import PageDisplay from '../components/PageDisplay.vue';
import { groupService } from '../services/groupService';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import PostList from '../components/PostList.vue';

export default {
    data() {
        return {
            paths: [],
            user: {},
            posts: []
        }
    },
    watch: {
        $route(to, from) {
            this.updateRoutes();
        },
    },
    methods: {
        updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path;
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            if (this.paths[0] !== 'groups') {
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
                for (const groupId of this.user.groups) {
                    const group = await groupService.getById(groupId);
                    for (const postId of group.posts) {
                        const post = await postService.getById(postId);
                        this.posts.push({ ...post });
                    }
                }
            }
        }
    },
    components: {
        SideNavbar,
        PageDisplay,
        PostList
    },
    async created() {
        this.updateRoutes()
        this.updateUser().then(() => this.retrievePosts())
    }
}
</script>

<style lang="scss">
.groups-page {
    display: flex;
    flex: 1;
    width: 100%;
    background-color: #ffffff;

    .container {
        display: flex;
        flex: 1;
        justify-content: center;
        background-color: #f0f2f5;

        .group-post-list {
            max-width: 680px;
            margin-block-start: 1em;
        }
    }
}
</style>