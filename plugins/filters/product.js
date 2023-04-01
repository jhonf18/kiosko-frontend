import Vue from 'vue'

export default () => {
  Vue.filter('formatCurrency', (currency) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(currency)
  })
}
