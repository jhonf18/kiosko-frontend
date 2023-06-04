<template>
  <Modal
    :id="`component-${nameRef}`"
    :ref="`component-${nameRef}`"
    size="sm"
    :fullModal="true"
    :showHeader="false"
    :footer="false"
  >
    <div class="aspect-video relative">
      <div
        @click="close"
        class="absolute left-2 top-2 p-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-700/50"
      >
        <ChevronLeftIcon class="stroke-gray-100"></ChevronLeftIcon>
      </div>
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
      </div>
      <h4
        class="font-semibold text-lg mt-4"
        v-if="
          product.ingredients_selected &&
          product.ingredients_selected.length > 0
        "
      >
        Descripción
      </h4>
      <p class="text-gray-600 text-sm">
        {{ product.ingredients_selected_text }}
      </p>

      <CollapseContent
        class="mb-8 mt-4"
        ref="collapse-content-add-product"
        :withShadow="true"
        v-if="
          product.ingredients_selected &&
          product.ingredients_selected.length > 0
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

      <Button variant="primary" size="block" @click="productEdit" class="mt-4">
        Editar
      </Button>
    </div>
  </Modal>
</template>

<script>
import { getPrettyIngredients } from '~/assets/utils/ingredientsFormatter'

export default {
  name: 'ModalActionsEditProduct',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  components: {
    ChevronLeftIcon: () => import('@/static/icons/chevronLeft.svg?inline'),
  },
  data() {
    return {
      nameRef: 'modal-actions-edit-product',
      productToEdit: {},
      selectedIngredients: [],
      meatTerm: '',
    }
  },
  mounted() {
    this.getNewProduct()
  },
  methods: {
    open() {
      this.$refs[`component-${this.nameRef}`].open()
    },
    close() {
      this.$refs[`component-${this.nameRef}`].closeByButton()
    },
    getNewProduct() {
      this.productToEdit = { ...this.product }
      this.selectedIngredients = this.product.ingredients_selected
      this.meatTerm = this.product.comments
    },
    productEdit() {
      const ingredientsText = getPrettyIngredients(this.selectedIngredients)
      console.log(ingredientsText)

      const product = {
        ...this.productToEdit,
        ingredients_selected: this.selectedIngredients,
        ingredients_selected_text: ingredientsText,
        comments: this.meatTerm,
      }
      this.$emit('updateProduct', product)
    },
  },
  watch: {
    product() {
      this.getNewProduct()
    },
  },
  computed: {
    checkedAll() {
      return (
        this.selectedIngredients.length ===
        this.product.selected_ingredients.length
      )
    },
  },
}
</script>

<style lang="postcss" scoped>
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
