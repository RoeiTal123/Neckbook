import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'group'
// _createGroups()

export const groupService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
}
// debug trick
window.bs = groupService

async function query(filterBy = { userId: '' }) {
  let groups = await storageService.query(STORAGE_KEY)
  if (filterBy.userId) {
    const regex = new RegExp(filterBy.userId, 'i')
    groups = groups.filter(
      (group) => group.ownerId === filterBy.userId
      // regex.test(group.title) || regex.test(group.description)
    )
  }
  if (filterBy.groupId) {
    const regex = new RegExp(filterBy.groupId, 'i')
    groups = groups.filter(
      (group) => group.groupGroupId === filterBy.groupId
      // regex.test(group.title) || regex.test(group.description)
    )
  }
  return groups
}

function getById(groupId) {
  return storageService.get(STORAGE_KEY, groupId)
}

async function remove(groupId) {
  await storageService.remove(STORAGE_KEY, groupId)
}

async function save(group) {
  let savedGroup
  if (group._id) {
    savedGroup = await storageService.put(STORAGE_KEY, group)
  } else {
    // group.owner = userService.getLoggedinUser()
    savedGroup = await storageService.group(STORAGE_KEY, group)
  }
  return savedGroup
}

function getDefaultFilter() {
  return {
    search: ''
  }
}

function _createGroups() {
  let groups = utilService.loadFromStorage(STORAGE_KEY)
  if (!groups || !groups.length) {
    groups = [
        {
        _id: "g001",
        name:'programming is fun!',
        coverImgUrl:'https://res.cloudinary.com/dqk28z6rq/image/upload/v1704624641/projects/Neckbook/group-images/code_sadrhr.jpg',
        description: "for programmers only",
        groupType: 'Public',
        admins: ['u003'],
        members:['u003','u001'],
        posts:['p003'],
        events:[],
        files:[],
        mediaUrls: [],
        videoUrls:[],
        lastPostAt:Date.now(),
        createdAt: Date.now()
      }
    ]
    utilService.saveToStorage(STORAGE_KEY, groups)
  }
}

_createGroups()