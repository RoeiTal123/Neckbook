<template>
    <div class="post-preview" :class="paths[paths.length - 1] === post._id ? 'display' : ''">
        <div class="post-header">
            <RouterLink :to="`/profile/${user._id}`">
                <img :src="user.avatar" />
                <div class="post-details">
                    <span>{{ user.username }}</span>
                    <span>{{ getPostDate() }}</span>
                </div>
            </RouterLink>
            <div>
                <RouterLink v-if="paths[paths.length - 1] !== post._id" :to="`${getRoutes()}/post/${post._id}`"
                    class="interaction">
                    <SvgIcon :iconName="'options'" />
                </RouterLink>
                <div>
                    <SvgIcon :iconName="'close'" />
                </div>
            </div>
        </div>
        <div class="description">
            {{ post.txt }}
        </div>
        <div v-if="!post.videoUrl" class="post-images">
            <div v-if="post.imgUrls.length === 1" class="one-image">
                <img :src="post.imgUrls[0]" @load="loadPreview" />
            </div>

            <div v-if="post.imgUrls.length === 2" class="two-image">
                <img :src="post.imgUrls[0]" />
                <img :src="post.imgUrls[1]" @load="loadPreview" />
            </div>

            <div v-if="post.imgUrls.length === 3" class="three-image">
                <img :src="post.imgUrls[0]" />
                <div>
                    <img :src="post.imgUrls[1]" />
                    <img :src="post.imgUrls[2]" @load="loadPreview" />
                </div>
            </div>

            <div v-if="post.imgUrls.length >= 4" class="four-image">
                <div>
                    <img :src="post.imgUrls[0]" />
                    <img :src="post.imgUrls[1]" />
                </div>
                <div>
                    <img :src="post.imgUrls[2]" />
                    <img :src="post.imgUrls[3]" @load="loadPreview" />
                </div>
            </div>
        </div>
        <div v-else>
            <video width="100%" controls>
                <source :src="post.videoUrl" type="video/mp4">
            </video>
        </div>
        <div class="post-interacted">
            <div>
                <div v-if="post.likedByUsers.length > 0" class="like-count">
                    <SvgIcon :iconName="'like'" />
                    <span v-if="!didLike">{{ post.likedByUsers.length }}</span>
                    <span v-if="didLike && post.likedByUsers.length !== 1">You and {{ post.likedByUsers.length - 1 }}
                        other{{
                            post.likedByUsers.length - 1 !== 1 ? 's' : '' }}</span>
                    <span v-if="didLike && post.likedByUsers.length === 1">You</span>
                    <!-- it shows 20 random names of those that liked it -->
                </div>
                <div v-else>
                    Be the first to like this post!
                </div>
            </div>
            <div class="viewers-interactions">
                <RouterLink v-if="post.comments.length > 0" :to="`${getRoutes()}/post-preview/${post._id}`">
                    {{ post.comments.length }} {{ (post.comments.length === 1 ? 'comment' : 'comments') }}
                </RouterLink>
                <span v-if="post.sharedByUsers.length !== 0">{{ post.sharedByUsers.length }} {{ (post.sharedByUsers.length
                    === 1 ? 'share' : 'shares') }}</span>
            </div>
        </div>
        <div class="post-interactions" :class="paths[paths.length - 1] === post._id ? 'display' : ''">
            <div v-if="!didLike" class="interaction" @click="likePost()">
                <img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1705508387/projects/Neckbook/svg%20images/like_1_dhqvyk.png"
                    class="like" />
                <span>Like</span>
            </div>
            <div v-if="didLike" class="interaction" @click="likePost()">
                <img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1705507993/projects/Neckbook/svg%20images/like_x972xa.png"
                    class="like" />
                <span>Like</span>
            </div>
            <RouterLink v-if="paths[paths.length - 1] !== post._id" :to="`${getRoutes()}/post-preview/${post._id}`"
                class="interaction">
                <SvgIcon :iconName="'comment'" />
                <span>Comment</span>
            </RouterLink>
            <div v-if="paths[paths.length - 1] === post._id" class="interaction">
                <SvgIcon :iconName="'comment'" />
                <span>Comment</span>
            </div>
            <div class="interaction">
                <SvgIcon :iconName="'share'" />
                <span>Share</span>
            </div>
        </div>
        <div v-if="(paths[paths.length - 1] === post._id) && comments.length !== 0">
            <CommentSection :comments="comments" />
        </div>
    </div>
</template>

<script>
import { userService } from '../services/userService';
import { utilService } from '../services/util.service';
import { commentService } from '../services/commentService';
import { postService } from '../services/postService';

import SvgIcon from './SvgIcon.vue';
import CommentSection from './CommentSection.vue';

import { toRaw } from 'vue';
import { RouterLink } from 'vue-router';

export default {
    props: {
        post: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            loggedinUser: {},
            user: {},
            paths: [],
            comments: [],
            didLike: null
        }
    }, watch: {
        $route(to, from) {
            this.updateRoutes()
            if (to.path !== from.path) {
                this.loadData()
            }
            // console.log(to.path !== from.path)
        }
    },
    methods: {
        async setUserData(id) {
            this.loggedinUser = await userService.getLoggedinUser()
            this.user = await userService.getById(id)
            if (this.post.likedByUsers.includes(this.loggedinUser._id)) {
                this.didLike = true
            } else {
                this.didLike = false
            }
        },
        getPostDate() {
            return utilService.timeAgoString(this.post.createdAt)
        },
        getRoutes() {
            let paths = ''
            paths = this.$route.path;
            return paths
        },
        updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path;
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            // console.log(this.paths)
        },
        async setComments() {
            this.comments = []
            for (const commentId of this.post.comments) {
                const comment = await commentService.getById(commentId);
                this.comments.push({ ...comment });
            }
            // console.log('this comments : ',this.comments)
        },
        setBackground() {
            if (this.post.background === 'none') return
        },
        loadData() {
            this.updateRoutes()
            this.setUserData(this.post.ownerId).then(() => this.setComments())
        },
        likePost() {
            this.didLike = !this.didLike
            if (!this.post.likedByUsers.includes(this.loggedinUser._id)) {
                this.post.likedByUsers.push(this.loggedinUser._id)
            } else {
                this.post.likedByUsers = this.post.likedByUsers.filter((id) => id !== this.loggedinUser._id)
            }
            postService.save(this.post)
        }
    },
    components: {
        SvgIcon,
        RouterLink,
        CommentSection
    },
    created() {
        this.loadData()
    }
}
</script>

<style lang="scss"></style>