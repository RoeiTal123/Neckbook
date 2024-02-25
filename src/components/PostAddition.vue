<template>
    <div class="blur"></div>
    <section class="post-addition">
        <div class="addition-model">
            <span class="header">
                <div>
                    <div class="x-left" @click="goBack()">
                        <img class="normal-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707996834/projects/Neckbook/svg%20images/arrow_ncg7po.png" />
                    </div>

                    <span>
                        Create post
                    </span>
                </div>
                <span>
                    Create post
                </span>
                <div>
                    <div class="x-right" @click="goBack()">
                        <SvgIcon :iconName="'close'" />
                    </div>
                    <button class="btn-add-post-header" id="btn-add-post-header" @click="createPost()">Post</button>
                </div>
            </span>
            <div class="post">
                <div v-if="user" class="user-showcase">
                    <img v-if="user.avatar" :src="user.avatar" />
                    <img v-else src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708621438/projects/Neckbook/website-images/user_eqfe6m.png"/>
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
                            <div v-if="oldPost" class="photo-container" v-for="photo in oldPost.mediaUrls"
                                :id="(photo.src ? photo.src : photo)">
                                <img v-if="mediaType(photo) === 'image' && photo.src" :src="photo.src" />
                                <img v-if="mediaType(photo) === 'image' && !photo.src" :src="photo" />

                                <video v-if="mediaType(photo) === 'video' && photo.src" width="100%" controls>
                                    <source :src="photo.src" type="video/mp4">
                                </video>
                                <video v-if="mediaType(photo) === 'video' && !photo.src" width="100%" controls>
                                    <source :src="photo" type="video/mp4">
                                </video>

                                <div class="emote-container" @click="cancelMedia(photo)">
                                    <span :class="`cancel-img cancel-img-${photo}`">
                                        <SvgIcon :iconName="'close'" />
                                    </span>
                                </div>
                            </div>


                            <div v-if="!oldPost || (oldPost && oldPost.mediaUrls.length === 0 && !oldPost.videoUrl) || (deletedMedia.length === newMedia.length + this.oldPost.mediaUrls.length)"
                                class="add-media-container" id="add-media-container" @click="triggerHandlingFile()">
                                <div>
                                    <img class="normal-emote"
                                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707039880/projects/Neckbook/svg%20images/image-gallery_zzrdx7.png" />
                                </div>
                                <span>Add Photos/Videos</span>
                                <span>or drag and drop</span>
                            </div>
                            <div v-if="((oldPost && oldPost.mediaUrls.length >= 0 && !oldPost.videoUrl) || (oldPost && deletedMedia.length !== newMedia.length + this.oldPost.mediaUrls.length))"
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
                    <div class="post-colors">
                        <img @click="() => togglePostColors()" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096982/projects/Neckbook/svg%20images/font_1_yybwyi.png" />
                        <div v-if="isColorMenu" class="colors-container">
                            <div v-for="color in colors" @click="() => selectColor(color)" :style="`background-color:${color};`" class="color-selector" :class="color===selectedColor ? 'selected' : ''"></div>
                        </div>
                    </div>
                    <img class="medium-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096264/projects/Neckbook/svg%20images/smile_w5wim2.png" />
                </div>
                <div class="document-addition">
                    <span>Add to your post</span>
                    <div class="additions">
                        <img class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703946502/projects/Neckbook/svg%20images/Ivw7nhRtXyo_et9veu.png"
                            @click="togglePicture()" />
                        <!-- <img v-if="oldPost && oldPost.mediaUrls !== null" class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706799599/projects/Neckbook/svg%20images/images_d7ag9l.png" /> -->

                        <img class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707234137/projects/Neckbook/svg%20images/mention_wjdl1x.png" />
                        <img class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096277/projects/Neckbook/svg%20images/smile_2_ytwacf.png" />
                        <img class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1707234114/projects/Neckbook/svg%20images/gps_1_r6ahhf.png" />

                        <img v-if="!oldPost" class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706106224/projects/Neckbook/svg%20images/gif-symbol_r2lrkl.png" />
                        <img v-if="oldPost && oldPost.mediaUrls.length === 0" class="medium-emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706106224/projects/Neckbook/svg%20images/gif-symbol_r2lrkl.png" />
                        <img v-if="oldPost && oldPost.mediaUrls.length !== 0" class="medium-emote"
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
            paths: [],
            addPicture: false,
            newMedia: [],
            deletedMedia: [],
            idsOfDeletedMedia: [],
            isColorMenu: false,
            colors:['#f0f2f5','#c600ff','#e2013b','#111111','#df075a','#743ddf','#fb803c','#4a4f5d','#3b1d51'],
            selectedColor: 'white'
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
            if (toRaw(this.oldPost.mediaUrls).length !== 0) {
                this.addPicture = true
            }
        },
        getFirstName() {
            const fullname = this.user.fullName.split(" ")
            return fullname[0]
        },
        checkText() {
            const txtBox = document.getElementById('post-txt')
            const txt = document.getElementById('post-txt').value
            if (txt !== '') {
                document.getElementById('btn-add-post').classList.add('allowed')
                document.getElementById('btn-add-post-header').classList.add('allowed')
            } else {
                document.getElementById('btn-add-post').classList.remove('allowed')
                document.getElementById('btn-add-post-header').classList.remove('allowed')
            }
        },
        updateFontSize(newSize){
            console.log(newSize)
            this.currentFontSize = newSize
        },
        togglePostColors(){
            this.isColorMenu = !this.isColorMenu
        },
        selectColor(color){
            this.selectedColor=color
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
                var fileType = file.type

                var reader = new FileReader()
                var newImgElement = document.createElement('img');
                var newVideoElement = document.createElement('video');
                var mediaContainer = document.getElementById('media-container')
                newImgElement.classList.add('new-image-here')
                newVideoElement.classList.add('new-video-here')

                if ((this.oldPost) === null) {
                    if (fileType.startsWith('video/')) {
                        if (toRaw(this.newMedia).length === 0) {
                            reader.onload = function (e) {
                                // document.getElementById('add-media-container').style.backgroundImage = `url('${URL.createObjectURL(file)}')`
                                document.getElementById('add-media-container').src = URL.createObjectURL(file)
                            }
                        }
                        else {
                            reader.onload = function (e) {
                                newVideoElement.src = reader.result

                                newVideoElement.alt = 'Description of the image'

                                newVideoElement.autoplay = true
                                newVideoElement.controls = true
                                newVideoElement.loop = true
                                newVideoElement.muted = true

                                mediaContainer.appendChild(newVideoElement)
                            }
                        }
                    } else {
                        if (toRaw(this.newMedia).length === 0) {
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
                //         if (!this.newMedia) {
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
                console.log('fileinput', fileInput)
                if (fileType.startsWith('video/')) {
                    this.uploadTheVideo(fileInput)
                } else if (fileType.startsWith('image/')) {
                    this.uploadTheImage(fileInput)
                }

                // Read the file as a data URL
                reader.readAsDataURL(file)
            }
        },
        async uploadTheImage(inputElement) {
            const url = await uploadService.uploadImg(inputElement)
            const id = url.public_id
            const publicId = id.split('/').pop()
            this.newMedia.push({ src: `${url.secure_url}`, id: publicId })
        },
        async uploadTheVideo(inputElement) {
            const url = await uploadService.uploadVideo(inputElement)
            const id = url.public_id
            const publicId = id.split('/').pop()
            this.newMedia.push({ src: `${url.secure_url}`, id: publicId })
        },
        async cancelMedia(mediaUrl) {
            let finalUrl
            if (mediaUrl.src) {
                finalUrl = mediaUrl.src
            } else {
                finalUrl = mediaUrl
            }
            console.log(`delete image ${finalUrl}`)
            document.getElementById(finalUrl).style.display = 'none'
            this.deletedMedia.push(finalUrl)
            // if (this.mediaType(finalUrl) === 'video') {
            //     const idOfMedia = await postService.getIdOfMediaBySrc(finalUrl)
            //     // console.log(idOfMedia)
            //     if (idOfMedia !== 'no id') {
            //         uploadService.deleteVideo(idOfMedia)
            //     }
            // } else if (this.mediaType(finalUrl) === 'image') {
            //     const idOfMedia = await postService.getIdOfMediaBySrc(finalUrl)
            //     // console.log(idOfMedia)
            //     if (idOfMedia !== 'no id') {
            //         uploadService.deleteImg(idOfMedia)
            //     }
            // }
        },
        mediaType(mediaUrl) {
            var sepMedia
            if (mediaUrl.src) {
                sepMedia = mediaUrl.src.split('/')
            } else {
                sepMedia = mediaUrl.split('/')
            }
            // console.log(sepMedia[4])
            return sepMedia[4]
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
                backgroundColor: this.selectedColor,
                ownerId: this.user._id,
                postType: 'normal',
                postGroupId: null,
                mediaUrls: [...this.newMedia],
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
            // console.log(this.newMedia)
            let allMedia = [...this.oldPost.mediaUrls]
            for (let media of toRaw(this.newMedia)) {
                allMedia.push(media.src)
            }
            if (toRaw(this.newMedia).length !== 0) {
                allMedia = allMedia.concat(toRaw(this.newMedia))
            }
            const finalMedia = utilService.removeCommonElements([...allMedia], [...toRaw(this.deletedMedia)])
            // console.log('all images : ',allMedia)
            // console.log('cancelled imaged : ',toRaw(this.deletedMedia))
            // console.log('final images : ',finalMedia)
            const updatedPost = { ...toRaw(this.oldPost), txt: txt, mediaUrls: finalMedia, backgroundColor: this.selectedColor }
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
            document.getElementById('body').style.overflow = 'auto'
        },
    },
    components: {
        SvgIcon,
        SvgIcon
    },
    async created() {
        // console.log('im here')
        window.scrollTo(0, 0)
        document.getElementById('body').style.overflow = 'hidden'
        this.user = await userService.getLoggedinUser()
        this.updateRoutes()
    }
}
</script>

<style lang="scss"></style>