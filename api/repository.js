import { branchOfficeRepository } from './branchOfficeRepository.js'

export class Repository {
  constructor($axios) {
    this.$axios = $axios
  }

  getBranchOfficeRepository() {
    return branchOfficeRepository(this.$axios)
  }
}
