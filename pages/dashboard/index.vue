<template>
  <div>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta voluptate
      unde nostrum quaerat facilis impedit, esse eius fugiat architecto ab
      tempora totam, consectetur blanditiis quis repellendus perspiciatis.
      Eaque, voluptates nulla.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta voluptate
      unde nostrum quaerat facilis impedit, esse eius fugiat architecto ab
      tempora totam, consectetur blanditiis quis repellendus perspiciatis.
      Eaque, voluptates nulla.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta voluptate
      unde nostrum quaerat facilis impedit, esse eius fugiat architecto ab
      tempora totam, consectetur blanditiis quis repellendus perspiciatis.
      Eaque, voluptates nulla.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta voluptate
      unde nostrum quaerat facilis impedit, esse eius fugiat architecto ab
      tempora totam, consectetur blanditiis quis repellendus perspiciatis.
      Eaque, voluptates nulla.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta voluptate
      unde nostrum quaerat facilis impedit, esse eius fugiat architecto ab
      tempora totam, consectetur blanditiis quis repellendus perspiciatis.
      Eaque, voluptates nulla.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta voluptate
      unde nostrum quaerat facilis impedit, esse eius fugiat architecto ab
      tempora totam, consectetur blanditiis quis repellendus perspiciatis.
      Eaque, voluptates nulla.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta voluptate
      unde nostrum quaerat facilis impedit, esse eius fugiat architecto ab
      tempora totam, consectetur blanditiis quis repellendus perspiciatis.
      Eaque, voluptates nulla.
    </p>
  </div>
</template>

<script>
const navigation = [
  { name: 'Usuarios', componentIcon: 'UsersIcon', route: '/dashboard' },
  { name: 'Pedidos', componentIcon: 'OrdersIcon', route: '/dashboard/orders' },
  {
    name: 'Productos',
    componentIcon: 'ProductIcon',
    route: '/dashboard/products',
  },
  {
    name: 'Categorias',
    componentIcon: 'CategoryIcon',
    route: '/admin/categories',
  },
]
export default {
  layout: 'dashboard',
  data() {
    return {
      navigation,
    }
  },
  components: {
    UsersIcon: () => import('@/static/icons/users.svg?inline'),
    ProductIcon: () => import('@/static/icons/product.svg?inline'),
    CategoryIcon: () => import('@/static/icons/category.svg?inline'),
    OrdersIcon: () => import('@/static/icons/orders.svg?inline'),
    StatisticsIcon: () => import('@/static/icons/statistics.svg?inline'),
    SignoutIcon: () => import('@/static/icons/signout.svg?inline'),
  },
}
</script>
