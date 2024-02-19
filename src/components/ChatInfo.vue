<template>
    <section v-if="chat && showInfo" class="chat-info">
        {{ loadData() }}
        <div class="info-header">
            <img class="chat-info-img" v-if="chat.coverImgUrl" :src="chat.coverImgUrl" />
            <img class="chat-info-img" v-if="!chat.coverImgUrl" :src="getOtherUser().avatar" />
            <span v-if="chat.name">{{ chat.name }}</span>
            <span v-if="!chat.name">{{ getOtherUser().fullName }}</span>
            <div class="options">
                <div class="option" v-if="chat.chatType !== 'group'">
                    <div>
                        <img class="normal-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706446065/projects/Neckbook/svg%20images/avatar_hs3gdb.png" />
                    </div>
                    <span>Profile</span>
                </div>
                <div class="option">
                    <div>
                        <img class="normal-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707727107/projects/Neckbook/svg%20images/bell_mvnpsc.png" />
                    </div>
                    <span>Mute</span>
                </div>
                <div class="option">
                    <div>
                        <img class="normal-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708325400/projects/Neckbook/svg%20images/magnifying-glass_bsqygy.png" />
                    </div>
                    <span>Search</span>
                </div>
            </div>
        </div>
        <div class="info-section">
            <span class="info-switch" @click="() => toggleSwitch('isInfo')"><span>Chat info</span><img class="small-emote"
                    :src="(isInfo ? 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1707730088/projects/Neckbook/svg%20images/arrow-up_iv53el.png' : 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1707730080/projects/Neckbook/svg%20images/arrow-down_p9aaix.png')" /></span>
            <div v-if="isInfo" class="info-sub-section">
                <div>
                    <img class="normal-emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707739508/projects/Neckbook/svg%20images/thumbtacks_nvqghn.png" />
                    <span>View pinned messages</span>
                </div>
            </div>

            <span class="info-switch" @click="() => toggleSwitch('isCustomize')"><span>Customize chat</span><img
                    class="small-emote"
                    :src="(isCustomize ? 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1707730088/projects/Neckbook/svg%20images/arrow-up_iv53el.png' : 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1707730080/projects/Neckbook/svg%20images/arrow-down_p9aaix.png')" /></span>
            <div v-if="isCustomize" class="info-sub-section">
                <div v-if="chat.chatType === 'group'">
                    <img class="normal-emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704290940/projects/Neckbook/svg%20images/pencil_ozev60.png" />
                    <span>Change chat name</span>
                </div>
                <div v-if="chat.chatType === 'group'">
                    <SvgIcon :iconName="'checkMedia'" />
                    <span>Change photo</span>
                </div>
                <div @click="() => openPicker()">
                    <SvgIcon :iconName="'themePicker'" />
                    <input type="color" id="theme-chooser" @input="() => changeTheme()" />
                    <span>Change theme</span>
                </div>
                <div>
                    <SvgIcon :iconName="'useChatEmote'" />
                    <span>Change emote</span>
                </div>
                <div>
                    <img class="normal-emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707727318/projects/Neckbook/svg%20images/text-font_nw6hht.png" />
                    <span>Edit nicknames</span>
                </div>
                <div>
                    <img class="normal-emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708325400/projects/Neckbook/svg%20images/magnifying-glass_bsqygy.png" />
                    <span>Search in conversation</span>
                </div>
            </div>

            <span v-if="chat.chatType === 'group'" class="info-switch" @click="() => toggleSwitch('isMembers')"><span>Chat
                    members</span><img class="small-emote"
                    :src="(isMembers ? 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1707730088/projects/Neckbook/svg%20images/arrow-up_iv53el.png' : 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1707730080/projects/Neckbook/svg%20images/arrow-down_p9aaix.png')" /></span>
            <div v-if="isMembers" class="info-sub-section">
                members
            </div>

            <span class="info-switch" @click="() => toggleSwitch('isMedia')"><span>Media, files and links</span><img
                    class="small-emote"
                    :src="(isMedia ? 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1707730088/projects/Neckbook/svg%20images/arrow-up_iv53el.png' : 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1707730080/projects/Neckbook/svg%20images/arrow-down_p9aaix.png')" /></span>
            <div v-if="isMedia" class="info-sub-section">
                <div>
                    <SvgIcon :iconName="'checkMedia'" />
                    <span>Media</span>
                </div>
                <div>
                    <img class="normal-emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707727613/projects/Neckbook/svg%20images/document_utvijj.png" />
                    <span>Files</span>
                </div>
                <div>
                    <img class="normal-emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707727395/projects/Neckbook/svg%20images/link_gssicl.png" />
                    <span>Links</span>
                </div>
            </div>

            <span class="info-switch" @click="() => toggleSwitch('isPrivacy')"><span>Privacy & support</span><img
                    class="small-emote"
                    :src="(isPrivacy ? 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1707730088/projects/Neckbook/svg%20images/arrow-up_iv53el.png' : 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1707730080/projects/Neckbook/svg%20images/arrow-down_p9aaix.png')" /></span>
            <div v-if="isPrivacy" class="info-sub-section">

                <div>
                    <img class="normal-emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707740178/projects/Neckbook/svg%20images/no_notifications_fyqhnl.png" />
                    <span>Mute notifications</span>
                </div>
                <div>
                    <img class="normal-emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707743939/projects/Neckbook/svg%20images/warning_umzkd6.png" />
                    <span>Report</span>
                </div>
                <div>
                    <img class="normal-emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704718690/projects/Neckbook/svg%20images/logout_1_dbk2oe.png" />
                    <span>Leave group</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { userService } from '../services/userService'
