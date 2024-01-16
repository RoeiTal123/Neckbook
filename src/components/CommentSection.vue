<template>
    <div class="comment-section">
        comments
    </div>
</template>

<script>
export default {
    props: {
        comments: {
            type: Array,
            required: true
        }
    }
}
</script>

<style lang="scss">
.comment-section {
    display: flex;
    flex-direction: column;
    padding: 0.75em 1em;
}
</style>