<template>
  <div class="mt-6 px-4">
    <!-- <h2 class="text-3xl font-bold mb-5">{{ title }}</h2> -->
    <BottomTabs>
      <template v-slot:menu-header-1="{ active }">
        <a
          target="#"
          class="flex items-center justify-center h-full leading-normal cursor-pointer"
        >
          <span
            class="text-primary h-full flex items-center justify-center py-4 w-10 rounded-t-sm transition-all duration-150 relative"
            :class="{ 'border-t-2 border-primary font-semibold': active }"
          >
            Entrantes
          </span>
        </a>
      </template>
      <template v-slot:menu-header-2="{ active }">
        <a
          target="#"
          class="flex items-center justify-center h-full leading-normal cursor-pointer"
        >
          <span
            class="text-primary h-full flex items-center justify-center py-4 w-24 rounded-t-sm transition-all duration-150 relative"
            :class="{ 'border-t-2 border-primary font-semibold': active }"
          >
            <span> En proceso </span>
          </span>
        </a>
      </template>
      <template v-slot:menu-header-3="{ active }">
        <a
          target="#"
          class="flex items-center justify-center h-full leading-normal cursor-pointer"
        >
          <span
            class="text-primary h-full flex items-center justify-center py-4 w-10 rounded-t-sm transition-all duration-150 relative"
            :class="{ 'border-t-2 border-primary font-semibold': active }"
          >
            Despachados
          </span>
        </a>
      </template>
      <template v-slot:menu-content-1>
        <div
          v-if="openTickets.length > 0"
          class="pb-10 px-3"
          :key="keyOpenTickets"
        >
          <h2 class="text-3xl font-bold mb-5 text-primary">
            Pedidos entrantes
          </h2>
          <CollapseContent
            :withShadow="true"
            :big="true"
            v-for="(ticket, i) in openTickets"
            :key="`${i}-${ticket.id}`"
            class="mb-2"
          >
            <template v-slot:title>
              <span class="text-xl font-semibold"
                >{{ ticket.order.name }}
              </span>
            </template>

            <div class="mb-2 cursor-pointer hover:bg-gray-100 px-2 pb-2">
              <hr />
              <div class="flex items-center justify-between mt-2">
                <h4 class="text-xl font-semibold">
                  {{ ticket.product.name }}
                </h4>
                <span class="font-semibold text-primary">
                  {{ ticket.product.price | formatCurrency }}
                </span>
              </div>
              <div
                class="pl-2 text-gray-600 text-base mt-3"
                v-if="ticket.product.ingredients.length > 0"
              >
                <h4 class="font-semibold text-lg">Ingredientes</h4>

                <p class="pl-1">{{ ticket.product.ingredients_text }}</p>
              </div>

              <div
                class="pl-2 text-gray-600 text-base mt-3"
                v-if="ticket.comments_text"
              >
                <h4 class="font-semibold text-lg">Comentarios</h4>

                <p class="pl-1">
                  {{ ticket.comments_text }}
                </p>
              </div>

              <div
                class="pl-2 text-gray-600 text-base mt-3"
                v-if="ticket.waiter"
              >
                <h4 class="font-semibold text-lg">Mesero</h4>

                <p class="pl-1">
                  {{ ticket.waiter.name }}
                </p>
              </div>
            </div>
            <hr />
            <div class="flex items-center justify-end mt-3 mb-2">
              <Button
                variant="primary"
                size="md"
                class="mr-2"
                @click="acceptTicket(ticket)"
              >
                Comenzar a preparar
              </Button>
            </div>
          </CollapseContent>
        </div>
        <div class="mt-16 text-center" v-else>
          <h3 class="text-3xl font-semibold">No hay pedidos por preparar</h3>
        </div>
      </template>
      <template v-slot:menu-content-2>
        <div
          v-if="ticketsInProcess.length > 0"
          class="pb-10 px-3"
          :key="keyTicketsInProcess"
        >
          <h2 class="text-3xl font-bold mb-5 text-primary">
            Pedidos por finalizar
          </h2>
          <CollapseContent
            :withShadow="true"
            :big="true"
            v-for="(ticket, i) in ticketsInProcess"
            :key="`${i}-${ticket.id}`"
            class="mb-2"
          >
            <template v-slot:title>
              <span class="text-xl font-semibold"
                >{{ ticket.order.name }}
              </span>
            </template>

            <div class="mb-2 cursor-pointer hover:bg-gray-100 px-2 pb-2">
              <hr />
              <div class="flex items-center justify-between mt-2">
                <h4 class="text-xl font-semibold">
                  {{ ticket.product.name }}
                </h4>
                <span class="font-semibold text-primary">
                  {{ ticket.product.price | formatCurrency }}
                </span>
              </div>
              <div
                class="pl-2 text-gray-600 text-base mt-3"
                v-if="ticket.product.ingredients.length > 0"
              >
                <h4 class="font-semibold text-lg">Ingredientes</h4>

                <p class="pl-1">{{ ticket.product.ingredients_text }}</p>
              </div>

              <div
                class="pl-2 text-gray-600 text-base mt-3"
                v-if="ticket.comments_text"
              >
                <h4 class="font-semibold text-lg">Comentarios</h4>

                <p class="pl-1">
                  {{ ticket.comments_text }}
                </p>
              </div>

              <div
                class="pl-2 text-gray-600 text-base mt-3"
                v-if="ticket.waiter"
              >
                <h4 class="font-semibold text-lg">Mesero</h4>

                <p class="pl-1">
                  {{ ticket.waiter.name }}
                </p>
              </div>
            </div>
            <hr />
            <div class="flex items-center justify-end mt-3 mb-2">
              <Button
                variant="success"
                size="md"
                class="mr-2"
                @click="finishTicket(ticket)"
              >
                Finalizar preparación
              </Button>
            </div>
          </CollapseContent>
        </div>
        <div class="mt-16 text-center" v-else>
          <h3 class="text-3xl font-semibold">No hay pedidos por finalizar</h3>
        </div>
      </template>
      <template v-slot:menu-content-3>
        <div
          v-if="closedTickets.length > 0"
          class="pb-10 px-3"
          :key="keyClosedTickets"
        >
          <h2 class="text-3xl font-bold mb-5 text-primary">
            Pedidos despachados
          </h2>
          <CollapseContent
            :withShadow="true"
            :big="true"
            v-for="(ticket, i) in closedTickets"
            :key="`${i}-${ticket.id}`"
            class="mb-2"
          >
            <template v-slot:title>
              <span class="text-xl font-semibold"
                >{{ ticket.order.name }}
              </span>
            </template>

            <div class="mb-2 cursor-pointer hover:bg-gray-100 px-2 pb-2">
              <hr />
              <div class="flex items-center justify-between mt-2">
                <h4 class="text-xl font-semibold">
                  {{ ticket.product.name }}
                </h4>
                <span class="font-semibold text-primary">
                  {{ ticket.product.price | formatCurrency }}
                </span>
              </div>
              <div
                class="pl-2 text-gray-600 text-base mt-3"
                v-if="ticket.product.ingredients.length > 0"
              >
                <h4 class="font-semibold text-lg">Ingredientes</h4>

                <p class="pl-1">{{ ticket.product.ingredients_text }}</p>
              </div>

              <div
                class="pl-2 text-gray-600 text-base mt-3"
                v-if="ticket.comments_text"
              >
                <h4 class="font-semibold text-lg">Comentarios</h4>

                <p class="pl-1">
                  {{ ticket.comments_text }}
                </p>
              </div>

              <div
                class="pl-2 text-gray-600 text-base mt-3"
                v-if="ticket.waiter"
              >
                <h4 class="font-semibold text-lg">Mesero</h4>

                <p class="pl-1">
                  {{ ticket.waiter.name }}
                </p>
              </div>
            </div>
          </CollapseContent>
        </div>
        <div class="mt-16 text-center" v-else>
          <h3 class="text-3xl font-semibold">No hay pedidos despachados</h3>
        </div>
      </template>
    </BottomTabs>
  </div>
