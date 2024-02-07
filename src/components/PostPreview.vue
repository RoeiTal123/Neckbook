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
                <!-- <RouterLink v-if="paths[paths.length - 1] !== post._id" :to="`${getRoutes()}/post/${post._id}`"
                    class="interaction">
                    <SvgIcon :iconName="'options'" />
                </RouterLink> -->
                <div v-if="paths[paths.length - 1] !== post._id" class="interaction" @click="goToEditPost()">
                    <SvgIcon :iconName="'options'" />
                </div>
                <div>
                    <SvgIcon :iconName="'close'" />
                </div>
            </div>
        </div>
        <div class="description">
            {{ post.txt }}
        </div>
        <div v-if="post.mediaUrls" :class="`post-media ${mediaCount()}`">
            <div v-if="post.mediaUrls[0]" class="media-container first-media">
                <video v-if="mediaType(post.mediaUrls[0]) === 'video'" controls>
                    <source :src="post.mediaUrls[0]" type="video/mp4">
                </video>
                <img v-if="mediaType(post.mediaUrls[0]) === 'image'" :src="post.mediaUrls[0]" />
            </div>
            <div v-if="post.mediaUrls[1]" class="media-container second-media">
                <video v-if="mediaType(post.mediaUrls[1]) === 'video'" controls>
                    <source :src="post.mediaUrls[1]" type="video/mp4">
                </video>
                <img v-if="mediaType(post.mediaUrls[1]) === 'image'" :src="post.mediaUrls[1]" />
            </div>
            <div v-if="post.mediaUrls[2]" class="media-container third-media">
                <video v-if="mediaType(post.mediaUrls[2]) === 'video'" controls>
                    <source :src="post.mediaUrls[2]" type="video/mp4">
                </video>
                <img v-if="mediaType(post.mediaUrls[2]) === 'image'" :src="post.mediaUrls[2]" />
            </div>
            <div v-if="post.mediaUrls[3]" class="media-container fourth-media">
                <video v-if="mediaType(post.mediaUrls[3]) === 'video'" controls>
                    <source :src="post.mediaUrls[3]" type="video/mp4">
                </video>
                <img v-if="mediaType(post.mediaUrls[3]) === 'image'" :src="post.mediaUrls[3]" />
            </div>
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
                <RouterLink v-if="(post.comments.length > 0) && zoomLevel < 1"
                    :to="`${getRoutes()}/post-preview/${post._id}`">
                    {{ post.comments.length }} {{ (post.comments.length === 1 ? 'comment' : 'comments') }}
                </RouterLink>
                <RouterLink v-if="(post.comments.length > 0) && zoomLevel >= 1"
                    :to="`${getRoutes()}/post-preview/${post._id}`">
                    {{ post.comments.length }} <img class="small-emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707299201/projects/Neckbook/svg%20images/comments_g8l9e0.png" />
                </RouterLink>
                <span v-if="(post.sharedByUsers.length !== 0) && zoomLevel < 1">{{ post.sharedByUsers.length }}
                    {{ (post.sharedByUsers.length === 1 ? 'share' : 'shares') }}</span>
                <span v-if="(post.sharedByUsers.length !== 0) && zoomLevel >= 1">{{ post.sharedByUsers.length }}
                    <img class="small-emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707299070/projects/Neckbook/svg%20images/forward_1_mgnxu6.png" /></span>
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
import router from '../router';

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
            didLike: null,
            zoomLevel: null
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
            this.updateZoomLevel()
        },
        likePost() {
            this.didLike = !this.didLike
            if (!this.post.likedByUsers.includes(this.loggedinUser._id)) {
                this.post.likedByUsers.push(this.loggedinUser._id)
            } else {
                this.post.likedByUsers = this.post.likedByUsers.filter((id) => id !== this.loggedinUser._id)
            }
            postService.save(this.post)
        },
        goToEditPost() {
            if (toRaw(this.loggedinUser)._id !== toRaw(this.post).ownerId) {
                alert('not your post')
            } else {
                router.push(`${this.getRoutes()}/post/${toRaw(this.post)._id}`)
            }
        },
        mediaCount() {
            return utilService.spellNumber(toRaw(this.post).mediaUrls.length)
        },
        mediaType(mediaUrl){
            const sepMedia=mediaUrl.split('/')
            // console.log(sepMedia[4])
            return sepMedia[4]
        },
        // videoCount() {
        //     return utilService.spellNumber(toRaw(this.post).videoUrls.length)
        // },
        updateZoomLevel() {
            this.zoomLevel = utilService.getZoomLevel()
        }
    },
    components: {
        SvgIcon,
        RouterLink,
        CommentSection
    },
    created() {
        this.loadData()
        window.addEventListener('resize', this.updateZoomLevel)
    },
    unmounted() {
        window.removeEventListener('resize', this.updateZoomLevel)
    }
}
</script>

<style lang="scss"></style>