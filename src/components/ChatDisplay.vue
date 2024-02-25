<template>
    <section class="chat-display">
        <section class="chat-room" :class="paths[1] === 'new' ? 'empty' : ''">
            <div v-if="chat" class="header">
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
                    <div @click="() => toggleInfo()">
                        <SvgIcon :iconName="'chatInfo'" />
                    </div>
                </div>
            </div>
            <div v-if="!chat" class="header empty">
                <span @click="() => toggleChatInput(false)">
                    To:
                </span>
                <div v-if="selectedUsers.length !== 0" class="selected-users">
                    <div class="selected-user" v-for="user in selectedUsers">
                        <span>{{ user.fullName }}</span>
                        <img @click="() => cancelFromSelection(user._id)" class="tiny-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708442485/projects/Neckbook/svg%20images/cancel-user_x9khs1.png" />
                    </div>
                </div>
                <input type="text" id="username-input" @click="() => toggleChatInput(true)"
                    @input="() => searchForUser()" @keyup.enter="addChat"/>
            </div>
            <div v-if="displayModel && !chat" class="displayed-users-model">
                <div v-if="displayedUsers !== null" class="displayed-users">
                    <div v-for="user in displayedUsers" @click="() => selectForAddition(user)">
                        <div class="displayed-user"
                            v-if="!checkIfAlreadySelected(user.userId) && user.userId !== loggedInUser._id">
                            <img v-if="user.avatar" :src="user.avatar" />
                            <img v-else src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708621438/projects/Neckbook/website-images/user_eqfe6m.png" />
                            <span>{{ user.fullName }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="messages" v-if="messages && chat && allUsersLoaded">
                <div :class="(message.messagerId === loggedInUser._id) ? 'message yours' : 'message'"
                    v-for="message in messages" :onmouseover="() => displayActions(message._id)"
                    :onmouseout="() => hideActions(message._id)">
                    <img v-if="(message.messagerId !== loggedInUser._id)" :src="getUser(message.messagerId).avatar" />
                    <div class="message-details">
                        <span class="user-name" v-if="(message.messagerId !== loggedInUser._id)">{{
                            getUser(message.messagerId).fullName }}</span>
                        <span class="message-txt" :class="(message.messagerId === loggedInUser._id) ? 'yours' : ''">{{
                            message.txt }}</span>
                    </div>
                    <div class="message-actions" :id="`message-actions ${message._id}`">
                        <!-- <img class="small-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707825959/projects/Neckbook/svg%20images/share_1_nf1wzo.png"/> -->
                        <img class="small-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707825960/projects/Neckbook/svg%20images/smile-emoticon_npaxgy.png" />
                        <img class="small-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707825962/projects/Neckbook/svg%20images/redo_vrhqia.png" />
                        <img class="small-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707825959/projects/Neckbook/svg%20images/dots_gb73kb.png" />
                    </div>
                </div>
                <!-- {{ messages }} -->
            </div>
            <div v-if="chat" class="input-section">
                <SvgIcon :iconName="'createPoll'" />
                <SvgIcon :id="'vanish1'" :iconName="'addMedia'" />
                <SvgIcon :id="'vanish2'" :iconName="'addSticker'" />
                <SvgIcon :id="'vanish3'" :iconName="'addGif'" />
                <div class="user-input">
                    <input @keyup.enter="addMessage" id="chat-message" type="text" placeholder="Aa"
                        :onInput="() => focusInput()" />
                    <SvgIcon :iconName="'addEmote'" />
                </div>
                <SvgIcon :iconName="'useChatEmote'" />
            </div>
        </section>
        <ChatInfo :showInfo="showInfo" :loggedInUser="loggedInUser" :chat="chat" :messages="messages" :users="users" />
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
            lastMessage: null,
            showInfo: true,
            svgsColor: null,
            displayModel: false,
            displayedUsers: null,
            selectedUsers: []
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
            this.chat = null
            this.chat = await chatService.getById(this.paths[this.paths.length - 1])
            this.svgsColor = toRaw(this.chat).themeColor
        },
        async loadMessages() {
            this.messages = []
            for (let messageId of toRaw(this.chat).messages) {
                const message = await messageService.getById(messageId)
                this.messages.push({ ...message })
            }
            this.lastMessage = { ...this.messages[this.messages.length - 1] }
        },
        async loadLoggedinUser() {
            this.loggedInUser = await userService.getLoggedinUser()
        },
        async loadUsersInChat() {
            this.users = []
            this.loadLoggedinUser()
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
        displayActions(messageId) {
            document.getElementById(`message-actions ${messageId}`).style.opacity = 1
            // console.log('actions appear!')
        },
        hideActions(messageId) {
            document.getElementById(`message-actions ${messageId}`).style.opacity = 0
            // console.log('actions vanish!')
        },
        toggleInfo() {
            this.showInfo = !this.showInfo
        },
        toggleChatInput(value) {
            this.displayModel = value
        },
        async searchForUser() {
            const username = document.getElementById('username-input').value
            if (username === '') {
                // console.log('type something')
                this.displayedUsers = []
                return
            }
            if (utilService.isTxtOnlySpaces(username)) {
                // console.log('no empty')
                this.displayedUsers = []
                return
            }
            // console.log(`searching for user: ${username}`)
            // console.log('----------------------------')
            const foundUsers = await userService.getByName(username)
            if (foundUsers.length === 0) {
                // console.log ('no user found')
            } else {
                // console.log(`users found : `)
                // console.log(foundUsers)
                this.displayedUsers = foundUsers
            }
        },
        selectForAddition(user) {
            // console.log(user)
            // console.log(this.selectedUsers)
            document.getElementById('username-input').value = ''
            for (let selectedUser of this.selectedUsers) {
                if (user.userId === selectedUser._id) return
            }
            this.selectedUsers.push({ _id: user.userId, fullName: user.fullName })
            this.displayedUsers = []
            // console.log(this.selectedUsers)
        },
        checkIfAlreadySelected(selectedId) {
            for (let selectedUser of this.selectedUsers) {
                if (selectedId === selectedUser._id) return true
            }
            return false
        },
        cancelFromSelection(userId) {
            this.selectedUsers = this.selectedUsers.filter(user => user._id !== userId)
            // console.log(this.selectedUsers) 
        },
        addMessage(event) {
            event.preventDefault()
            this.updateChat()
        },
        createMessage(msg) {
            if (msg === '') {
                console.log('type something')
                return false
            }
            if (utilService.isTxtOnlySpaces(msg)) {
                console.log('no empty')
                return false
            }
            const newMessage = {
                _id: utilService.makeId(),
                chatroomId: toRaw(this.chat)._id,
                messagerId: toRaw(this.loggedInUser)._id,
                txt: msg,
                likedByUsers: [],
                mediaUrls: [],
                fileUrls: [],
                createdAt: Date.now()
            }
            messageService.save(newMessage)
            return newMessage
        },
        addChat(event) {
            event.preventDefault()
            this.createChat()
        },
        async createChat() {
            let usersOfNewChat = [this.loggedInUser._id]
            const mainId = this.loggedInUser._id
            let nicknames = [{ [mainId]: 'default' }]
            let chatType='personal'
            for (let user of this.selectedUsers) {
                const userId = user._id
                usersOfNewChat.push(userId)
                nicknames.push({ [userId]: 'default' })
            }
            if (usersOfNewChat.length <= 1) {
                console.log('cant make chat')
                return
            }
            if(usersOfNewChat.length > 2){
                chatType='group'
            }
            const newChat = {
                _id: utilService.makeId(),
                chatType: chatType,
                usersInChat: usersOfNewChat,
                nicknames: nicknames,
                coverImgUrl: null,
                chatName: null,
                messages: [],
                mediaUrls: [],
                fileUrls: [],
                themeColor: '0084ff',
                createdAt: Date.now()
            }
            try{
                chatService.save({...newChat})
                console.log(`new chat ${newChat._id} was created`)
                try{
                    for(let userId of usersOfNewChat){
                        let user= await userService.getById(userId)
                        user={...user,chats:[...user.chats,newChat._id]}
                        userService.save(user)
                        console.log(`saved user ${userId}`)
                    }
                    const updatedUser = {...this.loggedInUser,chats:[...this.loggedInUser.chats,newChat._id]}
                    try{
                        userService.saveLocalUser(updatedUser)
                        
                    } catch (err) {
                        console.log(`couldn't save logged in user`)
                    }
                } catch (err) {
                    console.log(`couldn't save user`)
                }
            } catch (err) {
                console.log('cant create a new chat : ',err)
            }
            this.$router.push(`/messenger/${newChat._id}`)
        },
        updateChat() {
            const txt = document.getElementById('chat-message').value
            document.getElementById('chat-message').value = ''
            const newestMessage = this.createMessage(txt)
            if (!newestMessage) {
                console.log('cant save unlawfull messages')
                return
            }
            let allMessages = [...toRaw(this.chat).messages]
            allMessages.push(newestMessage._id)
            const updatedChat = { ...toRaw(this.chat), messages: allMessages }
            try {
                messageService.save(newestMessage)
                console.log('message saved')
                try {
                    chatService.save(updatedChat)
                    console.log('chat saved')
                } catch (err) {
                    console.log('cant save chat : ', err)
                }
            } catch (err) {
                console.log('cant save message : ', err)
            }
            // console.log(this.chat)
            this.chat = { ...this.updateChat }
            // console.log(this.chat)
        },
        loadData() {
            this.updateRoutes()
            if (toRaw(this.paths[1]) !== 'new') {
                this.setChat().then(() => {
                    this.loadMessages()
                    this.loadUsersInChat()
                })
            } else {
                this.chat = null
                this.loadLoggedinUser()
            }
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

<style lang="scss"></style>