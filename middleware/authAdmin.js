export default async function ({ $auth, redirect, store }) {
  let user = $auth.user

  if (!user || !$auth.loggedIn) {
    return redirect('/login')
  } else {
    if (user.role === 'ROLE_LEADER') {
      return redirect('/managment-orders')
    } else if (user.role === 'ROLE_WAITER') {
      return redirect('/orders')
    } else if (['ROLE_OVEN_COOK', 'ROLE_KITCHEN_COOK'].includes(user.role)) {
      return redirect('/tickets')
    }
  }
}
