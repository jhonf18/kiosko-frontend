<template>
  <div v-if="product.name && product.price" class="grid md:grid-cols-2 gap-4">
    <h4 class="text-lg font-semibold mb-2 text-center col-span-full">
      Resumen del producto
    </h4>
    <div>
      <a
        href="#"
        class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:max-w-sm w-full hover:bg-gray-100"
      >
        <img
          v-if="product.imagePreview"
          class="object-cover aspect-video w-full rounded-t-lg h-auto"
          :src="product.imagePreview"
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
          <span class="font-medium">Subcategoría:</span>
          <span class="text-sm capitalize">
            {{ product.category ? product.subcategory : 'Sin categoría' }}.
          </span>
        </li>
        <li class="mb-1">
          <span class="font-medium">Secciones de paso:</span>
          <span class="text-sm capitalize">
            {{ passage_sections.toLowerCase() }}.
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getPrettyIngredients } from '@/assets/utils/ingredientsFormatter'
export default {
  name: 'SummaryProduct',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      passage_sections:
        'Por defecto será la sección a la que pertenezca el producto.',
      ingredients: 'No se han agregado ingredientes.',
    }
  },
  mounted() {
    this.setPassageSections(this.product)
    this.setIngredients(this.product)
  },
  methods: {
    setPassageSections(product) {
      if (product.passage_sections.length > 0) {
        const formatter = new Intl.ListFormat('es', {
          style: 'long',
          type: 'conjunction',
        })

        this.passage_sections = formatter.format(product.passage_sections)
      }
    },
    setIngredients(product) {
      if (product.ingredients.length > 0) {
        this.ingredients = getPrettyIngredients(product.ingredients)
      }
    },
  },
  watch: {
    product: {
      handler: function (newVal) {
        this.setIngredients(newVal)
        this.setPassageSections(newVal)
      },
      deep: true,
      inmediate: true,
    },
  },
}
</script>
