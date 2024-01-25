import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'post'

loadData()

async function loadData(){
    // console.log(await storageService.query(STORAGE_KEY).length===undefined)
    if(await storageService.query(STORAGE_KEY).length===undefined){
      _createPosts()
    }
}

export const postService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
}
// debug trick
window.bs = postService

async function query(filterBy = { userId: '' }) {
  let posts = await storageService.query(STORAGE_KEY)
  if (filterBy.userId) {
    const regex = new RegExp(filterBy.userId, 'i')
    posts = posts.filter(
      (post) => post.ownerId === filterBy.userId
      // regex.test(post.title) || regex.test(post.txt)
    )
  }
  if (filterBy.groupId) {
    const regex = new RegExp(filterBy.groupId, 'i')
    posts = posts.filter(
      (post) => post.postGroupId === filterBy.groupId
      // regex.test(post.title) || regex.test(post.txt)
    )
  }
  return posts
}

function getById(postId) {
  return storageService.get(STORAGE_KEY, postId)
}

async function remove(postId) {
  await storageService.remove(STORAGE_KEY, postId)
}

async function save(post) {
  let savedPost
  const allPosts=await query()
  if (postExists(allPosts,post)) {
    savedPost = await storageService.put(STORAGE_KEY, post)
  } else {
    // post.owner = userService.getLoggedinUser()
    savedPost = await storageService.post(STORAGE_KEY, post)
  }
  return savedPost
}

function postExists(posts, post){
  for(let existingPost of posts){
      if(existingPost._id === post._id) {
          return true
      }
  }
  return false
}

function getDefaultFilter() {
  return {
    search: ''
  }
}

function _createPosts() {
  let posts = utilService.loadFromStorage(STORAGE_KEY)
  if (!posts || !posts.length) {
    posts = [
        {
        _id: "p001",
        txt: "I am actually the real Spiderman...",
        background: 'none',
        ownerId: "u001",
        postType: 'normal',
        postGroupId: null,
        imgUrls: [
          "https://cdn.britannica.com/54/93454-050-5AC49E5E/Spider-Man-Tobey-Maguire-2.jpg",
          "https://i.insider.com/5d5d70df4afbf9310528d139?width=750&format=jpeg&auto=webp",
          "https://assets-prd.ignimgs.com/2022/03/18/spidermannowayhomeexclusivefirst10minutesignblogroll-1647047297213-1647633871978.jpeg",
          "https://www.gamespot.com/a/uploads/scale_medium/1582/15828986/3552444-spider%20train%202.jpg",
          "https://www.gamespot.com/a/uploads/screen_kubrick/1582/15828986/3552441-hed.jpg"
        ],
        videoUrl:null,
        likedByUsers: ['fake id'],
        sharedByUsers: [],
        comments:['c001','c002','c003'],
        createdAt: Date.now()
      },
      {
        _id: "p002",
        txt: "I will design your robot logo in 24 hours or less...",
        background: 'none',
        ownerId: "u002",
        postType: 'normal',
        postGroupId: null,
        imgUrls: [
          "https://img.freepik.com/premium-vector/cute-robot-mascot-logo-cartoon-character-illustration_8169-227.jpg",
          "https://img.freepik.com/premium-vector/cute-robot-logo-vector-design-template_612390-492.jpg",
          "https://img.freepik.com/free-vector/hand-drawn-data-logo-template_23-2149203374.jpg?size=626&ext=jpg&ga=GA1.1.1028445320.1691753202&semt=ais",
          "https://img.freepik.com/free-vector/cute-bot-say-users-hello-chatbot-greets-online-consultation_80328-195.jpg?size=626&ext=jpg&ga=GA1.1.1028445320.1691753202&semt=ais",
          "https://img.freepik.com/free-vector/cute-robot-holding-clipboard-cartoon-vector-icon-illustration-science-technology-icon-isolated_138676-5184.jpg?size=626&ext=jpg&ga=GA1.1.1028445320.1691753202&semt=ais"
        ],
        videoUrl:null,
        likedByUsers: [],
        sharedByUsers: ['fake id'],
        comments:[],
        createdAt: Date.now()
      },
      {
        _id: "p003",
        txt: "i made this cool project",
        background: 'none',
        ownerId: "u003",
        postType: 'group',
        postGroupId: 'g001',
        imgUrls: [],
        videoUrl:'https://res.cloudinary.com/dqk28z6rq/video/upload/v1704616450/projects/Neckbook/user-videos/giggler_1_chxjgx.mp4',
        likedByUsers: ['fake id'],
        sharedByUsers: ['fake id'],
        comments:[],
        createdAt: Date.now()
      }
    ]
    utilService.saveToStorage(STORAGE_KEY, posts)
  }
}