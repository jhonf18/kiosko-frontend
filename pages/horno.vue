<template>
  <div>
    <h1>Tickets</h1>
    <ul v-for="ticket in tickets" :key="ticket.id">
      <li>{{ ticket.id }}</li>
    </ul>
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
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhOTk2MzhiMy04MWExLTQ3ZmItOTIwYS1hM2I0YTBjNTM1YmIiLCJpZCI6IjBkMjE1Yjg1LTNjNTktNGQ3My1iMDk4LWEwZGViNTAyMWY4OSIsImlkX2JyYW5jaF9vZmZpY2UiOiJlZjU1MzU4Yi0zOTI2LTQ2YTYtYThhZS01ZDlhOTA3ZjAxY2MiLCJpYXQiOjE2NzgyMTk5NjEsImV4cCI6MTY3ODI4NDc2MSwiYXVkIjoia2lvc2tvIn0.vY5RJ2z6n5WVB6grhjFIDks8svA09iMsKgmJVcPBKyELw92B0-l9IiRLMtch7opcIK5a5yPndolc4B7s7aq--A'
    });

    this.socket.on('authenticated', () => {
      this.socket.on('new-order', order => {
        console.log(order);
        this.tickets.push(...order);
      });
    });

    this.socket.on('unauthorized', err => {
      this.onError = err.message;
    });
  }
};
</script>
