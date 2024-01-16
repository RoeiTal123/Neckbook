import { storageService } from './async-storage.service'

const SESSION_KEY_LOGGEDIN_USER = 'loggedinUser'
const BASE_URL = 'user'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser: setLoggedinUser,
    getUsers,
    getById,
    remove,
    update,
}
window.userService = userService

function getUsers() {
    return storageService.query(BASE_URL)
}

async function getById(userId) {
    const user = await storageService.get(BASE_URL, userId)
    return user
}

function remove(userId) {
    return storageService.remove(BASE_URL, userId)
}

async function update(userId) {
    const user = await storageService.get(BASE_URL, userId)
    await storageService.put(BASE_URL, user)

    // // Handle case in which admin updates other user's details
    if (getLoggedinUser()._id === user._id) setLoggedinUser(user)
    return user
}

async function login(userCred) {
    const users = await storageService.query(BASE_URL)
    const user = users.find((user) => user.username === userCred.username)
    if (user) {
        return setLoggedinUser(user)
    }
}

async function signup(userCred) {
    const user = await storageService.post(BASE_URL, userCred)
    return setLoggedinUser(user)
}

async function logout() {
    sessionStorage.removeItem(SESSION_KEY_LOGGEDIN_USER)
}

function setLoggedinUser(user) {
    sessionStorage.setItem(SESSION_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY_LOGGEDIN_USER))
}

const users = [
    {
        _id: 'u001',
        fullName: 'Peter Parker',
        username: 'peter123',
        password: '123',
        avatar: 'https://qph.cf2.quoracdn.net/main-qimg-9fde28d147c243b690bdf975f8474145-lq',
        cover:'',
        mood: '',
        intro:{bio:'a worker for the daily beaugle',details:'im a photographer'},
        blockedUsers: [],
        blockedGroups: [],
        posts:['p001'],
        groups: ['g001'],
        chats: [],
        friendRequests:[{_id:'u003',type:'pending',createdAt:Date.now()-600000}],
        friends:['u002'],
        isAdmin: true,
        createdAt:Date.now()
    },
    {
        _id: 'u002',
        fullName: 'Jane Doe',
        username: 'jane123',
        password: '123',
        avatar: 'https://img.freepik.com/premium-photo/robot-face-with-green-eyes-black-face_14865-1671.jpg?w=2000',
        cover:'',
        mood: '',
        intro:{bio:'a online logo designer',details:'i design digital logos'},
        blockedUsers: [],
        blockedGroups: [],
        posts:['p002'],
        groups: [],
        chats: [],
        friendRequests:[],
        friends:['u001','u003'],
        isAdmin: false,
        createdAt:Date.now()
    },
    {
        _id: 'u003',
        fullName: 'Roei Tal',
        username: 'roei123',
        password: '123',
        avatar: 'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704104110/projects/Neckbook/user-images/me_nqkfek.jpg',
        cover:'',
        mood: '',
        intro:{bio:'',details:''},
        blockedUsers: [],
        blockedGroups: [],
        posts:['p003'],
        groups: ['g001'],
        chats: [],
        friendRequests:[{_id:'u001',type:'pending',createdAt:Date.now()-600000}],
        friends:[],
        isAdmin: true,
        createdAt:Date.now()
    },
]

// _createUsers()

// setLoggedinUser(users[0])

async function _createUsers() {
    localStorage.setItem('user', JSON.stringify(users))
}