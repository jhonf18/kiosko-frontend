import { branchOfficeRepository } from './branchOfficeRepository.js'
import { categoryRepository } from './categoryRepository.js'
import { ingredientRepository } from './ingredientRepository.js'
import { orderRepository } from './orderRepository.js'
import { productRepository } from './productRepository.js'
import { ticketRepository } from './ticketRepository.js'
import { userRepository } from './userRepository.js'

export class Repository {
  constructor($axios) {
    this.$axios = $axios
  }

  getBranchOfficeRepository() {
    return branchOfficeRepository(this.$axios)
  }

  getUserRepository() {
    return userRepository(this.$axios)
  }

  getCategoryRepository() {
    return categoryRepository(this.$axios)
  }

  getIngredientRepository() {
    return ingredientRepository(this.$axios)
  }

  getProductRepository() {
    return productRepository(this.$axios)
  }

  getOrderRepository() {
    return orderRepository(this.$axios)
  }

  getTicketRepository() {
    return ticketRepository(this.$axios)
  }
}