</template>

<script>
import { getPrettyIngredients } from '~/assets/utils/ingredientsFormatter'
import BottomTabs from '~/components/blocks/BottomTabs.vue'

export default {
  name: 'Tickets',
  data() {
    return {
      openTickets: [],
      closedTickets: [],
      ticketsInProcess: [],
      title: 'Tickets',
      socket: null,
      section: '',
      keyOpenTickets: 0,
      keyClosedTickets: 0,
      keyTicketsInProcess: 0,
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

              if (ticket.comments) {
                ticket.comments_text = this.formatComments(ticket.comments)
              }

              return ticket
            })
            .forEach((ticket) => {
              this.openTickets.push(ticket)
            })
          this.keyOpenTickets++
        })
        this.socket.on('update-order', (ticket) => {
          const indexTicket = this.tickets.findIndex((t) => t.id === ticket.id)
          ticket.product.ingredients_text = getPrettyIngredients(
            ticket.product.ingredients
          )
          if (indexTicket !== -1) {
            this.$set(this.tickets, indexTicket, ticket)
          } else {
            this.openTickets.push(ticket)
          }
        })
      })
      this.socket.on('unauthorized', (err) => {
        console.log(err)
        this.onError = err.message
      })
    },
    formatComments(comment) {
      const completeText = comment
      const commentWithoutDoublePoints = completeText.split('::')[1]

      const commentWithoutDoubleLineArray =
        commentWithoutDoublePoints.split('--')

      if (
        !commentWithoutDoubleLineArray[1] ||
        commentWithoutDoubleLineArray[1].length < 2
      ) {
        return commentWithoutDoubleLineArray[0]
      } else {
        return commentWithoutDoubleLineArray.join(', ')
      }
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
      let today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      today.setMilliseconds(0)

      const filter = `sort_by=asc(created_at)&sections=${section}&brach_office=${
        this.$auth.user.branch_office
      }&today=${today.getTime()}`

      const getData =
        'id,sections,product,comments,product.name,product.id,product.ingredients,product.price,order.comments,order.selected_products,waiter.id,waiter.name,waiter.email,order.total_price,order.id,order.name,date_accepted,date_finished'
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

          if (ticket.comments) {
            ticket.comments_text = this.formatComments(ticket.comments)
          }

          return { ...ticket }
        })

        this.openTickets = tickets.filter((ticket) => !ticket.date_accepted)
        this.ticketsInProcess = tickets.filter(
          (ticket) => ticket.date_accepted && !ticket.date_finished
        )
        this.closedTickets = tickets.filter((ticket) => ticket.date_finished)

        // this.tickets = tickets
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
          const indexTicket = this.openTickets.findIndex(
            (t) => t.id === ticket.id
          )

          if (indexTicket !== -1) {
            this.openTickets.splice(indexTicket, 1)
            this.ticketsInProcess.push(ticket)
          }
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
          this.socket.emit(`${this.section}:finish-order`, {
            order: {
              ...ticket.order,
              // selected_products: newSelectedProducts,
            },
            ticket,
          })
          const indexTicket = this.ticketsInProcess.findIndex(
            (t) => t.id === ticket.id
          )
          this.ticketsInProcess.splice(indexTicket, 1)
          this.closedTickets.push(ticket)
        }
      } catch (err) {
        // TODO: Handle error
        console.log(err)
      }
    },
  },
  components: { BottomTabs },
}
</script>
