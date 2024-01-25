<template>
    <div class="blur"></div>
    <section class="post-addition">
        <div class="addition-model">
            <span class="header">
                <div></div>
                <span>Create post</span>
                <div>
                    <div class="x" @click="goBack()">
                        <SvgIcon :iconName="'close'" />
                    </div>
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
                    <input type="text" @input="checkText()" class="post-txt" id="post-txt"
                        :placeholder="`What's on your mind, ${getFirstName()}?`" />
                </div>
                <div class="post-effects"><img
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096982/projects/Neckbook/svg%20images/font_1_yybwyi.png" /><img
                        class="emote"
                        src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096264/projects/Neckbook/svg%20images/smile_w5wim2.png" />
                </div>
                <div class="document-addition">
                    <span>Add to your post</span>
                    <div class="additions">
                        <img class="emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703946502/projects/Neckbook/svg%20images/Ivw7nhRtXyo_et9veu.png" />
                        <img class="emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096518/projects/Neckbook/svg%20images/mention_ltdjww.png" />
                        <img class="emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096277/projects/Neckbook/svg%20images/smile_2_ytwacf.png" />
                        <img class="emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706096513/projects/Neckbook/svg%20images/gps_1_lqlzpm.png" />
                        <img class="emote"
                            src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1706106224/projects/Neckbook/svg%20images/gif-symbol_r2lrkl.png" />
                    </div>
                </div>
                <button class="btn-add-post" id="btn-add-post" @click="createPost()">Post</button>
            </div>
        </div>
    </section>
</template>

<script>
import SvgIcon from './SvgIcon.vue';

import router from '../router';
import { postService } from '../services/postService';
import { utilService } from '../services/util.service';

export default {
    data() {
        return {
            user: null,
            newPost: {},
            background: 'none'
        }
    },
    methods: {
        getFirstName() {
            const fullname = this.user.fullName.split(" ")
            return fullname[0]
        },
        checkText() {
            const txt = document.getElementById('post-txt').value
            if (txt !== '') {
                document.getElementById('btn-add-post').classList.add('allowed')
            } else {
                document.getElementById('btn-add-post').classList.remove('allowed')
            }
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
            try{
                postService.save(newPost)
                console.log('post created')
            } catch (err) {
                console.log('cant create post')
            }
            this.goBack()
        },
        goBack() {
            router.go(-1)
            document.getElementById('body').style.overflow = 'scroll'
        }
    },
    components: {
        SvgIcon
    },
    async created() {
        // console.log('im here')
        window.scrollTo(0, 0);
        document.getElementById('body').style.overflow = 'hidden'
        this.user = await userService.getLoggedinUser()
    }
}
</script>

<style lang="scss">
.post-addition {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    height: 100svh;
    width: 100svw;
    z-index: 300;

    img {
        height: 2.375em;
        width: 2.375em;

        &:hover {
            cursor: pointer;
        }
    }

    .emote {
        width: 1.5em;
        height: 1.5em;
    }

    .addition-model {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 500px;
        background-color: #ffffff;
        border-radius: 0.5em;
        box-shadow: 0 12px 28px 0 #00000033, 0 2px 4px 0 #0000001a, inset 0 0 0 1px #ffffff80;

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 3.75em;
            width: 100%;
            border-block-end: 1px solid #e5e5e5;
            font-family: "Helvetica-Bold";

            div {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 3.75em;
                width: 3.75em;

                &.x {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 2.25em;
                    width: 2.25em;
                    border-radius: 50%;
                    background-color: #e4e6eb;

                    &:hover {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-color: #dadce1;
                    }
                }

                i {
                    height: 1.25em;
                    width: 1.25em;
                }
            }
        }

        .post {
            display: flex;
            flex-direction: column;
            padding: 1em;
            // gap: 1em;

            .user-showcase {
                display: flex;
                height: 2.5em;
                gap: 0.75em;

                img {
                    height: 2.5em;
                    width: 2.5em;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .inner {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
            }

            .post-txt {
                height: 40px;
                width: 100%;
                margin-block-end: 40px;
                margin-block-start: 20px;
                border: 0;
                font-size: 24px;
                outline: none;
            }

            .post-effects {
                display: flex;
                justify-content: space-between;
                height: 2.5em;
                align-items: center;
                margin-block-start: 1.25em;
            }

            .document-addition {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 3.75em;
                padding: 1em;
                margin-block-start: 1em;
                border: 1px solid #ced0d4;
                border-radius: 0.5em;
                font-family: "Helvetica-Bold";
                box-shadow: 0 1px 2px #0000001a;

                .additions {
                    display: flex;
                    align-items: center;
                    gap: 1em;
                }
            }

            .btn-add-post {
                height: 36px;
                margin-block-start: 1em;
                background-color: #e4e6eb;
                color: #bdc1c5;
                border: 0;
                border-radius: 0.5em;
                transition: all 1s 0s;

                &:hover {
                    cursor: not-allowed;
                }

                &.allowed {
                    cursor: default;
                    color: #ffffff;
                    background-color: #0866ff;
                }
            }
        }

    }
}</style>