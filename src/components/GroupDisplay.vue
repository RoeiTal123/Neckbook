<template>
    <section class="group-page" :class="paths[2] ? 'display' : ''">
        <div class="header">
            <img id="cover" class="cover" :src="group.coverImgUrl" @error="replaceImage()" />
        </div>

        <!-- <div class="main">
            <div class="header">
                <div class="details" v-if="group">
                    <span>{{ group.name }}</span>
                    <span><img class="state" :src="getGroupStatus()" />{{
                        group.groupType }} group · <span v-if="members.length">{{ members.length }} member{{ members.length
        > 1 ? 's' : '' }}</span></span>

                </div>
                <div class="change">
                    <button class="btn-invite">
                        <img
                            :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704291239/projects/Neckbook/svg%20images/add_wiwu9t.png'" />
                        Invite
                    </button>
                    <button>
                        <SvgIcon iconName="share" />
                        <span>Share</span>
                    </button>
                    <button>
                        <img
                            :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704716979/projects/Neckbook/svg%20images/group-users_1_cylxbp.png'" />
                        <span v-if="members">Join{{ userInGroupState() ? 'ed' : '' }}</span>
                        <img
                            :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704716868/projects/Neckbook/svg%20images/down_1_vwdgs0.png'" />
                    </button>
                    <button>
                        <img
                            :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704290751/projects/Neckbook/svg%20images/arrow_up_pmi42u.png'" />
                    </button>
                </div>
            </div>
            <div class="group-details">
                <div class="group-posts">
                    <PostList :posts="posts" />
                </div>

                <div class="group-info">

                    <div v-if="group.description" class="group-about info">

                        <div class="head">
                            <span class="title">About</span>
                        </div>

                        <span>{{ group.description }}</span>

                        <div class="group-privacy">
                            <img class="state" :src="getGroupStatus2()" />
                            <div class="inner-details">
                                <span>{{ group.groupType }}</span>
                                <span> {{ group.groupType === 'Public' ?
                                    'Anyone can see whos in the group and what they post' :
                                    'Only those in the group can see posts' }}</span>
                            </div>
                        </div>

                        <div class="group-privacy">
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

                    
                </div>
            </div>
        </div> -->

        <!-- <div class="group-media info">
            <div class="head">
                <span class="title">Photos</span>
                <button>See all photos</button>
            </div>
            <div v-if="media" class="media-container">
                <div v-for="eachMedia in media.slice(0, 4)">
                    <div>

                    </div>
                    <img :src="photo" />
                </div>
            </div>
            <span v-else>no photos?</span>
        </div> -->

        <div v-if="user && group && posts && photos && members && media">
            <SubpageDisplay :pageType="'group'" :photos="photos" :members="members" :posts="posts" :user="user"
                :group="group" />
        </div>
    </section>
</template>

<script>
import SvgIcon from './SvgIcon.vue';
import PostList from './PostList.vue';
import SubpageDisplay from '../components/SubpageDisplay.vue';

import { postService } from '../services/postService';
import { userService } from '../services/userService';
import { groupService } from '../services/groupService';

import { toRaw } from 'vue';
import router from '../router';

export default {
    data() {
        return {
            user: {},
            paths: [],
            group: {},
            posts: [],
            photos: [],
            media: [],
            members: []
        }
    }, watch: {
        $route(to, from) {
            this.updateRoutes();
            if (to.path !== from.path) {
                this.loadData()
            }
        }
    },
    components: {
        PostList,
        SvgIcon,
        SubpageDisplay
    },
    methods: {
        updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path;
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            // console.log(this.paths)
        },
        async updateUser() {
            this.user = {}
            this.user = await userService.getLoggedinUser()
        },
        async updateGroup() {
            this.group = {}
            const groupId = this.paths[1];
            this.group = await groupService.getById(groupId)
            console.log(this.group)
        },
        async updatePosts() {
            this.posts = []
            const groupId = this.paths[1];
            this.posts = await postService.query({ groupId: groupId })
        },
        updatePhotos() {
            this.photos = []
            this.posts.forEach(post => {
                this.photos.push(...post.mediaUrls);
            })
        },
        updateMedia() {
            this.media = []
            this.posts.forEach(post => {
                this.media.push(...post.mediaUrls)
            })
        },
        async updateMembers() {
            this.members = []
            for (const memberId of this.group.members) {
                const member = await userService.getById(memberId);
                this.members.push({ _id: member._id, avatar: member.avatar, fullName: member.fullName, isAdmin: member.isAdmin });
            }
        },
        replaceImage() {
            var img = document.getElementById('cover')
            img.src = 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704274663/projects/Neckbook/website-images/Persian_Cat_Facts_History_Personality_and_Care___ASPCA_Pet_Health_Insurance___white_Persian_cat_resting_on_a_brown_sofa-min_rgtjby.jpg'
            img.onerror = null
        },
        userInGroupState() {
            if (toRaw(this.members).length !== 0) {
                if (toRaw(this.members).find((member) => member._id === this.user._id)) {
                    return true
                } else {
                    return false
                }
            }
        },
        isAdmin() {
            if (toRaw(this.group.admins).length !== 0) {
                return toRaw(this.group.admins).find((member) => member._id === this.user._id)
            }
        },
        getGroupStatus() {
            if (this.group.groupType === 'Public') {
                return 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704617619/projects/Neckbook/svg%20images/globe-earth_poypgg.png'
            } else {
                return 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704629589/projects/Neckbook/svg%20images/padlock_cvbysn.png'
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
        goBack() {
            router.go(-1)
            document.getElementById('body').style.overflow = 'auto'
        },
        loadData() {
            this.updateRoutes()
            this.updateUser()
            if (this.paths.length !== 3 || this.paths[0] === 'groups') {
                this.updateGroup().then(() =>
                    this.updatePosts().then(() =>
                        this.updateMembers().then(() => {
                            if (this.userInGroupState()) {
                                this.updatePhotos()
                                this.updateMedia()
                            } else {
                                this.goBack()
                            }
                        })
                    )
                )
            }
        }
    },
    created() {
        this.loadData()
    }
}
</script>

<style lang="scss"></style>