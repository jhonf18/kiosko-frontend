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
      <div key="2" v-else-if="orderType === 'order-existing'">
        <div class="flex mb-4" @click="orderType = 'select-type'">
          <ChevronLeftIcon class="cursor-pointer"></ChevronLeftIcon>
          <span class="ml-1 cursor-pointer">Ir atrás</span>
        </div>

        <div class="mt-4">
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
                <span class="font-semibold text-primary-dark"> TOTAL: </span>
                <span>
                  {{ order.total | formatCurrency }}
                </span>
              </div>
            </div>
          </CollapseContent>
        </div>
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
import { getPrettyIngredients } from '~/assets/utils/ingredientsFormatter'

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
    }
  },
  components: {
    ChevronLeftIcon: () => import('@/static/icons/chevronLeft.svg?inline'),
  },
  methods: {
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
      }
    },
    addProductToOrder(index) {
      const cartStore = JSON.parse(localStorage.getItem('cart'))
      let product = { ...this.product }
      product.ingredients_selected_text = getPrettyIngredients(
        product.ingredients_selected
      )

      cartStore[index].products.unshift(product)
      cartStore[index].total += product.price

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
          products: [product],
          total: product.price,
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
