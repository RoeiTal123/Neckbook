<template>
    <div class="side-navbar" id="side-navbar" :class="displayingProfile ? 'profile' : ''">
        <div class="user-options">
            <div v-if="!paths[1]">
                <!-- friends -->
                <div class="header" v-if="(paths[0] === 'friends')">
                    <span>Friends</span>
                    <div>
                        <SvgIcon :iconName="'settings'" />
                    </div>
                </div>
                <!-- groups -->
                <div class="header" v-if="(paths[0] === 'groups')">
                    <span>Groups </span>
                    <div>
                        <SvgIcon :iconName="'settings'" />
                    </div>
                </div>
                <!-- marketplace -->
                <div class="header" v-if="(paths[0] === 'marketplace')">
                    <span>Marketplace </span>
                    <div>
                        <SvgIcon :iconName="'settings'" />
                    </div>
                </div>
                <!-- messenger -->
                <div class="options">
                    <!-- friends -->
                    <div class="main friend-option" v-if="(paths[0] === 'friends')">
                        <RouterLink :to="`/friends`" class="bread">
                            <div><img
                                    src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704188459/projects/Neckbook/svg%20images/friend_rythav.png" />
                            </div>
                            <span>Home</span>
                        </RouterLink>
                    </div>
                    <!-- groups -->
                    <div class="group-option group" v-for="group in groups"
                        v-if="groups && !paths[1] && paths[0] === 'groups'" @click="() => toggleDisplay()">
                        <RouterLink :to="`/groups/${group._id}`">
                            <div><img :src="group.coverImgUrl" /></div>
                            <div>
                                <span>{{ group.name }}</span>
                                <span>Last active {{ lastPost(group.lastPostAt) }}</span>
                            </div>
                        </RouterLink>
                    </div>
                    <!-- friends -->
                    <div class="friend-option" v-if="(paths[0] === 'friends')">
                        <RouterLink :to="`/friends/requests`">
                            <div><img
                                    src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708276949/projects/Neckbook/svg%20images/add-friend_3_xj4jl3.png" />
                            </div>
                            <span>Friend requests</span>
                        </RouterLink>
                        <RouterLink :to="`/friends/all`">
                            <div><img
                                    src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708276949/projects/Neckbook/svg%20images/add-friend_3_xj4jl3.png" />
                            </div>
                            <span>All friends</span>
                        </RouterLink>
                    </div>
                    <!-- messenger -->

                </div>
            </div>
            <div class="header" v-if="(paths[0] === 'messenger')">
                <span>Chats </span>
                <section>
                    <div>
                        <SvgIcon :iconName="'options'" />
                    </div>
                    <div>
                        <RouterLink :to="'/messenger/new'">
                            <SvgIcon :iconName="'newChat'" />
                        </RouterLink>
                    </div>
                </section>
            </div>
            <div class="search" v-if="paths[0]!=='friends'">
                <img class="normal-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707840798/projects/Neckbook/svg%20images/search_hcfvqm.png"/>
                <input type="text" :placeholder="`Search ${paths[0]}`"/>
            </div>
            <div class="options">
                <div class="chat-option" v-for="chat in chats" v-if="chats && paths[0] === 'messenger'"
                    @click="() => toggleDisplay()" :class="(paths[paths.length-1] === chat._id) ? 'selected' : ''">
                    <RouterLink :to="`/messenger/${chat._id}`">
                        <img v-if="chat.coverImgUrl" :src="chat.coverImgUrl" />
                        <img v-if="!chat.coverImgUrl"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707407122/projects/Neckbook/svg%20images/chat_jmmgsp.png" />
                        <div>
                            <span v-if="chat.name">{{ chat.name }}</span>
                            <span v-if="!chat.name">Chatroom</span>
                            <span v-if="chat.lastMessage">
                                <span>{{`${chat.lastMessage.messagerName}: ${chat.lastMessage.txt}` }}</span>
                                <span>{{ lastComment(chat.lastMessage.createdAt)}}</span>
                            </span>
                            <span v-if="!chat.lastMessage">
                                <span class="auto-message">{{"You can now message and call each other and see info like Active Status and when you've read messages."}}</span>
                            </span>
                        </div>
                    </RouterLink>
                </div>
            </div>
            <!-- groups -->
            <div v-if="(paths[0] === 'groups') && paths[1] && group" class="other-header">
                <img id="group-cover" class="group-cover" :src="group.coverImgUrl" @error="replaceImage()" />
                <div>
                    <span v-if="group.name !== ''">{{ group.name }}</span>
                    <span v-else>group name</span>
                    <span><img class="state" :src="getGroupStatus()" />
                        {{ group.groupType }} group · {{ group.membersCount }} member{{ group.membersCount > 1 ? 's' :
                            '' }}</span>
                </div>
                <button @click="changeVisibility()">
                    <img
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704718571/projects/Neckbook/svg%20images/exit_ak4pzg.png" />
                </button>
            </div>
            <!-- friends -->
            <div v-if="(paths[1] === 'requests') || paths[1] === 'all'">
                <div class="options">
                    <div class="main friend-option">
                        <RouterLink :to="`/friends`" class="bread">
                            <img
                                src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704376597/projects/Neckbook/svg%20images/back_dta0ko.png" />
                            <section>
                                <span>{{ paths[0] }}</span>
                                <span>{{ paths[1] }}</span>
                            </section>
                        </RouterLink>
                    </div>
                    <div v-if="requests && (paths[1] === 'requests')" v-for="request in requests" class="request">
                        <RouterLink :to="`/friends/requests/${request._id}`">
                            <img v-if="request.avatar" :src="request.avatar" />
                            <img v-else src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708621438/projects/Neckbook/website-images/user_eqfe6m.png" />
                            <div class="request-actions">
                                <span>{{ request.fullName }}</span>

                                <div class="request-buttons">
                                    <button class="btn-confirm">Confirm</button>
                                    <button class="btn-delete">Delete</button>
                                </div>
                            </div>
                        </RouterLink>
                    </div>
                    <div v-if="friends && paths[1] === 'all'" v-for="friend in friends" class="friend"
                        @click="() => toggleDisplay()">
                        <RouterLink :to="`/friends/all/${friend._id}`">
                            <img v-if="friend.avatar" :src="friend.avatar" />
                            <img v-else src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708621438/projects/Neckbook/website-images/user_eqfe6m.png"/>
                            <div class="friend-actions">
                                <span>{{ friend.fullName }}</span>
                            </div>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- works in all pages -->
    <button class="btn-make-visible " id="make-visible" @click="changeVisibility()">
        <img
            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704718690/projects/Neckbook/svg%20images/logout_1_dbk2oe.png" />
    </button>
