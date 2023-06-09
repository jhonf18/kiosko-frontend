const localStoreNames = {
  actions: {
    load: 'load',
  },
  mutations: {
    set: 'set',
    add: 'add',
    update: 'update',
    delete: 'delete',
  },
}

export const branchOfficeStoreNames = {
  getters: { getBranchOffices: 'branchOffice/getBranchOffices' },
  actions: { load: 'branchOffice/load' },
  mutations: {
    set: 'branchOffice/set',
    add: 'branchOffice/add',
    update: 'branchOffice/update',
    delete: 'branchOffice/delete',
    addEmployee: 'branchOffice/addEmployee',
    updateEmployee: 'branchOffice/updateEmployee',
    deleteEmployee: 'branchOffice/deleteEmployee',
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
  async load({ commit, getters }) {
    try {
      if (this.$auth.loggedIn && this.$auth.user.role === 'ROLE_ADMIN') {
        if (!getters.getBranchOffices) {
          const branchOffices = await this.$branchOfficeRepository.index(
            'address,name,id,employees.name,employees.role,employees.nickname,employees.id'
          )
          commit(localStoreNames.mutations.set, branchOffices)
        }
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
  addEmployee(state, { id, name, nickname, role, branchOfficeID }) {
    let indexBranchOffice = -1
    let branchOffice = state._branchOffices.find((b, index) => {
      if (b.id === branchOfficeID) {
        indexBranchOffice = index
        return true
      }
      return false
    })

    if (indexBranchOffice !== -1) {
      branchOffice.employees.push({ id, name, nickname, role })
      state._branchOffices[indexBranchOffice] = branchOffice
    }
  },
  delete(state, branchOffice) {
    const indexBranchOffice = state._branchOffices.findIndex(
      (b) => b.id === branchOffice.id
    )

    if (indexBranchOffice > -1) {
      state._branchOffices.splice(indexBranchOffice, 1)
    }
  },
  updateEmployee(state, { user, branchOfficeID, oldBranchOfficeID }) {
    // Delete user of the old branchOffice
    if (oldBranchOfficeID && branchOfficeID !== oldBranchOfficeID) {
      let branchOfficeIndex = -1
      let branchOffice = state._branchOffices.find((b, index) => {
        if (b.id === oldBranchOfficeID) {
          branchOfficeIndex = index
          return true
        }
        return false
      })

      const userIndex = branchOffice.employees.findIndex(
        (u) => u.id === user.id
      )

      branchOffice.employees.splice(userIndex, 1)

      state._branchOffices[branchOfficeIndex] = branchOffice
    }

    let branchOfficeIndex = -1
    let branchOffice = state._branchOffices.find((b, index) => {
      if (b.id === branchOfficeID) {
        branchOfficeIndex = index
        return true
      }
      return false
    })
    const userIndex = branchOffice.employees.findIndex((e) => e.id === user.id)
    if (userIndex > -1) {
      branchOffice.employees[userIndex] = user
    } else {
      branchOffice.employees.push(user)
    }
    state._branchOffices[branchOfficeIndex] = branchOffice
  },
  deleteEmployee(state, { userID, branchOfficeID }) {
    let branchOfficeIndex = -1
    let branchOffice = state._branchOffices.find((b, index) => {
      if (b.id === branchOfficeID) {
        branchOfficeIndex = index
        return true
      }
      return false
    })

    const employeeIndex = branchOffice.employees.findIndex(
      (e) => e.id === userID
    )

    if (employeeIndex > -1) {
      branchOffice.employees.splice(employeeIndex, 1)
    }

    state._branchOffices[branchOfficeIndex] = branchOffice
  },
}
