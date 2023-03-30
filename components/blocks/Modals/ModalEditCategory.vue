<template>
  <Modal
    :id="`modal-${nameRef}-custom`"
    :ref="`modal-${nameRef}-custom`"
    title="Editar categoría"
    size="lg"
    :footer="false"
  >
    <Message header="Recuerda" class="mb-4">
      Para agregar subcategorías solo debes escribirla y presionar
      <i>enter</i> para que sea agregada.
    </Message>
    <h5 class="mb-2 font-medium">Datos básicos</h5>
    <div class="grid lg:grid-cols-2 gap-4 mb-4">
      <Input
        v-model.trim="category.name"
        id-input="input-category-name"
        type="text"
        placeholder="Categoría ...."
        label="Nombre"
      ></Input>
      <Input
        v-model.trim="category.subcategoryText"
        id-input="input-subcategory"
        type="text"
        placeholder="Ingresar subcategoría"
        label="Nombre de la subcategoría"
        @keyDownEnter="addSubcategory"
      ></Input>
    </div>
    <div class="mt-7">
      <div v-if="category.subcategories.length === 0" class="text-center">
        <h5 class="font-semibold text-lg">No hay subcategorías agregadas</h5>
      </div>
      <div v-else class="px-4 lg:px-6">
        <h4 class="font-medium text-lg mb-2">Subcategorías agregadas</h4>
        <ul>
          <li
            v-for="subcategoryName in category.subcategories"
            class="flex items-center justify-between px-3 py-3 rounded hover:bg-gray-100"
          >
            <span class="flex items-center">
              <CheckIcon class="w-4 h-4 stroke-primary-dark mr-1"></CheckIcon>
              {{ subcategoryName }}
            </span>
            <TrashIcon
              @click="deleteSubcategory(subcategoryName)"
              class="!w-5 !h-5 stroke-red-600 cursor-pointer"
            ></TrashIcon>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex justify-end mt-8 mb-2">
      <ButtonWithSpinner
        @click="editCategory"
        :loading="loading"
        :text="buttonText"
      ></ButtonWithSpinner>
    </div>
  </Modal>
</template>

<script>
import { mapMutations } from 'vuex'
import { formatErrorMessages } from '~/assets/utils/formatErrorMessage'
import { categoryStoreNames } from '~/store/category'
import { generalStoreNames } from '~/store/general'

export default {
  name: 'ModalEditCategory',
  props: {
    categoryForEdit: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      buttonText: 'Editar categoría',
      loading: false,
      nameRef: 'edit-category',
      category: {
        id: '',
        name: '',
        subcategoryText: '',
        subcategories: [],
      },
    }
  },
  components: {
    CheckIcon: () => import('@/static/icons/check.svg?inline'),
    TrashIcon: () => import('@/static/icons/trash.svg?inline'),
  },
  methods: {
    ...mapMutations({
      showToast: generalStoreNames.mutations.showToast,
      updateCategoryStore: categoryStoreNames.mutations.update,
    }),
    async editCategory() {
      if (this.loading) return

      this.setLoading(true)

      if (this.category.name.length === 0) {
        return this.exitProcess('Debes ingresar el nombre de la categoría')
      }

      if (this.category.subcategories.length === 0) {
        return this.exitProcess('Debes añadir al menos una subcategoría')
      }

      try {
        const category = await this.$categoryRepository.update(
          this.category.id,
          {
            name: this.category.name,
            subcategories: this.category.subcategories,
          }
        )

        this.setLoading(false)
        this.emtpyFields()
        this.close()

        this.updateCategoryStore(category)
      } catch (err) {
        return this.exitProcess(formatErrorMessages(err.message))
      }
    },
    addSubcategory() {
      this.category.subcategories.push(this.category.subcategoryText)
      this.category.subcategoryText = ''
    },
    deleteSubcategory(name) {
      const index = this.category.subcategories.findIndex((n) => n === name)
      this.category.subcategories.splice(index, 1)
    },
    setLoading(state) {
      this.buttonText = state ? 'Editando ...' : 'Editar categoría'
      this.loading = state
    },
    exitProcess(msg) {
      this.showToast({ text: msg })
      this.setLoading(false)
    },
    emtpyFields() {
      this.category = { name: '', subcategoryText: '', subcategories: [] }
    },
    open() {
      this.$refs[`modal-${this.nameRef}-custom`].open()
      this.category = { ...this.categoryForEdit, subcategoryText: '' }
      this.category.subcategories = [...this.categoryForEdit.subcategories]
    },
    close() {
      this.$refs[`modal-${this.nameRef}-custom`].closeByButton()
    },
  },
  watch: {
    categoryForEdit: {
      handler() {
        this.category = { ...this.categoryForEdit, subcategoryText: '' }
        this.category.subcategories = [...this.categoryForEdit.subcategories]
      },
      inmediate: true,
    },
  },
}
</script>
