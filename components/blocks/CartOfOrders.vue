<template>
  <div class="px-8 py-6" :key="key">
    <h2 class="text-2xl font-bold mb-4">Pedidos por confirmar</h2>
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
          <Button variant="outline-danger" size="md" @click="deleteOrder(i)">
            Eliminar pedido
          </Button>
        </div>

        <div class="min-w-[215px] text-right">
          <span class="font-semibold text-primary-dark"> TOTAL: </span>
          <span>
            {{ order.total | formatCurrency }}
          </span>
        </div>
      </div>
    </CollapseContent>
    <ModalActionsCartProducts
      :order="orderSelected"
      :product="productSelected"
      :indexProduct="indexProduct"
      :indexOrder="indexOrder"
      ref="modal-actions-products"
      @deleteProduct="deleteProduct"
      @updateProduct="updateProduct"
    ></ModalActionsCartProducts>
  </div>
</template>

<script>
import ModalActionsCartProducts from '@/components/blocks/Modals/ModalActionsCartProducts.vue'
export default {
  name: 'CartOfOrders',
  props: {
    active: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    ModalActionsCartProducts,
  },
  data() {
    return {
      orders: [],
      orderSelected: {},
      productSelected: {},
      key: 1,
      indexProduct: -1,
      indexOrder: -1,
    }
  },
  mounted() {
    this.updateOrders()
  },
  methods: {
    findOrders() {
      const orders = JSON.parse(localStorage.getItem('cart'))
      if (orders) {
        this.orders = orders.filter(
          (order) => order.waiter === this.$auth.user.id
        )
      }
    },
    updateOrders() {
      this.findOrders()
    },
    addProductToOrder() {},
    sendOrder() {},
    deleteOrder(indexOrder) {
      const orders = JSON.parse(localStorage.getItem('cart'))
      orders.splice(indexOrder, 1)
      localStorage.setItem('cart', JSON.stringify(orders))
      this.findOrders()
      this.key++
    },
    openModalActions(order, product, indexOrder, indexProduct) {
      this.orderSelected = order
      this.productSelected = product
      this.indexOrder = indexOrder
      this.indexProduct = indexProduct
      this.$refs['modal-actions-products'].open()
    },
    deleteProduct({ product, indexOrder, indexProduct }) {
      const orders = JSON.parse(localStorage.getItem('cart'))

      orders[indexOrder].products.splice(indexProduct, 1)
      orders[indexOrder].total = orders[indexOrder].total - product.price
      localStorage.setItem('cart', JSON.stringify(orders))
      this.findOrders()
      this.key++
    },
    updateProduct({ product, indexOrder, indexProduct }) {
      const orders = JSON.parse(localStorage.getItem('cart'))
      orders[indexOrder].products[indexProduct] = product
      localStorage.setItem('cart', JSON.stringify(orders))
      this.findOrders()
      this.key++
    },
  },
  watch: {
    active() {
      if (this.active) {
        this.updateOrders()
        this.key++
      }
    },
  },
}
</script>
