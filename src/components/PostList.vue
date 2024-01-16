<template>
    <!-- <div v-if="isDisplayMode" class="display-container">
        <div class="blur">bread</div>
        <div class="mini-container">
            <PostDisplay :postId="displayedPostId" :userId="userId" />
        </div>
    </div> -->
    <ul v-if="posts.length !== 0" class="post-list">
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
import PostDisplay from './PostDisplay.vue';
export default {
    props: {
        posts: {
            type: Array,
            required: false
        }
    },
    components: {
        PostPreview,
        PostDisplay
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