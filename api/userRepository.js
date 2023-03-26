export const userRepository = ($axios) => ({
  index(getData = '') {
    return new Promise((resolve, reject) => {
      $axios
        .get(`/back-office/user-managment/users?get=${getData}`)
        .then((result) => {
          resolve(result.data.data)
        })
        .catch((err) => {
          reject(
            err.response.data.error
              ? err.response.data.error
              : { message: 'Ha ocurrido un error inesperado.' }
          )
        })
    })
  },

  // show(id, getData = '') {
  //   return $axios.$get(`/back-office/admin/branch-office/${id}?get=${getData}`)
  // },

  create(payload) {
    return new Promise(async (resolve, reject) => {
      $axios
        .$post(`/auth/signup`, payload)
        .then((result) => {
          resolve(result.data)
        })
        .catch((err) => {
          reject(
            err.response.data.error
              ? err.response.data.error
              : { message: 'Ha ocurrido un error inesperado.' }
          )
        })
    })
  },

  update(id, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await $axios.$put(
          `/back-office/admin/update-user/${id}`,
          payload
        )
        resolve(result.data)
      } catch (err) {
        reject(
          err.response.data.error
            ? err.response.data.error
            : { message: 'Ha ocurrido un error inesperado.' }
        )
      }
    })
  },

  delete(id) {
    return $axios.$delete(`/back-office/admin/delete-user/${id}`)
  },
  verifyPassword(password) {
    return new Promise(async (resolve, reject) => {
      $axios
        .$post('/back-office/admin/verify-password', { password: password })
        .then((result) => {
          resolve(result.data)
        })
        .catch((err) => {
          reject(
            err.response.data.error
              ? err.response.data.error
              : { message: 'Ha ocurrido un error inesperado.' }
          )
        })
    })
  },
  getRoles() {
    return new Promise((resolve, reject) => {
      $axios
        .get(`/back-office/admin/roles`)
        .then((result) => {
          resolve(result.data.data)
        })
        .catch((err) => {
          reject(
            err.response.data.error
              ? err.response.data.error
              : { message: 'Ha ocurrido un error inesperado.' }
          )
        })
    })
  },
})
