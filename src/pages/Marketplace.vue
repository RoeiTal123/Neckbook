<template>
    <section class="marketplace-page">

        <SideNavbar />

        <div v-if="products.length!==0" class="product-list-container">
            <ProductList :products="products"/>
        </div>
        <!-- <PageDisplay /> -->
        <router-view></router-view>
    </section>
</template>

<script>
import PageDisplay from '../components/PageDisplay.vue';
import ProductList from '../components/ProductList.vue';
import SideNavbar from '../components/SideNavbar.vue';
import SvgIcon from '../components/SvgIcon.vue';
import { productService } from '../services/productService';
export default {
    data() {
        return {
            paths: [],
            products:[]
        }
    },
    components: {
    SvgIcon,
    SideNavbar,
    PageDisplay,
    ProductList
}, watch: {
        $route(to, from) {
            // Your custom logic or function to be executed on each route change
            // console.log('Route is changing from', from.fullPath, 'to', to.fullPath);

            // Call your custom function or perform actions here
            this.updateRoutes();
        },
    }, methods: {
        updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path;
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            // console.log(this.paths)
        },
        async retrieveProducts(){
            this.products=[]
            this.products = await productService.query()
        },
        loadData(){
            this.updateRoutes()
            this.retrieveProducts()
        }
    },
    created() {
        this.loadData()
    }
}
</script>

<style lang="scss">
.marketplace-page {
    display: flex;
    flex: 1;
    width: 100%;
    background-color: #f0f2f5;
    position: relative;

    .product-list-container{
        display: flex;
        flex: 1;
        padding: 2em;
    }
}
</style>