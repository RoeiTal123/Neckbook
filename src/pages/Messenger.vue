<template>
    <section class="chat-page">
        <SideNavbar />
        <div v-if="!paths[1]" class="no-chat-selected">
            <img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707392170/projects/Neckbook/svg%20images/no-chat-open_jgbi35.png"/>

            <span>No chats selected</span>
        </div>
        <router-view></router-view>
    </section>
</template>

<script>
import SideNavbar from '../components/SideNavbar.vue'
export default {
    data() {
        return {
            paths: []
        }
    },
    watch: {
        $route(to, from) {
            // Your custom logic or function to be executed on each route change
            // console.log('Route is changing from', from.fullPath, 'to', to.fullPath);
            
            // Call your custom function or perform actions here
            this.loadData()
        },
    }, 
    methods: {
        updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path;
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            // console.log(this.paths)
        },
        // async retrieveProducts() {
        //     this.products = []
        //     this.products = await productService.query()
        // },
        loadData() {
            this.updateRoutes()
            // this.retrieveProducts()
        }
    },
    components: {
        SideNavbar
    }, 
    created() {
        this.loadData()
    }
}
</script>

<style lang="scss">
.chat-page{
    display: flex;
    flex: 1;
    .no-chat-selected{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 3em;
        flex: 1;
        border-inline-start: 1px solid #e5e5e5;

        img{
            height: 8.5em;
            width: 8.5em;
        }

        span{
            font-family: "Helvetica-Bold";
            font-size: 18px;
        }
    }
}
</style>