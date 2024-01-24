<template>
    <section class="main-page-center">
        <div v-if="user" class="post-creation">
            <div class="header">
                <img :src="user.avatar" />
                <RouterLink to="/main/post"><span>Whats on your mind, {{ user.fullName }}?</span></RouterLink>
            </div>
            <div class="user-actions">
                <div class="user-action">
                    <img
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703946502/projects/Neckbook/svg%20images/Ivw7nhRtXyo_et9veu.png" />
                    <span>Photo/Video</span>
                </div>
            </div>
        </div>
        <PostList :posts="posts" />
    </section>
</template>

<script>
import { RouterLink } from 'vue-router';
import { userService } from '../services/userService';
import PostList from './PostList.vue';

export default {
    props: {
        posts: {
            type: Array,
            required: true
        }
    }, data() {
        return {
            user: {}
        }
    },
    methods: {
        extractName() {
            if (this.user === undefined) return
            const nameParts = this.user.fullName.split(' ');
            if (nameParts.length > 1) {
                const name = nameParts[0].trim();
                return name;
            } else {
                return this.user.fullName.trim();
            }
        }
    },
    components: {
    PostList,
    RouterLink
},
    async created() {
        this.user = await userService.getLoggedinUser()
    }
}
</script>

<style lang="scss">
.main-page-center {
    max-width: 44.5em;
    height: 100%;
    flex: 1;
    margin: auto;
    margin-block-start: 1em;
    padding: 0 1em;

    .post-creation {
        display: flex;
        flex-direction: column;
        height: fit-content;
        width: 100%;
        background-color: #ffffff;
        border-radius: 0.5em;
        padding: 0.75em 1em;
        color: #65676B;
        
        .header {
            display: flex;
            align-items: center;
            height: fit-content;
            width: 100%;
            gap: 0.5em;
            border-block-end: 1px solid #e4e6eb;
            padding-block-end: 0.75em;

            a{
                flex: 1;
                height: 2.5em;
                text-decoration: none;
                color: #65676B;
            }

            span {
                display: flex;
                align-items: center;
                flex: 1;
                height: 2.5em;
                border-radius: 3.125em;
                padding-inline-start: 0.75em;
                background-color: #f0f2f5;
            }

            img {
                height: 2.5em;
                width: 2.5em;
                border-radius: 50%;
                object-fit: cover;
            }
        }

        .user-actions {
            display: flex;
            width: 100%;
            padding-block-start: 0.75em;
            justify-content: center;

            .user-action {
                display: flex;
                gap: 0.5em;

                img {
                    height: 1.5em;
                    width: 1.5em;
                }
            }
        }
    }
}

@media (max-width:675px) {
    .main-page-center {
        padding: 0;
    }
}
</style>