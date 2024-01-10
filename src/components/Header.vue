<template>
    <nav class="app-header">
        <div class="main-header">
            <div class="header-left">
                <RouterLink to="/main">
                    <img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703779937/projects/Neckbook/Neckbook-logo_iil57x.png"/>
                </RouterLink>
                <div class="full-search">
                    <SvgIcon :iconName="'search'" />
                    <input class="search" placeholder="Search Neckbook"/>
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
                <div v-for="link in links2" :key="link" class="link" :class="{ 'active-link': paths[0] === link }">
                    <RouterLink :to="`/${link}`">
                        <SvgIcon :iconName="link" :active="paths[0] === link" />
                    </RouterLink>
                </div>
                <RouterLink :to="`/profile/${user._id}`">
                    <img :src="user.avatar"/>
                </RouterLink>
            </div>
        </div>
            <div class="navbar">
            <div class="header-middle">
            <div v-for="link in links" :key="link" class="link" :class="{ 'active-link': paths[0] === link }">
                <RouterLink :to="`/${link}`">
                    <SvgIcon :iconName="link" :active="paths[0] === `/${link}`" />
                </RouterLink>
            </div>
        </div>
    </div>
</nav>
</template>

<script>
import SvgIcon from './SvgIcon.vue'
import { userService } from '@/services/userService'

    export default {
    data() {
        return {
            links: ['main', 'friends', 'videos', 'marketplace', 'groups'],
            links2:['menu','messenger','notification'],
            user:{},
            page:'home',
            paths: [],
        }
    },
    components: { SvgIcon },
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
    async created(){
        this.user = await userService.getLoggedinUser()
    }
}
</script>

<style lang="scss">

</style>