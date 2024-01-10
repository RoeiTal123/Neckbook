import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'product'
// _createProducts()

export const productService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
}
// debug trick
window.bs = productService

async function query(filterBy = { userId: '' }) {
  let products = await storageService.query(STORAGE_KEY)
  if (filterBy.userId) {
    const regex = new RegExp(filterBy.userId, 'i')
    products = products.filter(
      (product) => product.ownerId === filterBy.userId
      // regex.test(product.title) || regex.test(product.description)
    )
  }
  if (filterBy.groupId) {
    const regex = new RegExp(filterBy.groupId, 'i')
    products = products.filter(
      (product) => product.productGroupId === filterBy.groupId
      // regex.test(product.title) || regex.test(product.description)
    )
  }
  return products
}

function getById(productId) {
  return storageService.get(STORAGE_KEY, productId)
}

async function remove(productId) {
  await storageService.remove(STORAGE_KEY, productId)
}

async function save(product) {
  let savedProduct
  if (product._id) {
    savedProduct = await storageService.put(STORAGE_KEY, product)
  } else {
    // product.owner = userService.getLoggedinUser()
    savedProduct = await storageService.product(STORAGE_KEY, product)
  }
  return savedProduct
}

function getDefaultFilter() {
  return {
    search: ''
  }
}

function _createProducts() {
  let products = utilService.loadFromStorage(STORAGE_KEY)
  if (!products || !products.length) {
    products = [
        {
        _id: "pr001",
        name: "Spiderman pictures...",
        description:'100 Spiderman pictures available, buy while they last!',
        ownerId: "u001",
        price: '50',
        location: null,
        imgUrls: [
          "https://cdn.britannica.com/54/93454-050-5AC49E5E/Spider-Man-Tobey-Maguire-2.jpg",
          "https://i.insider.com/5d5d70df4afbf9310528d139?width=750&format=jpeg&auto=webp",
          "https://assets-prd.ignimgs.com/2022/03/18/spidermannowayhomeexclusivefirst10minutesignblogroll-1647047297213-1647633871978.jpeg",
          "https://www.gamespot.com/a/uploads/scale_medium/1582/15828986/3552444-spider%20train%202.jpg",
          "https://www.gamespot.com/a/uploads/screen_kubrick/1582/15828986/3552441-hed.jpg"
        ],
        videoUrl:null,
        availability: true,
        listedAt: Date.now()
      }
    ]
    utilService.saveToStorage(STORAGE_KEY, products)
  }
}

_createProducts()