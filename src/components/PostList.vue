<template>
    <ul v-if="posts.length!==0" class="post-list">
        <li v-for="post in posts" :key="post._id">
            <PostPreview :post="post"/>
        </li>
    </ul>
    <div v-else>
        no posts
    </div>
</template>

<script>
import PostPreview from '../components/PostPreview.vue';
    export default {
        props:{
            posts:{
                type:Array,
                required:false
            }
        },
        components:{
            PostPreview
        }
    }
</script>

<style lang="scss">

</style>