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
    add: 'ingredient/add',
    update: 'ingredient/update',
    delete: 'ingredient/delete',
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
  add(state, ingredient) {
    state._ingredients.push(ingredient)
  },
  update(state, ingredient) {
    const index = state._ingredients.findIndex((i) => i.id === ingredient.id)

    if (index > -1) {
      state._ingredients[index] = ingredient
      state._ingredients = [...state._ingredients]
    }
  },
  delete(state, { ingredientID }) {
    const index = state._ingredients.findIndex((i) => i.id === ingredientID)

    if (index > -1) {
      state._ingredients.splice(index, 1)
    }
  },
}
