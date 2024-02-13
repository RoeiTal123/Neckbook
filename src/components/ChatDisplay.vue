<template>
    <section class="chat-display">
        <section v-if="chat" class="chat-room">
            <div class="header">
                <div class="chat-title">
                    <img v-if="chat.coverImgUrl" :src="chat.coverImgUrl" />
                    <img v-if="!chat.coverImgUrl" :src="getOtherUser().avatar" />
                    <div class="inner-detail">
                        <span v-if="chat.name">{{ chat.name }}</span>
                        <span v-if="!chat.name">{{ getOtherUser().fullName }}</span>
                        <span>was active at some point</span>
                    </div>
                </div>
                <div class="header-actions">
                    <SvgIcon :iconName="'startCall'" />
                    <SvgIcon :iconName="'startVideo'" />
                    <img class="normal-emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707637111/projects/Neckbook/svg%20images/info_udllxu.png" />
                </div>
            </div>
            <div class="messages" v-if="messages && chat && allUsersLoaded">
                <div :class="(message.messagerId === loggedInUser._id) ? 'message yours' : 'message'"
                    v-for="message in messages"  :onmouseover="() =>displayActions(message._id)" :onmouseout="() =>hideActions(message._id)">
                    <img v-if="(message.messagerId !== loggedInUser._id)" :src="getUser(message.messagerId).avatar" />
                    <div class="message-details">
                        <span class="user-name" v-if="(message.messagerId !== loggedInUser._id)">{{
                            getUser(message.messagerId).fullName }}</span>
                        <span class="message-txt">{{ message.txt }}</span>
                    </div>
                    <div class="message-actions" :id="`message-actions ${message._id}`">
                        <img class="small-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707825959/projects/Neckbook/svg%20images/share_1_nf1wzo.png"/>
                        <img class="small-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707825960/projects/Neckbook/svg%20images/smile-emoticon_npaxgy.png"/>
                        <img class="small-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707825962/projects/Neckbook/svg%20images/redo_vrhqia.png"/>
                        <img class="small-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707825959/projects/Neckbook/svg%20images/dots_gb73kb.png"/>
                    </div>
                </div>
                <!-- {{ messages }} -->
            </div>
            <div class="input-section">
                <SvgIcon :iconName="'createPoll'" />
                <SvgIcon :id="'vanish1'" :iconName="'addMedia'" />
                <SvgIcon :id="'vanish2'" :iconName="'addSticker'" />
                <SvgIcon :id="'vanish3'" :iconName="'addGif'" />
                <div class="user-input">
                    <input id="chat-message" type="text" placeholder="Aa" :onInput="() => focusInput()" />
                    <SvgIcon :iconName="'addEmote'" />
                </div>
                <SvgIcon :iconName="'useChatEmote'" />
            </div>
        </section>
        <ChatInfo :loggedInUser="loggedInUser" :chat="chat" :messages="messages" :users="users"/>
    </section>
</template>

<script>

import { userService } from '../services/userService'
import { chatService } from '../services/chatService'
import { messageService } from '../services/messageService'
import { utilService } from '../services/util.service'

import SvgIcon from './SvgIcon.vue'

import ChatInfo from './ChatInfo.vue'

import { toRaw } from 'vue'

export default {
    data() {
        return {
            loggedInUser: null,
            chat: null,
            messages: [],
            users: [],
            paths: [],
            allUsersLoaded: false,
            lastMessage: null
        }
    },
    watch: {
        $route(to, from) {
            this.updateRoutes()
            if (to.path !== from.path) {
                this.loadData()
            }
        }
    },
    methods: {
        updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            // console.log(this.paths)
        },
        async setChat() {
            this.chat = await chatService.getById(this.paths[this.paths.length - 1])
        },
        async loadMessages() {
            this.messages = []
            for (let messageId of toRaw(this.chat).messages) {
                const message = await messageService.getById(messageId)
                this.messages.push({ ...message })
            }
            this.lastMessage = { ...this.messages[this.messages.length - 1] }
        },
        async loadUsersInChat() {
            this.users = []
            this.loggedInUser = await userService.getLoggedinUser()
            for (let userId of toRaw(this.chat).usersInChat) {
                const user = await userService.getById(userId)
                this.users.push({ ...user })
                if (this.users.length === toRaw(this.chat).usersInChat.length) this.allUsersLoaded = true
            }
        },
        getUser(userId) {
            for (let user of this.users) {
                if (userId === user._id) {
                    return user
                }
            }
            return 'user doesn`t exist'
        },
        getOtherUser() {
            for (let user of this.users) {
                if (toRaw(this.loggedInUser)._id !== user._id) {
                    return user
                }
            }
            return 'user doesn`t exist'
        },
        focusInput() {
            const txt = document.getElementById('chat-message').value
            if (txt === '') {
                document.getElementById('vanish1').classList.remove('focused')
                document.getElementById('vanish2').classList.remove('focused')
                document.getElementById('vanish3').classList.remove('focused')
                return
            }
            if (utilService.isTxtOnlySpaces(txt)) {
                document.getElementById('vanish1').classList.remove('focused')
                document.getElementById('vanish2').classList.remove('focused')
                document.getElementById('vanish3').classList.remove('focused')
                return
            }
            document.getElementById('vanish1').classList.add('focused')
            document.getElementById('vanish2').classList.add('focused')
            document.getElementById('vanish3').classList.add('focused')
        },
        displayActions(messageId){
            document.getElementById(`message-actions ${messageId}`).style.opacity=1
            console.log('actions appear!')
        },
        hideActions(messageId){
            document.getElementById(`message-actions ${messageId}`).style.opacity=0
            console.log('actions vanish!')
        },
        loadData() {
            this.updateRoutes()
            this.setChat().then(() => {
                this.loadMessages()
                this.loadUsersInChat()
            })
        }
    },
    components: {
        SvgIcon,
        ChatInfo
    },
    created() {
        this.loadData()
    }
}
</script>

<style lang="scss">
</style>