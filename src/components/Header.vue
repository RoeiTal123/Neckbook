<template>
    <nav class="app-header">
        <div class="main-header">
            <div class="header-left">
                <RouterLink to="/main">
                    <img
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703779937/projects/Neckbook/Neckbook-logo_iil57x.png" />
                </RouterLink>
                <div class="full-search">
                    <SvgIcon :iconName="'search'" />
                    <input class="search" placeholder="Search Neckbook" />
                </div>
            </div>
            <div class="header-middle">
                <div v-for="link in links" :key="link" class="link" :class="{ 'active-link': paths[0] === link }">
                    <RouterLink :to="`/${link}`">
                        <SvgIcon :iconName="link" :active="paths[0] === link" />
                    </RouterLink>
                </div>
            </div>
            <div class="header-right">

                <div class="link" :class="(paths[0] === 'menu') ? 'active-link hovered-area' : 'hovered-area'">
                    <SvgIcon :iconName="'menu'" :active="paths[0] === 'menu'" />
                </div>

                <div class="link" :class="(paths[0] === 'messenger') ? 'active-link hovered-area' : 'hovered-area'">                   
                    <RouterLink class="hovered-area" :to="'/messenger'">
                        <SvgIcon :iconName="'messenger'" :active="paths[0] === 'messenger'" />
                    </RouterLink>
                </div>
                <div class="link" :class="(paths[0] === 'notification') ? 'active-link hovered-area' : 'hovered-area'"> 
                    <SvgIcon :iconName="'notification'" :active="paths[0] === 'notification'" />
                </div>

                <!-- <div v-for="link in links2" :key="link" class="link" :class="{ 'active-link': paths[0] === link }">
                    <RouterLink class="hovered-area" :to="`/${link}`">
                        <SvgIcon :iconName="link" :active="paths[0] === link" />
                    </RouterLink>
                </div> -->

                <RouterLink :to="`/profile/${user._id}`">
                    <img :src="user.avatar" />
                </RouterLink>
            </div>
        </div>
        <div class="navbar">
            <div class="header-middle">
                <div v-for="link in links" :key="link" class="link" :class="{ 'active-link': paths[0] === link }">
                    <RouterLink :to="`/${link}`">
                        <SvgIcon :iconName="link" :active="paths[0] === link" />
                    </RouterLink>
                </div>
            </div>
        </div>
    </nav>
    <div v-if="paths[paths.length - 1] === 'post' || paths[paths.length - 2] === 'post'">
        <PostAddition />
    </div>
    <div v-if="paths[paths.length - 2] === 'post-preview'">
        <PostDisplay />
    </div>
</template>

<script>
import SvgIcon from './SvgIcon.vue'
import PostAddition from './PostAddition.vue'
import PostDisplay from './PostDisplay.vue'

import { userService } from '../services/userService'

export default {
    data() {
        return {
            links: ['main', 'friends', 'videos', 'marketplace', 'groups'],
            links2: ['menu', 'messenger', 'notification'],
            user: {},
            page: 'home',
            paths: [],
        }
    },
    components: {
        SvgIcon,
        PostAddition,
        PostDisplay
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
            // console.log(this.paths)
        }
    },
    async created() {
        this.user = await userService.getLoggedinUser()
    }
}
</script>

<style lang="scss"></style>