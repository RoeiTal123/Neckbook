<template>
    <section v-if="paths[0]" class="page-display" id="page-display">
        <div v-if="paths[0]==='profile' || paths[0]==='friends'">
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

import ProfilePage from '../pages/ProfilePage.vue';
import GroupDisplay from './GroupDisplay.vue';
// import Marketplace from '../pages/Marketplace.vue';

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
@media (max-width:600px){
    .page-display{
        flex: 0;
        width: 100%;
        position: absolute;
        left: 100%;
        transition: all 0.5s ease-in-out;
    }
    .show{
        left: 0%;
    }
}
</style>