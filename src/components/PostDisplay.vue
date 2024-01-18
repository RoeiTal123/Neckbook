<template>
    <div class="blur"></div>
    <section v-if="post !== null" class="post-display">
        <div class="header">
            <span>
                {{ user.fullName }}'s Post
            </span>
        </div>
        <div class="post-container">
            <PostPreview :post="post" />
        </div>
        <div class="comment-addition">
            <img :src="loggedinUser.avatar" />
            <div class="comment">
                <input type="text" id="comment" placeholder="Write a public comment..." />
                <div class="comment-actions">
                    <div>emotes here</div><img @click="() => addComment()"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1705565840/projects/Neckbook/svg%20images/paper-plane_djmb9g.png" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { utilService } from '../services/util.service';

import SvgIcon from './SvgIcon.vue';
import PostPreview from './PostPreview.vue';
import CommentSection from './CommentSection.vue';

export default {
    // props: {
    //     userId: {
    //         type: String,
    //         required: true
    //     },
    //     postId: {
    //         type: String,
    //         required: true
    //     }
    // },
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
            if (this.post.likedByUsers.includes(userService.getLoggedinUser()._id)) {
                this.didLike = true
            } else {
                this.didLike = false
            }
            // console.log('this post : ', this.post)
        },
        async setUserData() {
            this.loggedinUser= await userService.getLoggedinUser()
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
                likedByUsers: [],
                createdAt: Date.now()
            }
            console.log('new comment: ',newComment)
            try{
                commentService.save(newComment)
                console.log('comment saved')
                this.post.comments.push(newComment._id)
                try{
                    postService.save({...this.post})
                    console.log('comment id was added to post')
                } catch (err) {
                    console.log('comment id wasnt added to post : ',err)
                }
            } catch (err){
                console.lof('comment wasnt added : ',err)
            }
        }
    },
    components: {
        SvgIcon,
        PostPreview,
        CommentSection
    },
    created() {
        this.loadData()
    }
}

</script>

<style lang="scss">
.post-display {
    // position: absolute;
    // top: 2em;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 3.5em);
    width: 100%;
    max-width: 700px;
    margin: auto;
    // transform: translate(50%,0);
    z-index: 200;
    background-color: white;

    .header {
        display: flex;
        justify-content: center;
        padding-block: 1em;
        max-height: 60px;
        font-size: 20px;
        border-block-end: 1px solid #ced0d4;
        border-radius: 0.5em 0.5em 0 0;
        box-shadow: 1px 1px 5px 1px #ced0d4;
    }

    .post-container {
        flex: 1;
        max-height: 680px;
        overflow-y: scroll;
    }

    .comment-addition {
        display: flex;
        padding: 1.25em;
        gap: 0.375em;

        img {
            width: 2em;
            height: 2em;
            border-radius: 50%;
            object-fit: cover;
        }

        .comment {
            display: flex;
            flex-direction: column;
            height: 5em;
            flex: 1;
            padding: 0.75em;
            border: 0;
            border-radius: 1em;
            background-color: #f0f2f5;

            input {
                background-color: transparent;
                margin-block-end: 1em;
                border: 0;

                &:focus {
                    outline: none;
                }
            }

            .comment-actions {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex: 1;

                img {
                    height: 1em;
                    width: 1em;
                }
            }
        }
    }
}

.blur {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    opacity: 0.75;
    // display: none;
    background-color: white;
    z-index: 200;
}</style>