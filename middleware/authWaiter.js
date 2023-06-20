export default async function ({ $auth, redirect, store }) {
  const user = $auth.user

  if (!user || !$auth.loggedIn) {
    return redirect('/login')
  } else {
    if (user.role === 'ROLE_ADMIN') {
      return redirect('/dashboard')
    } else if (user.role === 'ROLE_LEADER') {
      return redirect('/managment-orders')
    } else if (['ROLE_OVEN_COOK', 'ROLE_KITCHEN_COOK'].includes(user.role)) {
      return redirect('/tickets')
    }
  }

  // if (!user || user.role !== 'ROLE_WAITER') {
  //   store.commit('general/showError', { text: 'Usuario no autenticado.' })
  //   redirect('/login')
  // }
}