</template>

<script>

import { userService } from '../services/userService'
import { groupService } from '../services/groupService'
import { chatService } from '../services/chatService'
import { messageService } from '../services/messageService'
import { utilService } from '../services/util.service'

import SvgIcon from './SvgIcon.vue'

import { toRaw } from 'vue'
import { RouterLink } from 'vue-router'

export default {
    props: {
        requests: {
            type: Array,
            required: false
        }
    },
    data() {
        return {
            paths: [],
            loggedInUser: {},
            friends: [],
            groups: [],
            group: {},
            chats: [],
            displayingProfile: false
        }
    },
    components: {
        SvgIcon,
        RouterLink
    }, watch: {
        $route(to, from) {
            this.loadData()
        },
    },
    methods: {
        updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            // console.log(this.paths)
        },
        async updateLoggedinUser() {
            this.loggedInUser = {}
            this.loggedInUser = await userService.getLoggedinUser()
        },
        async setFriends() {
            this.friends = []
            const friendsPromises = this.loggedInUser.friends.map(async (friendId) => {
                const friendDetails = await userService.getById(friendId);
                return {
                    _id: friendDetails._id,
                    avatar: friendDetails.avatar,
                    fullName: friendDetails.fullName,
                }
            })
            this.friends = await Promise.all(friendsPromises)
        },
        async setGroups() {
            this.groups = []
            const groupsPromises = this.loggedInUser.groups.map(async (groupId) => {
                const groupDetails = await groupService.getById(groupId)
                const isAdmin = groupDetails.admins.includes(this.loggedInUser._id)
                return {
                    _id: groupDetails._id,
                    coverImgUrl: groupDetails.coverImgUrl,
                    name: groupDetails.name,
                    membersCount: groupDetails.members.length,
                    groupType: groupDetails.groupType,
                    lastPostAt: groupDetails.lastPostAt,
                    isAdmin
                }
            })
            this.groups = await Promise.all(groupsPromises)
        },
        async setChats() {
            this.chats = []
            const chatsPromises = this.loggedInUser.chats.map(async (chatId) => {
                const chatDetails = await chatService.getById(chatId)
                const chatType = chatDetails.chatType
                var idOfSecondUser = null
                if (chatType === 'personal') {
                    const indexOfUser = chatDetails.usersInChat.findIndex(userId => userId === toRaw(this.loggedInUser)._id)
                    idOfSecondUser = (indexOfUser === 0) ? chatDetails.usersInChat[1] : chatDetails.usersInChat[0]
                }
                var coverOfChat
                var nameOfChat
                var lastMessage
                if (chatDetails.coverImgUrl) coverOfChat = chatDetails.coverImgUrl
                if (chatDetails.chatName) nameOfChat = chatDetails.chatName
                if (idOfSecondUser !== null) {
                    const secondUser = await userService.getById(idOfSecondUser)
                    coverOfChat = secondUser.avatar
                    nameOfChat = secondUser.fullName
                }
                const lastMessageId = chatDetails.messages[chatDetails.messages.length - 1]
                let ownerOfLastMessage
                if(lastMessageId){
                    lastMessage = await messageService.getById(lastMessageId)
                    ownerOfLastMessage = await userService.getById(lastMessage.messagerId)
                    return {
                        _id: chatDetails._id,
                        coverImgUrl: coverOfChat,
                        name: nameOfChat,
                        chatType: chatDetails.chatType,
                        lastMessage: { messagerName: ownerOfLastMessage.fullName, txt: lastMessage.txt, createdAt: lastMessage.createdAt }
                    }
                } else {      
                    return {
                        _id: chatDetails._id,
                        coverImgUrl: coverOfChat,
                        name: nameOfChat,
                        chatType: chatDetails.chatType,
                        lastMessage: null
                    }
                }

            })
            this.chats = await Promise.all(chatsPromises)
            // console.log(this.chats)
        },
        replaceImage() {
            var img = document.getElementById('group-cover')
            img.src = 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704274663/projects/Neckbook/website-images/Persian_Cat_Facts_History_Personality_and_Care___ASPCA_Pet_Health_Insurance___white_Persian_cat_resting_on_a_brown_sofa-min_rgtjby.jpg'
            img.onerror = null
        },
        updateGroup() {
            this.groups.map((group) => {
                if (group._id === this.paths[1]) {
                    this.group = group
                }
            })
        },
        getGroupStatus() {
            if (this.group.groupType === 'Public') {
                return 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704617619/projects/Neckbook/svg%20images/globe-earth_poypgg.png'
            } else {
                return 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704629589/projects/Neckbook/svg%20images/padlock_cvbysn.png'
            }
        },
        changeVisibility() {
            if (getComputedStyle(document.getElementById('side-navbar')).display !== 'none') {
                console.log('begone!')
                document.getElementById('side-navbar').style.display = 'none'
                document.getElementById('make-visible').classList.add('visible')
            } else {
                console.log('appear!')
                document.getElementById('side-navbar').style.display = 'flex'
                document.getElementById('make-visible').classList.remove('visible')
            }
        },
        toggleDisplay() {
            document.getElementById('page-display').classList.toggle('show')
        },
        toggleDisplayProfile() {
            this.displayingProfile = true
            // document.getElementById('page-display').classList.toggle('show')
        },
        lastPost(date) {
            return utilService.timeAgoString(date)
        },
        lastComment(date) {
            return utilService.timeString(date)
        },
        loadData() {
            this.updateRoutes()
            this.updateLoggedinUser().then(() => {
                this.setFriends()
                this.setGroups().then(() => {
                    if (this.paths[1]) {
                        this.updateGroup()
                    }
                })
                this.setChats()
            })
        }
    },
    created() {
        this.loadData()
    }
}
</script>

<style lang="scss"></style>