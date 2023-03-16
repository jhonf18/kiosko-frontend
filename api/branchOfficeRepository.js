export const branchOfficeRepository = ($axios) => ({
  index(getData = '') {
    return $axios.$get(`/back-office/admin/branch-offices?get=${getData}`)
  },

  show(id, getData = '') {
    return $axios.$get(`/back-office/admin/branch-office/${id}?get=${getData}`)
  },

  create(payload) {
    return $axios.$post(`/back-office/admin/create-branch-office`, payload)
  },

  update(id, payload) {
    return $axios.$post(
      `/back-office/admin/update-branch-office/${id}`,
      payload
    )
  },

  delete(id) {
    return $axios.$delete(`/back-office/admin/delete-branch-office/${id}`)
  },
})
