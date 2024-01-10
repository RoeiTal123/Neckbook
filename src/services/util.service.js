
export const utilService = {
  makeId,
  makeLorem,
  getRandomIntInclusive,
  debounce,
  randomPastTime,
  saveToStorage,
  loadFromStorage,
  getAssetSrc,
  timeAgoString,
  getRandomColor,
  getRandomMidColor,
  formatDate,
  checkVideoType
}

export const yearlyMonths = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December',
]


function makeId(length = 6) {
  let txt = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function makeLorem(size = 100) {
  let words = [
    'The sky',
    'above',
    'the port',
    'was',
    'the color of television',
    'tuned',
    'to',
    'a dead channel',
    '.',
    'All',
    'this happened',
    'more or less',
    '.',
    'I',
    'had',
    'the story',
    'bit by bit',
    'from various people',
    'and',
    'as generally',
    'happens',
    'in such cases',
    'each time',
    'it',
    'was',
    'a different story',
    '.',
    'It',
    'was',
    'a pleasure',
    'to',
    'burn',
  ]
  let txt = ''
  while (size > 0) {
    size--
    txt += words[Math.floor(Math.random() * words.length)] + ' '
  }
  return txt
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function randomPastTime() {
  const HOUR = 1000 * 60 * 60
  const DAY = 1000 * 60 * 60 * 24
  const WEEK = 1000 * 60 * 60 * 24 * 7

  const pastTime = getRandomIntInclusive(HOUR, WEEK)
  return Date.now() - pastTime
}

function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : undefined
}

// util function
function getAssetSrc(name) {
  const path = `/src/assets/${name}`
  const modules = import.meta.glob('/src/assets/*', { eager: true })
  const mod = modules[path]
  return mod.default
}

function timeAgoString(timestamp) {
  const now = new Date().getTime()
  const secondsAgo = Math.floor((now - timestamp) / 1000)
  const minutesAgo = Math.floor(secondsAgo / 60)
  const hoursAgo = Math.floor(minutesAgo / 60)
  const daysAgo = Math.floor(hoursAgo / 24)
  const monthsAgo = Math.floor(daysAgo / 30)

  if (monthsAgo >= 2) {
    return `${monthsAgo} months ago`
  }
  else if (daysAgo >= 2) {
    return `${daysAgo} days ago`
  }
  else if (hoursAgo >= 1) {
    return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`
  }
  else if (minutesAgo >= 1) {
    return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`
  }
  else return 'a few seconds ago'
}

function formatDate(timestamp) {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear().toString().substring(-2)

  return `${day}/${month}/${year}`
}

function getRandomMidColor() {
  const letters = '3456789ABC'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 10)]
  }
  return color
}


function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function checkVideoType(fileInput) {
  // const fileInput = document.getElementById('videoInput');
  const resultOfCheck = ''

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const allowedExtensions = ['mp4', 'webm', 'ogg']; // Add more if needed

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
      resultOfCheck = 'Valid video type.';
    } else {
      resultOfCheck = 'Invalid video type. Allowed formats: ' + allowedExtensions.join(', ');
      // You may want to clear the file input or take other actions
      fileInput.value = '';
    }
  }
  return resultOfCheck
}