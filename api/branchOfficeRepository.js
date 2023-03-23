export const branchOfficeRepository = ($axios) => ({
  index(getData = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await $axios.get(
          `/back-office/admin/branch-offices?get=${getData}`
        )

        resolve(result.data.data)
      } catch (err) {
        if (err.response && err.responde.data) reject(err.response.data.error)
      }
    })
  },

  show(id, getData = '') {
    return $axios.$get(`/back-office/admin/branch-office/${id}?get=${getData}`)
  },

  create(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await $axios.$post(
          `/back-office/admin/create-branch-office`,
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
          `/back-office/admin/update-branch-office/${id}`,
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
    return $axios.$delete(`/back-office/admin/delete-branch-office/${id}`)
  },
})