import { chatService } from '../services/chatService'
import { messageService } from '../services/messageService'
import { utilService } from '../services/util.service'

import SvgIcon from './SvgIcon.vue'

import { toRaw } from 'vue'
import { RouterLink } from 'vue-router'

export default {
    data() {
        return {
            isInfo: false,
            isCustomize: false,
            isMedia: false,
            isPrivacy: false,
            isMembers: false,
            colorTimeoutId: null,
            lastColorChangeAt: 0
        }
    },
    props: {
        loggedInUser: {
            type: Object,
            required: false
        },
        chat: {
            type: Object,
            required: false
        },
        messages: {
            type: Array,
            required: false
        },
        users: {
            type: Array,
            required: false
        },
        showInfo: {
            type: Boolean,
            required: false
        }
    },
    // watch: {
    //     $route(to, from) {
    //         if (to.path !== from.path) {
    //             this.loadData()
    //         }
    //     }
    // },
    methods: {
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
        toggleSwitch(setting) {
            this[setting] = !this[setting]
        },
        openPicker() {
            document.getElementById('theme-chooser').click()
        },
        changeTheme() {
            const colorPicker = document.getElementById('theme-chooser')
            this.setTheme(colorPicker.value)
        },
        setTheme(color) {
            const currentTime = Date.now()
            if ((currentTime - toRaw(this.lastColorChangeAt)) >= 1000) {
                console.log('color changed!')
                const allSvgsWithColors = document.querySelectorAll('.theme-color')
                for (let svg of allSvgsWithColors) {
                    svg.style.fill = color
                    svg.style.stroke = color
                }
                const allSvgsWithFills = document.querySelectorAll('.theme-fill')
                for (let svg of allSvgsWithFills) {
                    svg.style.fill = color
                }
                const allSvgsWithStrokes = document.querySelectorAll('.theme-stroke')
                for (let svg of allSvgsWithStrokes) {
                    svg.style.stroke = color
                }
                const allMessages = document.querySelectorAll('.message-txt')
                for (let message of allMessages) {
                    if (message.classList[1] === 'yours') {
                        message.style.backgroundColor = color                   }
                }
                chatService.save({ ...this.chat, themeColor: color })
            }
            this.lastColorChangeAt = currentTime
        },
        setStartingTheme() {
            const allSvgsWithColors = document.querySelectorAll('.theme-color')
            for (let svg of allSvgsWithColors) {
                svg.style.fill = toRaw(this.chat).themeColor
                svg.style.stroke = toRaw(this.chat).themeColor
            }
            const allSvgsWithFills = document.querySelectorAll('.theme-fill')
            for (let svg of allSvgsWithFills) {
                svg.style.fill = toRaw(this.chat).themeColor
            }
            const allSvgsWithStrokes = document.querySelectorAll('.theme-stroke')
            for (let svg of allSvgsWithStrokes) {
                svg.style.stroke = toRaw(this.chat).themeColor
            }
            const allMessages = document.querySelectorAll('.message-txt')
            for (let message of allMessages) {
                if (message.classList[1] === 'yours') {
                    message.style.backgroundColor = toRaw(this.chat).themeColor
                }
            }
            // document.getElementById('theme-chooser').value = toRaw(this.chat).themeColor
        },
        loadData() {
            this.setStartingTheme()
        }
    },
    components: {
        SvgIcon
    },
    created() {
        // this.loadData()
        this.lastColorChangeAt = Date.now()
    }
}
</script>

<style lang="scss">
.chat-display {
    .chat-info {
        height: 100%;
        width: 33%;
        overflow-y: auto;

        .info-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-block: 1em;
            gap: 0.75em;

            .chat-info-img {
                height: 5em;
                width: 5em;
                object-fit: cover;
                border-radius: 50%;
            }

            .options {
                display: flex;
                gap: 2.25em;

                .option {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5em;

                    div {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 50%;
                        background-color: #e4e6eb;
                        padding: 0.5em;

                        &:hover {
                            cursor: pointer;
                            background-color: #dadce1;
                        }
                    }
                }
            }
        }

        .info-section {
            display: flex;
            flex-direction: column;
            padding-inline: 0.5em;

            .info-switch {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-block: 1em;
                padding-inline: 0.5em;
                border-radius: 0.5em;
                transition: all 0.5s 0s ease-in-out;

                &:hover {
                    cursor: pointer;
                    background-color: #f1f1f1;
                }
            }

            .info-sub-section {
                display: flex;
                flex-direction: column;
                // gap: 0.75em;

                div {
                    display: flex;
                    align-items: center;
                    padding-block: 0.75em;
                    padding-inline: 0.5em;
                    gap: 0.75em;
                    border-radius: 0.5em;
                    transition: all 0.5s 0s ease-in-out;

                    i {
                        height: 1.25em;
                        width: 1.25em;
                    }

                    &:hover {
                        cursor: pointer;
                        background-color: #f1f1f1;
                    }

                    input {
                        display: none;
                    }
                }
            }
        }
    }
}
</style>