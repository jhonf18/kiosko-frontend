export default async function ({ $auth, redirect }) {
  const user = $auth.user

  const ROLES_COOK = ['ROLE_OVEN_COOK', 'ROLE_KITCHEN_COOK']

  if (user && user.role === 'ROLE_ADMIN') {
    redirect('/dashboard')
  } else if (user && user.role === 'ROLE_WAITER') {
    redirect('/orders')
  } else if (user && ROLES_COOK.includes(user.role)) {
    redirect('/tickets')
  } else if (user && user.role === 'ROLE_LEADER') {
    redirect('/managment-orders')
  }
}
