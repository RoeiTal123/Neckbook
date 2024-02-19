import { storageService } from './async-storage.service.js'
import { messageService } from './messageService.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'chat'

loadData()

async function loadData(){
    // console.log(await storageService.query(STORAGE_KEY).length===undefined)
    if(await storageService.query(STORAGE_KEY).length===undefined){
      _createChats()
    }
}

export const chatService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
}
// debug trick
window.bs = chatService

async function query(filterBy = { userId: '' }) {
  let chats = await storageService.query(STORAGE_KEY)
  if (filterBy.userId) {
    const regex = new RegExp(filterBy.userId, 'i')
    chats = chats.filter(
      (chat) => chat.ownerId === filterBy.userId
      // regex.test(chat.title) || regex.test(chat.description)
    )
  }
  if (filterBy.groupId) {
    const regex = new RegExp(filterBy.groupId, 'i')
    chats = chats.filter(
      (chat) => chat.chatGroupId === filterBy.groupId
      // regex.test(chat.title) || regex.test(chat.description)
    )
  }
  return chats
}

async function getById(chatId) {
  let chat = await storageService.get(STORAGE_KEY, chatId)
  for (let message of chat.messages){
    const msgFromService =  messageService.getById(message)
    message = {...msgFromService}
  }
  return chat
}

async function remove(chatId) {
  await storageService.remove(STORAGE_KEY, chatId)
}

async function save(chat) {
  let savedChat
  const allChats = await query()
  if (chatExists(allChats,chat)) {
    savedChat = await storageService.put(STORAGE_KEY, chat)
  } else {
    // chat.owner = userService.getLoggedinUser()
    savedChat = await storageService.post(STORAGE_KEY, chat)
  }
  return savedChat
}

function chatExists(chats, chat){
  for(let existingChat of chats){
      if(existingChat._id === chat._id) {
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

function _createChats() {
  let chats = utilService.loadFromStorage(STORAGE_KEY)
  if (!chats || !chats.length) {
    chats = [
        {
        _id: "ch001",
        chatType:'personal',
        usersInChat:['u001','u003'],
        nickname:[{'u001':'default'},{'u003':'default'}],
        messages: ['m001','m002'],
        mediaUrls: [],
        fileUrls: [],
        themeColor:'0084ff',
        createdAt: Date.now()
      },
      {
      _id: "ch002",
      chatType:'group',
      usersInChat:['u001','u002','u003'],
      nickname:[{'u001':'default'},{'u002':'default'},{'u003':'default'}],
      messages: ['m003'],
      coverImgUrl: null,
      chatName: null,
      mediaUrls: [],
      fileUrls: [],
      themeColor:'0084ff',
      createdAt: Date.now()
    },
    ]
    utilService.saveToStorage(STORAGE_KEY, chats)
  }
}