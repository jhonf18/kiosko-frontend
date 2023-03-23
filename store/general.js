export const generalStoreNames = {
  getters: { get: 'general/getError', getToast: 'general/getToast' },
  mutations: {
    showError: 'general/showError',
    toggleError: 'general/toggleErrorState',
    showToast: 'general/showToast',
    removeToast: 'general/removeToast',
  },
}

const toastDefault = {
  show: false,
  type: 'error',
  visibleTime: 3,
  text: '',
}

export const state = () => ({
  _error: { show: false },
  _toast: { ...toastDefault },
})

export const getters = {
  getError(state) {
    return state._error
  },
  getToast(state) {
    return state._toast
  },
}

export const mutations = {
  showError(state, { name, reason }) {
    state._error = { name, reason, show: true }
  },
  toggleErrorState(state, toggle) {
    state._error = { show: toggle }
  },
  showToast(state, { text, type = 'error', visibleTime = 3 }) {
    state._toast.text = text
    state._toast.visibleTime = visibleTime
    state._toast.type = type
    state._toast.show = true
  },
  removeToast(state) {
    state._toast = { ...toastDefault }
  },
}
