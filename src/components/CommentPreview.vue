<template>
    <section class="comment-preview">
        <img :src="user.avatar" />
        <div class="comment-details">
            <div class="user-output">
                <span>{{ user.fullName }}</span>
                <p>{{ comment.txt }}</p>
            </div>
            <div class="user-input">
                <span>{{ timeAgoString() }}</span>
                <span :class="isLiked ? 'liked' : ''" @click="likeComment()">{{isLiked ? 'Liked' : 'Like'}}</span>
                <span>Reply</span>
                <span>Share</span>
                <span>Like Count: {{ comment.likedByUsers.length }}</span>
            </div>
        </div>
    </section>
</template>

<script>
import { userService } from '../services/userService';
import { commentService } from '../services/commentService';
import { utilService } from '../services/util.service';

export default {
    props: {
        comment: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            loggedinUser: {},
            user: {},
            isLiked: null
        }
    },
    methods: {
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
        }
    },
    created() {
        this.setUser().then(()=>this.setLiked())
    }
}
</script>

<style lang="scss">
.comment-preview {
    display: flex;
    gap: 0.375em;

    img {
        width: 2em;
        height: 2em;
        border-radius: 50%;
        object-fit: cover;
    }

    .comment-details {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.25em;

        .user-output {
            display: flex;
            flex-direction: column;
            gap: 0.5em;
            width: fit-content;
            padding: 0.5em;
            background-color: #f0f2f5;
            border-radius: 1em;

            span {
                font-family: "Helvetica-Bold";
            }
        }

        .user-input {
            display: flex;
            gap: 1em;
            padding-inline-start: 0.5em;

            span {
                font-family: "Helvetica-Bold";
                font-size: 12px;
            }

            .liked{
                color: #0866FF;
            }
        }
    }
}
</style>