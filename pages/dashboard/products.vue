<template>
  <div>
    <div class="px-4 my-4 max-w-full">
      <h2 class="font-semibold text-xl mb-4">Todos los productos</h2>
      <div class="grid grid-cols-2 lg:grid-cols-8 gap-3">
        <Input
          type="search"
          idInput="search-product"
          v-model="search"
          placeholder="Buscar producto"
          @keyUp="searchProduct"
          class="mr-2 w-full lg:col-span-2"
        ></Input>
        <SelectInput
          class="row-start-2 lg:row-start-auto col-span-full lg:col-span-3"
          :options="optionsSelect"
          v-model="filterSelect"
          @change="onChangeFilter"
        ></SelectInput>
        <div
          class="lg:col-start-7 lg:col-span-2 lg:order-none flex justify-end"
        >
          <Button size="sm" variant="primary" @click="openModalAddProduct">
            <span class="flex items-center w-full">
              <PlusIcon></PlusIcon>
              Agregar
              <span class="hidden sm:inline-block">&ThinSpace; producto</span>
            </span>
          </Button>
        </div>
      </div>
    </div>
    <div class="relative overflow-x-auto w-full max-w-full">
      <table class="w-full">
        <thead>
          <tr class="border-b border-t bg-gray-100">
            <th
              scope="col"
              class="text-left text-gray-700 font-medium uppercase text-sm p-4 w-72 min-w-[200px]"
            >
              Nombre
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm w-32 p-4"
            >
              Precio
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm w-40 p-4"
            >
              Sucursal
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm p-4"
            >
              Categoría
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm p-4"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody v-if="products && products.length > 0">
          <tr
            :key="product.id"
            v-for="product in products"
            class="border-b bg-white hover:bg-gray-100"
          >
            <td class="flex flex-col p-4">
              <span class="font-semibold text-sm md:text-base">
                {{ product.name }}
              </span>
            </td>
            <td class="p-4 text-sm">
              <span class="">{{ product.price | formatCurrency }}</span>
            </td>
            <td class="p-4 text-sm">
              <span v-if="product.branch_office" class="flex flex-col">
                <span class="font-semibold text-sm md:text-base">
                  {{ product.branch_office.name }}
                </span>
                <span class="text-gray-700 text-xs md:text-sm">
                  {{ product.branch_office.address }}
                </span>
              </span>
              <span v-else>No asignada</span>
            </td>
            <td class="p-4 text-sm">
              {{ product.category }}
            </td>
            <td class="p-4">
              <div class="flex items-center">
                <Button
                  size="sm"
                  variant="primary"
                  class="mr-3"
                  @click="openModalEditProduct(product)"
                >
                  <span class="flex w-full items-center">
                    <EditIcon class="w-4 h-4 lg:w-5 lg:h-5"></EditIcon>
                    <span class="hidden lg:block">
                      Editar
                      <span class="hidden xl:inline-block">producto</span>
                    </span>
                  </span>
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  @click="openModalDeleteProduct(product)"
                >
                  <span class="flex w-full items-center">
                    <TrashIcon class="w-4 h-4 lg:w-5 lg:h-5"></TrashIcon>
                    <span class="hidden lg:block">Eliminar</span>
                  </span>
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!products || products.length === 0" class="text-center">
        <h5 class="font-semibold text-lg mt-8">
          No hay productos por mostrar.
        </h5>
      </div>
    </div>
    <ModalAddProduct
      id="modal-add-product"
      ref="modal-add-product"
    ></ModalAddProduct>

    <ModalEditProduct
      id="moda-edit-product"
      ref="modal-edit-product"
      :productStore="productSelected"
    ></ModalEditProduct>

    <ModalDeleteProduct
      ref="modal-delete-product"
      :productStore="productSelected"
    ></ModalDeleteProduct>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { normalizeText } from '~/assets/utils/normalize'
import ModalAddProduct from '~/components/blocks/Modals/ModalAddProduct.vue'
import ModalDeleteProduct from '~/components/blocks/Modals/ModalDeleteProduct.vue'
import ModalEditProduct from '~/components/blocks/Modals/ModalEditProduct.vue'
import { branchOfficeStoreNames } from '~/store/branchOffice'
import { productStoreNames } from '~/store/product'

export default {
  layout: 'dashboard',
  data() {
    // tabla con filtro de busqueda por palabra y por sucursales
    // agregar, editar y eliminar productos
    return {
      products: [],
      search: '',
      optionsSelect: [],
      filterSelect: null,
      productSelected: {
        category: '',
        selected_ingredients: [],
        passage_sections: [],
      },
    }
  },
  computed: {
    ...mapGetters({
      productsStore: productStoreNames.getters.get,
      branchOfficesStore: branchOfficeStoreNames.getters.getBranchOffices,
    }),
  },
  async created() {
    if (!this.productsStore) {
      await this.loadProducts()
    }

    if (!this.branchOfficesStore) {
      await this.loadBranchOffices()
    }

    if (this.productsStore) {
      this.products = [...this.productsStore]
    }

    if (this.branchOfficesStore) {
      this.optionsSelect = this.branchOfficesStore.map((b) => ({
        name: `${b.name}, ${b.address}`,
        value: b.id,
      }))
      this.optionsSelect.unshift({
        name: 'Todas las sucursales',
        value: null,
        canSelected: true,
      })
    }
  },
  methods: {
    ...mapActions({
      loadProducts: productStoreNames.actions.load,
      loadBranchOffices: branchOfficeStoreNames.actions.load,
    }),
    openModalAddProduct() {
      this.$refs['modal-add-product'].open()
    },
    openModalEditProduct(product) {
      this.productSelected = product
      this.$refs['modal-edit-product'].open()
    },
    openModalDeleteProduct(product) {
      this.productSelected = product
      this.$refs['modal-delete-product'].open()
    },
    searchProduct() {
      if (this.filterSelect) {
        const products = (this.products = this.productsStore.filter(
          (p) => p.branch_office.id === this.filterSelect
        ))
        const search = normalizeText(this.search.toLowerCase())
        this.products = products.filter((product) => {
          const name = normalizeText(product.name.toLocaleLowerCase())
          return name.includes(search)
        })
      } else {
        const search = normalizeText(this.search.toLowerCase())
        this.products = this.productsStore.filter((product) => {
          const name = normalizeText(product.name.toLocaleLowerCase())
          return name.includes(search)
        })
      }
    },
    onChangeFilter() {
      if (this.filterSelect) {
        this.products = this.productsStore.filter(
          (p) => p.branch_office.id === this.filterSelect
        )
      } else {
        this.products = [...this.productsStore]
      }
      this.search = ''
    },
  },
  components: {
    EditIcon: () => import('@/static/icons/edit.svg?inline'),
    TrashIcon: () => import('@/static/icons/trash.svg?inline'),
    PlusIcon: () => import('@/static/icons/plus.svg?inline'),
    ModalAddProduct,
    ModalEditProduct,
    ModalDeleteProduct,
  },
  watch: {
    productsStore: {
      handler() {
        if (this.productsStore) {
          this.products = [...this.productsStore]
        }
      },
      inmediate: true,
    },
  },
}
</script>
