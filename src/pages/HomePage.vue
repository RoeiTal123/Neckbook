<template>
    <!-- <RouterLink to="/main">
        - to main page -
    </RouterLink> -->
    <div  class="login-page">
        <div class="left-side">
            <span>Neckbook</span>
            <span>Connect with friends and the world around you on Neckbook.</span>
        </div>
        <div class="login-side">
            <div class="login-box">
                <input type="text" id="email-or-phone-input" placeholder="Email or phone number" />
                <input type="text" id="password-input" placeholder="Password" />
                <button class="login-btn" @click="() => logIn()">Log In</button>
                <span>Forgot password?</span>
                <button class="signup-btn" @click="() => toggleSignup()">Create new account</button>
            </div>
            <span><span class="link">Create a page</span> for a celebrity, brand or business</span>
        </div>
    </div>
    <div v-if="isSignup">
        <SignupModel :toggleSignup="toggleSignup" />
    </div>
</template>

<script>
import { userService } from '../services/userService'
import { utilService } from '../services/util.service'

import SignupModel from '../components/SignupModel.vue';
import router from '../router';

export default {
    data() {
        return {
            isSignup: false
        }
    },
    methods: {
        toggleSignup() {
            this.isSignup = !this.isSignup
        },
        logIn() {
            const phoneOrEmail = document.getElementById('email-or-phone-input').value
            const password = document.getElementById('password-input').value
            let user
            if (utilService.isPhoneNumberOrEmail(phoneOrEmail) === 'Email') {
                user = userService.login({ password: password, email: phoneOrEmail })
            } else if (utilService.isPhoneNumberOrEmail(phoneOrEmail) === 'Phone Number') {
                user = userService.login({ password: password, phoneNumber: phoneOrEmail })
            } else {
                console.log('no account?')
                return
            }
            console.log(`welcome ${user.fullName} to Neckbook :)`)
            this.$router.push('/main')
        },
        loadData() {
            // console.log('loading data')
            document.getElementById('email-or-phone-input').value = 'peter123@gmail.com'
            document.getElementById('password-input').value = '123'
        }
    },
    components: {
        SignupModel
    },
    mounted(){
        this.loadData()
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
            cursor: default;
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

                &:hover {
                    cursor: pointer;
                    background-color: #005df4;
                }
            }

            .signup-btn {
                width: fit-content;
                background-color: #42b72a;

                &:hover {
                    cursor: pointer;
                    background-color: #389b25;
                }
            }

            :nth-child(4n) {
                font-size: 16px;
                width: 100%;
                text-align: center;
                color: #0866ff;
                padding-block-end: 1em;
                border-block-end: 1px solid #dadde1;

                &:hover {
                    cursor: pointer;
                }
            }
        }

        .link {
            font-family: "Helvetica-Bold";

            &:hover {
                cursor: pointer;
            }
        }
    }
}
</style>