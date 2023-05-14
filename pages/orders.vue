<template>
  <div>
    <BottomTabs>
      <template v-for="tab in headerTabs" v-slot:[tab.slotName]="{ active }">
        <a
          target="#"
          class="flex items-center justify-center h-full leading-normal cursor-pointer"
        >
          <span
            class="text-primary h-full flex items-center justify-center py-4 w-10 rounded-t-sm transition-all duration-150"
            :class="{ 'border-t-2 border-primary': active }"
          >
            <component
              :is="active ? tab.activeIcon : tab.icon"
              class="w-7 h-7"
            ></component>
          </span>
        </a>
      </template>
      <template v-slot:menu-content-1>
        <CategoriesBanner @selected="categorySelected"></CategoriesBanner>
        <ProductsCarousel
          :products="products"
          :category="category"
        ></ProductsCarousel>
      </template>
      <template v-slot:menu-content-2> tab 2 </template>
      <template v-slot:menu-content-3> tab 3 </template>
    </BottomTabs>
  </div>
</template>

<script>
import BottomTabs from '~/components/blocks/BottomTabs.vue'
import CategoriesBanner from '~/components/blocks/CategoriesBanner.vue'
import ProductsCarousel from '~/components/blocks/ProductsCarousel.vue'

const headerTabs = [
  { icon: 'HomeIcon', activeIcon: 'HomeSolidIcon', slotName: 'menu-header-1' },
  {
    icon: 'ShoppingCartIcon',
    activeIcon: 'ShoppingCartSolidIcon',
    slotName: 'menu-header-2',
  },
  {
    icon: 'TicketIcon',
    activeIcon: 'TicketSolidIcon',
    slotName: 'menu-header-3',
  },
]

export default {
  name: 'OrdersPage',
  data() {
    return {
      headerTabs,
      products: [
        {
          media_files: [],
        },
      ],
      category: null,
    }
  },
  components: {
    BottomTabs,
    HomeIcon: () => import('@/static/icons/home.svg?inline'),
    HomeSolidIcon: () => import('@/static/icons/home-solid.svg?inline'),
    ShoppingCartIcon: () => import('@/static/icons/shopping-cart.svg?inline'),
    ShoppingCartSolidIcon: () =>
      import('@/static/icons/shopping-cart-solid.svg?inline'),
    TicketIcon: () => import('@/static/icons/ticket.svg?inline'),
    TicketSolidIcon: () => import('@/static/icons/ticket-solid.svg?inline'),
    ProductsCarousel,
    CategoriesBanner,
  },
  created() {
    this.getProducts()
  },
  methods: {
    categorySelected(category) {
      this.category = category
    },
    async getProducts() {
      try {
        const products = await this.$productRepository.index({
          getData:
            'name,price,id,category,subcategory,passage_sections,media_files,branch_office.id,branch_office.name,branch_office.address,selected_ingredients.id,selected_ingredients.name,selected_ingredients.type',
        })
        this.products = products
        console.log(products)
        // commit(localStoreNames.mutations.set, products)
      } catch (err) {
        console.log(err)
      }
    },
  },
}
</script>
