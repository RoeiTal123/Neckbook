<template>
    <div class="side-navbar" id="side-navbar">
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
                <div class="options">
                    <!-- friends -->
                    <div class="main friend-option" v-if="(paths[0] !== 'groups')">
                        <RouterLink :to="`/friends`" class="bread">
                            <div><img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704188459/projects/Neckbook/svg%20images/friend_rythav.png" /></div>
                            <span>Home</span>
                        </RouterLink>
                    </div>
                    <!-- groups -->
                    <div class="group-option group" v-for="group in groups" v-if="groups && !paths[1] && paths[0] === 'groups'">
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
                            <div><img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704188459/projects/Neckbook/svg%20images/friend_rythav.png" /></div>
                            <span>Friend requests</span>
                        </RouterLink>
                        <RouterLink :to="`/friends/all`">
                            <div><img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704188459/projects/Neckbook/svg%20images/friend_rythav.png" /></div>
                            <span>All friends</span>
                        </RouterLink>
                    </div>
                </div>
            </div>
            <!-- groups -->
            <div v-if="(paths[0] === 'groups') && paths[1] && group" class="other-header">
                <img id="group-cover" class="group-cover" :src="group.coverImgUrl" @error="replaceImage()" />
                <div>
                    <span v-if="group.name !== ''">{{ group.name }}</span>
                    <span v-else>group name</span>
                    <span><img class="state" :src="getGroupStatus()" />
                    {{ group.groupType }} group · {{ group.membersCount }} member{{ group.membersCount > 1 ? 's' : ''}}</span>
                </div>
                <button @click="changeVisibility()">
                    <img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704718571/projects/Neckbook/svg%20images/exit_ak4pzg.png" />
                </button>
            </div>
            <!-- friends -->
            <div v-if="(paths[1] === 'requests') || paths[1] === 'all'">
                <div class="options">
                    <div class="main friend-option">
                        <RouterLink :to="`/friends`" class="bread">
                            <img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704376597/projects/Neckbook/svg%20images/back_dta0ko.png" />
                            <section>
                                <span>{{ paths[0] }}</span>
                                <span>{{ paths[1] }}</span>
                            </section>
                        </RouterLink>
                    </div>
                    <div v-if="requests && (paths[1] === 'requests')" v-for="request in requests" class="request">
                        <RouterLink :to="`/friends/requests/${request._id}`">
                            <img :src="request.avatar" />
                            <div class="request-actions">
                                <span>{{ request.fullName }}</span>

                                <div class="request-buttons">
                                    <button class="btn-confirm">Confirm</button>
                                    <button class="btn-delete">Delete</button>
                                </div>
                            </div>
                        </RouterLink>
                    </div>
                    <div v-if="friends && paths[1] === 'all'" v-for="friend in friends" class="friend">
                        <RouterLink :to="`/friends/all/${friend._id}`">
                            <img :src="friend.avatar" />
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
    <button class="btn-make-visible" id="make-visible" @click="changeVisibility()">
                    <img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704718690/projects/Neckbook/svg%20images/logout_1_dbk2oe.png" />
    </button>
</template>

<script>

import { groupService } from '../services/groupService';
import { utilService } from '../services/util.service';
import SvgIcon from './SvgIcon.vue';

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
            group: {}
        }
    },
    components: {
        SvgIcon
    }, watch: {
        $route(to, from) {
            this.loadData()
        },
    },
    methods: {
        updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path;
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
                };
            });
            this.friends = await Promise.all(friendsPromises);
        },
        async setGroups() {
            this.groups = []
            const groupsPromises = this.loggedInUser.groups.map(async (groupId) => {
                const groupDetails = await groupService.getById(groupId);
                const isAdmin = groupDetails.admins.includes(this.loggedInUser._id)
                return {
                    _id: groupDetails._id,
                    coverImgUrl: groupDetails.coverImgUrl,
                    name: groupDetails.name,
                    membersCount: groupDetails.members.length,
                    groupType: groupDetails.groupType,
                    lastPostAt: groupDetails.lastPostAt,
                    isAdmin
                };
            });
            this.groups = await Promise.all(groupsPromises)
        },
        replaceImage() {
            var img = document.getElementById('group-cover');
            img.src = 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704274663/projects/Neckbook/website-images/Persian_Cat_Facts_History_Personality_and_Care___ASPCA_Pet_Health_Insurance___white_Persian_cat_resting_on_a_brown_sofa-min_rgtjby.jpg'; // Set your alternate image URL here
            img.onerror = null; // Remove the onerror handler to avoid an infinite loop
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
        lastPost(date){
            return utilService.timeAgoString(date)
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
            })
        }
    },
    created() {
        this.loadData()
    }
}
</script>

<style lang="scss"></style>