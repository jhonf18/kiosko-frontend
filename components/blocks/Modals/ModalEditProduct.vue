<template>
  <Modal
    :id="`component-${nameRef}-${id}`"
    :ref="`component-${nameRef}-${id}`"
    size="lg"
    title="Editar producto"
    :footer="false"
  >
    <div class="grid md:grid-cols-2 gap-4 mb-4">
      <Input
        label="Nombre del producto"
        v-model="product.name"
        idInput="add-edit-name"
        validations="true"
        required="true"
        type="text"
        placeholder="Nombre"
        class="mb-2"
        size="md"
      ></Input>
      <Input
        label="Precio"
        v-model.trim="product.price"
        id-input="add-edit-price"
        type="number"
        required="true"
        validations="true"
        placeholder="50000"
        class="mb-2"
        size="md"
      ></Input>
      <SelectInput
        label="Categoría"
        :options="categories"
        v-model="product.category"
        class="w-full mb-2"
        @change="onSelectedCategory"
      ></SelectInput>
      <SelectInput
        label="Subcategoría"
        :options="subcategories"
        :disabled="!product.category"
        v-model="product.subcategory"
        class="w-full mb-2"
      ></SelectInput>
      <SelectInput
        label="Sucursal"
        :options="branchOffices"
        :disabled="true"
        v-model="product.branchOffice"
        class="w-full mb-2"
      ></SelectInput>
      <div>
        <label
          class="font-medium text-sm mb-1 text-gray-600"
          for="input-select-image"
        >
          Cambiar imagen
        </label>
        <span class="sr-only">Seleccionar imagen</span>
        <input
          type="file"
          id="input-select-image"
          accept=".jpeg,.jpg,.png,image/jpeg,image/png"
          aria-label="botón subir imagen"
          @change="onSelectImage"
          class="rounded cursor-pointer block w-full text-sm border text-gray-500 file:mr-2 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-white"
        />
      </div>
    </div>

    <CollapseContent
      title="Más opciones"
      class="mb-8 mt-4"
      ref="collapse-content-add-product"
    >
      <SearchPassingSectionsForm
        class="mb-6"
        :passingSections="product.passage_sections"
        @updateSelection="handlePassingSelection"
      ></SearchPassingSectionsForm>
      <SearchIngredientsForm
        :ingredientsSelectedStore="product.ingredients"
        class="col-span-full mb-6"
        @updateSelection="handleIngredientSelection"
      ></SearchIngredientsForm>
    </CollapseContent>

    <SummaryProduct :product="product"></SummaryProduct>

    <div class="flex justify-end mt-8 mb-2">
      <ButtonWithSpinner
        @click="createProduct"
        :loading="loading"
        :text="buttonText"
      ></ButtonWithSpinner>
    </div>
  </Modal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { formatErrorMessages } from '~/assets/utils/formatErrorMessage'
import CollapseContent from '~/components/special/CollapseContent.vue'
import SearchWithAutocomplete from '~/components/special/SearchWithAutocomplete.vue'
import { branchOfficeStoreNames } from '~/store/branchOffice'
import { categoryStoreNames } from '~/store/category'
import { generalStoreNames } from '~/store/general'
import { productStoreNames } from '~/store/product'
import SearchIngredientsForm from '../SearchIngredientsForm.vue'
import SearchPassingSectionsForm from '../SearchPassingSectionsForm.vue'
import SummaryProduct from '../SummaryProduct.vue'

