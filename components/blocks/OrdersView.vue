<template>
  <div class="px-6 pt-5 pb-10">
    <tabs :key="keyTabs">
      <tab :selected="true" name="Abiertas" size="lg">
        <div v-if="openOrders.length > 0">
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
        </div>
        <div v-else class="text-center pt-20">
          <h2 class="text-3xl font-semibold">
            No hay pedidos abiertos actualmente
          </h2>
        </div>
      </tab>
      <tab name="Cerradas" size="lg">
        <div v-if="closedOrders.length > 0">
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
              <div class="min-w-[215px] text-right">
                <span class="font-semibold text-primary-dark"> TOTAL: </span>
                <span>
                  {{ order.total_price | formatCurrency }}
                </span>
              </div>
            </div>
          </CollapseContent>
        </div>
        <div v-else class="text-center pt-20">
          <h2 class="text-3xl font-semibold">
            No hay pedidos cerrados actualmente
          </h2>
        </div>
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
import { mapMutations } from 'vuex'

import { formatErrorMessages } from '~/assets/utils/formatErrorMessage'
import { getPrettyIngredients } from '~/assets/utils/ingredientsFormatter'
import { generalStoreNames } from '~/store/general'
import ModalActionsOrderViews from './Modals/ModalActionsOrderViews.vue'

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
      keyTabs: 0,
    }
  },
  methods: {
    ...mapMutations({
      showToast: generalStoreNames.mutations.showToast,
    }),
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
      let today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      today.setMilliseconds(0)

      const filter = `waiter=${
        this.$auth.user.id
      }&sort_by=desc(created_at)&today=${today.getTime()}`
      const getData =
        'name,is_open,created_at,total_price,id,branch_office,branch_office.id,selected_products.ticket_id,selected_products.id,selected_products.ingredients,selected_products.name,selected_products.price,selected_products.category,selected_products.media_files,waiter.name'
      try {
        let orders = await this.$orderRepository.index({ getData, filter })
        orders = orders.map((order) => {
          let finished = true
          order.selected_products = order.selected_products.map((product) => {
            const ingredientsText = getPrettyIngredients(product.ingredients)
            const completeComment = product.comments
            const commentsText = completeComment.split('::')[1]
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
        this.keyTabs = new Date().getTime()
      } catch (err) {
        this.showToast({
          text: formatErrorMessages(err.message),
          type: 'error',
          visibleTime: 3,
        })
      }
    },
    changeStatusOfTicket(status, { order, ticket }) {
      let index = -1
      const orders = [...this.openOrders].concat([...this.closedOrders])
      const orderStore = orders.find((ord, ind) => {
        index = ind
        return ord.id === order.id
      })

      if (orderStore) {
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

        const ticketIndex = orderStore.selected_products.findIndex(
          (product) => {
            return product.ticket_id === ticket.id
          }
        )

        if (ticketIndex) {
          if (orderStore.is_open) {
            this.openOrders[index].selected_products[ticketIndex].ticket =
              ticketForUpdate
          }
        }

        if (this.isFinishedOrder(this.openOrders[index])) {
          this.openOrders[index].finished = true
        }
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
        this.showToast({
          text: formatErrorMessages(err.message),
          type: 'error',
          visibleTime: 3,
        })
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
    async deleteProduct({ order, product, indexOrder, indexProduct }) {
      const orderID = order.id

      const payload = {
        product_id: product.id,
        product_comments: product.comments,
      }

      try {
        await this.$orderRepository.deleteProductOfOrder({
          id: orderID,
          payload,
        })

        this.openOrders[indexOrder].selected_products.splice(indexProduct, 1)

        this.openOrders[indexOrder].total_price =
          this.openOrders[indexOrder].total_price - product.price

        if (this.isFinishedOrder(this.openOrders[indexOrder])) {
          this.openOrders[indexOrder].finished = true
        }

        const ticketIndex = this.openOrders[indexOrder].tickets.findIndex(
          (ticket) => {
            return ticket.id === product.ticket_id
          }
        )

        if (ticketIndex > -1) {
          this.$emit('emitSocket', {
            name: 'delete-product-of-order',
            order: this.openOrders[indexOrder],
            product,
            ticket: this.openOrders[indexOrder].tickets[ticketIndex],
          })
        }

        this.$refs['modal-actions-products'].close()
      } catch (err) {
        this.showToast({
          text: formatErrorMessages(err.message),
          type: 'error',
          visibleTime: 3,
        })
      }
    },
    closedOrder({ order }) {
      const indexOrder = this.openOrders.findIndex((ord) => ord.id === order.id)

      if (indexOrder > -1) {
        this.openOrders.splice(indexOrder, 1)
      }

      this.closedOrders.unshift(order)
    },
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
