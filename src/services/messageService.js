import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'message'

loadData()

async function loadData(){
    // console.log(await storageService.query(STORAGE_KEY).length===undefined)
    if(await storageService.query(STORAGE_KEY).length===undefined){
      _createMessages()
    }
}

export const messageService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
}
// debug trick
window.bs = messageService

async function query(filterBy = { userId: '' }) {
  let messages = await storageService.query(STORAGE_KEY)
  if (filterBy.userId) {
    const regex = new RegExp(filterBy.userId, 'i')
    messages = messages.filter(
      (message) => message.ownerId === filterBy.userId
      // regex.test(message.title) || regex.test(message.description)
    )
  }
  if (filterBy.groupId) {
    const regex = new RegExp(filterBy.groupId, 'i')
    messages = messages.filter(
      (message) => message.messageGroupId === filterBy.groupId
      // regex.test(message.title) || regex.test(message.description)
    )
  }
  return messages
}

function getById(messageId) {
  return storageService.get(STORAGE_KEY, messageId)
}

async function remove(messageId) {
  await storageService.remove(STORAGE_KEY, messageId)
}

async function save(message) {
  let savedMessage
  if (message._id) {
    savedMessage = await storageService.put(STORAGE_KEY, message)
  } else {
    // message.owner = userService.getLoggedinUser()
    savedMessage = await storageService.post(STORAGE_KEY, message)
  }
  return savedMessage
}

function getDefaultFilter() {
  return {
    search: ''
  }
}

function _createMessages() {
  let messages = utilService.loadFromStorage(STORAGE_KEY)
  if (!messages || !messages.length) {
    messages = [
        {
        _id: "m001",
        chatroomId: 'ch001',
        messagerId: 'u001',
        txt:'hey',
        likedByUsers: ['u003'],
        mediaUrls: [],
        fileUrls: [],
        createdAt: Date.now()
      },
      {
        _id: "m002",
        chatroomId: 'ch001',
        messagerId:'u003',
        txt:'wassup?',
        likedByUsers: [],
        mediaUrls: [],
        fileUrls: [],
        createdAt: Date.now()
      },
      {
        _id: "m003",
        chatroomId: 'ch002',
        messagerId:'u002',
        txt:'hi',
        likedByUsers: [],
        mediaUrls: [],
        fileUrls: [],
        createdAt: Date.now()
      }
    ]
    utilService.saveToStorage(STORAGE_KEY, messages)
  }
}