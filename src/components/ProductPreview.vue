<template>
    <section v-if="product" class="product">
        <RouterLink :to="`marketplace/product/${product._id}`">
            <img :src="product.imgUrls[0]" />
            <span>{{ product.price ? product.price : 'Free' }}</span>
            <span>{{ product.name ? product.name : 'name' }}</span>
            <span v-if="product.location">{{ product.location }}</span>
        </RouterLink>
    </section>
</template>

<script>
export default {
    props: {
        product: {
            type: Object,
            required: false
        }
    },
    created() {
        // console.log(this.product)
    }
}
</script>

<style lang="scss">
.product {
    a {

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 0.75em;
        color: #000000;
        text-decoration: none;

        img {
            width: 100%;
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: 0.5em;
        }
    }
}
</style>