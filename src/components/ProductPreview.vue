<template>
    <section class="product">
        <img :src="product.imgUrls[0]"/>
        <span>{{ product.price ? product.price : 'Free' }}</span>
        <span>{{ product.name ? product.name : 'name'}}</span>
        <span v-if="product.location">{{ product.location }}</span>
    </section>
</template>

<script>
    export default {
        props:{
            product:{
                type: Object,
                required: false
            }
        },
        created(){
            console.log(this.product)
        }
    }
</script>

<style lang="scss">
.product{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.75em;
    img{
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 0.5em;
    }
}
</style>