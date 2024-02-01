<template>
    <section class="product-list">
        <div v-for="product in products" class="product-container">
            <ProductPreview :product="product" />
        </div>
    </section>
</template>

<script>
import ProductPreview from './ProductPreview.vue';

export default {
    props: {
        products: {
            type: Array,
            required: false
        }
    },
    components: {
        ProductPreview
    },
    created() {
        // console.log(this.products)
    }
}
</script>

<style lang="scss">
</style>