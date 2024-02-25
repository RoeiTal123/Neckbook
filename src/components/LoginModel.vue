<template>
    <div v-if="!isSignup" class="blur">
        <div class="login-model">
            <div class="hovered-area" @click="()=>toggleLogModel()">
                <img class="normal-emote" src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708593106/projects/Neckbook/svg%20images/close_leuqbv.png"/>
            </div>
            <div class="login-box">
                <span>See more on Neckbook</span>
                <input type="text" id="email-or-phone-input" placeholder="Email or phone number" />
                <input type="text" id="password-input" placeholder="Password" />
                <button class="login-btn" @click="() => logIn()">Log In</button>
                <span class="forgot">Forgot password?</span>
                <button class="signup-btn" @click="() => toggleSignup()">Create new account</button>
            </div>
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

export default {
    props:{
        toggleLogModel: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            isVisible: true,
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
            this.isSignup = !this.isSignup
            // this.$router.push('/main')
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
    mounted() {
        this.loadData()
    }
}
</script>

<style lang="scss">
.blur {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;

    .login-model {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 0.8em;
        background-color: #ffffff;
        box-shadow: 0 2px 4px #0000001a, 0 8px 16px #0000001a;

        .hovered-area{
            padding: 0.5em;
            border-radius: 50%;
            align-self: end;
            margin-block-start: 0.75em;
            margin-inline-end: 0.75em;
        }

        .login-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 0.8em;
            height: 20em;
            width: 20em;
            border-radius: 0.8em;
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

            .forgot {
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
    }
}
</style>