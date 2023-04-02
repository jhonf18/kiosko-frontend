<template>
  <Modal
    :id="`component-${nameRef}`"
    :ref="`component-${nameRef}`"
    size="lg"
    title="Eliminar producto"
    :footer="false"
  >
    <Message header="¡Importante!" variant="danger" class="mb-4">
      Este es un proceso irreversible y puede afectar los pedidos realizados que
      contengan a este producto.
    </Message>
    <div class="grid md:grid-cols-2 gap-4">
      <h4 class="text-lg font-semibold mb-2 text-center col-span-full">
        Resumen del producto
      </h4>
      <div>
        <a
          href="#"
          class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:max-w-sm w-full hover:bg-gray-100"
        >
          <img
            v-if="product.media_files"
            class="object-cover aspect-video w-full rounded-t-lg h-auto"
            :src="product.media_files[0]"
            alt="Imagen de previsualización del producto"
          />
          <div class="flex flex-col justify-between p-4 leading-normal w-full">
            <h5 class="mb-2 text-base font-bold tracking-tight text-gray-900">
              {{ product.name }}
            </h5>
            <p class="mb-3 text-sm text-gray-700">
              {{ ingredients }}
            </p>
            <div class="flex justify-end">
              <span class="text-primary font-semibold">
                {{ product.price | formatCurrency }}
              </span>
            </div>
          </div>
        </a>
      </div>
      <div>
        <ul class="py-4 list-disc pl-4">
          <li class="mb-1">
            <span class="font-medium">Categoría:</span>
            <span class="text-sm capitalize"
              >{{ product.category.toLowerCase() }}.
            </span>
          </li>
          <li class="mb-1">
            <span class="font-medium">Subcategoría:</span>
            <span class="text-sm capitalize">{{ product.subcategory }}. </span>
          </li>
          <li class="mb-1">
            <span class="font-medium">Sucursal:</span>
            <span class="text-sm capitalize">
              {{
                `${product.branch_office.name}, ${product.branch_office.address}`
              }}.
            </span>
          </li>
          <li class="mb-1">
            <span class="font-medium">Secciones de paso:</span>
            <span class="text-sm capitalize"
              >{{ passage_sections.toLowerCase() }}.</span
            >
          </li>
        </ul>
      </div>
    </div>

    <div class="flex justify-end mt-8 mb-2">
      <ButtonWithSpinner
        @click="openModalDeleteProduct"
        :loading="loading"
        variant="danger"
        :text="buttonText"
      ></ButtonWithSpinner>
    </div>
    <ModalConfirmPassword
      id="modal-confirm-pwd-for-delete-product"
      ref="modal-confirm-pwd-for-delete-product"
      @correctPassword="deleteProduct"
    ></ModalConfirmPassword>
  </Modal>
</template>

<script>
import { mapMutations } from 'vuex'
import { formatErrorMessages } from '~/assets/utils/formatErrorMessage'
import { ingredientsFormatter } from '~/assets/utils/ingredientsFormatter'
import { generalStoreNames } from '~/store/general'
import { productStoreNames } from '~/store/product'
import ModalConfirmPassword from './ModalConfirmPassword.vue'

export default {
  name: 'ModalDeleteProduct',
  props: {
    productStore: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      product: {
        name: '',
        price: 0,
        active: true,
        category: '',
        subcategory: '',
        media_files: null,
        passage_sections: [],
        selected_ingredients: [],
        branch_office: {},
      },
      ingredients: '',
      passage_sections: '',
      buttonText: 'Eliminar producto',
      loading: false,
      nameRef: 'modal-delete-product',
    }
  },
  watch: {
    productStore(newValue) {
      this.product = {
        ...newValue,
      }
      this.setIngredients(this.product)
      this.setPassageSections(this.product)
    },
  },
  methods: {
    ...mapMutations({
      showToast: generalStoreNames.mutations.showToast,
      deleteProductFromStore: productStoreNames.mutations.delete,
    }),
    async deleteProduct() {
      if (this.loading) return

      this.setLoading(true)

      try {
        // Create product
        await this.$productRepository.delete(this.product.id)
        // Add delete product of store

        this.deleteProductFromStore({ productID: this.product.id })
        this.close()
      } catch (error) {
        this.showToast({
          type: 'error',
          text: formatErrorMessages(error.message),
        })
      } finally {
        this.setLoading(false)
      }
    },
    setPassageSections(product) {
      if (product.passage_sections && product.passage_sections.length > 0) {
        const formatter = new Intl.ListFormat('es', {
          style: 'long',
          type: 'conjunction',
        })
        this.passage_sections = formatter.format(product.passage_sections)
      }
    },
    setIngredients(product) {
      if (
        product.selected_ingredients &&
        product.selected_ingredients.length > 0
      ) {
        const formatter = new Intl.ListFormat('es', {
          style: 'long',
          type: 'conjunction',
        })
        const ingredientsFormated = ingredientsFormatter(
          product.selected_ingredients
        )
        const ingredientsNames = ingredientsFormated.map((ingredient) => {
          let ingredientName = ''
          if (ingredient.quantity) {
            ingredientName += `${ingredient.quantity} `
          }
          ingredientName += ingredient.name
          return ingredientName
        })
        this.ingredients = `${formatter.format(ingredientsNames)}.`
      }
    },
    setLoading(state) {
      if (state) this.buttonText = 'Eliminando ...'
      else this.buttonText = 'Eliminar producto'
      this.loading = state
    },
    open() {
      this.$refs[`component-${this.nameRef}`].open()
      this.setIngredients(this.productStore)
      this.setPassageSections(this.productStore)
    },
    openModalDeleteProduct() {
      this.$refs['modal-confirm-pwd-for-delete-product'].open()
    },
    close() {
      this.$refs[`component-${this.nameRef}`].closeByButton()
    },
  },
  components: { ModalConfirmPassword },
}
</script>
