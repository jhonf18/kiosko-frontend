import { generalStoreNames } from './general'

const localStoreNames = {
  actions: { load: 'load' },
  mutations: {
    set: 'set',
  },
}

export const ingredientStoreNames = {
  getters: { get: 'ingredient/get' },
  actions: { load: 'ingredient/load' },
  mutations: {
    set: 'ingredient/set',
  },
}

export const state = () => ({
  _ingredients: null,
})

export const getters = {
  get(state) {
    return state._ingredients
  },
}

export const actions = {
  async load({ commit }) {
    try {
      if (this.$auth.loggedIn && this.$auth.user.role === 'ROLE_ADMIN') {
        const ingredients = await this.$ingredientRepository.index()
        commit(localStoreNames.mutations.set, ingredients)
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
  set(state, ingredients) {
    state._ingredients = ingredients
  },
}
