<template>
    <section class="friends-page">
        <section class="sticky">
            <SideNavbar :requests="requests" />
            <div class="friends" v-if="!paths[1]">
                <div class="friend-requests">
                    <div class="header">
                        <span>Friend requests</span>
                        <button>See All</button>
                    </div>
                    <div class="friend-request-list">
                        <div v-for="request in requests" class="friend-request">
                            <div v-if="request !== undefined && request.request._id !== user._id">
                                <img v-if="request.avatar" :src="request.avatar" />
                                <img v-else src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708621438/projects/Neckbook/website-images/user_eqfe6m.png"/>
                                <div class="request-actions">
                                    <span>{{ request.fullName }}</span>

                                    <div class="request-buttons">
                                        <button class="btn-confirm">Confirm</button>
                                        <button class="btn-delete">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <router-view></router-view>
        </section>
    </section>
</template>

<script>
import { userService } from '../services/userService';

import SideNavbar from '../components/SideNavbar.vue';

import { toRaw } from 'vue';
import router from '../router';

export default {
    data() {
        return {
            user: {},
            requests: [],
            paths: []
        }
    }, watch: {
        $route(to, from) {
            this.updateRoutes()
        },
    },
    methods: {
        filterRequests() {
            let usefullRequests = []
            for (let request of this.user.friendRequests) {
                if (request.type !== 'accepted') {
                    usefullRequests.push(request)
                }
            }
            return usefullRequests
        },
        async setRequests() {
            const filteredRequests=this.filterRequests()
            // console.log(filteredRequests)
            const requestsPromises = filteredRequests.map(async (request) => {
                const userDetails = await this.getUser(request._id)
                return {
                    _id: userDetails._id,
                    avatar: userDetails.avatar,
                    fullName: userDetails.fullName,
                    request: { ...request }
                }
            })
            this.requests = await Promise.all(requestsPromises);
        }, updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path;
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            // console.log(this.paths)
        },
        async getUser(id) {
            return await userService.getById(id)
        },
        goBack() {
            router.go(-1)
        }
    },
    components: {
        SideNavbar
    },
    async created() {
        this.user = await userService.getLoggedinUser()
        if(this.user){
            this.setRequests()
            this.updateRoutes()
        } else {
            this.goBack()
        }
    }
}
</script>

<style lang="scss"></style>