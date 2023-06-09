<template>
  <Modal
    :id="`${nameRef}`"
    :ref="`${nameRef}`"
    size="lg"
    :title="`Pedido: ${order.name} - ${order.id}`"
    :footer="false"
  >
    <div class="flex justify-between mb-5 px-8 mt-4">
      <div class="flex flex-col">
        <span class="font-semibold">Mesero</span>
        <span v-if="order.waiter">{{ order.waiter.name }}</span>
      </div>
      <div class="flex flex-col">
        <span class="font-semibold">Fecha</span>
        <span>{{ new Date(order.created_at).toLocaleDateString() }}</span>
      </div>
    </div>

    <div class="relative overflow-x-auto w-full max-w-full">
      <table class="w-full">
        <thead>
          <tr class="border-b border-t bg-gray-100">
            <th
              scope="col"
              class="text-left text-gray-700 font-medium uppercase text-sm p-4 w-6/12 min-w-[100px]"
            >
              Descripción
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm p-4"
            >
              Cantidad
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm p-4"
            >
              P. unitario
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm p-4"
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody v-if="products && products.length > 0">
          <tr
            v-for="(productArr, index) in products"
            :key="productArr[0].id"
            class="border-b bg-white hover:bg-gray-100 transition-colors duration-100 cursor-pointer"
          >
            <td class="p-4">
              <div class="flex flex-col">
                <span class="font-medium text-sm md:text-base">{{
                  productArr[0].name
                }}</span>
              </div>
            </td>

            <td class="p-4 text-sm">
              {{ productArr.length }}
            </td>

            <td class="p-4">
              {{ productArr[0].price | formatCurrency }}
            </td>

            <td class="p-4">
              {{ (productArr[0].price * productArr.length) | formatCurrency }}
            </td>
          </tr>
        </tbody>
      </table>
      <!-- <div
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
      </div> -->
    </div>
    <div class="p-4 text-right">
      <span class="font-semibold text-primary">TOTAL:</span>
      <span>
        {{ order.total_price | formatCurrency }}
      </span>
    </div>
    <div
      class="flex justify-center my-5"
      v-if="order.is_open"
      @click="$emit('finishOrder', order)"
    >
      <Button variant="primary">
        <span>Finalizar pedido</span>
      </Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'ModalInformationOrder',
  data() {
    return {
      nameRef: 'modal-information-order',
      products: [],
    }
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  methods: {
    open() {
      this.formatProducts()
      this.$refs[`${this.nameRef}`].open()
    },
    close() {
      this.$refs[`${this.nameRef}`].closeByButton()
    },
    formatProducts() {
      const products = this.order.selected_products
      let uniqueIDS = []
      this.products = products
        .map((x) => products.filter((y) => y.id === x.id))
        .filter((el) => {
          const isDuplicate = uniqueIDS.includes(el[0].id)

          if (!isDuplicate) {
            uniqueIDS.push(el[0].id)

            return true
          }

          return false
        })
    },
  },
  watch: {
    order() {
      if (this.order.selected_products.length > 0) this.formatProducts()
    },
  },
}
</script>
