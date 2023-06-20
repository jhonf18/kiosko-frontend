export default async function ({ $auth, redirect, store }) {
  const user = $auth.user

  if (!user || !$auth.loggedIn) {
    return redirect('/login')
  } else {
    if (user.role === 'ROLE_ADMIN') {
      return redirect('/dashboard')
    } else if (user.role === 'ROLE_WAITER') {
      return redirect('/orders')
    } else if (['ROLE_OVEN_COOK', 'ROLE_KITCHEN_COOK'].includes(user.role)) {
      return redirect('/tickets')
    }
  }
}
