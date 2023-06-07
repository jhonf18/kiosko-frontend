<template>
  <div>
    <div v-for="order in orders" :key="order.id">
      <strong>
        {{ order.name }}
      </strong>
      {{ order.total_price }}
      <br />
      <button @click="finishOder(order.id)">Finalizar pedido</button>
      <hr />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
    }
  },
  mounted() {
    this.socket = this.$nuxtSocket({
      name: 'main',
    })

    this.socket.emit('authentication', {
      token:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMzgxMTVlNi1jYjQ4LTRjNTktYTQ3ZC04YWZkNjYwNjcyZDUiLCJpZCI6Ijc1OTVmYjU0LWE0OTktNGEyNi05YjkzLWQ1YjE5ZmNhMmQ5NCIsImlkX2JyYW5jaF9vZmZpY2UiOiJlZjU1MzU4Yi0zOTI2LTQ2YTYtYThhZS01ZDlhOTA3ZjAxY2MiLCJpYXQiOjE2ODU5MjI0ODksImV4cCI6MTY4NTk4NzI4OSwiYXVkIjoia2lvc2tvIn0.Oj4jXJwxX6uDl-IplwZsewYBYaX4CcmJpAF7efhQm_LJtSOkk2PBJJvjfFj_jz-XGo9Qr-baP06rR2wO2m8Wuw',
    })

    this.socket.on('authenticated', () => {
      this.socket.on('new-order', (order) => {
        this.orders.push(order)
      })
    })

    this.socket.on('unauthorized', (err) => {
      this.onError = err.message
    })
  },
  methods: {
    finishOrder(orderID) {
      //Fetch finish order
      this.socket.emit('')
    },
  },
}
</script>
