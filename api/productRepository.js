export const productRepository = ($axios) => ({
  index({ getData = '', filter = '' }) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await $axios.get(
          `/back-office/products-managment/products?get=${getData}&${filter}`
        )

        resolve(result.data.data)
      } catch (err) {
        if (err.response && err.responde.data) reject(err.response.data.error)
      }
    })
  },
  create(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await $axios.$post(
          `/back-office/products-managment/create-product`,
          payload
        )
        resolve(result.data)
      } catch (err) {
        if (err.response && err.response.data) {
          reject(err.response.data.error)
        }
      }
    })
  },

  update(id, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await $axios.$put(
          `/back-office/products-managment/update-product/${id}`,
          payload
        )
        resolve(result.data)
      } catch (err) {
        if (err.response && err.response.data) {
          reject(err.response.data.error)
        }
      }
    })
  },

  delete(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await $axios.$delete(
          `/back-office/products-managment/delete-product/${id}`
        )
        resolve(result.data)
      } catch (err) {
        if (err.response && err.response.data) {
          reject(err.response.data.error)
        }
      }
    })
  },
})
