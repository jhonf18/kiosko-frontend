<template>
  <!-- TODO: Agregar el histórico de ventas en un periodo de tiempo dado -->
  <div class="mt-6 px-6">
    <div class="grid grid-cols-2 lg:grid-cols-8 gap-2 mb-5">
      <Input
        type="search"
        idInput="search-waiter"
        v-model="waiterSearch"
        placeholder="Buscar mesero"
        @keyUp="onWaiterSearch"
        autocomplete="off"
        class="mr-2 w-full lg:col-span-2"
      ></Input>
      <SelectInput
        class="row-start-2 lg:row-start-auto col-span-full lg:col-span-3"
        :options="optionsFilter"
        v-model="filter"
        @change="onChangeFilter"
      ></SelectInput>
    </div>

    <div class="relative overflow-x-auto w-full max-w-full mb-7">
      <table class="w-full">
        <thead>
          <tr class="border-b border-t bg-gray-100">
            <th
              scope="col"
              class="text-left text-gray-700 font-medium uppercase text-sm p-4 w-4/12 min-w-[100px]"
            >
              Nombre
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm p-4"
            >
              Hora de inicio
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm p-4"
            >
              Mesero
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm p-4"
            >
              Estado
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm p-4"
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody v-if="orders && orders.length > 0">
          <tr
            v-for="(order, index) in orders"
            :key="order.id"
            @click="openModalInformation({ order, index })"
            class="border-b bg-white hover:bg-gray-100 transition-colors duration-100 cursor-pointer"
          >
            <td class="p-4">
              <div class="flex flex-col">
                <span class="font-semibold text-sm md:text-base">{{
                  order.name
                }}</span>
                <span class="text-sm font-medium text-gray-700 pl-1">
                  {{ order.id }}
                </span>
              </div>
            </td>

            <td class="p-4 text-sm">
              {{ order.created_at_hours }}
            </td>

            <td class="p-4" v-if="order.waiter">
              {{ order.waiter.name }}
            </td>

            <td>
              <span
                v-if="order.is_open && !order.finished"
                class="font-bold text-primary"
              >
                EN PREPARACIÓN
              </span>
              <span
                v-else-if="order.is_open && order.finished"
                class="font-bold text-green-700"
              >
                DESPACHADO
              </span>
              <span v-else-if="!order.is_open" class="font-bold text-blue-700">
                CERRADA
              </span>
            </td>

            <td class="p-4">
              <span class="font-semibold">
                {{ order.total_price | formatCurrency }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        class="w-full p-6 text-center font-semibold"
        v-if="!orders || orders.length === 0"
      >
        <h5>
          {{
            waiterSearch.length > 0
              ? `No hay pedidos creados por ${waiterSearch}.`
              : 'No hay pedidos en este momento.'
          }}
        </h5>
      </div>
    </div>
    <div class="w-full max-w-full text-right mr-2" v-if="filter === 'closed'">
      <span class="font-bold text-primary text-lg"> TOTAL VENTAS: </span>
      <span class="text-lg"> {{ salesTotal | formatCurrency }} </span>
    </div>

    <ModalInformationOrder
      ref="component-modal-information-order"
      :order="orderSelected"
      @finishOrder="onFinishOrder"
      @deleteOrder="onDeleteOrder"
    ></ModalInformationOrder>
  </div>
</template>

<script>
import ModalInformationOrder from '@/components/blocks/Modals/ModalInformationOrder.vue'
import { mapMutations } from 'vuex'
import { formatErrorMessages } from '~/assets/utils/formatErrorMessage'
import { normalizeText } from '~/assets/utils/normalize'
import { generalStoreNames } from '~/store/general'

export default {
  name: 'ManagmentOrders',
  middleware: ['authLeader'],
  data() {
    return {
      waiterSearch: '',
      orders: [],
      openOrders: [],
      closedOrders: [],
      filter: 'open',
      optionsFilter: [
        {
          name: 'Pedidos activos',
          value: 'open',
        },
        {
          name: 'Pedidos cerrados',
          value: 'closed',
        },
      ],
      orderSelected: { selected_products: [] },
    }
  },
  components: {
    ModalInformationOrder,
  },
  async mounted() {
    this.handleSocket()
    await this.getOrders()
    this.onChangeFilter()
  },
  methods: {
    ...mapMutations({
      showToast: generalStoreNames.mutations.showToast,
    }),
    isValidBranchOffice(order) {
      if (
        !order.branch_office ||
        order.branch_office.id !== this.$auth.user.branch_office
      ) {
        return false
      }
      return true
    },
    handleSocket() {
      const TOKEN = localStorage.getItem('auth._token.local').split(' ')[1]

      this.socket = this.$nuxtSocket({
        name: 'main',
      })

      this.socket.emit('authentication', {
        token: TOKEN,
      })

      this.socket.on('authenticated', () => {
        this.socket.on('new-order', ({ order, tickets }) => {
          if (!this.isValidBranchOffice(order)) {
            return
          }

          const fullName = order.name
          const name = order.name.split('-')[0]
          order.name = name
          order.fullName = fullName

          const date = new Date(order.created_at).toLocaleTimeString([], {
            hour12: true,
          })
          order.created_at_hours = date

          const orderIndex = this.openOrders.findIndex(
            (orderItem) => orderItem.id === order.id
          )

          if (orderIndex !== -1) {
            order.tickets = this.openOrders[orderIndex].tickets.concat(tickets)

            this.$set(this.openOrders, orderIndex, {
              ...this.openOrders[orderIndex],
              tickets: order.tickets,
              selected_products: order.selected_products,
              is_open: true,
              finished: false,
              total_price: order.total_price,
            })
            if (this.waiterSearch === '') {
              const orderIndexInOrders = this.orders.findIndex(
                (orderItem) => orderItem.id === order.id
              )
              this.$set(this.orders, orderIndexInOrders, {
                ...this.orders[orderIndexInOrders],
                tickets: order.tickets,
                finished: false,
                is_open: true,
                selected_products: order.selected_products,
                total_price: order.total_price,
              })
            }
          } else {
            // order.selected_products = order.selected
            order.tickets = tickets
            this.orders.unshift(order)
            this.openOrders.unshift(order)
          }
        })

        this.socket.on('update-order', ({ order, ticket }) => {
          if (!this.isValidBranchOffice(order)) {
            return
          }

          this.waiterSearch = ''
          const fullName = order.name
          const name = order.name.split('-')[0]
          order.name = name
          order.fullName = fullName

          const date = new Date(order.created_at).toLocaleTimeString([], {
            hour12: true,
          })
          order.created_at_hours = date

          const orderIndex = this.this.orders.findIndex(
            (orderItem) => orderItem.id === order.id
          )

          const orderIndexInOpenOrders = this.openOrders.findIndex(
            (orderItem) => orderItem.id === order.id
          )

          order.selected_products = ticket.product
          this.orders[orderIndex].tickets.push(ticket)
          this.openOrders[orderIndexInOpenOrders].tickets.push(ticket)
          // this.$set(this.orders, orderIndex, order)
          // this.$set(this.openOrders, orderIndex, order)
        })

        this.socket.on('oven:finished-order', this.onEventFinishedOrder)
        this.socket.on('kitchen:finished-order', this.onEventFinishedOrder)

        this.socket.on('delete-product', this.onEventDeleteProductInOrder)
      })

      this.socket.on('unauthorized', (err) => {
        this.onError = err.message
      })
    },
    async getOrders() {
      let today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      today.setMilliseconds(0)

      const filter = `&sort_by=desc(created_at)&branch_office=${
        this.$auth.user.branch_office
      }&today=${today.getTime()}`
      const getData =
        'name,is_open,created_at,total_price,id,branch_office,branch_office.id,selected_products.id,selected_products.ingredients,selected_products.name,selected_products.price,selected_products.category,selected_products.media_files,waiter.name,waiter.id,waiter.email,waiter.nickname'
      try {
        let orders = await this.$orderRepository.index({ getData, filter })
        orders = orders.map((order) => {
          const finished = this.verifyFinishedOrder(
            order.selected_products,
            order.tickets
          )
          const fullName = order.name
          const name = order.name.split('-')[0]
          order.name = name
          order.fullName = fullName

          const date = new Date(order.created_at).toLocaleTimeString([], {
            hour12: true,
          })
          order.created_at_hours = date
          return { ...order, finished }
        })

        this.orders = orders
        this.openOrders = orders.filter((order) => order.is_open)
        this.closedOrders = orders.filter((order) => !order.is_open)
      } catch (err) {
        this.showToast({
          text: formatErrorMessages(err.message),
          type: 'error',
          visibleTime: 3,
        })
      }
    },
    onEventDeleteProductInOrder({ order, ticket }) {
      if (!this.isValidBranchOffice(order)) {
        return
      }

      const orderIndex = this.openOrders.findIndex(
        (orderItem) => orderItem.id === order.id
      )

      if (orderIndex > -1) {
        // Delete product in selected_products property
        const productIndex = this.openOrders[
          orderIndex
        ].selected_products.findIndex(
          (productItem) => productItem.ticket_id === ticket.id
        )

        if (productIndex > -1) {
          this.openOrders[orderIndex].selected_products.splice(productIndex, 1)
        }

        // Delete ticket

        const ticketIndex = this.openOrders[orderIndex].tickets.findIndex(
          (ticketItem) => ticketItem.id === ticket.id
        )

        if (ticketIndex > -1) {
          this.openOrders[orderIndex].tickets.splice(ticketIndex, 1)
        }

        // update total price
        this.openOrders[orderIndex].total_price = order.total_price
      }
    },
    verifyFinishedOrder(products, tickets) {
      let finished = true
      for (const product of products) {
        const ticket = tickets.find((ticket) => ticket.id === product.ticket_id)
        if (ticket && !ticket.date_finished) {
          finished = false
          break
        }
      }

      return finished
    },
    onWaiterSearch() {
      const search = normalizeText(this.waiterSearch.toLowerCase())
      if (this.filter === 'open') {
        this.orders = this.openOrders.filter((order) => {
          const name = normalizeText(order.waiter.name.toLocaleLowerCase())
          return name.includes(search)
        })
      } else {
        this.orders = this.closedOrders.filter((order) => {
          const name = normalizeText(order.waiter.name.toLocaleLowerCase())
          return name.includes(search)
        })
      }
    },
    onChangeFilter() {
      if (this.filter === 'open') {
        this.orders = [...this.openOrders]
      } else {
        this.orders = [...this.closedOrders]
      }
    },
    openModalInformation({ order, index }) {
      this.orderSelected = { ...order, orderIndex: index }
      this.$refs['component-modal-information-order'].open()
    },
    onEventFinishedOrder({ order, ticket }) {
      if (!this.isValidBranchOffice(order)) {
        return
      }
      const orderIndex = this.orders.findIndex(
        (orderItem) => orderItem.id === order.id
      )

      if (orderIndex !== -1) {
        const ticketIndex = this.orders[orderIndex].tickets.findIndex(
          (ticketItem) => ticketItem.id === ticket.id
        )
        if (ticketIndex !== -1) {
          ticket.date_finished = new Date()
          this.$set(this.orders[orderIndex].tickets, ticketIndex, ticket)

          const isFinishedOrder = this.verifyFinishedOrder(
            this.orders[orderIndex].selected_products,
            this.orders[orderIndex].tickets
          )
          if (isFinishedOrder) {
            this.$set(this.orders[orderIndex], 'finished', true)
          }
        } else {
          this.orders[orderIndex].tickets.push(ticket)
        }
      } else {
        this.orders.unshift(order)
      }
    },
    async onEventUpdatedOrder() {},
    async onFinishOrder(order) {
      const id = order.id
      const payload = {
        is_open: false,
      }

      try {
        const response = await this.$orderRepository.updateStatus({
          id,
          payload,
        })

        if (response) {
          this.$set(this.orders, order.orderIndex, {
            ...this.orders[order.orderIndex],
            is_open: false,
          })

          const orderIndexInOpenOrders = this.openOrders.findIndex(
            (openOrder) => openOrder.id === order.id
          )
          this.openOrders.splice(orderIndexInOpenOrders, 1)
          this.closedOrders.unshift({
            ...this.orders[order.orderIndex],
            is_open: false,
          })

          this.onChangeFilter()
          this.$refs['component-modal-information-order'].close()

          // emit event
          this.socket.emit('close-order', {
            order: { ...order, is_open: false },
          })
        }
      } catch (err) {
        this.showToast({
          text: formatErrorMessages(err.message),
          type: 'error',
          visibleTime: 3,
        })
      }
    },
    async onDeleteOrder(order) {
      const id = order.id

      try {
        await this.$orderRepository.delete(id)

        const orderIndex = order.orderIndex
        this.orders.splice(orderIndex, 1)

        const orderIndexInOpenOrders = this.openOrders.findIndex(
          (openOrder) => openOrder.id === order.id
        )
        if (orderIndexInOpenOrders !== -1) {
          this.openOrders.splice(orderIndexInOpenOrders, 1)
        } else {
          const orderIndexInClosedOrders = this.closedOrders.findIndex(
            (closedOrder) => closedOrder.id === order.id
          )
          this.closedOrders.splice(orderIndexInClosedOrders, 1)
        }

        this.$refs['component-modal-information-order'].close()
        this.socket.emit('delete-order', { order })
      } catch (err) {
        this.showToast({
          text: formatErrorMessages(err.message),
          type: 'error',
          visibleTime: 3,
        })
      }
    },
  },
  watch: {
    waiterSearch() {
      if (this.waiterSearch.length === 0) {
        this.onChangeFilter()
      }
    },
  },
  computed: {
    salesTotal() {
      return this.orders.reduce((acc, order) => {
        return acc + order.total_price
      }, 0)
    },
  },
}
</script>
