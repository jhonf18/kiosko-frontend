export default async function ({ $auth, redirect, store }) {
  const user = $auth.user

  if (!user || user.role !== 'ROLE_LEADER') {
    store.commit('general/showError', { text: 'Usuario no autenticado.' })
    redirect('/login')
  }
}
