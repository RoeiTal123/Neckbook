<template>
    <div class="sub-page-details">
        <div class="sub-page-info">
            <div v-if="user && fullPath !== null && pageType === 'group'">
                <PostCreation :user="user" :fullPath="fullPath" />
            </div>
            <div v-if="pageType === 'group'" class="sub-page-posts">
                <PostList :posts="posts" />
            </div>
            <div v-if="pageType === 'user'">
                <div v-if="user.intro" class="sub-page-intro info">
                    <div class="head">
                        <span class="title">Intro</span>
                    </div>
                    <span>{{ user.intro.bio }}</span>
                    <button>Edit bio</button>
                    <button>Edit details</button>
                    <button>Add features</button>
                </div>
                <div class="sub-page-photos info">
                    <div class="head">
                        <span class="title">Photos</span>
                        <RouterLink :to="`/${paths[0]}/${paths[1]}/Photos`" :class="{ 'active-link': paths[2] === 'Photos' }">See all photos</RouterLink>
                    </div>
                    <div v-if="media" class="photos-container">
                        <div v-for="file in media.slice(0, 9)">
                            <video v-if="mediaType(file) === 'video' && file.src" width="100%" controls>
                                <source :src="file.src" type="video/mp4">
                            </video>
                            <video v-if="mediaType(file) === 'video' && !file.src" width="100%" controls>
                                <source :src="file" type="video/mp4">
                            </video>
                            <img v-if="mediaType(file) === 'image' && file.src" :src="file.src" />
                            <img v-if="mediaType(file) === 'image' && !file.src" :src="file" />
                        </div>
                    </div>
                    <span v-else>no media?</span>
                </div>
                <div class="sub-page-friends info">
                    <div class="head">
                        <span class="title">Friends</span>
                        <RouterLink :to="`/${paths[0]}/${paths[1]}/Friends`" :class="{ 'active-link': paths[2] === 'Friends' }">See all friends</RouterLink>
                    </div>
                    <div v-if="friends" class="friends-container">
                        <RouterLink :to="`/profile/${friend._id}`" v-for="friend in friends.slice(0, 9)"
                            class="friend-container">
                            <img v-if="friend.avatar" :src="friend.avatar" />
                            <img v-else
                                src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708621438/projects/Neckbook/website-images/user_eqfe6m.png" />
                            <span>{{ friend.fullName }}</span>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
        <div class="sub-page-about info" v-if="group && group.description && pageType === 'group'">
            <div class="head">
                <span class="title">About</span>
            </div>
            <span>{{ group.description }}</span>
            <div class="sub-page-privacy">
                <img class="state" :src="getGroupStatus2()" />
                <div class="inner-details">
                    <span>{{ group.groupType }}</span>
                    <span> {{ group.groupType === 'Public' ?
                        'Anyone can see whos in the group and what they post' :
                        'Only those in the group can see posts' }}</span>
                </div>
            </div>

            <div class="sub-page-privacy">
                <img class="state" :src="getGroupStatus3()" />
                <div class="inner-details">
                    <span>{{ group.groupType === 'Public' ? 'Visible' : 'Private' }}</span>
                    <span> {{ group.groupType === 'Public' ?
                        'Anyone can see this group' :
                        'Only those invited cab join this group' }}</span>
                </div>
            </div>
            <button>Learn more</button>
        </div>

        <div v-if="pageType === 'user'" class="sub-page-posts">
            <div v-if="user && fullPath !== null && pageType === 'user'">
                <PostCreation :user="user" :fullPath="fullPath" />
            </div>
            <PostList :posts="posts" />
        </div>
    </div>
</template>

<script>
import PostList from '../components/PostList.vue';
import PostCreation from '../components/PostCreation.vue';
import SvgIcon from './SvgIcon.vue';

import { toRaw } from 'vue';
import { userService } from '../services/userService';

export default {
    props: {
        pageType: { //both
            type: String,
            required: true
        },
        media: { //both
            type: Array,
            required: false
        },
        posts: { //both
            type: Array,
            required: false
        },
        pageType:{
            type: String,
            required: true
        },
        fullPath:{
            type: String,
            required: true
        },
        user: {  //profile
            type: Object,
            required: false
        },
        friends: { //profile
            type: Array,
            required: false
        },
        group: {  //group
            type: Object,
            required: false
        },
        members: { //group
            type: Array,
            required: false
        }
    },
    data() {
        return {
            paths: []
        }
    },
    watch: {
        $route(to, from) {
            this.updateRoutes();
            // console.log(to.path,' ',from.path)
            if (to.path !== from.path) {
                this.loadData()
            }
        }
    },
    components: {
        PostList,
        PostCreation,
        SvgIcon
    },
    methods: {
        updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path;
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            // console.log(this.paths)
        },
        userInGroupState() {
            if (toRaw(this.members).length !== 0) {
                return toRaw(this.members).find((member) => member._id === this.user._id)
            }
        },
        isAdmin() {
            if (toRaw(this.group.admins).length !== 0) {
                return toRaw(this.group.admins).find((member) => member._id === this.user._id)
            }
        },
        getGroupStatus2() {
            if (this.group.groupType === 'Public') {
                return 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704802966/projects/Neckbook/svg%20images/globe-earth_1_fzgrkz.png'
            } else {
                return 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704802970/projects/Neckbook/svg%20images/padlock_1_fqravs.png'
            }
        },
        getGroupStatus3() {
            if (this.group.groupType === 'Public') {
                return 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704802968/projects/Neckbook/svg%20images/eye_xqgfyt.png'
            } else {
                return 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704803460/projects/Neckbook/svg%20images/restriction_wxosu6.png'
            }
        },
        mediaType(mediaUrl) {
            const sepMedia = mediaUrl.split('/')
            return sepMedia[4]
        }
    },
    created() {
        this.updateRoutes()
    }
}
</script>

<style lang="scss"></style>