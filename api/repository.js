import { branchOfficeRepository } from './branchOfficeRepository.js'
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
}
