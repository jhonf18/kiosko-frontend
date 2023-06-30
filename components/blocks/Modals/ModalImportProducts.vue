<template>
  <Modal
    :id="`${nameRef}`"
    :ref="`${nameRef}`"
    title="Importar producto"
    size="lg"
    :footer="false"
  >
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
                  @click="importProduct(product)"
                >
                  <span class="flex w-full items-center">
                    <span class="hidden lg:block"> Seleccionar </span>
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
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { productStoreNames } from '~/store/product'

export default {
  name: 'ModalImportProducts',
  data() {
    return {
      nameRef: 'component-modal-import-products',
      products: [],
    }
  },
  mounted() {
    if (this.productsStore && this.productsStore.length > 0) {
      this.products = [...this.productsStore]
    }
  },
  computed: {
    ...mapGetters({
      productsStore: productStoreNames.getters.get,
    }),
  },
  methods: {
    open() {
      this.$refs[`${this.nameRef}`].open()
      this.products = [...this.productsStore]
    },
    close() {
      this.$refs[`${this.nameRef}`].closeByButton()
    },
    importProduct(product) {
      this.$emit('importProduct', product)
      this.close()
    },
  },
  watch: {
    productsStore(newVal) {
      console.log(newVal)
      this.products = newVal
    },
  },
}
</script>
