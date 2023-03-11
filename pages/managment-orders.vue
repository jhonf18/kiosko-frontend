<template>
  <div>
    <div v-for="order in orders" :key="order.id">
      {{ order.total_price }}
      {{ order.is_open }}
      <ul v-if="order.custom_product && order.custom_product.length > 0">
        <li v-for="(product, index) in order.custom_product" :key="index">
          <strong>nombre: </strong> {{ product.name }} <strong>precio: </strong> {{ product.price }}
        </li>
      </ul>
      <br />
      <button @click="finishOder(order.id)">Finalizar pedido</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: []
    };
  },
  mounted() {
    this.socket = this.$nuxtSocket({
      name: 'main'
    });

    this.socket.emit('authentication', {
      token:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNmM2YTUyNS02MDc5LTQzYzEtOGNjZi0xNjNmYTkxNGM5NzMiLCJpZCI6IjJlMTg3MmU4LTU5M2MtNDllMy1iNjgxLTYyY2M2ZjZiYjYyNyIsImlkX2JyYW5jaF9vZmZpY2UiOiJlZjU1MzU4Yi0zOTI2LTQ2YTYtYThhZS01ZDlhOTA3ZjAxY2MiLCJpYXQiOjE2NzgyMTk4NzcsImV4cCI6MTY3ODI4NDY3NywiYXVkIjoia2lvc2tvIn0.BYeOT6CppPck_XEcOHEC4jKCuNZ8WG_xl-2GY-xg8GHmjBC7ShBwWgzCHkfX_jo34FuDr3AdzOqI9e-LsnoXxA'
    });

    this.socket.on('authenticated', () => {
      this.socket.on('new-order', order => {
        this.orders.push(order);
      });
    });

    this.socket.on('unauthorized', err => {
      this.onError = err.message;
    });
  },
  methods: {
    finishOrder(orderID) {
      //Fetch finish order
      this.socket.emit('');
    }
  }
};
</script>
