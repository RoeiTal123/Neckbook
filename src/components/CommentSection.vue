<template>
    <div v-if="comments" class="comment-section">
        <div class="comment-container" v-for="comment in comments">
            <CommentPreview :comment="comment"/>
        </div>
    </div>
</template>

<script>
import CommentPreview from './CommentPreview.vue';

export default {
    props: {
        comments: {
            type: Array,
            required: true
        }
    },
    components:{
        CommentPreview
    },
    created(){
        // console.log(this.comments)
    }
}
</script>

<style lang="scss">
.comment-section {
    display: flex;
    flex-direction: column;
    padding-inline: 1em;
    padding-block-start: 0.75em;

    .comment-container{
        margin-block-end: 0.5em;
    }
}
</style>