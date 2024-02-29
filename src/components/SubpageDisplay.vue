<template>
    <div class="main" :class="pageType === 'user' ? 'profile' : ''">
        <div v-if="pageType === 'user'" class="user-header">
            <div class="details">
                <span>{{ user.fullName }}</span>
                <span v-if="user.friends">{{ user.friends.length }} friend{{ user.friends.length > 1 ? 's' : '' }}</span>
            </div>
            <div class="change" v-if="pageType === 'user' && isProfileOfUser !== null">
                <!-- own profile -->
                <button v-if="isProfileOfUser" class="btn-add">
                    <img
                        :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704291239/projects/Neckbook/svg%20images/add_wiwu9t.png'" />
                    <span>Add to story</span>
                </button>
                <button v-if="isProfileOfUser">
                    <img
                        :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704290940/projects/Neckbook/svg%20images/pencil_ozev60.png'" />
                    <span>Edit profile</span>
                </button>
                <button v-if="isProfileOfUser">
                    <img
                        :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704290751/projects/Neckbook/svg%20images/arrow_up_pmi42u.png'" />
                </button>
                <!-- other' profile -->
                <button v-if="!isProfileOfUser" class="btn-add" @click="changeFriendrequestStatus()">
                    <img
                        :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1707231826/projects/Neckbook/svg%20images/add-friend_2_xkmuge.png'" />
                    <span v-if="confirmFriend()">friends</span>
                    <span v-if="!confirmFriend() && (typeOfRequest() === 'none' || (typeOfRequest() === 'denied'))">Add
                        friend</span>
                    <span v-if="!confirmFriend() && typeOfRequest() === 'received'">Accept friend</span>
                    <span v-if="!confirmFriend() && typeOfRequest() === 'sent'">Request sent</span>
                </button>
                <button v-if="!isProfileOfUser">
                    <img
                        :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704900790/projects/Neckbook/svg%20images/messenger_qu7sun.png'" />
                    <span>Message</span>
                </button>
                <button v-if="!isProfileOfUser">
                    <img
                        :src="'https://res.cloudinary.com/dqk28z6rq/image/upload/v1706446065/projects/Neckbook/svg%20images/avatar_hs3gdb.png'" />
                    <span>View profile</span>
                </button>
            </div>
        </div>
        <div v-if="pageType === 'group'" class="group-header">
            <div class="details">
                <span>{{ group.name }}</span>
                <span>
                    <img class="state" :src="getGroupStatus()" />
                    {{ group.groupType }} group ·
                    <span v-if="members.length">{{ members.length }} member{{ members.length > 1 ? 's' : '' }}</span>
                </span>
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
        <div class="sub-page-navbar">
            <div v-if="pageType === 'user' && !isInFriends" class="sub-navbar">
                <RouterLink :to="`/${paths[0]}/${paths[1]}`" :class="{ 'active-link': !paths[2] }">Posts</RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/About`" :class="{ 'active-link': paths[2] === 'About' }">About
                </RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/Friends`" :class="{ 'active-link': paths[2] === 'Friends' }">
                    Friends</RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/Photos`" :class="{ 'active-link': paths[2] === 'Photos' }">Photos
                </RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/Videos`" :class="{ 'active-link': paths[2] === 'Videos' }">Videos
                </RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/Checkins`" :class="{ 'active-link': paths[2] === 'Checkins' }">
                    Check-ins</RouterLink>
            </div>

            <div v-if="pageType === 'user' && isInFriends" class="sub-navbar">
                {{ `/${paths[0]}/${paths[1]}/${paths[2]}` }}
                <RouterLink :to="`/${paths[0]}/${paths[1]}/${paths[2]}`" :class="{ 'active-link': !paths[2] }">Posts</RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/${paths[2]}/About`" :class="{ 'active-link': paths[2] === 'About' }">About
                </RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/${paths[2]}/Friends`" :class="{ 'active-link': paths[2] === 'Friends' }">
                    Friends</RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/${paths[2]}/Photos`" :class="{ 'active-link': paths[2] === 'Photos' }">Photos
                </RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/${paths[2]}/Videos`" :class="{ 'active-link': paths[2] === 'Videos' }">Videos
                </RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/${paths[2]}/Checkins`" :class="{ 'active-link': paths[2] === 'Checkins' }">
                    Check-ins</RouterLink>
            </div>

            <div v-if="pageType === 'group'" class="sub-navbar">
                <RouterLink :to="`/${paths[0]}/${paths[1]}`" :class="{ 'active-link': !paths[2] }">Discussion</RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/Featured`" :class="{ 'active-link': paths[2] === 'Featured' }">
                    Featured</RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/People`" :class="{ 'active-link': paths[2] === 'People' }">People
                </RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/Events`" :class="{ 'active-link': paths[2] === 'Events' }">Events
                </RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/Media`" :class="{ 'active-link': paths[2] === 'Media' }">Media
                </RouterLink>
                <RouterLink :to="`/${paths[0]}/${paths[1]}/Files`" :class="{ 'active-link': paths[2] === 'Files' }">Files
                </RouterLink>
            </div>

            <div class="hovered-area">
                <SvgIcon :iconName="'options'" />
            </div>
        </div>
        <div v-if="whatToDisplay === 'posts' || whatToDisplay === 'discussion'" class="sub-page-details">
            <SubpagePosts :user="user" :fullPath="fullPath" :posts="posts" :pageType="pageType" :media="media"
                :friends="friends" :group="group" />
        </div>
        <div v-if="whatToDisplay === 'friends' || whatToDisplay === 'people'" class="sub-page-details">
            <SubpageFriends :fullPath="fullPath" :pageType="pageType" :friends="friends" :members="members" />
        </div>
        <div v-if="whatToDisplay === 'photos'" class="sub-page-details">
            <SubpageMedia :media="media" :mediaType="'/image/'"/>
        </div>
        <div v-if="whatToDisplay === 'videos'" class="sub-page-details">
            <SubpageMedia :media="media" :mediaType="'/video/'"/>
        </div>
        <div v-if="whatToDisplay === 'media'" class="sub-page-details">
            <SubpageMedia :media="media" :mediaType="'media'"/>
        </div>
    </div>
