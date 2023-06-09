<template>
  <div class="mt-6 px-6">
    <div class="grid grid-cols-2 lg:grid-cols-8 gap-2 mb-5">
      <Input
        type="search"
        idInput="search-waiter"
        v-model="waiterSearch"
        placeholder="Buscar mesero"
        @keyUp="onWaiterSearch"
        class="mr-2 w-full lg:col-span-2"
      ></Input>
      <SelectInput
        class="row-start-2 lg:row-start-auto col-span-full lg:col-span-3"
        :options="optionsFilter"
        v-model="filter"
        @change="onChangeFilter"
      ></SelectInput>
      <!-- <div
          class="lg:col-start-7 lg:col-span-2 lg:order-none flex justify-end"
        >
          <Button size="sm" variant="primary" @click="openModalAddProduct">
            <span class="flex items-center w-full">
              <PlusIcon></PlusIcon>
              Agregar
              <span class="hidden sm:inline-block">&ThinSpace; producto</span>
            </span>
          </Button>
        </div> -->
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

            <td class="p-4">
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

    <ModalInformationOrder
      ref="component-modal-information-order"
      :order="orderSelected"
      @finishOrder="onFinishOrder"
    ></ModalInformationOrder>
  </div>
</template>

<script>
import ModalInformationOrder from '@/components/blocks/Modals/ModalInformationOrder.vue'
import { getPrettyIngredients } from '~/assets/utils/ingredientsFormatter'
import { normalizeText } from '~/assets/utils/normalize'

// TODO: Falta finalizar orden y realizar conexión de eventos en tiempo real

export default {
  data() {
    return {
      orders: [],
      openOrders: [],
      closedOrders: [],
      waiters: [],
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
      waiterSearch: '',
      orderSelected: { selected_products: [] },
    }
  },
  components: {
    ModalInformationOrder,
  },
  async mounted() {
    this.handleSocket()
    await this.getOrders()
    await this.getWaiters()
    this.onChangeFilter()
  },
  methods: {
    handleSocket() {
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
    async getOrders() {
      const filter = `&sort_by=desc(created_at)`
      const getData =
        'name,is_open,created_at,total_price,id,branch_office,branch_office.id,selected_products.id,selected_products.ingredients,selected_products.name,selected_products.price,selected_products.category,selected_products.media_files,waiter.name,waiter.id,waiter.email,waiter.nickname'
      try {
        let orders = await this.$orderRepository.index({ getData, filter })
        orders = orders.map((order) => {
          let finished = true
          order.selected_products = order.selected_products.map((product) => {
            const ingredientsText = getPrettyIngredients(product.ingredients)
            const commentsText = product.comments.split('::')[1]
            const ticket = order.tickets.find(
              (ticket) => ticket.id === product.ticket_id
            )
            if (ticket && !ticket.date_finished) finished = false
            return {
              ...product,
              ingredients_text: ingredientsText,
              comments_text: commentsText,
              ...(ticket && { ticket }),
            }
          })

          const name = order.name.split('-')[0]
          order.name = name

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
        // TODO: Handle error
        console.log(err)
      }
    },
    async getWaiters() {
      const filter = `branch_office=${this.$auth.user.branch_office}&role=ROLE_WAITER`
      const getData = 'name,email,role,branch_office.name,id,'

      try {
        const waiters = await this.$userRepository.getAll({ getData, filter })

        if (waiters) {
          this.waiters = waiters
        }
      } catch (err) {
        // Handle error
        console.log(err)
      }
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
      this.orderSelected = { ...order }
      this.$refs['component-modal-information-order'].open()
    },
    onFinishOrder() {},
  },
}
</script>
