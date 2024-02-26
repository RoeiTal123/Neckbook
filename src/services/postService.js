import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'post'

loadData()

async function loadData() {
  // console.log(await storageService.query(STORAGE_KEY).length===undefined)
  if (await storageService.query(STORAGE_KEY).length === undefined) {
    _createPosts()
  }
}

export const postService = {
  query,
  getById,
  getIdOfMediaBySrc,
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

async function getIdOfMediaBySrc(mediaSrc) {
  const allPosts = await query()
  for (let post of allPosts) {
    for (let media of post.mediaUrls) {
      // console.log(media.src)
      if(media.src){
        if (media.src === mediaSrc) {
          // console.log(media.id)
          return await media.id
        }
      }
    }
  }
  return 'no id'
}

async function remove(postId) {
  await storageService.remove(STORAGE_KEY, postId)
}

async function save(post) {
  let savedPost
  const allPosts = await query()
  if (postExists(allPosts, post)) {
    savedPost = await storageService.put(STORAGE_KEY, post)
  } else {
    // post.owner = userService.getLoggedinUser()
    savedPost = await storageService.post(STORAGE_KEY, post)
  }
  return savedPost
}

function postExists(posts, post) {
  for (let existingPost of posts) {
    if (existingPost._id === post._id) {
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
        backgroundColor: 'white',
        ownerId: "u001",
        postType: 'normal',
        postGroupId: null,
        mediaUrls: [
          "https://res.cloudinary.com/dqk28z6rq/image/upload/v1707320130/projects/Neckbook/website-images/spiderman3_yfyuiq.webp",
          "https://res.cloudinary.com/dqk28z6rq/image/upload/v1707320130/projects/Neckbook/website-images/spiderman4_mbsmfk.webp",
          "https://res.cloudinary.com/dqk28z6rq/image/upload/v1707320132/projects/Neckbook/website-images/spiderman1_l70zgu.jpg",
          "https://res.cloudinary.com/dqk28z6rq/image/upload/v1707320285/projects/Neckbook/website-images/spiderman5_vvyewt.jpg",
          "https://res.cloudinary.com/dqk28z6rq/image/upload/v1707320332/projects/Neckbook/website-images/spiderman6_dnb4t0.jpg"
        ],
        likedByUsers: ['fake id'],
        sharedByUsers: [],
        comments: ['c001', 'c002', 'c003'],
        createdAt: Date.now()
      },
      {
        _id: "p002",
        txt: "I will design your robot logo in 24 hours or less...",
        backgroundColor: 'white',
        ownerId: "u002",
        postType: 'normal',
        postGroupId: null,
        mediaUrls: [
          "https://res.cloudinary.com/dqk28z6rq/image/upload/v1707320130/projects/Neckbook/website-images/robot3_tqijup.avif",
          "https://res.cloudinary.com/dqk28z6rq/image/upload/v1707320130/projects/Neckbook/website-images/robot2_khqays.avif",
          "https://res.cloudinary.com/dqk28z6rq/image/upload/v1707320130/projects/Neckbook/website-images/robot4_e0vsln.avif",
          "https://res.cloudinary.com/dqk28z6rq/image/upload/v1707320131/projects/Neckbook/website-images/robot1_bup7zn.avif",
          "https://res.cloudinary.com/dqk28z6rq/image/upload/v1707320130/projects/Neckbook/website-images/robot5_ntwepb.avif"
        ],
        likedByUsers: [],
        sharedByUsers: ['fake id'],
        comments: [],
        createdAt: Date.now()
      },
      {
        _id: "p003",
        txt: "i made this cool project",
        backgroundColor: 'white',
        ownerId: "u003",
        postType: 'group',
        postGroupId: 'g001',
        mediaUrls: ['https://res.cloudinary.com/dqk28z6rq/video/upload/v1704616450/projects/Neckbook/user-videos/giggler_1_chxjgx.mp4',
          'https://res.cloudinary.com/dqk28z6rq/image/upload/v1703150515/projects/giggler_explore_wic27f.png'],
        likedByUsers: ['fake id'],
        sharedByUsers: ['fake id'],
        comments: [],
        createdAt: Date.now()
      }
    ]
    utilService.saveToStorage(STORAGE_KEY, posts)
  }
}