<template>
  <Modal
    :id="`component-${nameRef}`"
    :ref="`component-${nameRef}`"
    size="sm"
    title="Agregar producto"
    :footer="false"
  >
    <TransitionGroup name="list" tag="div">
      <div key="1" class="w-full" v-if="orderType === 'select-type'">
        <Button
          variant="primary"
          size="block"
          class="mb-4"
          @click="addProduct(false)"
        >
          Añadir producto a un pedido existente
        </Button>
        <Button
          variant="outline-primary"
          size="block"
          @click="addProduct(true)"
        >
          Añadir producto a un nuevo pedido
        </Button>
      </div>
      <div key="2" v-else-if="orderType === 'order-existing'" class="pb-6">
        <div class="flex mb-6" @click="orderType = 'select-type'">
          <ChevronLeftIcon class="cursor-pointer"></ChevronLeftIcon>
          <span class="ml-1 cursor-pointer">Ir atrás</span>
        </div>
        <tabs>
          <tab name="Pedidos NO enviados" :selected="true" size="sm">
            <div class="mt-4" v-if="orders.length > 0">
              <CollapseContent
                :withShadow="true"
                v-for="(order, i) in orders"
                :key="`${i}-${order.name}`"
                class="mb-2"
              >
                <template v-slot:title>
                  <span class="text-lg font-semibold">{{ order.name }}</span>
                </template>

                <div
                  v-for="(product, index) in order.products"
                  :key="`${index}-${product.id}`"
                  class="mb-2"
                >
                  <hr />
                  <div class="flex items-center justify-between mt-2">
                    <h4 class="font-medium">
                      {{ product.name }}
                    </h4>
                    <span class="font-semibold text-primary">
                      {{ product.price | formatCurrency }}
                    </span>
                  </div>
                  <div
                    class="pl-2 text-gray-600 text-sm mt-4"
                    v-if="product.ingredients_selected.length > 0"
                  >
                    <p>{{ product.ingredients_selected_text }}</p>
                    <p class="mt-2" v-if="product.comments">
                      <span class="font-semibold"> Comentarios: </span>
                      {{ product.comments }}
                    </p>
                  </div>
                </div>
                <hr />
                <div class="flex items-center justify-between mt-4">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    @click="addProductToOrder(i)"
                  >
                    Añadir producto a aquí
                  </Button>

                  <div class="min-w-[125px] text-sm text-right">
                    <span class="font-semibold text-primary-dark">
                      TOTAL:
                    </span>
                    <span>
                      {{ order.total | formatCurrency }}
                    </span>
                  </div>
                </div>
              </CollapseContent>
            </div>
            <div v-else>
              <h4 class="font-semibold text-lg mt-5 text-center">
                No hay pedidos sin enviar
              </h4>
            </div>
          </tab>
          <tab name="Pedidos enviados" size="sm">
            <CollapseContent
              v-if="sendedOrders.length > 0"
              :withShadow="true"
              v-for="(order, i) in sendedOrders"
              :key="`${i}-${order.name}`"
              class="mb-2"
            >
              <template v-slot:title>
                <span class="text-lg font-semibold">{{ order.name }} </span>
              </template>

              <div
                v-for="(product, index) in order.selected_products"
                :key="`${index}-${product.id}`"
                class="mb-2 cursor-pointer hover:bg-gray-100 px-2 pb-2"
              >
                <hr />
                <div class="flex items-center justify-between mt-2">
                  <h4 class="font-medium">
                    {{ product.name }}
                  </h4>
                  <span class="font-semibold text-primary">
                    {{ product.price | formatCurrency }}
                  </span>
                </div>
                <div
                  class="pl-2 text-gray-600 text-sm mt-3"
                  v-if="product.ingredients.length > 0"
                >
                  <p>{{ product.ingredients_text }}</p>
                  <p class="mt-2" v-if="product.comments_text">
                    <span class="font-semibold"> Comentarios: </span>
                    {{ product.comments_text }}
                  </p>
                </div>
              </div>
              <hr />
              <div class="flex items-center justify-end mt-6 mb-4">
                <div class="flex">
                  <ButtonWithSpinner
                    variant="outline-primary"
                    size="sm"
                    :loading="loading"
                    :text="buttonText"
                    @click="addProductToSendedOrder(order, i)"
                    :textCenter="true"
                  >
                  </ButtonWithSpinner>
                </div>
                <div class="min-w-[215px] text-right">
                  <span class="font-semibold text-primary-dark"> TOTAL: </span>
                  <span>
                    {{ order.total_price | formatCurrency }}
                  </span>
                </div>
              </div>
            </CollapseContent>
            <div v-if="sendedOrders.length === 0">
              <h4 class="font-semibold text-lg mt-5 text-center">
                No hay pedidos enviados
              </h4>
            </div>
          </tab>
        </tabs>
      </div>

      <div key="3" v-else-if="orderType === 'new-order'">
        <div class="flex mb-4" @click="orderType = 'select-type'">
          <ChevronLeftIcon class="cursor-pointer"></ChevronLeftIcon>
          <span class="ml-1 cursor-pointer">Ir atrás</span>
        </div>

        <Input
          idInput="name-of-order"
          placeholder="Nombre para el pedido"
          type="text"
          class="mb-4"
          label="Nombre"
          v-model="orderName"
        ></Input>

        <Button variant="primary" size="block" @click="createOrder">
          Crear pedido y agregar producto
        </Button>
      </div>
    </TransitionGroup>
  </Modal>
