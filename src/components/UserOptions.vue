<template>
    <section class="main-page-user-options">
        <div class="option-list">
            <RouterLink :to="`/profile/${user._id}`">
                <div class="option"><img :src="user.avatar" class="profile" /><span>{{ user.fullName }}</span></div>
            </RouterLink>
            <RouterLink to="/friends">
                <div class="option"><img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704015441/projects/Neckbook/svg%20images/e_dewf5s.png" /><span>Find friends</span></div>
            </RouterLink>
            <RouterLink to="/groups">
                <div class="option"><img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704015371/projects/Neckbook/svg%20images/output_k05frw.png" /><span>Groups</span></div>
            </RouterLink>
            <RouterLink to="/videos">
                <div class="option"><img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704015387/projects/Neckbook/svg%20images/b_d3awju.png" /><span>Videos</span></div>
            </RouterLink>
            <RouterLink to="/marketplace">
                <div class="option"><img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704015391/projects/Neckbook/svg%20images/c_v5juuh.png" /><span>Marketplace</span></div>
            </RouterLink>
            <RouterLink to="/messenger">
                <div class="option"><img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704013666/projects/Neckbook/svg%20images/Facebook_Messenger_logo_2020.svg_mj3lou.png" /><span>Messenger</span></div>
            </RouterLink>
            <RouterLink to="/games">
                <div class="option"><img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704188464/projects/Neckbook/svg%20images/video-game_memlwj.png" /><span>Playgame</span></div>
            </RouterLink>
        </div>
    </section>
</template>

<script>
import { userService } from '../services/userService';

export default {
    data() {
        return {
            user: {}
        }
    },
    async created() {
        this.user = await userService.getLoggedinUser()
    }
}
</script>

<style lang="scss">
</style>