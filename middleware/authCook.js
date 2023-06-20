export default async function ({ $auth, redirect, store }) {
  const user = $auth.user

  if (!user || !$auth.loggedIn) {
    return redirect('/login')
  } else {
    if (user.role === 'ROLE_ADMIN') {
      return redirect('/dashboard')
    } else if (user.role === 'ROLE_LEADER') {
      return redirect('/managment-orders')
    } else if (user.role === 'ROLE_WAITER') {
      return redirect('/orders')
    }
  }
}
