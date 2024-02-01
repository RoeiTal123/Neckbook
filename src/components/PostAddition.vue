<template>
    <div class="blur"></div>
    <section class="post-addition">
        <div class="addition-model">
            <span class="header">
                <div>
                    <div class="x-left" @click="goBack()">
                        <SvgIcon :iconName="'close'" />
                    </div>
                </div>
                <span>Create post</span>
                <div>
                    <div class="x-right" @click="goBack()">
                        <SvgIcon :iconName="'close'" />
                    </div>
                    <button class="btn-add-post-header" id="btn-add-post-header" @click="createPost()">Post</button>
                </div>
            </span>
            <div class="post">
                <div v-if="user" class="user-showcase">
                    <img :src="user.avatar" />
                    <div class="inner">
                        <span>{{ user.fullName }}</span>
                        <select id="post-viewers">
                            <option value="friends">friends</option>
                            <option value="public">public</option>
                            <option value="private">private</option>
                        </select>
                    </div>
                </div>
                <div v-if="user" class="post-add-container">
                    <textarea @input="checkText()" class="post-txt" id="post-txt" :placeholder="`What's on your mind, ${getFirstName()}?`" />
                </div>
                <div v-if="addPicture" class="photos-container">
                    pictures here
                </div>
                <div class="post-effects">
                    <img class="large-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096982/projects/Neckbook/svg%20images/font_1_yybwyi.png" />
                    <img class="medium-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096264/projects/Neckbook/svg%20images/smile_w5wim2.png" />
                </div>
                <div class="document-addition">
                    <span>Add to your post</span>
                    <div class="additions">
                        <img v-if="!oldPost" class="medium-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703946502/projects/Neckbook/svg%20images/Ivw7nhRtXyo_et9veu.png" @click="togglePicture()"/>
                        <img v-if="oldPost && oldPost.videoUrl === null" class="medium-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703946502/projects/Neckbook/svg%20images/Ivw7nhRtXyo_et9veu.png" @click="togglePicture()"/>
                        <img v-if="oldPost && oldPost.videoUrl !== null" class="medium-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706799599/projects/Neckbook/svg%20images/images_d7ag9l.png" />

                        <img class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096518/projects/Neckbook/svg%20images/mention_ltdjww.png" />
                        <img class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096277/projects/Neckbook/svg%20images/smile_2_ytwacf.png" />
                        <img class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096513/projects/Neckbook/svg%20images/gps_1_lqlzpm.png" />

                        <img v-if="!oldPost" class="medium-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706106224/projects/Neckbook/svg%20images/gif-symbol_r2lrkl.png" />
                        <img v-if="oldPost && oldPost.imgUrls.length === 0" class="medium-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706106224/projects/Neckbook/svg%20images/gif-symbol_r2lrkl.png" />
                        <img v-if="oldPost && oldPost.imgUrls.length !== 0" class="medium-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706797706/projects/Neckbook/svg%20images/gif-symbol_1_qkejga.png" title="can add with images or videos" />
                    </div>
                </div>
                <button v-if="oldPost" class="btn-add-post" id="btn-add-post" @click="updatePost()">
                    <span v-if="oldPost">
                        Save
                    </span>
                </button>
                <button v-else class="btn-add-post" id="btn-add-post" @click="createPost()">
                    <span>
                        Post
                    </span>
                </button>
            </div>
        </div>
    </section>
</template>

<script>
import SvgIcon from './SvgIcon.vue';

import router from '../router';
import { postService } from '../services/postService';
import { utilService } from '../services/util.service';
import { toRaw } from 'vue';

export default {
    data() {
        return {
            user: null,
            newPost: {},
            oldPost: null,
            background: 'none',
            paths: [],
            addPicture: false
        }
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
            if(this.paths[this.paths.length-2] === 'post'){
                console.log('existing post')
                this.setPostData()
            } 
            // console.log(this.paths)
        },
        async setPostData() {
            this.oldPost = await postService.getById(this.paths[this.paths.length - 1])
            // console.log('this post : ', this.oldPost)
            document.getElementById('post-txt').value=toRaw(this.oldPost).txt
        },
        getFirstName() {
            const fullname = this.user.fullName.split(" ")
            return fullname[0]
        },
        checkText() {
            const txt = document.getElementById('post-txt').value
            if (txt !== '') {
                document.getElementById('btn-add-post').classList.add('allowed')
                document.getElementById('btn-add-post-header').classList.add('allowed')
            } else {
                document.getElementById('btn-add-post').classList.remove('allowed')
                document.getElementById('btn-add-post-header').classList.remove('allowed')
            }
        },
        togglePicture(){
            this.addPicture = !this.addPicture
        },
        createPost() {
            const txt = document.getElementById('post-txt').value
            if (txt === '') {
                console.log('type something')
                return
            }
            if (utilService.isTxtOnlySpaces(txt)) {
                console.log('no empty')
                return
            }
            const newPost = {
                _id: utilService.makeId(),
                txt,
                background: this.background,
                ownerId: this.user._id,
                postType: 'normal',
                postGroupId: null,
                imgUrls: [],
                videoUrl: null,
                likedByUsers: [],
                sharedByUsers: [],
                comments: [],
                createdAt: Date.now()
            }
            try {
                postService.save(newPost)
                console.log('post created')
            } catch (err) {
                console.log('cant create post')
            }
            this.goBack()
        },
        updatePost() {
            const txt = document.getElementById('post-txt').value
            if (txt === '') {
                console.log('type something')
                return
            }
            if (utilService.isTxtOnlySpaces(txt)) {
                console.log('no empty')
                return
            }
            const updatedPost = {...toRaw(this.oldPost), txt:txt }
            try {
                postService.save(updatedPost)
                console.log('post saved')
            } catch (err) {
                console.log('cant save post')
            }
            this.goBack()
        },
        goBack() {
            router.go(-1)
            document.getElementById('body').style.overflow = 'scroll'
        },
    },
    components: {
        SvgIcon
    },
    async created() {
        // console.log('im here')
        window.scrollTo(0, 0);
        document.getElementById('body').style.overflow = 'hidden'
        this.user = await userService.getLoggedinUser()
        this.updateRoutes()
    }
}
</script>

<style lang="scss">

</style>