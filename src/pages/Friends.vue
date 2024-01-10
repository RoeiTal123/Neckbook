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
                            <div v-if="request.request._id !== user._id">
                                <img :src="request.avatar" />
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
import SideNavbar from '@/components/SideNavbar.vue';
import { userService } from '@/services/userService';

export default {
    data() {
        return {
            user: {},
            requests: [],
            paths: []
        }
    }, watch: {
        $route(to, from) {
            this.updateRoutes();
        },
    },
    methods: {
        async setRequests() {
            const requestsPromises = this.user.friendRequests.map(async (request) => {
                const userDetails = await this.getUser(request._id);
                return {
                    _id: userDetails._id,
                    avatar: userDetails.avatar,
                    fullName: userDetails.fullName,
                    request: { ...request }
                };
            });
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
        }
    },
    components: {
        SideNavbar
    },
    async created() {
        this.user = await userService.getLoggedinUser()
        this.setRequests()
        this.updateRoutes()
    }
}
</script>

<style lang="scss"></style>