<template>
    <section class="comment-preview">
        <img :src="user.avatar" />
        <div class="comment-details">
            <div class="user-output">
                <span>{{ user.fullName }}</span>
                <p class="text" :id="`${comment._id}`"></p>
            </div>
            <div class="user-input">
                <span>{{ timeAgoString() }}</span>
                <span :class="isLiked ? 'liked' : ''" @click="likeComment()">{{ isLiked ? 'Liked' : 'Like' }}</span>
                <span @click="selectReply()">Reply</span>
                <span>Share</span>
                <span>Like Count: {{ comment.likedByUsers.length }}</span>
            </div>
            <div id="replies-section" class="replies-section">

                <!-- <input v-if="selectedReply" type="text" :id="`reply ${comment._id}`" placeholder="write a public response" /> -->

                <div v-if="selectedReply" class="reply-addition">
                    <img :src="loggedinUser.avatar" />
                    <div class="reply">
                        <input type="text" :id="`reply ${comment._id}`" placeholder="Write a public reply..." />
                        <div class="reply-actions">
                            <div>emotes here</div><img @click="() => addReply()"
                                src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1705565840/projects/Neckbook/svg%20images/paper-plane_djmb9g.png" />
                        </div>
                    </div>
                </div>

                <div v-if="replies.length !== 0" class="replies">
                    <div class="reply" v-for="reply in replies">
                        <CommentPreview :comment="reply" />
                    </div>
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

import { toRaw } from 'vue';

export default {
    name: 'comment-preview',
    props: {
        comment: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            paths: [],
            loggedinUser: {},
            user: {},
            post: null,
            isLiked: null,
            selectedReply: false,
            replies: []
        }
    },
    mounted() {
        this.setText()
    },
    methods: {
        updateRoutes() {
            this.paths = []
            const currentPath = this.$route.path;
            this.paths = currentPath.split('/')
            this.paths = this.paths.slice(1, this.paths.length)
            // console.log(this.paths)
        },
        async setUser() {
            this.loggedinUser = await userService.getLoggedinUser()
            const user = await userService.getById(this.comment.ownerId)
            // console.log(user)
            this.user = user
        },
        setLiked() {
            this.isLiked = this.comment.likedByUsers.includes(this.loggedinUser._id)
        },
        timeAgoString() {
            return utilService.timeString(this.comment.createdAt)
        },
        likeComment() {
            this.isLiked = !this.isLiked
            if (!this.comment.likedByUsers.includes(this.loggedinUser._id)) {
                this.comment.likedByUsers.push(this.loggedinUser._id)
            } else {
                this.comment.likedByUsers = this.comment.likedByUsers.filter((id) => id !== this.loggedinUser._id)
            }
            commentService.save(this.comment)
        },
        selectReply() {
            if (this.selectedReply === false) {
                this.selectedReply = true
                // console.log(document.getElementById('reply'))
                // console.log(document.getElementById(`reply ${(toRaw(this.comment))._id}`))
                // document.getElementById(`reply ${(toRaw(this.comment))._id}`).value = `@${toRaw(this.user).fullName}`
            }
        },
        async setPostData() {
            try{
                this.post = await postService.getById(this.paths[this.paths.length - 1])
                if (this.post.likedByUsers.includes(userService.getLoggedinUser()._id)) {
                    this.didLike = true
                } else {
                    this.didLike = false
                }
            } catch (err){

            }
            // console.log('this post : ', this.post)
        },
        setText() {
            let textSection = document.getElementById(`${this.comment._id}`)
            // console.log(textSection)
            textSection.innerText = this.comment.txt
            if (utilService.checkIfUrlInText(this.comment.txt)) {
                let wholeInsert = `<span>${this.comment.txt}</span>`
                wholeInsert = wholeInsert.replace(utilService.cutUrlFromText(this.comment.txt), `<a href="${utilService.cutUrlFromText(this.comment.txt)}" title="A link, press with caution">${utilService.cutUrlFromText(this.comment.txt)}</a>`)
                textSection.innerHTML = wholeInsert
            }
        },
        async setReplies() {
            this.replies = []
            for (const replyId of this.comment.replies) {
                const reply = await commentService.getById(replyId);
                this.replies.push({ ...reply });
            }
            // console.log('this comments : ',this.comments)
        },
        addReply() {
            const txt = document.getElementById(`reply ${(toRaw(this.comment))._id}`).value
            const newComment = {
                _id: utilService.makeId(),
                postId: this.post._id,
                ownerId: this.loggedinUser._id,
                txt,
                imgUrl: null,
                videoUrl: null,
                level: this.comment.level+1,
                replies: [],
                likedByUsers: [],
                createdAt: Date.now()
            }
            let replies=toRaw(this.comment).replies
            replies.push(newComment._id)
            const oldComment={...toRaw(this.comment), replies}
            try {
                commentService.save(oldComment).then(()=>commentService.save(newComment))
            } catch (err) {
                console.lof('comment wasnt added : ', err)
            }
        }
    },
    created() {
        this.updateRoutes()
        this.setUser().then(() => this.setLiked())
        this.setPostData()
        this.setReplies()
    }
}
</script>

<style lang="scss">

</style>

<!-- @load="()=>replaceUrlWithLink()"  -->