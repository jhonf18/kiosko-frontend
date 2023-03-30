import { branchOfficeRepository } from './branchOfficeRepository.js'
import { categoryRepository } from './categoryRepository.js'
import { ingredientRepository } from './ingredientRepository.js'
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
}
