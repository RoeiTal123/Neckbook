<template>
    <section v-if="mediaType !== 'media'" class="sub-page-media info">
        <div class="sub-header">
            <span class="title">{{ mediaType.substring(1,mediaType.length-1) }}s</span>
            <div>
                <button>Add photos/videos</button>
                <div class="hovered-area">
                    <SvgIcon :iconName="'options'" />
                </div>
            </div>
        </div>
        <div class="sub-navbar">
            <RouterLink :to="`/${paths[0]}/${paths[1]}/${paths[2]}/all`" :class="{ 'active-link': paths[3] === 'all' }">All
                {{mediaType.substring(1,mediaType.length-1)}}s</RouterLink>
            <RouterLink :to="`/${paths[0]}/${paths[1]}/${paths[2]}/albums`"
                :class="{ 'active-link': paths[3] === 'albums' }">Albums</RouterLink>
        </div>
        <div v-if="displayedImageMedia" class="sub-container">
            <div v-for="media in displayedMedia" class="sub-media-container">
                <video v-if="mediaType === '/video/'" controls>
                    <source :src="media" type="video/mp4">
                </video>
                <img v-if="mediaType === '/image/'" :src="media"/>
            </div>
        </div>
    </section>
    <section v-else class="sub-page-media info">
        <div class="sub-header">
            <span class="title">{{ mediaType }}</span>
            <div>
                <button>Add photos/videos</button>
                <div class="hovered-area">
                    <SvgIcon :iconName="'options'" />
                </div>
            </div>
        </div>
        <div class="sub-navbar">
            <RouterLink :to="`/${paths[0]}/${paths[1]}/${paths[2]}/videos`" :class="{ 'active-link': paths[3] === 'videos' }">
                Videos
            </RouterLink>
            <RouterLink :to="`/${paths[0]}/${paths[1]}/${paths[2]}/photos`" :class="{ 'active-link': paths[3] === 'photos' }">
                Photos
            </RouterLink>
        </div>
        <div v-if="displayedImageMedia.length !== 0 && (selectedGroupMedia === 'photos')" class="sub-container">
            <div v-for="photo in displayedImageMedia" class="sub-media-container">
                <img :src="photo"/>
            </div>
        </div>
        <div v-if="displayedVideoMedia.length !== 0 && (selectedGroupMedia === 'videos')" class="sub-container">
            <div v-for="video in displayedVideoMedia" class="sub-media-container">
                <video controls>
                    <source :src="video" type="video/mp4">
                </video>
            </div>
        </div>
    </section>
</template>

<script>
import SvgIcon from './SvgIcon.vue'
export default {
    props: {
        media: {
            type: Array,
            required: false
        },
        mediaType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            paths: [],
            displayedMedia: [],
            displayedImageMedia:[],
            displayedVideoMedia:[],
            selectedGroupMedia: 'photos'
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
    methods: {
        setDisplayedMedia() {
            console.log(this.media)
            if(this.media !== undefined){
                if(this.mediaType !== 'media'){
                    for (let mediaUrl of this.media) {
                        if (mediaUrl.includes(this.mediaType)) {
                            this.displayedMedia.push(mediaUrl)
                        }
                    }
                } else {
                    for (let mediaUrl of this.media) {
                        if (mediaUrl.includes('/image/')) {
                            this.displayedImageMedia.push(mediaUrl)
                        } else if (mediaUrl.includes('/video/')) {
                            this.displayedVideoMedia.push(mediaUrl)
                        }
                    }
                }
            }
            console.log(`there are ${this.displayedMedia.length} media files of type ${this.mediaType}`)
        },
        updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path;
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            if(this.paths[3]){
                this.selectedGroupMedia=this.paths[3]
            } else {
                this.selectedGroupMedia='photos'
            }
            // console.log(this.typeOfUsersToDisplay)
        },
        loadMedia() {
            this.setDisplayedMedia()
            this.updateRoutes()
        }
    },
    components: {
        SvgIcon
    },
    created() {
        this.loadMedia()
    }
}
</script>

<style lang="scss"></style>