<template>
  <Modal
    :id="`component-${nameRef}-${id}`"
    :ref="`component-${nameRef}-${id}`"
    size="lg"
    title="Añadir un nuevo producto"
    :footer="false"
  >
    <Message header="Aspectos que debes tener en cuenta" class="mb-4">
      <ol class="list-decimal ml-4">
        <li class="mb-2">
          Las <b>secciones de paso</b> (<i
            >se encuentra en la sección de más opciones</i
          >) son las secciones por las cuales el producto debe pasar para ser
          preparado. No es necesario añadir siempre estas secciones de paso si
          el producto no pasa por otra sección distinta a la categoría que
          pertenece.
        </li>
        <li>
          Para los jugos que tienen sus variaciones por cantidad es necesario
          que seguido del nombre se añada <i>" -- "</i> y posteriormente la
          respectiva cantidad. Por ejemplo: <i>"Jugo de naranja -- 1 Litro"</i>.
          Esto creará automaticamente una subcategoría para este producto
          agrupando por cantidad.
        </li>
      </ol>
    </Message>
    <div class="grid md:grid-cols-2 gap-4 mb-4">
      <Input
        label="Ingresa el nombre del producto"
        v-model="product.name"
        idInput="add-product-name"
        validations="true"
        required="true"
        type="text"
        placeholder="Nombre"
        class="mb-2"
        size="md"
      ></Input>
      <Input
        label="Ingresa el precio"
        v-model.trim="product.price"
        id-input="add-product-price"
        type="number"
        required="true"
        validations="true"
        placeholder="50000"
        class="mb-2"
        size="md"
      ></Input>
      <SelectInput
        label="Seleccionar categoría"
        :options="categories"
        v-model="product.category"
        class="w-full mb-2"
        @change="onSelectedCategory"
      ></SelectInput>
      <SelectInput
        label="Seleccionar subcategoría"
        :options="subcategories"
        :disabled="!product.category"
        v-model="product.subcategory"
        class="w-full mb-2"
      ></SelectInput>
      <SelectInput
        label="Seleccionar sucursal"
        :options="branchOffices"
        v-model="product.branchOffice"
        class="w-full mb-2"
      ></SelectInput>
      <div>
        <label
          class="font-medium text-sm mb-1 text-gray-600"
          for="input-select-image"
        >
          Selecionar imagen
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
        @updateSelection="handlePassingSelection"
      ></SearchPassingSectionsForm>
      <SearchIngredientsForm
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
  name: 'ModalAddProduct',
  props: {
    id: {
      type: String,
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
      },
      categories: [],
      subcategories: [{ name: 'Subcategoría', value: null }],
      branchOffices: [],
      buttonText: 'Crear producto',
      loading: false,
      nameRef: 'modal-add-product',
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
  },
  methods: {
    ...mapActions({
      loadBranchOffices: branchOfficeStoreNames.actions.load,
      loadCategories: categoryStoreNames.actions.load,
    }),
    ...mapMutations({
      showToast: generalStoreNames.mutations.showToast,
      addProduct: productStoreNames.mutations.add,
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
        const product = await this.$productRepository.create({
          name: this.product.name,
          price: Number(this.product.price),
          media_files: urlImage ? [urlImage] : [],
          active: true,
          category: this.product.category,
          subcategory: this.product.subcategory,
          branch_office: this.product.branchOffice,
          passage_sections:
            this.product.passage_sections.length > 0
              ? this.product.passage_sections
              : null,
          selected_ingredients: ingredients,
        })
        // Add product to store
        this.addProduct(product)
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
      if (state) this.buttonText = 'Creando ...'
      else this.buttonText = 'Crear producto'

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
