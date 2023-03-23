export const userRepository = ($axios) => ({
  index(getData = '') {
    return new Promise((resolve, reject) => {
      $axios
        .get(`/back-office/user-managment/users?get=${getData}`)
        .then((result) => {
          resolve(result.data.data)
        })
        .catch((err) => {
          if (err.response && err.response.data.error) {
            reject(err.response.data.error)
          }
        })
    })
  },

  // show(id, getData = '') {
  //   return $axios.$get(`/back-office/admin/branch-office/${id}?get=${getData}`)
  // },

  create(payload) {
    return $axios.$post(`/auth/signup`, payload)
  },

  update(id, payload) {
    return $axios.$post(`/back-office/admin/update-branch-user/${id}`, payload)
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
          if (err.response && err.response.data.error) {
            reject(err.response.data.error)
          }
        })
    })
  },
})
