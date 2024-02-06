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
                <div class="user-input">
                    <div v-if="user" class="post-add-container">
                        <textarea @input="checkText()" class="post-txt" id="post-txt"
                            :placeholder="`What's on your mind, ${getFirstName()}?`" />
                    </div>
                    <div v-if="addPicture" class="media-interactions">
                        <div class="media-container" id="media-container">
                            <div v-if="oldPost" class="photo-container" v-for="photo in oldPost.imgUrls" :id="photo">
                                <img :src="photo" />
                                <div class="emote-container" @click="cancelPhoto(photo)">
                                    <span :class="`cancel-img cancel-img-${photo}`">
                                        <SvgIcon :iconName="'close'" />
                                    </span>
                                </div>
                            </div>
                            <div v-if="oldPost && oldPost.videoUrl">
                                <video width="100%" controls>
                                    <source :src="oldPost.videoUrl" type="video/mp4">
                                </video>
                            </div>
                            <div v-if="!oldPost || (oldPost && oldPost.imgUrls.length === 0 && !oldPost.videoUrl) || (deletedImgs.length === newImgs.length + this.oldPost.imgUrls.length)"
                                class="add-media-container" id="add-media-container" @click="triggerHandlingFile()">
                                <div>
                                    <img class="normal-emote"
                                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707039880/projects/Neckbook/svg%20images/image-gallery_zzrdx7.png" />
                                </div>
                                <span>Add Photos/Videos</span>
                                <span>or drag and drop</span>
                            </div>
                            <div v-if="((oldPost && oldPost.imgUrls.length >= 0 && !oldPost.videoUrl) || (deletedImgs.length !== newImgs.length + this.oldPost.imgUrls.length))"
                                class="add-media-mini-container" id="add-media-mini-container"
                                @click="triggerHandlingFile()">
                                <img class="normal-emote"
                                    src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707039880/projects/Neckbook/svg%20images/image-gallery_zzrdx7.png" />
                                <span>Add Photos/Videos</span>
                            </div>
                            <input class="add-file-input" id="add-file-input" type="file" placeholder="bread"
                                @change="handleFile()" />
                        </div>
                    </div>
                </div>
                <div class="post-effects">
                    <img class="large-emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096982/projects/Neckbook/svg%20images/font_1_yybwyi.png" />
                    <img class="medium-emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096264/projects/Neckbook/svg%20images/smile_w5wim2.png" />
                </div>
                <div class="document-addition">
                    <span>Add to your post</span>
                    <div class="additions">
                        <img v-if="!oldPost" class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703946502/projects/Neckbook/svg%20images/Ivw7nhRtXyo_et9veu.png"
                            @click="togglePicture()" />
                        <img v-if="oldPost && oldPost.videoUrl === null" class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703946502/projects/Neckbook/svg%20images/Ivw7nhRtXyo_et9veu.png"
                            @click="togglePicture()" />
                        <img v-if="oldPost && oldPost.videoUrl !== null" class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706799599/projects/Neckbook/svg%20images/images_d7ag9l.png" />

                        <img class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707234137/projects/Neckbook/svg%20images/mention_wjdl1x.png" />
                        <img class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096277/projects/Neckbook/svg%20images/smile_2_ytwacf.png" />
                        <img class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707234114/projects/Neckbook/svg%20images/gps_1_r6ahhf.png" />

                        <img v-if="!oldPost" class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706106224/projects/Neckbook/svg%20images/gif-symbol_r2lrkl.png" />
                        <img v-if="oldPost && oldPost.imgUrls.length === 0" class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706106224/projects/Neckbook/svg%20images/gif-symbol_r2lrkl.png" />
                        <img v-if="oldPost && oldPost.imgUrls.length !== 0" class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706797706/projects/Neckbook/svg%20images/gif-symbol_1_qkejga.png"
                            title="can add with images or videos" />
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
import { uploadService } from '../services/upload.service';
import { toRaw } from 'vue';

