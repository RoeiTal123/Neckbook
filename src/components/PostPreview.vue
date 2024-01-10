<template>
    <div class="post-preview">
        <div class="post-header">
            <div>
                <img :src="user.avatar" />
                <div class="post-details">
                    <span>{{ user.username }}</span>
                    <span>{{ getPostDate() }}</span>
                </div>
            </div>
            <div>
                <SvgIcon :iconName="'options'" />
                <div>
                    <SvgIcon :iconName="'close'" />
                </div>
            </div>
        </div>
        <div class="description">
            {{ post.description }}
        </div>
        <div v-if="!post.videoUrl" class="post-images">
            <div v-if="post.imgUrls.length === 1" class="one-image">
                <img :src="post.imgUrls[0]"  @load="loadPreview"/>
            </div>

            <div v-if="post.imgUrls.length === 2" class="two-image">
                <img :src="post.imgUrls[0]" />
                <img :src="post.imgUrls[1]"  @load="loadPreview"/>
            </div>

            <div v-if="post.imgUrls.length === 3" class="three-image">
                <img :src="post.imgUrls[0]" />
                <div>
                    <img :src="post.imgUrls[1]" />
                    <img :src="post.imgUrls[2]"  @load="loadPreview"/>
                </div>
            </div>

            <div v-if="post.imgUrls.length >= 4" class="four-image">
                <div>
                    <img :src="post.imgUrls[0]" />
                    <img :src="post.imgUrls[1]" />
                </div>
                <div>
                    <img :src="post.imgUrls[2]" />
                    <img :src="post.imgUrls[3]"  @load="loadPreview"/>
                </div>
            </div>
        </div>
        <div v-else>
            <video width="100%" controls>
                <source :src="post.videoUrl" type="video/mp4">
            </video>
        </div>
        <div class="post-interacted">
            <div>
                <div v-if="post.likedByUsers.length > 0" class="like-count">
                    <SvgIcon :iconName="'like'" />
                    <span>{{ post.likedByUsers.length }}</span> 
                    <!-- it shows 20 random names of those that liked it -->
                </div>
                <div v-else>
                    Be the first to like this post!
                </div>
            </div>
            <div class="viewers-interactions">
                <span v-if="post.comments.length > 0">{{ post.comments.length }} {{ (post.comments.length === 1 ? 'comment'
                    : 'comments') }}</span>

                <span v-if="post.sharedByUsers.length !== 0">{{ post.sharedByUsers.length }} {{ (post.sharedByUsers.length ===
                    1 ? 'share' : 'shares') }}</span>
            </div>
        </div>
        <div class="post-interactions">
            <div class="interaction">
                <img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703929946/projects/Neckbook/svgs/Facebook_Like_unwg3r.png" class="like"/>
                <span>Like</span>
            </div>
            <div class="interaction">
                <SvgIcon :iconName="'comment'" />
                <span>Comment</span>
            </div>
            <div class="interaction">
                <SvgIcon :iconName="'share'" />
                <span>Share</span>
            </div>
        </div>
    </div>
    <!-- <div id="skeleton" class="post-skeleton">
        <div class="post-header">
            <div>
                <div class="user-image"></div>
                <div class="post-details">
                    <span v-if="post.postGroupId === null" class="username"></span>
                    <span class="date"></span>
                </div>
            </div>
            <div>
                <SvgIcon :iconName="'options'" />
                <div>
                    <SvgIcon :iconName="'close'" />
                </div>
            </div>
        </div>
        <div class="description"></div>
        <div v-if="!post.videoUrl" class="post-images"></div>
        <div v-else>
            <video height="622" controls>
                <source :src="post.videoUrl" type="video/mp4">
            </video>
        </div>
        <div class="post-interacted">
            <div><div v-if="post.likedByUsers.length > 0" class="like-count"></div></div>
            <div class="viewers-interactions"></div>
        </div>
        <div class="post-interactions">
            <div class="interaction">
                <img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703929946/projects/Neckbook/svgs/Facebook_Like_unwg3r.png" class="like"/>
                <span>Like</span>
            </div>
            <div class="interaction">
                <SvgIcon :iconName="'comment'" />
                <span>Comment</span>
            </div>
            <div class="interaction">
                <SvgIcon :iconName="'share'" />
                <span>Share</span>
            </div>
        </div>
    </div> -->
</template>

<script>
import { userService } from '../services/userService';
import { utilService } from '../services/util.service';

import SvgIcon from '../components/SvgIcon.vue';

export default {
    props: {
        post: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            user: {},
            didLike: false
        }
    },
    methods: {
        async setUserData(id) {
            this.user = await userService.getById(id)
        },
        getPostDate() {
            return utilService.timeAgoString(this.post.createdAt)
        },
    },
    components: {
        SvgIcon
    },
    created() {
        this.setUserData(this.post.ownerId)
        if(this.post.likedByUsers.includes(userService.getLoggedinUser._id)){
            this.didLike = true
        } else {
            this.didLike = false
        }
    }
}
</script>

<style lang="scss">

</style>