export default function ({ store, redirect }) {
  if (
    store.state.auth.loggedIn &&
    store.state.auth.user.role === 'ROLE_ADMIN'
  ) {
    return redirect('/dashboard')
  } else if (
    store.state.auth.loggedIn &&
    store.state.auth.user.role === 'ROLE_LEADER'
  ) {
    return redirect('/dashboard-leaders')
  } else if (
    store.state.auth.loggedIn &&
    store.state.auth.user.role === 'ROLE_WAITER'
  ) {
    return redirect('/orders')
  } else if (
    store.state.auth.loggedIn &&
    ['ROLE_OVEN_COOK', 'ROLE_KITCHEN_COOK'].includes(store.state.auth.user.role)
  ) {
    return redirect('/tickets')
  }
}
