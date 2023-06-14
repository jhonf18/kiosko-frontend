<template>
  <div class="mt-6 px-4">
    <h2 class="text-3xl font-bold mb-5">{{ title }}</h2>
    <article v-for="ticket in tickets" :key="ticket.id" class="mb-4">
      {{ ticket.order.name }} <br />
      <strong>Comentarios:</strong> {{ ticket.comments }} <br />
      <strong>Nombre:</strong> {{ ticket.product.name }} <br />
      <strong>Ingredientes: </strong> {{ ticket.product.ingredients_text }}
      <br />
      <br />
      <div class="mb-4">
        <Button size="sm" variant="success" @click="acceptTicket(ticket)"
          >Aceptar</Button
        >
        <Button size="sm" variant="primary" @click="finishTicket(ticket)"
          >Finalizado</Button
        >
      </div>
      <hr />
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

        this.socket.on('update-order', (ticket) => {
          const indexTicket = this.tickets.findIndex((t) => t.id === ticket.id)

          ticket.product.ingredients_text = getPrettyIngredients(
            ticket.product.ingredients
          )

          if (indexTicket !== -1) {
            this.$set(this.tickets, indexTicket, ticket)
          } else {
            this.tickets.unshift(ticket)
          }
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
        'id,sections,product,comments,product.name,product.id,product.ingredients,order.comments,order.selected_products,waiter.id,waiter.name,waiter.email,order.total_price,order.id,order.name'

      let tickets = null
      try {
        tickets = await this.$ticketRepository.index({ getData, filter })
      } catch (err) {
        // TODO: Handle error
        console.log(err)
      }

      if (tickets) {
        tickets = tickets.map((ticket) => {
          if (
            ticket.product &&
            ticket.product.ingredients &&
            ticket.product.ingredients.length > 0
          ) {
            const ingredientsText = getPrettyIngredients(
              ticket.product.ingredients
            )
            ticket.product.ingredients_text = ingredientsText
          }
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
    async finishTicket(ticket) {
      try {
        const response = await this.$ticketRepository.updateStatus(ticket.id, {
          state: 'finished',
        })

        if (response) {
          console.log(response)
          console.log(ticket)
          const selectedProducts = ticket.order.selected_products
          let newSelectedProducts = []

          for (const selectedProduct of selectedProducts) {
            console.log(response.order)
            const product = response.order.selected_products.find(
              (lst) => lst.product._id === selectedProduct.product
            )

            console.log(product)
            newSelectedProducts.push({
              ...selectedProduct,
              ticket_id: product.ticket_id,
            })
          }

          this.socket.emit(`${this.section}:finish-order`, {
            order: {
              ...ticket.order,
              // selected_products: newSelectedProducts,
            },
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
