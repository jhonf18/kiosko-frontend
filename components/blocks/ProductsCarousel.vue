<template>
  <div
    class="max-w-6xl mx-auto mb-24 mt-7 relative px-6"
    :class="{ '!mt-[90px]': !category }"
  >
    <div v-if="category" class="w-full flex justify-center mb-7">
      <ul class="flex justify-center">
        <li
          v-for="(subcategory, i) in subcategories"
          :key="i"
          @click="selectedSubcategory(subcategory, i)"
          :class="{ 'bg-primary text-white': subcategory.active }"
          class="border border-primary rounded-lg px-2 py-1.5 text-sm font-semibold mr-2 cursor-pointer hover:bg-primary hover:text-white transition-colors"
        >
          {{ subcategory.name }}
        </li>
      </ul>
    </div>
    <div v-if="productsStore.length === 0">
      <h3 class="text-2xl text-center font-semibold">
        No hay productos para esta categoría
      </h3>
    </div>
    <VueSlickCarousel
      v-bind="settings"
      ref="carousel"
      :key="carouselKey"
      v-if="productsStore.length > 0"
    >
      <section class="px-2" v-for="product in productsStore" :key="product.id">
        <div class="rounded shadow-sm border-gray-200 border">
          <div class="rounded-t">
            <div class="aspect-video">
              <img
                class="rounded-t max-h-full min-w-full"
                :src="product.media_files[0]"
              />
            </div>
            <div class="px-2 py-2">
              <h4 class="line-clamp-2 leading-5 font-semibold h-10">
                {{ product.name | formatProductName }}
              </h4>
              <p class="text-gray-600 text-sm line-clamp-4 h-20">
                {{ product.ingredients }}
              </p>
              <div class="flex justify-between mt-4 items-center">
                <span class="font-semibold text-primary">
                  {{ product.price | formatCurrency }}
                </span>
                <div
                  class="rounded-full bg-primary cursor-pointer hover:bg-primary-dark"
                  @click="selectProduct(product)"
                >
                  <PlusIcon class="stroke-white w-7 h-7"></PlusIcon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </VueSlickCarousel>

    <!-- Arrow buttons -->
    <button
      v-if="productsStore.length > 0"
      v-for="(button, i) in buttons"
      :key="i"
      @click="move(button.name)"
      class="border border-gray rounded-lg p-2.5 absolute bg-white top-1/2 transform -translate-y-1/2"
      :class="button.class"
    >
      <component :is="button.icon"></component>
    </button>

    <ModalAddProductToCart
      ref="modal-add-product-2-cart"
      :product="productToAdd"
    ></ModalAddProductToCart>
  </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import { getPrettyIngredients } from '@/assets/utils/ingredientsFormatter'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import ModalAddProductToCart from './Modals/ModalAddProductToCart.vue'

const buttons = [
  { name: 'prev', icon: 'ChevronLeftIcon', class: 'left-0' },
  { name: 'next', icon: 'ChevronRightIcon', class: 'right-0' },
]

export default {
  props: {
    products: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: false,
    },
  },
  name: 'MyComponent',
  components: {
    PlusIcon: () => import('@/static/icons/plus.svg?inline'),
    ChevronLeftIcon: () => import('@/static/icons/chevronLeft.svg?inline'),
    ChevronRightIcon: () => import('@/static/icons/chevronRight.svg?inline'),
    VueSlickCarousel,
    ModalAddProductToCart,
  },
  data() {
    return {
      carouselKey: new Date().getTime(),
      settings: {
        centerMode: true,
        focusOnSelect: false,
        infinite: true,
        slidesToShow: 4,
        speed: 500,
        rows: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4,
            },
          },
          {
            breakpoint: 868,
            settings: {
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 640,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 470,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      },
      buttons,
      productsStore: [],
      subcategories: [],
      productToAdd: { media_files: [] },
    }
  },
  methods: {
    selectProduct(product) {
      this.productToAdd = product
      this.$refs['modal-add-product-2-cart'].open()
    },
    selectedSubcategory(subcategory, index) {
      if (
        subcategory.name.includes('Personal') ||
        subcategory.name.includes('1 L') ||
        subcategory.name.includes('2 L')
      ) {
        const juiceSize = subcategory.name.split('-')[1].trim()

        this.productsStore = this.products.filter((product) => {
          return (
            product.subcategory === 'Jugos naturales' &&
            product.name.includes(`-- ${juiceSize}`)
          )
        })
      } else {
        this.productsStore = this.products.filter(
          (product) => product.subcategory === subcategory.name
        )
      }

      this.setProducts(this.productsStore, false)

      this.subcategories.forEach((subcategory) => {
        subcategory.active = false
      })

      this.subcategories[index].active = true
      this.carouselKey = new Date().getTime()
    },
    move(to) {
      if (to === 'prev') {
        this.$refs.carousel.prev()
      } else {
        this.$refs.carousel.next()
      }
    },
    setProducts(products, setSubcategories = true) {
      this.productsStore = products.map((product) => {
        let ingredients = ''
        if (product.selected_ingredients.length > 0) {
          ingredients = getPrettyIngredients(product.selected_ingredients)
        }
        return { ...product, ingredients }
      })

      if (setSubcategories) {
        let naturalJuices = {
          personal: [],
          oneLiter: [],
          twoLiters: [],
        }

        let subcategories = this.productsStore.map((product) => {
          const productName = product.name
          if (productName.includes('Personal')) {
            naturalJuices.personal.push(product)
          } else if (productName.includes('1 Litro')) {
            naturalJuices.oneLiter.push(product)
          } else if (productName.includes('2 Litros')) {
            naturalJuices.twoLiters.push(product)
          }
          return product.subcategory
        })
        subcategories = Array.from(new Set(subcategories))
        const naturalJuicesIndex = subcategories.findIndex(
          (subcategory) => subcategory === 'Jugos naturales'
        )

        if (naturalJuicesIndex > -1) {
          subcategories.splice(naturalJuicesIndex, 1)
          if (naturalJuices.personal.length > 0) {
            subcategories.push('Jugo natural - Personal')
          }
          if (naturalJuices.oneLiter.length > 0) {
            subcategories.push('Jugo natural - 1 L')
          }
          if (naturalJuices.twoLiters.length > 0) {
            subcategories.push('Jugo natural - 2 L')
          }
        }

        console.log(subcategories)
        this.subcategories = subcategories.map((subcategoryName) => {
          return { active: false, name: subcategoryName }
        })
      }
      this.carouselKey = new Date().getTime()
    },
  },
  watch: {
    products() {
      this.setProducts(this.products)
    },
    category() {
      if (this.category) {
        this.productsStore = this.products.filter(
          (product) => product.category === this.category
        )
        this.setProducts(this.productsStore)
      }
    },
  },
}
</script>
