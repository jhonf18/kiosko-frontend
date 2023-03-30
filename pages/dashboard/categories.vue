<template>
  <div>
    <div class="mb-4 px-4 pt-4">
      <h2 class="text-xl font-semibold">Categorias de productos</h2>
      <div class="flex justify-end w-full">
        <Button size="sm" variant="primary" @click="openModalAddCategory">
          <span class="flex items-center w-full">
            <PlusIcon></PlusIcon>
            Agregar categoría
          </span>
        </Button>
      </div>
    </div>

    <CategoriesManagmentTable class="mb-6"></CategoriesManagmentTable>

    <div class="mb-4 px-4 pt-4">
      <h2 class="text-xl font-semibold">Ingredientes</h2>
    </div>
    <ModalAddCategory ref="modal-add-category"></ModalAddCategory>
    <IngredientsManagmentTable></IngredientsManagmentTable>
  </div>
</template>

<script>
import ModalAddCategory from '~/components/blocks/Modals/ModalAddCategory.vue'
import CategoriesManagmentTable from '~/components/blocks/Tables/CategoriesManagmentTable.vue'
import IngredientsManagmentTable from '~/components/blocks/Tables/IngredientsManagmentTable.vue'

export default {
  layout: 'dashboard',
  components: {
    PlusIcon: () => import('@/static/icons/plus.svg?inline'),
    CategoriesManagmentTable,
    IngredientsManagmentTable,
    ModalAddCategory,
  },
  methods: {
    openModalAddCategory() {
      this.$refs['modal-add-category'].open()
    },
    openModalAddIngredient() {},
  },
}
</script>
