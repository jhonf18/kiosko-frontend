const localStoreNames = {
  actions: {
    load: 'load',
  },
  mutations: {
    set: 'set',
    add: 'add',
    update: 'update',
  },
}

export const branchOfficeStoreNames = {
  getters: { getBranchOffices: 'branchOffice/getBranchOffices' },
  actions: { load: 'branchOffice/load' },
  mutations: {
    set: 'branchOffice/set',
    add: 'branchOffice/add',
    update: 'branchOffice/update',
  },
}

export const state = () => ({
  _branchOffices: null,
})

export const getters = {
  getBranchOffices(state) {
    return state._branchOffices
  },
}

export const actions = {
  async load({ commit }) {
    try {
      if (this.$auth.loggedIn && this.$auth.user.role === 'ROLE_ADMIN') {
        const branchOffices = await this.$branchOfficeRepository.index(
          'address,name,id,employees.name,employees.role,employees.nickname,employees.id'
        )
        commit(localStoreNames.mutations.set, branchOffices)
      }
    } catch (err) {
      commit('general/showError', { name: err.code, reason: err.message })
    }
  },
}

export const mutations = {
  set(state, branchOffices) {
    state._branchOffices = branchOffices
  },
  add(state, branchOffice) {
    state._branchOffices.push(branchOffice)
  },
  update(state, branchOffice) {
    state._branchOffices = state._branchOffices.map((branchOfficeStore) =>
      branchOfficeStore.id === branchOffice.id
        ? branchOffice
        : branchOfficeStore
    )
  },
}