export default {
  name: 'ModalEditProduct',
  props: {
    id: {
      type: String,
      required: true,
    },
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
        category: null,
        subcategory: null,
        branchOffice: null,
        imageFile: null,
        imagePreview: null,
        passage_sections: [],
        ingredients: [],
        branch_office: {},
      },
      categories: [],
      subcategories: [{ name: 'Subcategoría', value: null }],
      branchOffices: [],
      buttonText: 'Editar producto',
      loading: false,
      nameRef: 'modal-edit-product',
    }
  },
  components: {
    SearchWithAutocomplete,
    CollapseContent,
    SearchPassingSectionsForm,
    SearchIngredientsForm,
    SummaryProduct,
  },
  computed: {
    ...mapGetters({
      categoriesStore: categoryStoreNames.getters.get,
      branchOfficesStore: branchOfficeStoreNames.getters.getBranchOffices,
    }),
  },
  watch: {
    categoriesStore(newValue) {
      this.setCategories(newValue)
    },
    branchOfficesStore(newValue) {
      this.setBranchOffices(newValue)
    },
    productStore(newValue) {
      this.product = {
        ...newValue,
        ingredients: newValue.selected_ingredients,
        imagePreview: newValue.media_files[0],
        branchOffice: newValue.branch_office.id,
      }
      this.findCategoryId()
    },
  },
  methods: {
    ...mapActions({
      loadBranchOffices: branchOfficeStoreNames.actions.load,
      loadCategories: categoryStoreNames.actions.load,
    }),
    ...mapMutations({
      showToast: generalStoreNames.mutations.showToast,
      updateProduct: productStoreNames.mutations.update,
    }),
    async createProduct() {
      if (this.loading) return

      this.setLoading(true)

      if (!this.validationsOfFields()) {
        this.setLoading(false)
        return
      }

      try {
        // Upload image to cloudinary
        let urlImage
        if (this.product.imageFile) {
          urlImage = await this.$uploadImages(this.product.imageFile)
        }

        let ingredients = null

        if (this.product.ingredients.length > 0) {
          ingredients = this.product.ingredients.map((ingredient) => ({
            ingredient: ingredient.id,
            quantity: ingredient.quantity,
          }))
        }

        // Create product
        const product = await this.$productRepository.update(this.product.id, {
          name: this.product.name,
          price: Number(this.product.price),
          media_files: urlImage ? [urlImage] : [],
          active: true,
          category: this.product.category,
          subcategory: this.product.subcategory,
          branch_office: this.product.branch_office.id,
          passage_sections:
            this.product.passage_sections.length > 0
              ? this.product.passage_sections
              : null,
          selected_ingredients: ingredients,
        })
        // Add product to store
        this.updateProduct(product)
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
    setLoading(state) {
      if (state) this.buttonText = 'Editando ...'
      else this.buttonText = 'Editar producto'

      this.loading = state
    },
    validationsOfFields() {
      if (this.product.name === '') {
        this.showToast({
          type: 'error',
          text: 'El nombre del producto es requerido',
        })
        return false
      }
      if (this.product.price === 0) {
        this.showToast({
          type: 'error',
          text: 'El precio del producto es requerido',
        })
        return false
      }
      if (this.product.category === null) {
        this.showToast({
          type: 'error',
          text: 'La categoría del producto es requerida',
        })
        return false
      }
      if (this.product.subcategory === null) {
        this.showToast({
          type: 'error',
          text: 'La subcategoría del producto es requerida',
        })
        return false
      }
      if (this.product.branchOffice === null) {
        this.showToast({
          type: 'error',
          text: 'La sucursal del producto es requerida',
        })
        return false
      }

      return true
    },
    async onSelectImage(e) {
      const file = e.target.files[0]

      /* Make sure file exists */
      if (!file) return

      /* create a reader */
      const readData = (f) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onload = (e) => {
            this.product.imagePreview = reader.result
          }
          reader.readAsDataURL(f)
        })
      /* Read data */
      this.product.imageFile = await readData(file)
    },
    setBranchOffices(branchOffices) {
      branchOffices = branchOffices || []
      this.branchOffices = branchOffices.map((branchOffice) => {
        return {
          name: `${branchOffice.name}, ${branchOffice.address}`,
          value: branchOffice.id,
        }
      })

      this.branchOffices.unshift({
        name: 'Sucursales',
        value: null,
        selected: true,
      })
    },
    setCategories(categories) {
      const categoriesFilter = categories.map((c) => ({
        name: c.name,
        value: c.id,
      }))
      this.categories = [
        { name: 'Categoría', value: null },
        ...categoriesFilter,
      ]

      this.findCategoryId()
    },
    findCategoryId() {
      const regexExp =
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
      if (regexExp.test(this.product.category)) return

      if (this.categories.length > 1) {
        const category = this.categories.find(
          (c) => c.name === this.product.category
        )

        this.product.category = category ? category.value : null

        if (this.product.category) {
          this.onSelectedCategory()
        }
      }
    },
    onSelectedCategory() {
      const categorySelected = this.categoriesStore.find(
        (c) => c.id === this.product.category
      )

      if (categorySelected) {
        const subcategories = categorySelected.subcategories

        this.subcategories = subcategories.map((sub) => ({
          name: sub,
          value: sub,
        }))
        this.subcategories.unshift({
          name: `Subcategoría ${categorySelected.name}`,
          value: null,
        })
      }
    },
    handlePassingSelection(sections) {
      this.product.passage_sections = sections
      this.$refs['collapse-content-add-product'].resizeNow()
    },
    handleIngredientSelection(ingredients) {
      this.product.ingredients = ingredients
      this.$refs['collapse-content-add-product'].resizeNow()
    },
    async open() {
      this.$refs[`component-${this.nameRef}-${this.id}`].open()
      if (!this.categoriesStore) {
        await this.loadCategories()
      }

      if (!this.branchOfficesStore) {
        await this.loadBranchOffices()
      }

      this.setBranchOffices(this.branchOfficesStore)
      this.setCategories(this.categoriesStore)
    },
    close() {
      this.$refs[`component-${this.nameRef}-${this.id}`].closeByButton()
    },
  },
}
</script>
