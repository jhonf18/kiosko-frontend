<template>
  <div class="relative overflow-x-auto w-full max-w-full">
    <table class="w-full">
      <thead>
        <tr class="border-b border-t bg-gray-100">
          <th
            scope="col"
            class="text-left text-gray-700 font-medium uppercase text-sm p-4 min-w-[100px]"
          >
            Nombre
          </th>
          <th
            class="text-left text-gray-700 font-medium uppercase text-sm p-4 w-5/12"
          >
            Subcategorias
          </th>
          <th class="text-left text-gray-700 font-medium uppercase text-sm p-4">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody v-if="categoriesStore">
        <tr
          v-for="category in categoriesStore"
          class="border-b bg-white hover:bg-gray-100"
        >
          <td class="p-4">
            <div class="flex items-center font-semibold text-sm md:text-base">
              {{ category.name }}
            </div>
          </td>

          <td class="p-4">
            <span
              v-if="category.subcategories && category.subcategories.length > 0"
            >
              <ul>
                <li
                  v-for="subcategoryName in category.subcategories"
                  class="flex items-center"
                >
                  <CheckIcon
                    class="w-4 h-4 stroke-primary-dark mr-2"
                  ></CheckIcon>
                  {{ subcategoryName }}
                </li>
              </ul>
            </span>
            <span v-else> No hay subcategorias creadas </span>
          </td>

          <td class="p-4">
            <div class="flex items-center">
              <Button
                size="sm"
                variant="primary"
                class="mr-3"
                @click="openEditModal(category)"
              >
                <span class="flex w-full items-center">
                  <EditIcon class="w-4 h-4 lg:w-5 lg:h-5"></EditIcon>
                  <span class="hidden lg:block">
                    Editar
                    <span class="hidden xl:inline-block">categoría</span>
                  </span>
                </span>
              </Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <ModalEditCategory
      :categoryForEdit="categoryForEdit"
      ref="modal-edit-category"
    ></ModalEditCategory>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { categoryStoreNames } from '~/store/category'
import ModalEditCategory from '../Modals/ModalEditCategory.vue'

export default {
  name: 'CategoriesTable',
  async created() {
    if (!this.categoriesStore) this.loadCategories()
  },
  data() {
    return {
      categoryForEdit: {
        id: '',
        name: '',
        subcategories: [],
      },
    }
  },
  components: {
    EditIcon: () => import('@/static/icons/edit.svg?inline'),
    CheckIcon: () => import('@/static/icons/check.svg?inline'),
    ModalEditCategory,
  },
  methods: {
    ...mapActions({
      loadCategories: categoryStoreNames.actions.load,
    }),
    openEditModal(category) {
      this.categoryForEdit = category
      this.$refs['modal-edit-category'].open()
    },
  },
  computed: {
    ...mapGetters({
      categoriesStore: categoryStoreNames.getters.get,
    }),
  },
}
</script>
