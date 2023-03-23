const localStoreNames = {
  actions: { load: 'load' },
  mutations: {
    set: 'set',
    update: 'updatePropertyBranchOffice',
  },
}

export const userStoreNames = {
  getters: { get: 'user/getUsers' },
  actions: { load: 'user/load' },
  mutations: {
    set: 'user/set',
    update: 'user/updatePropertyBranchOffice',
  },
}

export const state = () => ({
  _users: null,
})

export const getters = {
  getUsers(state) {
    return state._users
  },
}

export const actions = {
  async load({ commit }) {
    try {
      if (this.$auth.loggedIn && this.$auth.user.role === 'ROLE_ADMIN') {
        const users = await this.$userRepository.index(
          'id,name,email,nickname,role,active,branch_office.name,branch_office.id'
        )
        commit(localStoreNames.mutations.set, users)
      }
    } catch (err) {
      commit('general/showError', { name: err.code, reason: err.message })
    }
  },
}

export const mutations = {
  set(state, users) {
    state._users = users
  },
  updatePropertyBranchOffice(state, { usersIDS, branchOffice }) {
    state._users = state._users.map((user) => {
      if (usersIDS.includes(user.id)) user.branch_office = branchOffice

      if (
        user.branch_office &&
        user.branch_office.id === branchOffice.id &&
        !usersIDS.includes(user.id)
      )
        user.branch_office = null

      return user
    })
  },
}
