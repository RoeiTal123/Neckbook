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
.product-list {
    flex: 1;
    display: grid;
    grid-gap: 0.25em;

    .product-container {
        width: 100%;
        max-width: 300px;
        overflow: hidden;
    }
}

@media (min-width:1800px) {
    .product-list {
        grid-template-columns: repeat(6, 1fr);
    }
}

@media (max-width:1800px) {
    .product-list {
        grid-template-columns: repeat(5, 1fr);
    }
}

@media (max-width:1650px) {
    .product-list {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width:1400px) {
    .product-list {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width:1200px) {
    .product-list {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>