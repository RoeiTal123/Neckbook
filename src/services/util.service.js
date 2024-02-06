
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
  timeString,
  getRandomColor,
  getRandomMidColor,
  formatDate,
  checkVideoType,
  checkIfUrlInText,
  cutUrlFromText,
  indexsOfUrl,
  isTxtOnlySpaces,
  spellNumber,
  removeCommonElements
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

function timeString(timestamp) {
  const now = new Date().getTime()
  const secondsAgo = Math.floor((now - timestamp) / 1000)
  const minutesAgo = Math.floor(secondsAgo / 60)
  const hoursAgo = Math.floor(minutesAgo / 60)
  const daysAgo = Math.floor(hoursAgo / 24)
  const monthsAgo = Math.floor(daysAgo / 30)

  if (monthsAgo >= 2) {
    return `${monthsAgo}mo`
  }
  else if (daysAgo >= 2) {
    return `${daysAgo}d`
  }
  else if (hoursAgo >= 1) {
    return `${hoursAgo}h`
  }
  else if (minutesAgo >= 1) {
    return `${minutesAgo}m`
  }
  else return 'seconds ago'
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
  let resultOfCheck = ''

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


function checkIfUrlInText(text) {
  const tester = '\^~{}[];@` '
  if (text.includes('http://') || text.includes('https://')) {
    let secondTester = text.split('/')
    secondTester = secondTester.splice(2, secondTester.length - 2)
    for (let route of secondTester) {
      for (let character of tester) {
        if (route.includes(character)) {
          console.log(`'${character}' is illegal!!!!`)
          return
        } else {
          console.log('pass')
        }
      }
      if (route.includes('http') || route.includes('https')) {
        console.log(`its illegal!!!!`)
        return
      }
    }
    console.log('intact Url')
    return true
  }
  return false
}

function cutUrlFromText(text) {
  const startIndex = text.indexOf('http')
  const helper = text.slice(startIndex, text.length - startIndex + 1)
  // console.log(startIndex)
  const endIndex = helper.indexOf(' ')
  // console.log(endIndex)
  const croppedUrl = text.slice(startIndex, endIndex + startIndex)
  console.log(croppedUrl)
  return croppedUrl
}

function indexsOfUrl(text) {
  const startIndex = text.indexOf('http')
  const helper = text.slice(startIndex, text.length - startIndex + 1)
  // console.log(startIndex)
  const endIndex = helper.indexOf(' ')
  // console.log(endIndex)
  const croppedUrl = text.slice(startIndex, endIndex + startIndex)
  return { start: startIndex, end: endIndex }
}

function isTxtOnlySpaces(txt) {
  if (!txt) {
    return true
  }
  for (let character of txt) {
    if (character !== ' ') {
      return false;
    }
  }
  return true
}

function spellNumber(n) {
  const numberWords = {
    0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four',
    5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine',
    10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen',
    14: 'fourteen', 15: 'fifteen', 16: 'sixteen', 17: 'seventeen',
    18: 'eighteen', 19: 'nineteen', 20: 'twenty', 30: 'thirty',
    40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy',
    80: 'eighty', 90: 'ninety'
  }

  if (n in numberWords) {
    return numberWords[n]
  }

  if (n < 100) {
    return numberWords[Math.floor(n / 10) * 10] + '-' + numberWords[n % 10]
  }

  if (n < 1000) {
    const hundreds = numberWords[Math.floor(n / 100)] + ' hundred'
    const remainder = n % 100
    if (remainder > 0) {
      return hundreds + ' and ' + spellNumber(remainder)
    } else {
      return hundreds
    }
  }

  return "Number out of range"
}

function removeCommonElements(arr1, arr2) {
  // Count occurrences of elements in both arrays
  const count1 = {}
  const count2 = {}

  // Count occurrences in arr1
  for (const item of arr1) {
    count1[item] = (count1[item] || 0) + 1
  }

  // Count occurrences in arr2
  for (const item of arr2) {
    count2[item] = (count2[item] || 0) + 1
  }

  // Iterate through arr1 in reverse order
  for (let i = arr1.length - 1; i >= 0; i--) {
    const item = arr1[i]
    // Check if item exists in arr2
    if (count2[item] !== undefined) {
      // Calculate the minimum occurrences to remove
      const minToRemove = Math.min(count1[item], count2[item])
      // Remove minToRemove occurrences of item from both arrays
      for (let j = 0; j < minToRemove; j++) {
        arr1.splice(arr1.lastIndexOf(item), 1)
        arr2.splice(arr2.lastIndexOf(item), 1)
      }
      // Update the counts
      count1[item] -= minToRemove
      count2[item] -= minToRemove
      // If no more occurrences in arr1, remove it from the count
      if (count1[item] === 0) {
        delete count1[item]
      }
      // If no more occurrences in arr2, remove it from the count
      if (count2[item] === 0) {
        delete count2[item]
      }
    }
  }
  if (arr1.length > arr2) {
    return arr1
  } else {
    return arr2
  }
  // return [arr1, arr2]
}