import { generalStoreNames } from '~/store/general'

export default function ({ $axios, store }) {
  $axios.onError((error) => {
    if (error.response === undefined) {
      store.commit(generalStoreNames.mutations.showError, {
        name: '500',
        reason: 'Ha ocurrido un error de red, por favor recarga la página.',
      })
    }

    if (error.status === 500) {
      store.commit(generalStoreNames.mutations.showError, {
        name: '500',
        reason: 'Ha ocurrido un error de red, por favor recarga la página.',
      })
    }

    if (error.response.statusText === 'Not Found') {
      store.commit(generalStoreNames.mutations.showError, {
        name: '404',
        reason: 'Recurso no encontrado.',
      })
    }
  })
}
