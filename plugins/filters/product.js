import Vue from 'vue'

export default () => {
  Vue.filter('formatCurrency', (currency) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(currency)
  })

  Vue.filter('formatProductName', (name) => {
    const productNameArray = name.split('--')
    if (productNameArray.length === 2) {
      const productName = productNameArray[0].trim()
      const productSize = productNameArray[1].trim()
      return `${productName} (${productSize})`
    } else {
      return name
    }
  })
}
