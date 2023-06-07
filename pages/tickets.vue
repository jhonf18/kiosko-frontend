<template>
  <div class="mt-6 px-4">
    <h2 class="text-3xl font-bold mb-5">{{ title }}</h2>
    <article v-for="ticket in tickets" :key="ticket.id" class="mb-4">
      {{ ticket.order.name }} <br />
      <strong>Productos: </strong> {{ ticket.product.ingredients_text }} <br />
      <Button size="sm" variant="success" @click="acceptTicket(ticket)"
        >Aceptar</Button
      >
      <Button size="sm" variant="primary" @click="finishTicket(ticket)"
        >Finalizado</Button
      >
    </article>
  </div>
</template>

<script>
import { getPrettyIngredients } from '~/assets/utils/ingredientsFormatter'

export default {
  name: 'Tickets',
  data() {
    return {
      tickets: [{ order: {}, product: {} }],
      title: 'Tickets',
      socket: null,
      section: '',
    }
  },
  mounted() {
    this.getTickets()
    this.openSocketConnection()
    this.handleSocket()
  },
  methods: {
    openSocketConnection() {
      const TOKEN = localStorage.getItem('auth._token.local').split(' ')[1]
      this.socket = this.$nuxtSocket({
        name: 'main',
        auth: {
          token: TOKEN,
        },
      })

      this.socket.emit('authentication', {
        token: TOKEN,
      })

      this.socket.on('authenticated', () => {
        this.socket.on('new-order', (tickets) => {
          tickets = tickets
            .map((ticket) => {
              ticket.product.ingredients_text = getPrettyIngredients(
                ticket.product.ingredients
              )
              return ticket
            })
            .forEach((ticket) => {
              this.tickets.unshift(ticket)
            })
        })
      })

      this.socket.on('unauthorized', (err) => {
        console.log(err)
        this.onError = err.message
      })
    },
    handleSocket() {},
    async getTickets() {
      let section = ''
      if (this.$auth.user.role === 'ROLE_OVEN_COOK') {
        section = 'HORNO'
        this.section = 'oven'
        this.title = 'Tickets de horno'
      } else {
        section = 'COCINA'
        this.section = 'kitchen'
        this.title = 'Tickets de cocina'
      }

      const filter = `sort_by=desc(created_at)&sections=${section}&brach_office=${this.$auth.user.branch_office.id}`
      const getData =
        'id,sections,product,comments,product.name,product.id,product.ingredients,order.comments,waiter.id,waiter.name,waiter.email,order.total_price,order.id,order.name'

      let tickets = null
      try {
        tickets = await this.$ticketRepository.index({ getData, filter })
      } catch (err) {
        // TODO: Handle error
        console.log(err)
      }

      if (tickets) {
        tickets = tickets.map((ticket) => {
          const ingredientsText = getPrettyIngredients(
            ticket.product.ingredients
          )
          ticket.product.ingredients_text = ingredientsText
          return { ...ticket }
        })
        this.tickets = tickets
      }
    },
    async acceptTicket(ticket) {
      try {
        const response = this.$ticketRepository.updateStatus(ticket.id, {
          state: 'accepted',
        })

        if (response) {
          this.socket.emit(`${this.section}:accept-order`, {
            order: ticket.order,
            ticket,
          })
        }
      } catch (err) {
        // TODO: Handle error
        console.log(err)
      }
    },
    finishTicket(ticket) {
      try {
        const response = this.$ticketRepository.updateStatus(ticket.id, {
          state: 'finished',
        })

        if (response) {
          this.socket.emit(`${this.section}:finish-order`, {
            order: ticket.order,
            ticket,
          })
        }
      } catch (err) {
        // TODO: Handle error
        console.log(err)
      }
    },
  },
}
</script>
