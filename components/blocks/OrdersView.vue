<template>
  <div class="px-6 pt-5">
    <tabs>
      <tab :selected="true" name="Abiertas" size="lg">
        <CollapseContent
          :withShadow="true"
          v-for="(order, i) in openOrders"
          :key="`${i}-${order.name}`"
          class="mb-2"
        >
          <template v-slot:title>
            <span class="text-lg font-semibold"
              >{{ order.name }}
              <span
                v-if="!order.finished"
                class="text-base text-primary font-bold"
              >
                (En proceso)
              </span>
              <span
                v-else-if="order.finished"
                class="text-base text-green-700 font-bold"
              >
                (Finalizado)
              </span>
            </span>
          </template>

          <div
            v-for="(product, index) in order.selected_products"
            :key="`${index}-${product.id}`"
            @click="openModalActions(order, product, i, index)"
            class="mb-2 cursor-pointer hover:bg-gray-100 px-2 pb-2"
          >
            <hr />
            <div class="flex items-center justify-between mt-2">
              <h4 class="font-medium">
                {{ product.name }}
                <span
                  v-if="product.ticket && !product.ticket.date_accepted"
                  class="text-xs text-red-700 font-semibold"
                >
                  (En espera)
                </span>
                <span
                  v-else-if="
                    product.ticket &&
                    product.ticket.date_accepted &&
                    !product.ticket.date_finished
                  "
                  class="text-xs text-primary font-semibold"
                >
                  (En proceso)
                </span>
                <span
                  v-else-if="product.ticket && product.ticket.date_finished"
                  class="text-xs text-green-700 font-semibold"
                >
                  (Finalizado)
                </span>
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
            <div class="min-w-[215px] text-right">
              <span class="font-semibold text-primary-dark"> TOTAL: </span>
              <span>
                {{ order.total_price | formatCurrency }}
              </span>
            </div>
          </div>
        </CollapseContent>
      </tab>
      <tab name="Cerradas" size="lg">
        <CollapseContent
          :withShadow="true"
          v-for="(order, i) in closedOrders"
          :key="`${i}-${order.name}`"
          class="mb-2"
        >
          <template v-slot:title>
            <span class="text-lg font-semibold">{{ order.name }}</span>
          </template>

          <div
            v-for="(product, index) in order.selected_products"
            :key="`${index}-${product.id}`"
            @click="openModalActions(order, product, i, index)"
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
          <div class="flex items-center justify-between mt-6 mb-4">
            <div>
              <Button
                variant="outline-success"
                size="md"
                class="mr-2"
                @click="sendOrder(i)"
              >
                Enviar pedido
              </Button>
              <!-- <Button
            variant="outline-primary"
            size="md"
            class="mr-2"
            @click="addProductToOrder(i)"
          >
            Agregar producto
          </Button> -->
              <Button
                variant="outline-danger"
                size="md"
                @click="deleteOrder(i)"
              >
                Eliminar pedido
              </Button>
            </div>

            <div class="min-w-[215px] text-right">
              <span class="font-semibold text-primary-dark"> TOTAL: </span>
              <span>
                {{ order.total_price | formatCurrency }}
              </span>
            </div>
          </div>
        </CollapseContent>
      </tab>
    </tabs>
    <ModalActionsOrderViews
      :order="orderSelected"
      :product="productSelected"
      :indexProduct="indexProduct"
      :indexOrder="indexOrder"
      ref="modal-actions-products"
      @deleteProduct="deleteProduct"
      @updateProduct="updateProduct"
    ></ModalActionsOrderViews>
  </div>
</template>

<script>
import { getPrettyIngredients } from '~/assets/utils/ingredientsFormatter'
import ModalActionsOrderViews from './Modals/ModalActionsOrderViews.vue'

// TODO: Agregar funcionalidad de eliminar producto

export default {
  name: 'OrdersView',
  async mounted() {
    await this.getOrders()
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      openOrders: [],
      closedOrders: [],
      orderSelected: {},
      productSelected: { media_files: [], ingredients_selected: [] },
      key: 1,
      indexProduct: -1,
      indexOrder: -1,
    }
  },
  methods: {
    openModalActions(order, product, indexOrder, indexProduct) {
      this.orderSelected = order
      this.productSelected = product
      this.productSelected.ingredients_selected = product.ingredients
      this.productSelected.selected_ingredients = product.all_ingredients
      this.productSelected.ingredients_selected_text = getPrettyIngredients(
        product.ingredients
      )
      const commentsArray = product.comments.split('::')
      this.productSelected.comments = commentsArray[1]
      this.productSelected.comments_id = commentsArray[0]

      this.indexOrder = indexOrder
      this.indexProduct = indexProduct
      this.$refs['modal-actions-products'].open()
    },
    async getOrders() {
      const filter = `waiter=${this.$auth.user.id}&sort_by=desc(created_at)`
      const getData =
        'name,is_open,created_at,total_price,id,branch_office,branch_office.id,selected_products.id,selected_products.ingredients,selected_products.name,selected_products.price,selected_products.category,selected_products.media_files,waiter.name'
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
        this.openOrders = orders.filter((order) => order.is_open)
        this.closedOrders = orders.filter((order) => !order.is_open)
      } catch (err) {
        // TODO: Handle error
        console.log(err)
      }
    },
    changeStatusOfTicket(status, { order, ticket }) {
      let index = -1
      const orders = [...this.openOrders].concat([...this.closedOrders])
      const orderStore = orders.find((ord, ind) => {
        index = ind
        return ord.id === order.id
      })
      const ticketIndex = orderStore.selected_products.findIndex((product) => {
        return product.ticket_id === ticket.id
      })
      let ticketForUpdate = {}
      if (status === 'accepted') {
        ticketForUpdate = {
          ...ticket,
          date_accepted: new Date(),
        }
      } else {
        ticketForUpdate = {
          ...ticket,
          date_accepted: new Date(),
          date_finished: new Date(),
        }
      }
      if (orderStore.is_open) {
        this.openOrders[index].selected_products[ticketIndex].ticket =
          ticketForUpdate
      }
      if (this.isFinishedOrder(this.openOrders[index])) {
        this.openOrders[index].finished = true
      }
    },
    isFinishedOrder(order) {
      const finished = order.selected_products.every((product) => {
        return (
          !product.ticket || (product.ticket && product.ticket.date_finished)
        )
      })
      if (finished) {
        return true
      }
      return false
    },
    async updateProduct({ product, indexOrder, indexProduct }) {
      const order = this.openOrders[indexOrder]
      const payload = {
        product_id: product.id,
        product_ingredients: product.ingredients_selected.map(
          (ingredient) => ingredient.id
        ),
        product_comments: product.comments,
      }

      let response = null

      try {
        response =
          await this.$orderRepository.updateCommentsOrIngredientsOfProduct(
            order.id,
            payload
          )
      } catch (err) {
        // TODO: Handle error
        console.log(err)
      }

      if (response) {
        this.$set(
          this.openOrders[indexOrder].selected_products,
          indexProduct,
          product
        )

        this.$emit('emitSocket', {
          name: 'update-order',
          ticket: { ...response.ticket, order: response.order },
          order: response.order,
        })
        this.$refs['modal-actions-products'].close()
      }
    },
    deleteProduct() {},
  },
  watch: {
    active() {
      if (this.active) {
        this.getOrders()
      }
    },
  },
  components: { ModalActionsOrderViews },
}
</script>
