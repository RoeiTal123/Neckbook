<template>
    <div class="blur"></div>
    <div class="post-container">
        <section v-if="post !== null" class="post-display">

            <div class="header">
                <div></div>
                <span>
                    {{ user.fullName }}'s Post
                </span>
                <div>
                    <div class="x">
                        <span @click="goBack()">
                            <SvgIcon :iconName="'close'" />
                        </span>
                    </div>
                </div>
            </div>
            <div class="post-container">
                <PostPreview :post="post" />
            </div>
            <div v-if="loggedinUser" class="comment-addition">
                <img v-if="loggedinUser.avatar" :src="loggedinUser.avatar" />
                <img v-else src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708621438/projects/Neckbook/website-images/user_eqfe6m.png"/>
                <div class="comment">
                    <input type="text" id="comment" placeholder="Write a public comment..." />
                    <div class="comment-actions">
                        <div>emotes here</div><img @click="() => addComment()"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1705565840/projects/Neckbook/svg%20images/paper-plane_djmb9g.png" />
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { utilService } from '../services/util.service';

import SvgIcon from './SvgIcon.vue';
import PostPreview from './PostPreview.vue';
import CommentSection from './CommentSection.vue';
import router from '../router';

export default {
    data() {
        return {
            paths: [],
            loggedinUser: {},
            user: {},
            post: null,
            comments: [],
            didLike: false,
            previousUrl: ''
        }
    },
    methods: {
        updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path;
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            // console.log(this.paths)
        },
        async setPostData() {
            this.post = await postService.getById(this.paths[this.paths.length - 1])
            if(userService.getLoggedinUser()){
                if (this.post.likedByUsers.includes(userService.getLoggedinUser()._id)) {
                    this.didLike = true
                } else {
                    this.didLike = false
                }
            }
            // console.log('this post : ', this.post)
        },
        async setUserData() {
            this.loggedinUser = await userService.getLoggedinUser()
            this.user = await userService.getById(this.post.ownerId)
            //console.log('this user : ',this.user)
        },
        async setComments() {
            this.comments = await commentService.query({ postId: this.post._id })
            //console.log('this comments : ',this.comments)
        },
        getPostDate() {
            return utilService.timeAgoString(this.post.createdAt)
        },
        loadData() {
            this.updateRoutes()
            this.setPostData().then(() => this.setUserData().then(() => this.setComments()))
            if(!userService.getLoggedinUser()){
                this.goBack()
            }
        },
        addComment() {
            const txt = document.getElementById('comment').value
            // console.log("new comment: ", txt, ", by user:", this.loggedinUser.fullName)
            const newComment = {
                _id: utilService.makeId(),
                postId: this.post._id,
                ownerId: this.loggedinUser._id,
                txt,
                imgUrl: null,
                videoUrl: null,
                level: 1,
                replies: [],
                likedByUsers: [],
                createdAt: Date.now()
            }
            // console.log('new comment: ',newComment)
            try {
                commentService.save(newComment)
                // console.log('comment saved')
                this.post.comments.push(newComment._id)
                try {
                    postService.save({ ...this.post })
                    console.log('comment id was added to post')
                } catch (err) {
                    console.log('comment id wasnt added to post : ', err)
                }
            } catch (err) {
                console.lof('comment wasnt added : ', err)
            }
        },
        goBack() {
            router.go(-1)
            document.getElementById('body').style.overflow = 'auto'
        }
    },
    components: {
        SvgIcon,
        PostPreview,
        CommentSection
    },
    created() {
        // console.log(document.getElementById('body'))
        window.scrollTo(0, 0);
        document.getElementById('body').style.overflow = 'hidden'
        this.loadData()
    }
}

</script>

<style lang="scss"></style>