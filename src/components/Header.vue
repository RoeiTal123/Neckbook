<template>
    <nav v-if="paths[0]" class="app-header">
        <div class="main-header">
            <div v-if="isLoggedIn" class="header-left">
                <RouterLink to="/main">
                    <img
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703779937/projects/Neckbook/Neckbook-logo_iil57x.png" />
                </RouterLink>
                <div class="full-search">
                    <SvgIcon :iconName="'search'" />
                    <input class="search" placeholder="Search Neckbook" />
                </div>
            </div>
            <div v-if="isLoggedIn" class="header-middle">
                <div v-for="link in links" :key="link" class="link" :class="{ 'active-link': paths[0] === link }">
                    <RouterLink :to="`/${link}`">
                        <SvgIcon :iconName="link" :active="paths[0] === link" />
                    </RouterLink>
                </div>
            </div>
            <div v-if="isLoggedIn" class="header-right">
                <div class="link" :class="(paths[0] === 'menu') ? 'active-link hovered-area' : 'hovered-area'">
                    <SvgIcon :iconName="'menu'" :active="paths[0] === 'menu'" />
                </div>

                <div class="link" :class="(paths[0] === 'messenger') ? 'active-link hovered-area' : 'hovered-area'">
                    <RouterLink class="hovered-area" :to="'/messenger'">
                        <SvgIcon :iconName="'messenger'" :active="paths[0] === 'messenger'" />
                    </RouterLink>
                </div>
                <div class="link" :class="(paths[0] === 'notification') ? 'active-link hovered-area' : 'hovered-area'">
                    <SvgIcon :iconName="'notification'" :active="paths[0] === 'notification'" />
                </div>

                <!-- <div v-for="link in links2" :key="link" class="link" :class="{ 'active-link': paths[0] === link }">
                    <RouterLink class="hovered-area" :to="`/${link}`">
                        <SvgIcon :iconName="link" :active="paths[0] === link" />
                    </RouterLink>
                </div> -->

                <RouterLink v-if="user" :to="`/profile/${user._id}`">
                    <img v-if="user.avatar" :src="user.avatar" />
                    <img v-else
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708621438/projects/Neckbook/website-images/user_eqfe6m.png" />
                </RouterLink>
            </div>
            <div v-if="!isLoggedIn" class="login-header">
                <span class="logo">Neckbook</span>
                <div class="login-header-section">
                <input type="text" id="email-or-phone-header-input" placeholder="Email or phone number" />
                <input type="text" id="password-header-input" placeholder="Password" />
                <button class="login-btn" @click="() => logIn()">Log In</button>
                <span>Forgot password?</span>
            </div>
            </div>
        </div>
        <div class="navbar">
            <div v-if="isLoggedIn" class="header-middle">
                <div v-for="link in links" :key="link" class="link" :class="{ 'active-link': paths[0] === link }">
                    <RouterLink :to="`/${link}`">
                        <SvgIcon :iconName="link" :active="paths[0] === link" />
                    </RouterLink>
                </div>
            </div>
        </div>
    </nav>
    <div v-if="paths[paths.length - 1] === 'post' || paths[paths.length - 2] === 'post'">
        <PostAddition />
    </div>
    <div v-if="paths[paths.length - 2] === 'post-preview'">
        <PostDisplay />
    </div>
    <div v-if="!isNotDisplayLogModel && paths[0]">
        <LoginModel :toggleLogModel="toggleLogModel"/>
    </div>
</template>

<script>
import SvgIcon from './SvgIcon.vue'
import PostAddition from './PostAddition.vue'
import PostDisplay from './PostDisplay.vue'
import LoginModel from './LoginModel.vue'

import { userService } from '../services/userService'
import { utilService } from '../services/util.service'

export default {
    data() {
        return {
            links: ['main', 'friends', 'videos', 'marketplace', 'groups'],
            links2: ['menu', 'messenger', 'notification'],
            user: {},
            page: 'home',
            paths: [],
            isNotDisplayLogModel: false,
            isLoggedIn:false
        }
    },
    components: {
        SvgIcon,
        PostAddition,
        PostDisplay,
        LoginModel
    },
    watch: {
        $route(to, from) {
            this.updateRoutes();
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
        toggleLogModel(){
            this.isNotDisplayLogModel = true
            document.getElementById('body').style.overflow = 'auto'
        },
        logIn() {
            const phoneOrEmail = document.getElementById('email-or-phone-header-input').value
            const password = document.getElementById('password-header-input').value
            let user
            if (utilService.isPhoneNumberOrEmail(phoneOrEmail) === 'Email') {
                user = userService.login({ password: password, email: phoneOrEmail })
            } else if (utilService.isPhoneNumberOrEmail(phoneOrEmail) === 'Phone Number') {
                user = userService.login({ password: password, phoneNumber: phoneOrEmail })
            } else {
                console.log('no account?')
                return
            }
            console.log(`welcome ${user.fullName} to Neckbook :)`)
            this.$router.push('/main')
        }
    },
    async created() {
        this.user = await userService.getLoggedinUser()
        if (this.user) {
            this.isNotDisplayLogModel = true
            this.isLoggedIn = true
        } else {
            window.scrollTo(0, 0)
            document.getElementById('body').style.overflow = 'hidden'
        }
    },
    mounted(){
        if (!this.user) {
            document.getElementById('email-or-phone-header-input').value = 'peter123@gmail.com'
            document.getElementById('password-header-input').value = '123'
        }
    }
}
</script>

<style lang="scss"></style>