export const ingredientRepository = ($axios) => ({
  index() {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await $axios.get(
          `/back-office/products-managment/ingredients`
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
          `/back-office/products-managment/create-ingredient`,
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
          `/back-office/products-managment/update-ingredient/${id}`,
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
          `/back-office/products-managment/delete-ingredient/${id}`
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
