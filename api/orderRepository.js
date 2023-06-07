export const orderRepository = ($axios) => ({
  index({ getData = '', filter = '' }) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await $axios.get(
          `/managment-orders/orders/orders?get=${getData}&${filter}`
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
          `/managment-orders/orders/create-order`,
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
          `managment-orders/orders/delete-order/${id}`
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
