import Vue from 'vue'

export default () => {
  const roles = [
    { path: 'ROLE_ADMIN', name: 'Administrador' },
    { path: 'ROLE_WAITER', name: 'Mesero' },
    { path: 'ROLE_LEADER', name: 'Líder' },
    { path: 'ROLE_KITCHEN_COOK', name: 'Cocinero de cocina' },
    { path: 'ROLE_OVEN_COOK', name: 'Cocinero de horno' },
  ]
  Vue.filter('roleName', (role) => {
    const indexRole = roles.findIndex((r) => r.path === role)

    if (indexRole > -1) {
      return roles[indexRole].name
    }

    return 'No asignado'
  })
}
