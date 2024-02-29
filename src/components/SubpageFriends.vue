<template>
    <section class="sub-page-friends info" :class="(pageType === 'group') ? 'group' : ''">
        <div class="sub-header">
            <span class="title">
                {{ (pageType === 'group') ? `Members · ${members.length}` : 'Friends'}}
            </span>
            <div>
                <div class="full-search">
                    <SvgIcon :iconName="'search'" />
                    <input class="search" :placeholder="(pageType !== 'group') ? 'Search' : 'Find members'" />
                </div>
                <RouterLink v-if="(pageType !== 'group')" to="/friends/requests">Friend requests</RouterLink>
                <RouterLink v-if="(pageType !== 'group')" to="/friends">Find friends</RouterLink>
                <div v-if="(pageType !== 'group')" class="hovered-area">
                    <SvgIcon :iconName="'options'" />
                </div>
            </div>
        </div>
        <div v-if="(pageType !== 'group')" class="sub-navbar">
            <RouterLink :to="`/${paths[0]}/${paths[1]}/${paths[2]}/all`" :class="{ 'active-link': (paths[3] === 'all') || (!paths[3]) }">All friends</RouterLink>
            <RouterLink :to="`/${paths[0]}/${paths[1]}/${paths[2]}/following`" :class="{ 'active-link': paths[3] === 'following' }">following</RouterLink>
        </div>
        <div class="sub-friends-container-area">
            <span v-if="pageType === 'group'">Admins</span>
            <div v-if="pageType === 'group'" class="sub-friends-container" :class="pageType === 'group' ? 'group' : ''">
                <div v-for="admin in admins" class="sub-friend-container" >
                    <RouterLink :to="`/profile/${admin._id}`">
                        <img :src="admin.avatar"/>
                        <span>{{ admin.fullName }}</span>
                    </RouterLink>
                    <SvgIcon :iconName="'options'" />
                </div>
            </div>
            <span v-if="pageType === 'group'">Members</span>
            <div v-if="typeOfUsersToDisplay==='all'" class="sub-friends-container" :class="pageType === 'group' ? 'group' : ''">
                <div v-for="user in usersToDisplay" class="sub-friend-container">
                    <RouterLink :to="`/profile/${user._id}`">
                        <img :src="user.avatar"/>
                        <span>{{ user.fullName }}</span>
                    </RouterLink>
                    <SvgIcon :iconName="'options'" />
                </div>
            </div>
            <div v-else class="sub-friends-container">
                followed pages
            </div>
        </div>
    </section>
</template>

<script>
import SvgIcon from './SvgIcon.vue'
export default {
    props: {
        pageType: { //both
            type: String,
            required: true
        },
        fullPath: { //both
            type: String,
            required: true
        },
        friends: { //profile
            type: Array,
            required: false
        },
        members: { //group
            type: Array,
            required: false
        }
    },
    data(){
        return {
            paths:[],
            usersToDisplay:[],
            typeOfUsersToDisplay:'all',
            admins:[]
        }
    },
    watch: {
        $route(to, from) {
            this.updateRoutes();
            // console.log(to.path,' ',from.path)
            // if (to.path !== from.path) {
            //     this.loadData()
            // }
        }
    },
    methods:{
        updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path;
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            if (this.paths[this.paths.length - 3]) {
                this.whatToDisplay = this.paths[this.paths.length - 1].toLowerCase()
            } else {
                this.whatToDisplay = 'posts'
            }

            if(this.paths[3]){
                this.typeOfUsersToDisplay = this.paths[3]
            } else {
                this.typeOfUsersToDisplay = 'all'
            }
            // console.log(this.typeOfUsersToDisplay)
        },
        setAdmins(){
            for(let member of this.members){
                if (member.isAdmin) this.admins.push({...member})
            }
        }
    },
    components:{
        SvgIcon
    },
    created(){
        if(this.pageType === 'user'){
            this.usersToDisplay=[...this.friends]
        } else {
            this.setAdmins()
            this.usersToDisplay=[...this.members]
        }
        // console.log(this.members)
        this.updateRoutes()
    }
}
</script>

<style lang="scss">

</style>