export default {
    data() {
        return {
            user: null,
            newPost: {},
            oldPost: null,
            background: 'none',
            paths: [],
            addPicture: false,
            newImgs: [],
            deletedImgs: []
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
            if (this.paths[this.paths.length - 2] === 'post') {
                // console.log('existing post')
                this.setPostData()
            }
            // console.log(this.paths)
        },
        async setPostData() {
            this.oldPost = await postService.getById(this.paths[this.paths.length - 1])
            // console.log('this post : ', this.oldPost)
            document.getElementById('post-txt').value = toRaw(this.oldPost).txt
            if (toRaw(this.oldPost.imgUrls).length !== 0) {
                this.addPicture = true
            }
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
        togglePicture() {
            this.addPicture = !this.addPicture
        },
        triggerHandlingFile() {
            // Programmatically click the hidden file input
            document.getElementById('add-file-input').click();
        },
        handleFile() {
            var fileInput = document.getElementById('add-file-input')

            if (fileInput.files.length > 0) {
                var file = fileInput.files[0]
                var reader = new FileReader()
                var newImgElement = document.createElement('img');
                newImgElement.classList.add('new-image-here')
                var mediaContainer = document.getElementById('media-container')
                if ((this.oldPost) === null) {
                    if (toRaw(this.newImgs).length === 0) {
                        reader.onload = function (e) {
                            document.getElementById('add-media-container').style.backgroundImage = `url('${URL.createObjectURL(file)}')`
                        }
                    }
                    else {
                        reader.onload = function (e) {
                            newImgElement.src = reader.result

                            newImgElement.alt = 'Description of the image'

                            mediaContainer.appendChild(newImgElement)
                        }
                    }
                } else {
                    reader.onload = function (e) {
                        newImgElement.src = reader.result

                        newImgElement.alt = 'Description of the image'

                        mediaContainer.appendChild(newImgElement)
                    }
                }
                // reader.onload = function (e) {
                //     // Set the data URL as the source of the image
                //     // displayedImage.src = e.target.result
                //     if ((!this.oldPost)) {
                //         if (!this.newImgs) {
                //             document.getElementById('add-media-container').style.backgroundImage = `url('${URL.createObjectURL(file)}')`
                //         }
                //         else {

                //             document.getElementById('new-image-here').style.backgroundImage = `url('${URL.createObjectURL(file)}')`
                //             document.getElementById('new-image-here').style.height = '225px'
                //         }
                //     } else {
                //         document.getElementById('new-image-here').style.backgroundImage = `url('${URL.createObjectURL(file)}')`
                //         document.getElementById('new-image-here').style.height = '225px'
                //     }
                //     // console.log(`url('${URL.createObjectURL(file)}')`)
                // }
                this.uploadTheImage(fileInput)

                // Read the file as a data URL
                reader.readAsDataURL(file)
            }
        },
        async uploadTheImage(inputElement) {
            const url = await uploadService.uploadImg(inputElement)
            // console.log(url.secure_url)
            this.newImgs.push(`${url.secure_url}`)
        },
        cancelPhoto(imgUrl) {
            // console.log(`delete image ${imgUrl}`)
            document.getElementById(imgUrl).style.display = 'none'
            this.deletedImgs.push(imgUrl)
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
                imgUrls: [...this.newImgs],
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
            // console.log(this.newImgs)
            let allImgs = [...this.oldPost.imgUrls]
            if (toRaw(this.newImgs).length !== 0) {
                allImgs = allImgs.concat(toRaw(this.newImgs))
            }
            const finalImgs = utilService.removeCommonElements(allImgs, toRaw(this.deletedImgs))
            // console.log('all images : ',allImgs)
            // console.log('cancelled imaged : ',toRaw(this.deletedImgs))
            // console.log('final images : ',finalImgs)
            const updatedPost = { ...toRaw(this.oldPost), txt: txt, imgUrls: finalImgs }
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
        SvgIcon,
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

<style lang="scss"></style>