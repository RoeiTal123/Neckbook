<template>
    <div v-if="user" class="post-creation">
        <div class="interactable">
            <img :src="user.avatar" />
            <RouterLink :to="`${fullPath}/post`"><span>Whats on your mind, {{ user.fullName }}?</span></RouterLink>
        </div>
        <div class="user-actions">
            <div class="user-action">
                <img
                    src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1703946502/projects/Neckbook/svg%20images/Ivw7nhRtXyo_et9veu.png" />
                <span>Photo/Video</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        user: {
            type: Object,
            required: true
        },
        fullPath: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss">
.post-creation {
    display: flex;
    flex-direction: column;
    height: fit-content;
    width: 100%;
    background-color: #ffffff;
    border-radius: 0.5em;
    padding: 0.75em 1em;
    margin-block-end: 1em;
    color: #65676B;

    .interactable {
        display: flex;
        align-items: center;
        height: fit-content;
        width: 100%;
        gap: 0.5em;
        border-block-end: 1px solid #e4e6eb;
        padding-block-end: 0.75em;

        a {
            flex: 1;
            height: 2.5em;
            text-decoration: none;
            color: #65676B;
        }

        span {
            display: flex;
            align-items: center;
            flex: 1;
            height: 2.5em;
            border-radius: 3.125em;
            padding-inline-start: 0.75em;
            background-color: #f0f2f5;

            &:hover {
                background-color: #e1e3e6;
            }
        }

        img {
            height: 2.5em;
            width: 2.5em;
            border-radius: 50%;
            object-fit: cover;
        }
    }

    .user-actions {
        display: flex;
        width: 100%;
        padding-block-start: 0.75em;
        justify-content: center;

        .user-action {
            display: flex;
            gap: 0.5em;

            img {
                height: 1.5em;
                width: 1.5em;
            }
        }
    }
}
</style>