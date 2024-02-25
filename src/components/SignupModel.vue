<template>
    <div class="background-blur">
        <div class="signup-model">
            <div class="header">
                <div>
                    <span>Sign Up</span>
                    <span>It's quick and easy</span>
                </div>
                <img @click="() => toggleSignup()" class="normal-emote"
                    src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1708593106/projects/Neckbook/svg%20images/close_leuqbv.png" />
            </div>
            <div class="user-input">
                <div>
                    <input type="text" placeholder="First name" id="first-name" />
                    <input type="text" placeholder="Last name" id="last-name" />
                </div>
                <input type="text" placeholder="Mobile number or email" id="phono-or-email" />
                <input type="text" placeholder="New password" id="password" />
                <div>
                    <select id="month-selector">
                        <option v-for="month in yearlyMonths" :value="month">{{ month }}</option>
                    </select>
                    <select id="day-selector">
                        <option v-for="day in days" :value="day">{{ day }}</option>
                    </select>
                    <select id="year-selector">
                        <option v-for="year in years" :value="year">{{ year }}</option>
                    </select>
                </div>
                <div>
                    <div class="input-container">
                        <span>Female</span>
                        <input type="radio" id="female" name="gender" value="female" @input="() => switchRadio()" />
                    </div>
                    <div class="input-container">
                        <span>male</span>
                        <input type="radio" id="male" name="gender" value="male" @input="() => switchRadio()" />
                    </div>
                    <div class="input-container">
                        <span>Other</span>
                        <input type="radio" id="other" name="gender" value="other" @input="() => switchRadio()" />
                    </div>
                </div>
                <p>People who use our service may have uploaded your contact information to Neckbook.</p>
                <p>By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS
                    Notifications from us and can opt out any time.</p>
                <button class="signup-btn" @click="() => addNewAccount()">Sign Up</button>
            </div>
        </div>
    </div>
</template>

<script>
import { utilService } from '../services/util.service'
import { userService } from '../services/userService'
import { toRaw } from 'vue'

export default {
    props: {
        toggleSignup: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017",
                "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008",
                "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000", "1999",
                "1998", "1997", "1996", "1995", "1994", "1993", "1992", "1991", "1990",
                "1989", "1988", "1987", "1986", "1985", "1984", "1983", "1982", "1981", "1980"],
            yearlyMonths: [
                'January', 'February', 'March',
                'April', 'May', 'June',
                'July', 'August', 'September',
                'October', 'November', 'December',
            ],
            days: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
                "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
            gender: null
        }
    },
    methods: {
        addNewAccount() {
            const firstName = document.getElementById('first-name').value
            const lastName = document.getElementById('last-name').value
            const emailOrPhone = document.getElementById('phono-or-email').value
            const password = document.getElementById('password').value
            const day = document.getElementById('day-selector').value
            const month = document.getElementById('month-selector').value
            const year = document.getElementById('year-selector').value
            let monthInNumber = new Date(`${month} 1, 2000`)
            monthInNumber = monthInNumber.getMonth() + 1
            // console.log(`${day}/${monthInNumber}/${year}`)
            const newUserDetails = [firstName, lastName, emailOrPhone, password]
            for (let detail of newUserDetails) {
                if (!this.testInput(detail)) {
                    console.log('something is missing')
                    return
                }
            }
            if (this.gender === null) {
                console.log('pick gender')
                return
            }
            if (!this.passwordTest(password)){
                console.log('password too weak, use characters, capitals, digits, symbols and must be 8 digits long')
                return
            }
            let newUser = {
                _id: utilService.makeId(),
                fullName: `${firstName} ${lastName}`,
                password: password,
                avatar: null,
                cover: null,
                mood: null,
                gender: toRaw(this.gender),
                intro: { bio: null, details: null },
                blockedUsers: [],
                blockedGroups: [],
                posts: [],
                groups: [],
                chats: [],
                friendRequests: [],
                friends: [],
                birthday: `${day}/${monthInNumber}/${year}`,
                isAdmin: false,
                createdAt: Date.now()
            }
            if (utilService.isPhoneNumberOrEmail(emailOrPhone) === 'Email') {
                newUser.email = `${emailOrPhone}`
            } else if (utilService.isPhoneNumberOrEmail(emailOrPhone) === 'Phone Number') {
                newUser.phoneNumber = `${emailOrPhone}`
            } else if (utilService.isPhoneNumberOrEmail(emailOrPhone) === 'Unknown') {
                console.log('enter phone number or email to continue')
                return
            }
            console.log(`the new user is : `, newUser)
            try{
                userService.save(newUser)
            } catch (err) {
                console.log(`user ${newUser._id} couldn't be saved, `,err)
            }
            this.toggleSignup()
        },
        testInput(txt) {
            if (txt === '') {
                // console.log('type something')
                return
            }
            if (utilService.isTxtOnlySpaces(txt)) {
                // console.log('no empty')
                return
            }
            return true
        },
        switchRadio() {
            const radios = document.getElementsByName('gender')
            for (let radio of radios) {
                if (radio.checked === true) {
                    this.gender = radio.value
                }
            }
        }, 
        passwordTest(password) {
            var hasCharacters = /[a-zA-Z]/.test(password)
            var hasCapitals = /[A-Z]/.test(password)
            var hasNumbers = /\d/.test(password)
            var hasSymbols = /[!@#$%^&*()\-_=+{};:,<.>]/.test(password)

            return hasCharacters && hasCapitals && hasNumbers && hasSymbols && password.length > 8
        }
    }
}
</script>

<style lang="scss">
.background-blur {
    position: absolute;
    top: 0;
    width: 100svw;
    height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 200;

    .signup-model {
        display: flex;
        flex-direction: column;
        width: 450px;
        height: 550px;
        border-radius: 1em;
        background-color: white;
        box-shadow: 0 12px 28px 0 #00000033, 0 2px 4px 0 #0000001a,
            inset 0 0 0 1px #ffffff80;
        color: #606770;

        .header {
            display: flex;
            justify-content: space-between;
            padding: 1em;
            border-block-end: 1px solid #dadde1;

            div {
                display: flex;
                flex-direction: column;

                :first-child {
                    font-size: 32px;
                    font-family: "Helvetica-Bold";
                }

                :nth-child(2n) {
                    font-size: 12px;
                }
            }

            img {
                &:hover {
                    cursor: pointer;
                }
            }
        }

        .user-input {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 1em;
            gap: 1em;


            input {
                width: 100%;
                padding: 0.75em;
                border-radius: 0.25em;
                background-color: #f5f6f7;
                border: 1px solid #ccd0d5;
                font-size: 16px;
                outline: none;
            }

            select {
                width: 100%;
                padding: 0.75em;
                border-radius: 0.25em;
                border: 1px solid #ccd0d5;
                font-size: 16px;
            }

            div {
                display: flex;
                align-items: center;
                width: 100%;
                gap: 1em;
            }

            p {
                font-size: 10px;
                align-self: start;
            }

            .input-container {
                display: flex;
                justify-content: space-between;
                padding: 0.75em;
                border-radius: 0.25em;
                border: 1px solid #ccd0d5;

                input {
                    width: auto;
                }
            }

            .signup-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: fit-content;
                padding: 4px 64px;
                border: none;
                border-radius: 8px;
                font-size: 18px;
                font-family: "Helvetica-Bold";
                background-color: #42b72a;
                color: #ffffff;

                &:hover {
                    cursor: pointer;
                    background-color: #389b25;
                }
            }
        }
    }
}
</style>