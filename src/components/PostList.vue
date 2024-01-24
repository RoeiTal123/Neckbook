<template>
    <ul v-if="posts && posts.length !== 0" class="post-list">
        <li v-for="post in posts" :key="post._id">
            <PostPreview :post="post" />
        </li>
    </ul>
    <div v-else>
        no posts
    </div>
</template>

<script>
import PostPreview from './PostPreview.vue';
export default {
    props: {
        posts: {
            type: Array,
            required: false
        }
    },
    components: {
        PostPreview
    }
}
</script>

<style lang="scss">
.display-container {
    position: relative;
    top: -132px;
    width: 100%;
    max-height: 850px;

    .mini-container{
        height: fit-content;
        max-height: 650px;
        overflow: scroll;
    }

}
</style>