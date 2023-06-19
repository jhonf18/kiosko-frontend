<template>
  <div>
    <BottomTabs @toggleTabs="toggleBottomTabs">
      <template v-for="tab in headerTabs" v-slot:[tab.slotName]="{ active }">
        <a
          target="#"
          class="flex items-center justify-center h-full leading-normal cursor-pointer"
        >
          <span
            class="text-primary h-full flex items-center justify-center py-4 w-10 rounded-t-sm transition-all duration-150 relative"
            :class="{ 'border-t-2 border-primary': active }"
          >
            <component
              :is="active ? tab.activeIcon : tab.icon"
              class="w-7 h-7"
            ></component>
            <div
              v-if="!active && tab.hasNotification"
              class="absolute w-2 h-2 rounded-full bg-primary top-2.5 right-1.5"
            ></div>
          </span>
        </a>
      </template>
      <template v-slot:menu-content-1>
        <CategoriesBanner @selected="categorySelected"></CategoriesBanner>
        <ProductsCarousel
          :products="products"
          :category="category"
        ></ProductsCarousel>
      </template>
      <template v-slot:menu-content-2="{ active }">
        <CartOfOrders
          :active="active"
          @emitSocket="emitEventsOfSockets"
        ></CartOfOrders>
      </template>
      <template v-slot:menu-content-3="{ active }">
        <OrdersView
          :active="active"
          ref="order-views-component"
          @emitSocket="emitEventsOfSockets"
        ></OrdersView>
      </template>
    </BottomTabs>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { generalStoreNames } from '~/store/general'

import { formatErrorMessages } from '~/assets/utils/formatErrorMessage'
import BottomTabs from '~/components/blocks/BottomTabs.vue'
import CartOfOrders from '~/components/blocks/CartOfOrders.vue'
import CategoriesBanner from '~/components/blocks/CategoriesBanner.vue'
import OrdersView from '~/components/blocks/OrdersView.vue'
import ProductsCarousel from '~/components/blocks/ProductsCarousel.vue'

const headerTabs = [
  {
    icon: 'HomeIcon',
    activeIcon: 'HomeSolidIcon',
    slotName: 'menu-header-1',
    hasNotification: false,
  },
  {
    icon: 'ShoppingCartIcon',
    activeIcon: 'ShoppingCartSolidIcon',
    slotName: 'menu-header-2',
    hasNotification: false,
  },
  {
    icon: 'TicketIcon',
    activeIcon: 'TicketSolidIcon',
    slotName: 'menu-header-3',
    hasNotification: false,
  },
]

export default {
  name: 'OrdersPage',
  middleware: ['authWaiter'],
  data() {
    return {
      headerTabs,
      products: [
        {
          media_files: [],
        },
      ],
      category: null,
      socket: null,
    }
  },
  components: {
    BottomTabs,
    HomeIcon: () => import('@/static/icons/home.svg?inline'),
    HomeSolidIcon: () => import('@/static/icons/home-solid.svg?inline'),
    ShoppingCartIcon: () => import('@/static/icons/shopping-cart.svg?inline'),
    ShoppingCartSolidIcon: () =>
      import('@/static/icons/shopping-cart-solid.svg?inline'),
    TicketIcon: () => import('@/static/icons/ticket.svg?inline'),
    TicketSolidIcon: () => import('@/static/icons/ticket-solid.svg?inline'),
    ProductsCarousel,
    CategoriesBanner,
    CartOfOrders,
    OrdersView,
  },
  created() {
    this.getProducts()
  },
  mounted() {
    this.openSocketConnection()
    this.$root.$on('emitSocket', this.emitEventsOfSockets)
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
    categorySelected(category) {
      this.category = category
    },
    async getProducts() {
      try {
        const products = await this.$productRepository.index({
          getData:
            'name,price,id,category,subcategory,passage_sections,media_files,branch_office.id,branch_office.name,branch_office.address,selected_ingredients.id,selected_ingredients.name,selected_ingredients.type',
          filter: `branch_office=${this.$auth.user.branch_office}`,
        })
        this.products = products
      } catch (err) {
        this.showToast({
          text: formatErrorMessages(err.message),
          type: 'error',
        })
      }
    },
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
        this.socket.on('kitchen:accepted-order', ({ order, ticket }) => {
          if (!this.isValidBranchOffice(order)) return

          this.showToast({
            text: `Preparando ${ticket.product.name} para ${order.name}`,
            type: 'default',
          })
          this.$refs['order-views-component'].changeStatusOfTicket('accepted', {
            order,
            ticket,
          })
          this.headerTabs[2].hasNotification = true
        })

        this.socket.on('oven:accepted-order', ({ order, ticket }) => {
          if (!this.isValidBranchOffice(order)) return

          this.showToast({
            text: `Preparando ${ticket.product.name} para ${order.name}`,
            type: 'default',
          })
          this.$refs['order-views-component'].changeStatusOfTicket('accepted', {
            order,
            ticket,
          })
          this.headerTabs[2].hasNotification = true
        })

        this.socket.on('kitchen:finished-order', ({ order, ticket }) => {
          if (!this.isValidBranchOffice(order)) return

          this.showToast({
            text: `Ha terminado la preparación de ${ticket.product.name} para ${order.name}`,
            type: 'success',
          })
          this.$refs['order-views-component'].changeStatusOfTicket('finished', {
            order,
            ticket,
          })
          this.headerTabs[2].hasNotification = true
          const audioFile = require('@/assets/sounds/notification.mp3').default
          const audio = new Audio(audioFile)
          audio.volume = 1
          audio.play()
        })

        this.socket.on('oven:finished-order', ({ order, ticket }) => {
          if (!this.isValidBranchOffice(order)) return

          this.showToast({
            text: `Ha terminado la preparación de ${ticket.product.name} para ${order.name}`,
            type: 'success',
          })
          this.$refs['order-views-component'].changeStatusOfTicket('finished', {
            order,
            ticket,
          })
          this.headerTabs[2].hasNotification = true
          const audioFile = require('@/assets/sounds/notification.mp3').default
          const audio = new Audio(audioFile)
          audio.volume = 1
          audio.play()
        })

        this.socket.on('closed-order', this.onEventClosedOrder)
      })

      this.socket.on('unauthorized', (err) => {
        this.onError = err.message
      })
    },
    emitEventsOfSockets(data) {
      let dataToSend = { ...data }
      delete dataToSend.name
      this.socket.emit(data.name, dataToSend)
    },
    onEventClosedOrder({ order }) {
      if (!this.isValidBranchOffice(order)) return

      this.$refs['order-views-component'].closedOrder({
        order,
      })
    },
    toggleBottomTabs(tabNumber) {
      if (tabNumber === 3 && this.headerTabs[2].hasNotification) {
        this.headerTabs[2].hasNotification = false
      }
    },
  },
}
</script>
