<template>
  <div>
    <h1>Tickets</h1>
    <div v-for="tickets in orders" :key="tickets.id">
      {{ ticket.name }}
      {{ ticket.total_price }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tickets: []
    };
  },
  mounted() {
    this.socket = this.$nuxtSocket({
      name: 'main'
    });

    this.socket.emit('authentication', {
      token:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmYzUwY2ViYi0xOWY3LTQ5MDAtYjAyZi0xN2M1NDMzNWQ4NzEiLCJpZCI6ImZkN2VlMmRkLWJlZTctNGNkYi1hMTYyLWU1MmJkZWQxYTU5OSIsImlkX2JyYW5jaF9vZmZpY2UiOiJlZjU1MzU4Yi0zOTI2LTQ2YTYtYThhZS01ZDlhOTA3ZjAxY2MiLCJpYXQiOjE2NzgyMTk5ODgsImV4cCI6MTY3ODI4NDc4OCwiYXVkIjoia2lvc2tvIn0.3Kexay4ZuVLlSSbYtdzZjhTFzAKT7cosIj88g931oegfuo953OJCD5Bp8QuLQ4_eO0VLnfF7agEjdHwpwjkg8Q'
    });

    this.socket.on('authenticated', () => {
      this.socket.on('new-order', order => {
        this.orders.push(order);
      });
    });

    this.socket.on('unauthorized', err => {
      this.onError = err.message;
    });
  }
};
</script>
