import { generalStoreNames } from './general'

const localStoreNames = {
  actions: { load: 'load' },
  mutations: {
    set: 'set',
  },
}

export const productStoreNames = {
  getters: { get: 'product/get' },
  actions: { load: 'product/load' },
  mutations: {
    set: 'product/set',
    add: 'product/add',
    update: 'product/update',
    delete: 'product/delete',
  },
}

export const state = () => ({
  _products: null,
})

export const getters = {
  get(state) {
    return state._products
  },
}

export const actions = {
  async load({ commit }) {
    try {
      const products = await this.$productRepository.index({
        getData:
          'name,price,id,category,subcategory,passage_sections,media_files,branch_office.id,branch_office.name,branch_office.address,selected_ingredients.id,selected_ingredients.name,selected_ingredients.type,can_change_price',
      })
      commit(localStoreNames.mutations.set, products)
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
  set(state, products) {
    state._products = products
  },
  add(state, product) {
    state._products.push(product)
  },
  update(state, product) {
    const index = state._products.findIndex((i) => i.id === product.id)

    if (index > -1) {
      state._products[index] = product
      state._products = [...state._products]
    }
  },
  delete(state, { productID }) {
    const index = state._products.findIndex((i) => i.id === productID)

    if (index > -1) {
      state._products.splice(index, 1)
    }
  },
}