</template>

<script>
import { mapMutations } from 'vuex'
import { formatErrorMessages } from '~/assets/utils/formatErrorMessage'
import { getPrettyIngredients } from '~/assets/utils/ingredientsFormatter'
import { generalStoreNames } from '~/store/general'

export default {
  name: 'ModalAddProductToOrder',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      nameRef: 'modal-add-product-to-order',
      orderType: 'select-type',
      orderName: '',
      orders: [],
      sendedOrders: [],
      loading: false,
      buttonText: 'Añadir producto aquí',
    }
  },
  components: {
    ChevronLeftIcon: () => import('@/static/icons/chevronLeft.svg?inline'),
  },
  methods: {
    ...mapMutations({
      showToast: generalStoreNames.mutations.showToast,
    }),
    setLoading(state) {
      this.loading = state
      this.buttonText = state ? 'Añadiendo producto...' : 'Añadir producto aquí'
    },
    open() {
      this.$refs[`component-${this.nameRef}`].open()
    },
    close() {
      this.$refs[`component-${this.nameRef}`].closeByButton()
    },
    addProduct(createNewOrder) {
      if (createNewOrder) {
        this.orderType = 'new-order'
      } else {
        this.orderType = 'order-existing'
        this.orders = JSON.parse(localStorage.getItem('cart')).filter(
          (order) => order.waiter === this.$auth.user.id
        )
        this.getOrders()
      }
    },
    addProductToOrder(index) {
      const cartStore = JSON.parse(localStorage.getItem('cart'))
      let product = { ...this.product }
      product.ingredients_selected_text = getPrettyIngredients(
        product.ingredients_selected
      )

      for (let i = 0; i < product.quantity; i++) {
        cartStore[index].products.unshift(product)
        cartStore[index].total += product.price
      }
      localStorage.setItem('cart', JSON.stringify(cartStore))
      this.close()
      this.$emit('finished', true)
    },
    createOrder() {
      const cartStore = JSON.parse(localStorage.getItem('cart'))

      let product = { ...this.product }
      product.ingredients_selected_text = getPrettyIngredients(
        product.ingredients_selected
      )

      let products = []
      let totalPrice = 0

      for (let i = 0; i < product.quantity; i++) {
        products.unshift(product)
        totalPrice += product.price
      }

      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      }

      const cart = [
        {
          name: `${this.orderName} - ${new Intl.DateTimeFormat(
            'es-Es',
            options
          ).format(new Date())}`,
          waiter: this.$auth.user.id,
          products,
          total: totalPrice,
        },
      ]

      if (!cartStore) {
        localStorage.setItem('cart', JSON.stringify(cart))
      } else {
        cartStore.unshift(cart[0])
        localStorage.setItem('cart', JSON.stringify(cartStore))
      }

      this.close()
      this.$emit('finished', true)
    },
    async getOrders() {
      let today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      today.setMilliseconds(0)

      const filter = `waiter=${
        this.$auth.user.id
      }&sort_by=asc(created_at)&is_open=true&today=${today.getTime()}`
      const getData =
        'name,is_open,created_at,total_price,id,branch_office,branch_office.id,selected_products.id,selected_products.ingredients,selected_products.name,selected_products.price,selected_products.category,waiter.name'

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
          return { ...order, finished }
        })

        this.sendedOrders = orders
      } catch (err) {
        this.showToast({
          text: formatErrorMessages(err.message),
          type: 'error',
          visibleTime: 3,
        })
      }
    },
    async addProductToSendedOrder(order, index) {
      if (this.loading) return

      this.setLoading(true)

      const payload = {
        product: this.product.id,
        ids_selected_ingredients: this.product.ingredients_selected.map(
          (ingredient) => ingredient.id
        ),
        comments: this.product.comments,
      }

      let data = []

      for (let i = 0; i < this.product.quantity; i++) {
        data.unshift(payload)
      }

      let response = null

      try {
        response = await this.$orderRepository.addProductToOrder(order.id, {
          selected_products: data,
        })
      } catch (err) {
        this.setLoading(false)
        this.showToast({
          text: formatErrorMessages(err.message),
          type: 'error',
          visibleTime: 3,
        })
      }

      if (response) {
        const waiter = {
          id: this.$auth.user.id,
          name: this.$auth.user.name,
          email: this.$auth.user.email,
        }

        this.$root.$emit('emitSocket', {
          name: 'create-order',
          order: response.order,
          tickets: response.tickets.map((ticket) => {
            ticket.order = response.order
            ticket.waiter = waiter
            return ticket
          }),
        })
        this.setLoading(false)
        this.close()
        this.$emit('finished', true)
      }
    },
  },
}
</script>

<style scoped lang="postcss">
.list {
  transition: all 0.5s;
}
.list-enter, .list-leave-to
/* .card-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: scale(0);
}
.list-enter-to {
  opacity: 1;
  transform: scale(1);
}
/*
.list-leave-active {
  position: absolute;
}
*/

.list-move {
  opacity: 1;
  transition: all 0.5s;
}
</style>
