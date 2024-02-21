<template>
    <RouterLink to="/main">
        - to main page -
    </RouterLink>
    <div class="login-page">
        <div class="left-side">
            <span>Neckbook</span>
            <span>Connect with friends and the world around you on Neckbook.</span>
        </div>
        <div class="login-side">
            <div class="login-box">
                <input type="text" id="email-or-phone-input" placeholder="Email or phone number" />
                <input type="text" id="password-input" placeholder="Password" />
                <button class="login-btn">Log In</button>
                <span>Forgot password?</span>
                <button class="signup-btn">Create new account</button>
            </div>
            <span><span class="link">Create a page</span> for a celebrity, brand or business</span>
        </div>
    </div>
</template>

<script>
import { userService } from '../services/userService'
import { postService } from '../services/postService'

export default {

    created() {

    }
}
</script>

<style lang="scss">
.login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 7.5em;

    .left-side {
        display: flex;
        flex-direction: column;
        gap: 1em;
        max-width: 25em;

        :first-child {
            font-size: 64px;
            font-family: "Helvetica-Bold";
            color: #0866ff;
        }

        :nth-child(2n) {
            font-size: 26px;
        }
    }

    .login-side {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.75em;

        .login-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 0.8em;
            height: 20em;
            width: 20em;
            border-radius: 0.8em;
            box-shadow: 0 2px 4px #0000001a, 0 8px 16px #0000001a;
            font-size: 20px;

            input {
                width: 100%;
                padding: 1em;
                border: 1px solid #dddfe2;
                border-radius: 0.5em;
                font-size: 20px;
                outline-color: #0866ff;
            }

            button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                font-size: 18px;
                padding: 16px;
                border: none;
                border-radius: 8px;
                color: #ffffff;
                font-family: "Helvetica-Bold";
            }

            .login-btn {
                background-color: #0866ff;
            }

            .signup-btn{
                width: fit-content;
                background-color: #42b72a;
            }

            :nth-child(4n){
                font-size: 16px;
                width: 100%;
                text-align: center;
                color: #0866ff;
                padding-block-end: 1em;
                border-block-end: 1px solid #dadde1;
            }
        }
    }
}
</style>