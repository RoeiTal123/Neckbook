<template>
    <section class="product-display">
        <div class="product-images-display">
            <div v-if="product.imgUrls" class="image-container">
                <img :src="product.imgUrls[0]" />
            </div>
        </div>
        <div class="product-actions">
            <div>
                <div class="header">
                    <span class="name">{{ product.name }}</span>
                    <span class="price">{{ product.price }}</span>
                    <span class="time">Listed {{ convertToSimpleTime(product.listedAt) }} in {{ product.location ?
                        product.location : 'somewhere' }}</span>
                    <div class="actions">
                        <button class="message"><img
                                src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704900790/projects/Neckbook/svg%20images/messenger_qu7sun.png" />
                            <span>Message</span></button>
                        <button><img
                                src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704900790/projects/Neckbook/svg%20images/bookmark_bkbr19.png" /></button>
                        <button><img
                                src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704901918/projects/Neckbook/svg%20images/forward_g7djzd.png" /></button>
                        <button>
                            <SvgIcon :iconName="'options'" />
                        </button>
                    </div>
                </div>
                <div class="description">
                    <span>Seller' description</span>
                    <p>{{ product.description }}</p>
                </div>
                <div v-if="seller" class="seller-information">
                    <div class="title"><span>Seller information</span></div>
                    <div><img :src="seller.avatar" /><span>{{ seller.fullName }}</span></div>
                    <div><img class="logo"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703779937/projects/Neckbook/Neckbook-logo_iil57x.png" />
                        <span>Joined Neckbook in {{ getFullYear(seller.createdAt) }}</span>
                    </div>
                </div>
            </div>
            <div class="contact-seller">
                <div><img
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704013666/projects/Neckbook/svg%20images/Facebook_Messenger_logo_2020.svg_mj3lou.png" /><span>Send
                        seller a message</span></div>
                <input class="send-message" type="text" placeholder="Send a private message..." />
                <button>Send</button>
            </div>
        </div>
    </section>
</template>

<script>
import { utilService } from '../services/util.service';
import { productService } from '../services/productService';
import { userService } from '../services/userService';

import SvgIcon from './SvgIcon.vue';

import { toRaw } from 'vue';

export default {
    data() {
        return {
            paths: [],
            product: {},
            seller: {},
        }
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
        },
        async getProduct() {
            this.product = await productService.getById(this.paths[2])
        },
        async getSeller() {
            this.seller = await userService.getById(toRaw(this.product).ownerId)
        },
        convertToSimpleTime(timestamp) {
            return utilService.timeAgoString(timestamp)
        },
        getFullYear(timestamp) {
            const date = new Date(timestamp)
            return date.getFullYear()
        }
    },
    components: {
        SvgIcon
    },
    created() {
        this.updateRoutes()
        this.getProduct().then(() => this.getSeller())

    }
}
</script>

<style lang="scss"></style>