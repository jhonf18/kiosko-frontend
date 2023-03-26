import { generalStoreNames } from './general'

const localStoreNames = {
  actions: { load: 'load', loadRoles: 'loadRoles' },
  mutations: {
    set: 'set',
    update: 'updatePropertyBranchOffice',
    setRoles: 'setRoles',
  },
}

export const userStoreNames = {
  getters: { get: 'user/getUsers', getRoles: 'user/getRoles' },
  actions: { load: 'user/load', loadRoles: 'user/loadRoles' },
  mutations: {
    set: 'user/set',
    updatePropertyBranchOffice: 'user/updatePropertyBranchOffice',
    add: 'user/add',
    update: 'user/update',
    delete: 'user/delete',
  },
}

export const state = () => ({
  _users: null,
  _roles: [],
})

export const getters = {
  getUsers(state) {
    return state._users
  },
  getRoles(state) {
    return state._roles
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
      commit(
        generalStoreNames.mutations.showError,
        {
          name: err.code,
          reason: err.message,
        },
        { root: true }
      )
    }
  },
  async loadRoles({ commit }) {
    try {
      const rolesInLocalStorage = localStorage.getItem('roles')

      if (!rolesInLocalStorage) {
        let roles = await this.$userRepository.getRoles()
        localStorage.setItem('roles', JSON.stringify(roles))
        commit(localStoreNames.mutations.setRoles, roles)
      } else {
        commit(
          localStoreNames.mutations.setRoles,
          JSON.parse(rolesInLocalStorage)
        )
      }
    } catch (err) {
      commit(
        generalStoreNames.mutations.showError,
        {
          name: err.code,
          reason: err.message,
        },
        { root: true }
      )
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
  setRoles(state, roles) {
    state._roles = roles
  },
  add(state, user) {
    state._users.push(user)
  },
  update(state, user) {
    const userIndex = state._users.findIndex((u) => u.id === user.id)

    state._users[userIndex] = user
    state._users = [...state._users]
  },
  delete(state, { userID }) {
    const userIndex = state._users.findIndex((u) => u.id === userID)
    if (userIndex > -1) {
      state._users.splice(userIndex, 1)
    }
  },
}
