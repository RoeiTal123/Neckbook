<template>
    <div v-if="user" class="post-creation">
        <div class="interactable">
            <img v-if="user.avatar" :src="user.avatar" />
            <img v-else src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708621438/projects/Neckbook/website-images/user_eqfe6m.png" />
            <RouterLink :to="`${fullPath}/post`"><span class="hovered-area">Whats on your mind<span class="name">, {{ user.fullName }}</span>?</span></RouterLink>
        </div>
        <div class="user-actions">
            <RouterLink class="user-action" :to="`${fullPath}/post`">
                <img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707153072/projects/Neckbook/svg%20images/live-video_m89qre.png" />
                <span>Live video</span>
            </RouterLink>
            <RouterLink class="user-action" :to="`${fullPath}/post`">
                <img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703946502/projects/Neckbook/svg%20images/Ivw7nhRtXyo_et9veu.png" />
                <span>Photo/video</span>
            </RouterLink>
            <RouterLink class="user-action" :to="`${fullPath}/post`">
                <img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096277/projects/Neckbook/svg%20images/smile_2_ytwacf.png" />
                <span>Feeling/activity</span>
            </RouterLink>
            <!-- <div class="user-action">
            </div> -->
        </div>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';

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
    },
    components: { RouterLink }
}
</script>

<style lang="scss">

</style>