import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'comment'

loadData()

async function loadData(){
    // console.log(await storageService.query(STORAGE_KEY).length===undefined)
    if(await storageService.query(STORAGE_KEY).length===undefined){
        _createComments()
    }
}

export const commentService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
}
// debug trick
window.bs = commentService

async function query(filterBy = { userId: '' }) {
    let comments = await storageService.query(STORAGE_KEY)
    if (filterBy.userId) {
        const regex = new RegExp(filterBy.userId, 'i')
        comments = comments.filter(
            (comment) => comment.ownerId === filterBy.userId
            // regex.test(comment.title) || regex.test(comment.description)
        )
    }
    if (filterBy.postId) {
        const regex = new RegExp(filterBy.postId, 'i')
        comments = comments.filter(
            (comment) => comment.postId === filterBy.postId
            // regex.test(comment.title) || regex.test(comment.description)
        )
    }
    return comments
}

function getById(commentId) {
    return storageService.get(STORAGE_KEY, commentId)
}

async function remove(commentId) {
    await storageService.remove(STORAGE_KEY, commentId)
}

async function save(comment) {
    let savedComment
    const allComments=await query()
    console.log(allComments)
    if (allComments.includes(comment._id)) {
        savedComment = await storageService.put(STORAGE_KEY, comment)
    } else {
        // comment.owner = userService.getLoggedinUser()
        savedComment = await storageService.post(STORAGE_KEY, comment)
    }
    return savedComment
}

function getDefaultFilter() {
    return {
        search: ''
    }
}

function _createComment(postId,ownerId,txt){
    const newComment = {
        _id: utilService.makeId(),
        postId,
        ownerId,
        txt,
        imgUrls: [],
        videoUrl: null,
        likedByUsers: [],
        createdAt: Date.now()
    }
    return newComment
}

function _createComments() {
    let comments = utilService.loadFromStorage(STORAGE_KEY)
    if (!comments || !comments.length) {
        comments = [
            {
                _id: "c001",
                postId: "p001",
                ownerId: "u001",
                txt: "bad photos",
                imgUrls: [],
                videoUrl: null,
                likedByUsers: [],
                createdAt: Date.now()
            },{
                _id: "c002",
                postId: "p001",
                ownerId: "u002",
                txt: "bad photos",
                imgUrls: [],
                videoUrl: null,
                likedByUsers: [],
                createdAt: Date.now()
            },{
                _id: "c003",
                postId: "p001",
                ownerId: "u003",
                txt: "bad photos",
                imgUrls: [],
                videoUrl: null,
                likedByUsers: [],
                createdAt: Date.now()
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, comments)
    }
}