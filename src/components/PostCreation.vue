<template>
    <div v-if="user" class="post-creation">
        <div class="interactable">
            <img :src="user.avatar" />
            <RouterLink :to="`${fullPath}/post`"><span class="hovered-area">Whats on your mind, {{ user.fullName }}?</span></RouterLink>
        </div>
        <div class="user-actions">
            <div class="user-action">
                <img
                    src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703946502/projects/Neckbook/svg%20images/Ivw7nhRtXyo_et9veu.png" />
                <span>Photo/Video</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        user: {
            type: Object,
            required: true
        },
        fullPath: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss">

</style>