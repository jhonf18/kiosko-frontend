export const categoryRepository = ($axios) => ({
  index() {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await $axios.get(
          `/back-office/categories-managment/categories`
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
          `/back-office/categories-managment/create-category`,
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
          `/back-office/categories-managment/update-category/${id}`,
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

  delete(id) {},
})
