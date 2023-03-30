import { generalStoreNames } from './general'

const localStoreNames = {
  actions: { load: 'load' },
  mutations: {
    set: 'set',
  },
}

export const categoryStoreNames = {
  getters: { get: 'category/get' },
  actions: { load: 'category/load' },
  mutations: {
    set: 'category/set',
    add: 'category/add',
    update: 'category/update',
  },
}

export const state = () => ({
  _categories: null,
})

export const getters = {
  get(state) {
    return state._categories
  },
}

export const actions = {
  async load({ commit }) {
    try {
      if (this.$auth.loggedIn && this.$auth.user.role === 'ROLE_ADMIN') {
        const categories = await this.$categoryRepository.index()
        commit(localStoreNames.mutations.set, categories)
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
  set(state, categories) {
    state._categories = categories
  },
  add(state, category) {
    state._categories.push(category)
  },
  update(state, category) {
    const index = state._categories.findIndex((c) => c.id === category.id)
    if (index > -1) {
      state._categories[index] = category
      state._categories = [...state._categories]
    }
  },
}