</template>

<script>
import PostList from '../components/PostList.vue';
import PostCreation from '../components/PostCreation.vue';
import SubpagePosts from '../components/SubpagePosts.vue';
import SubpageFriends from '../components/SubpageFriends.vue';
import SubpageMedia from '../components/SubpageMedia.vue';
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
            paths: [],
            fullPath: null,
            isProfileOfUser: null,
            loggedinUser: null,
            whatToDisplay: 'posts',
            isInFriends: false
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
        SvgIcon,
        SubpagePosts,
        SubpageFriends,
        SubpageMedia
    },
    methods: {
        updateRoutes() {
            this.paths = []
            this.fullPath = null
            this.isInFriends = false
            const currentPath = this.$route.path;
            this.fullPath = currentPath
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            if(this.paths[2]===this.user._id){
                if (this.paths[this.paths.length - 4]) {
                    this.whatToDisplay = this.paths[3].toLowerCase()
                } else {
                    this.whatToDisplay = 'posts'
                }
                this.isInFriends=true
            } else {
                if (this.paths[this.paths.length - 3]) {
                    this.whatToDisplay = this.paths[2].toLowerCase()
                } else {
                    this.whatToDisplay = 'posts'
                }
            }
            console.log(this.whatToDisplay)
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
        getGroupStatus() {
            if (this.group.groupType === 'Public') {
                return 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704617619/projects/Neckbook/svg%20images/globe-earth_poypgg.png'
            } else {
                return 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704629589/projects/Neckbook/svg%20images/padlock_cvbysn.png'
            }
        },
        async setProfileState() {
            this.isProfileOfUser = null
            this.loggedinUser = await userService.getLoggedinUser()
            if (this.loggedinUser) {
                this.isProfileOfUser = (this.loggedinUser._id === toRaw(this.user)._id)
            }
        },
        loadData() {
            this.setProfileState()
            this.updateRoutes()
        },
        confirmFriend() {
            return toRaw(this.loggedinUser).friends.includes(toRaw(this.user)._id)
        },
        typeOfRequest() { //request types: received - the used received it, send - the user sent it, accepted - they are friends, denied - the request was denied
            for (let request of toRaw(this.loggedinUser).friendRequests) {
                if (request._id === toRaw(this.user)._id) {
                    return request.type
                }
            }
            return 'none'
        },
        updateRequest(requests, state = 'denied', counterpartId) {
            requests.map((request) => {
                if ((request._id === counterpartId)) {
                    request.type = state
                }
            })
            return requests
            // console.log(requests)
        },
        changeFriendrequestStatus() {
            const stateOfFriendship = this.typeOfRequest()
            if (this.confirmFriend()) {
                return
            }
            if (stateOfFriendship === 'received') {
                //updating receiver
                // console.log('updating receiver')
                const receiverRequests = this.updateRequest((toRaw(this.user)).friendRequests, 'accepted', toRaw(this.loggedinUser)._id)
                const updatedReceiver = {
                    ...toRaw(this.user),
                    friends: [...(toRaw(this.user)).friends, toRaw(this.loggedinUser)._id],
                    friendRequests: receiverRequests
                }
                // console.log(updatedReceiver)

                //updating sender
                // console.log('updating sender')
                const senderRequests = this.updateRequest((toRaw(this.loggedinUser)).friendRequests, 'accepted', toRaw(this.user)._id)
                const updatedSender = {
                    ...toRaw(this.loggedinUser),
                    friends: [...(toRaw(this.loggedinUser)).friends, toRaw(this.user)._id],
                    friendRequests: senderRequests
                }
                // console.log(updatedSender)
                userService.saveLocalUser(updatedSender)
                try {
                    try {
                        userService.save(updatedReceiver).then(() => {
                            try {
                                userService.save(updatedSender)
                            } catch (err) {
                                console.log('could not update sender : ', err)
                            }
                        })
                    } catch (err) {
                        console.log('could not update receiver : ', err)
                    }

                } catch (err) {
                    console.log('could not save loggedinuser : ', err)
                }
            }
            else {
                console.log('you cant do that')
            }
        }
    },
    created() {
        this.updateRoutes()
        this.loadData()
    }
}
</script>

<style lang="scss"></style>