export const ticketRepository = ($axios) => ({
  index({ getData = '', filter = '' }) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await $axios.get(
          `/managment-orders/tickets/tickets?get=${getData}&${filter}`
        )

        resolve(result.data.data)
      } catch (err) {
        if (err.response && err.responde.data) reject(err.response.data.error)
      }
    })
  },
  updateStatus(id, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await $axios.$put(
          `/managment-orders/tickets/change-status-ticket/${id}`,
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
})
