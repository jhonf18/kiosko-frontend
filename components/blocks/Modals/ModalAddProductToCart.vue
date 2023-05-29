<template>
  <Modal
    :id="`component-${nameRef}`"
    :ref="`component-${nameRef}`"
    size="sm"
    :fullModal="true"
    :showHeader="false"
    :footer="false"
  >
    <div class="aspect-video">
      <img :src="product.media_files[0]" :alt="`Imagen de ${product.name}`" />
    </div>
    <div class="rounded-t-2xl py-4 px-4 bg-white relative -mt-5">
      <h3 class="leading-5 font-bold text-xl">
        {{ product.name }}
      </h3>
      <div class="mt-5 flex justify-between">
        <span class="font-semibold text-primary text-lg">
          {{ product.price | formatCurrency }}
        </span>
        <InputQuantity v-model="quantity"></InputQuantity>
      </div>
      <h4
        class="font-semibold text-lg mt-4"
        v-if="
          product.selected_ingredients &&
          product.selected_ingredients.length > 0
        "
      >
        Descripción
      </h4>
      <p class="text-gray-600 text-sm">
        {{ product.ingredients }}
      </p>

      <CollapseContent
        class="mb-8 mt-4"
        ref="collapse-content-add-product"
        :withShadow="true"
        v-if="
          product.selected_ingredients &&
          product.selected_ingredients.length > 0
        "
      >
        <template v-slot:title>
          <div class="flex items-center w-full">
            <input
              class="w-5 h-5 text-primary-light rounded form-checkbox focus:ring-primary-light cursor-pointer"
              type="checkbox"
              value=""
              v-model="checkedAll"
              id="with-all-ingredients"
            />
            <label
              class="hover:cursor-pointer ml-2 flex justify-between w-full"
              for="with-all-ingredients"
            >
              <span> Con todo </span>
            </label>
          </div>
        </template>

        <ul>
          <li
            class="rounded border border-gray px-2 py-1.5 mb-2 flex justify-between items-center"
            v-for="ingredient in product.selected_ingredients"
            :key="ingredient.id"
          >
            <label
              class="hover:cursor-pointer ml-2 flex justify-between w-full"
              :for="ingredient.id"
            >
              {{ ingredient.quantity ? ingredient.quantity : '' }}
              {{ ingredient.name }}
            </label>
            <input
              v-model="selectedIngredients"
              class="w-5 h-5 text-primary-light rounded form-checkbox focus:ring-primary-light cursor-pointer"
              type="checkbox"
              :value="ingredient"
              :id="ingredient.id"
            />
          </li>
        </ul>
      </CollapseContent>

      <div
        class="flex justify-around mt-5 mb-6"
        id="meat-term-content"
        v-if="product.category === 'HORNO'"
      >
        <input
          type="radio"
          v-model="meatTerm"
          class="hidden"
          name="meat-term"
          id="meat-medium-term"
          value="Termino medio"
        />
        <label
          for="meat-medium-term"
          class="border border-primary px-2 py-1.5 rounded-lg text-sm font-semibold"
        >
          Termino medio
        </label>
        <input
          v-model="meatTerm"
          type="radio"
          class="hidden"
          name="meat-term"
          id="meat-3/4-term"
          value="Tres cuartos"
        />
        <label
          for="meat-3/4-term"
          class="border border-primary px-2 py-1.5 rounded-lg text-sm font-semibold"
        >
          Tres cuartos
        </label>
        <input
          v-model="meatTerm"
          type="radio"
          class="hidden"
          name="meat-term"
          id="meat-well-done"
          value="Bien asado"
        />
        <label
          for="meat-well-done"
          class="border border-primary px-2 py-1.5 rounded-lg text-sm font-semibold"
        >
          Bien asado
        </label>
      </div>

      <Button
        variant="primary"
        size="block"
        @click="showModalAddProduct"
        class="mt-4"
      >
        Añadir al carrito
      </Button>
    </div>
    <ModalAddProductToOrder
      @finished="close"
      :product="productToSaved"
      ref="modal-add-product-to-order"
    ></ModalAddProductToOrder>
  </Modal>
</template>

<script>
import ModalAddProductToOrder from '@/components/blocks/Modals/ModalAddProductToOrder.vue'
import CollapseContent from '~/components/special/CollapseContent.vue'

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      nameRef: 'modal-add-product-to-cart',
      productToAdd: {},
      quantity: 1,
      selectedIngredients: [],
      meatTerm: '',
    }
  },
  components: {
    ChevronRightIcon: () => import('@/static/icons/chevronRight.svg?inline'),
    CollapseContent,
    ModalAddProductToOrder,
  },
  watch: {
    product() {
      this.selectedIngredients = this.product.selected_ingredients || []
    },
  },
  methods: {
    resetData() {
      this.quantity = 1
      // this.selectedIngredients = []
      this.meatTerm = ''
    },
    open() {
      this.$refs[`component-${this.nameRef}`].open()
      this.resetData()
      // console.log(this.product)
      // console.log(this.product.selectedIngredients)
      // this.selectedIngredients = this.product.selected_ingredients || []
    },
    close() {
      this.$refs[`component-${this.nameRef}`].closeByButton()
    },
    showModalAddProduct() {
      this.$refs['modal-add-product-to-order'].open()
    },
    addToCart() {
      const productToAdd = {
        product: this.product.id,
        ...(this.selectedIngredients.length > 0 && {
          ids_selected_ingredients: this.selectedIngredients.map(
            (ingredient) => ingredient.id
          ),
        }),
        ...(this.meatTerm && { comments: this.meatTerm }),
      }

      const cartStore = JSON.parse(localStorage.getItem('cart'))

      if (!cartStore) {
        const cart = [
          {
            waiter: this.$auth.user.id,
            cart: [productToAdd],
          },
        ]
        localStorage.setItem('cart', JSON.stringify(cart))
      } else {
        const index = this.findCartByUser(cartStore)

        if (index >= cartStore.length) {
          cartStore[index] = {
            waiter: this.$auth.user.id,
            cart: [productToAdd],
          }
        } else {
          cartStore[index].cart.push(productToAdd)
        }

        localStorage.setItem('cart', JSON.stringify(cartStore))
      }
    },
    findCartByUser(cart) {
      if (cart) {
        const index = cart.findIndex(
          (item) => item.waiter === this.$auth.user.id
        )
        return index < 0 ? cart.length - 1 : index
      }
      return 0
    },
  },
  computed: {
    productToSaved() {
      return {
        ...this.product,
        ingredients_selected:
          this.selectedIngredients.length > 0
            ? this.selectedIngredients
            : this.product.selected_ingredients,
        ...(this.meatTerm && { comments: this.meatTerm }),
      }
    },
    checkedAll() {
      return (
        this.selectedIngredients.length ===
        this.product.selected_ingredients.length
      )
    },
  },
}
</script>

<style scoped lang="postcss">
#meat-term-content label {
  @apply cursor-pointer;
}

#meat-term-content label:hover {
  @apply bg-primary-light;
}

input[type='radio']:checked + label {
  @apply bg-primary text-white;
}
</style>
