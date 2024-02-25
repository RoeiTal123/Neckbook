<template>
    <section v-if="user" class="profile-page" :class="paths[2] ? 'display' : ''">
        <div class="header">
            <img v-if="user.cover" id="cover" class="cover" :src="user.cover" />
            <img v-else id="cover" class="cover" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704274663/projects/Neckbook/website-images/Persian_Cat_Facts_History_Personality_and_Care___ASPCA_Pet_Health_Insurance___white_Persian_cat_resting_on_a_brown_sofa-min_rgtjby.jpg"/>
        </div>
        <div class="actions">
            <div class="avatar">
                <img v-if="user.avatar" class="avatar-image" :src="user.avatar" />
                <img v-else class="avatar-image" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708621438/projects/Neckbook/website-images/user_eqfe6m.png"/>
                <button v-if="isProfileOfUser">
                    <img class="camera" :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704279211/projects/Neckbook/svg%20images/camera_xe8roi.png'" />
                </button>
            </div>
            <button v-if="isProfileOfUser" class="btn-edit">
                <img class="camera"
                    :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704279211/projects/Neckbook/svg%20images/camera_xe8roi.png'" />
                <span class="text">Edit cover photo</span>
            </button>
        </div>
        <!-- <div class="main">
            <div class="header">
                <div class="details" v-if="user">
                    <span>{{ user.fullName }}</span>
                    <span v-if="user.friends">{{ user.friends.length }} friend{{ user.friends.length > 1 ? 's' : ''
                    }}</span>
                </div>
                <div class="change">
                    <button class="btn-add"><img
                            :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704291239/projects/Neckbook/svg%20images/add_wiwu9t.png'" /><span>Add
                            to story</span></button>
                    <button><img
                            :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704290940/projects/Neckbook/svg%20images/pencil_ozev60.png'" /><span>Edit
                            profile</span></button>
                    <button><img
                            :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704290751/projects/Neckbook/svg%20images/arrow_up_pmi42u.png'" /></button>
                </div>
            </div>
            <div class="user-details">
                <div class="user-info">

                    <div v-if="user.intro" class="user-intro info">

                        <div class="head">
                            <span class="title">Intro</span>
                        </div>
                        <span>{{ user.intro.bio }}</span>
                        <button>Edit bio</button>
                        <button>Edit details</button>
                        <button>Add features</button>

                    </div>

                    <div class="user-media info">
                        <div class="head">
                            <span class="title">media</span>
                            <button>See all media</button>
                        </div>
                        <div v-if="media" class="media-container">
                            <div v-for="photo in media.slice(0, 9)">
                                <img :src="photo" />
                            </div>
                        </div>
                        <span v-else>no media?</span>
                    </div>

                    <div class="user-friends info">
                        <div class="head">
                            <span class="title">Friends</span>
                            <button>See all friends</button>
                        </div>
                        <div v-if="friends" class="friends-container">
                            <RouterLink :to="`/profile/${friend._id}`" v-for="friend in friends.slice(0, 9)"
                                class="friend-container">
                                <img :src="friend.avatar" />
                                <span>{{ friend.fullName }}</span>
                            </RouterLink>
                        </div>
                    </div>

                </div>
                <div class="user-posts">
                    <PostList :posts="posts" />
                </div>
            </div>
        </div> -->

        <div v-if="user && posts && media && friends">
            <SubpageDisplay :pageType="'user'" :media="media" :friends="friends" :posts="posts" :user="user" />
        </div>
    </section>
</template>

<script>
import { postService } from '../services/postService';
import { userService } from '../services/userService';

import PostList from '../components/PostList.vue';
import SubpageDisplay from '../components/SubpageDisplay.vue';
import { toRaw } from 'vue';

export default {
    data() {
        return {
            paths: [],
            user: null,
            posts: null,
            media: null,
            friends: null,
            loggedinUser: null,
            isProfileOfUser: null
        }
    }, watch: {
        $route(to, from) {
            this.updateRoutes()
            if (to.path !== from.path) {
                // console.log('different')
                this.loadData()
            }
        }
    },
    components: {
        PostList,
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
            this.user = null
            let userId 
            if(this.paths[0] !== 'profile'){
                userId = this.paths[2]
            } else {
                userId = this.paths[1]
            }
            console.log(userId)
            this.user = await userService.getById(userId)
        },
        async updatePosts() {
            this.posts = []
            let userId 
            if(this.paths[0] !== 'profile'){
                userId = this.paths[2]
            } else {
                userId = this.paths[1]
            }
            this.posts = await postService.query({ userId: userId })
        },
        updateMedia() {
            this.media = []
            this.posts.forEach(post => {
                this.media.push(...post.mediaUrls);
            })
        },
        async updateFriends() {
            this.friends = []
            for (const friendId of this.user.friends) {
                const friend = await userService.getById(friendId);
                this.friends.push({ _id: friend._id, avatar: friend.avatar, fullName: friend.fullName });
            }
        },
        async setProfileState() {
            this.isProfileOfUser = null
            this.loggedinUser = await userService.getLoggedinUser()
            if(this.loggedinUser){
                this.isProfileOfUser = (this.loggedinUser._id === toRaw(this.user)._id)
            }
        },
        replaceImage() {
            var img = document.getElementById('cover');
            img.src = 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704274663/projects/Neckbook/website-images/Persian_Cat_Facts_History_Personality_and_Care___ASPCA_Pet_Health_Insurance___white_Persian_cat_resting_on_a_brown_sofa-min_rgtjby.jpg'; // Set your alternate image URL here
            img.onerror = null; // Remove the onerror handler to avoid an infinite loop
        },
        loadData() {
            this.updateRoutes()
            if (this.paths[1] !== 'post') {
                this.updateUser().then(() => {
                    this.setProfileState()
                    this.updatePosts().then(() =>
                        this.updateFriends().then(() =>
                            this.updateMedia()
                        )
                    )
                })
            }
        }
    },
    created() {
        this.loadData()
    }
}
</script>

<style lang="scss"></style>