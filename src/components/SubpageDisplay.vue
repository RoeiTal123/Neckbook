<template>
    <div class="main" :class="pageType === 'user' ? 'profile' : '' ">
        <div v-if="pageType === 'user'" class="user-header">
            <div class="details" >
                <span>{{ user.fullName }}</span>
                <span v-if="user.friends">{{ user.friends.length }} friend{{ user.friends.length > 1 ? 's' : '' }}</span>
            </div>
            <div class="change" v-if="pageType === 'user'">
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
        <div v-if="pageType === 'group'" class="group-header">
            <div class="details" >
                <span>{{ group.name }}</span>
                <span><img class="state" :src="getGroupStatus()" />{{
                    group.groupType }} group · <span v-if="members.length">{{ members.length }} member{{ members.length > 1
        ? 's' : '' }}</span></span>
            </div>
            <div class="change">
                <button class="btn-invite">
                    <img
                        :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704291239/projects/Neckbook/svg%20images/add_wiwu9t.png'" />
                    <span>Invite</span>
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
        <div class="sub-page-details">
            <div class="sub-page-info">
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
                            <button>See all photos</button>
                        </div>
                        <div v-if="photos" class="photos-container">
                            <div v-for="photo in photos.slice(0, 9)">
                                <img :src="photo" />
                            </div>
                        </div>
                        <span v-else>no photos?</span>
                    </div>

                    <div class="sub-page-friends info">
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
            </div>
            <div class="sub-page-about info" v-if="group && group.description && pageType === 'group'" >

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
            <!-- <div class="sub-page-media info">
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
            <div v-if="pageType === 'user'" class="sub-page-posts">
                <PostList :posts="posts" />
            </div>
        </div>
    </div>
</template>

<script>
import PostList from '../components/PostList.vue';
import SvgIcon from './SvgIcon.vue';

import { toRaw } from 'vue';

export default {
    props: {
        pageType: { //both
            type: String,
            required: true
        },
        photos:{ //both
            type: Array,
            required: false
        },
        posts:{ //both
            type: Array,
            required: false
        },
        user:{  //profile
            type: Object,
            required: false
        },
        friends:{ //profile
            type: Array,
            required: false
        },
        group:{  //group
            type: Object,
            required: false
        },
        members:{ //group
            type: Array,
            required: false
        }
    },
    components:{
        PostList,
        SvgIcon
    },
    methods:{
        replaceImage() {
            var img = document.getElementById('cover')
            img.src = 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704274663/projects/Neckbook/website-images/Persian_Cat_Facts_History_Personality_and_Care___ASPCA_Pet_Health_Insurance___white_Persian_cat_resting_on_a_brown_sofa-min_rgtjby.jpg'
            img.onerror = null
        },
        userInGroupState() {
            if(toRaw(this.members).length!==0){
                return toRaw(this.members).find((member)=>member._id===this.user._id)
            }
        },
        isAdmin(){
            if(toRaw(this.group.admins).length!==0){
                return toRaw(this.group.admins).find((member)=>member._id===this.user._id)
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
        }
    }
}
</script>

<style lang="scss"></style>