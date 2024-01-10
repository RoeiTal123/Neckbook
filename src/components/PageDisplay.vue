<template>
    <section v-if="paths[0]" class="page-display">
        <div v-if="paths[2]">
            <ProfilePage />
        </div>
        <div v-if="paths[0]==='marketplace'">
            market
        </div>
        <div v-if="paths[0]==='groups'">
            <GroupDisplay />
        </div>
    </section>
</template>

<script>

import ProfilePage from '@/pages/ProfilePage.vue';
import GroupDisplay from './GroupDisplay.vue';
// import Marketplace from '@/pages/Marketplace.vue';

export default {
    data() {
        return {
            paths: []
        }
    }, watch: {
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
    components: {
    ProfilePage,
    GroupDisplay,
    GroupDisplay
},
    created() {
        this.updateRoutes()
    }
}
</script>

<style lang="scss">
.page-display {
    flex: 1;
    background-color: #f0f2f5;
}
</style>