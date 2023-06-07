export const socketStoreNames = {
  getters: {
    isConnected: 'general/isConnected',
    getEvent: 'general/getEmitter',
  },
  mutations: {
    showError: 'general/showError',
    toggleError: 'general/toggleErrorState',
    showToast: 'general/showToast',
    removeToast: 'general/removeToast',
  },
}

export const state = () => ({
  _connected: false,
  _emitter: {
    name: '',
    data: null,
    date: null,
  },
  _socket: null,
})

export const getters = {
  isConnected(state) {
    return state._connected
  },
  getEmitter(state) {
    return state._emitter
  },
}

export const actions = {
  async nuxtServerInit({ context }) {
    console.log('heeeeee')
    console.log(context)
  },
}

export const mutations = {
  emit(state, { name, data, date }) {
    state._event = { name, data, date }
  },
}
