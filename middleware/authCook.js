export default async function ({ $auth, redirect, store }) {
  const user = $auth.user

  const ROLES_COOK = ['ROLE_OVEN_COOK', 'ROLE_KITCHEN_COOK']

  if (!user || !ROLES_COOK.includes(user.role)) {
    store.commit('general/showError', { text: 'Usuario no autenticado.' })
    redirect('/login')
  }
}
