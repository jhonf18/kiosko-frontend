<template>
  <div>
    <div class="grid md:grid-cols-2 gap-4">
      <SearchWithAutocomplete
        :items="ingredients"
        label="Ingresa los ingredientes"
        placeholder="Salsa ..."
        @selectedItem="onSelectedIngredient"
        :cleanFieldAutomatic="false"
        ref="search-autocomplete-ingredient"
      ></SearchWithAutocomplete>
      <div class="flex items-center justify-between">
        <Input
          label="Cantidad del ingrediente"
          v-model.trim="quantity"
          id-input="add-product-quantity-ingredient"
          type="text"
          placeholder="650 gr"
          class="mb-2 w-full"
          size="md"
        ></Input>
        <div class="flex">
          <Button
            variant="primary"
            size="md"
            class="-ml-2 mt-4"
            @click="addIngredient"
          >
            Agregar
          </Button>
        </div>
      </div>
    </div>
    <div>
      <ul>
        <li
          v-for="ingredient in ingredientsSelected"
          :key="ingredient.id"
          class="flex items-center justify-between px-3 py-3 rounded hover:bg-gray-100"
        >
          <span class="flex items-center">
            <CheckIcon class="w-4 h-4 stroke-primary-dark mr-1"></CheckIcon>
            {{ ingredient.quantity ? `${ingredient.quantity} de ` : '' }}
            {{ ingredient.name }}
          </span>
          <TrashIcon
            @click="onDeleteIngredient(ingredient)"
            class="!w-5 !h-5 stroke-red-600 cursor-pointer"
          ></TrashIcon>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ingredientStoreNames } from '~/store/ingredient'
import SearchWithAutocomplete from '../special/SearchWithAutocomplete.vue'

export default {
  name: 'SearchIngredientsForm',
  data() {
    return {
      quantity: '',
      ingredients: [],
      ingredientsSelected: [],
      ingredientSelected: {},
    }
  },
  computed: {
    ...mapGetters({
      ingredientsStore: ingredientStoreNames.getters.get,
    }),
  },
  components: {
    SearchWithAutocomplete,
    TrashIcon: () => import('@/static/icons/trash.svg?inline'),
    CheckIcon: () => import('@/static/icons/check.svg?inline'),
  },
  methods: {
    ...mapActions({
      loadIngredients: ingredientStoreNames.actions.load,
    }),
    onSelectedIngredient(item) {
      const ingredient = this.ingredientsSelected.find(
        (ingredient) => ingredient.id === item.id
      )
      if (ingredient) {
        this.$refs['search-autocomplete-ingredient'].reset()
      } else {
        this.ingredientSelected = { ...item }
      }
    },
    onDeleteIngredient(ingredient) {
      const index = this.ingredientsSelected.findIndex(
        (item) => item.id !== ingredient.id
      )

      this.ingredientsSelected.splice(index, 1)
      const ingredientsWithFormat = this.formatIngredients()

      this.$emit('updateSelection', ingredientsWithFormat)
    },
    addIngredient() {
      const indexIngredient = this.ingredientsSelected.findIndex(
        (ingredient) => ingredient.id === this.ingredientSelected.id
      )

      if (indexIngredient < 0) {
        this.ingredientsSelected.push({
          ...this.ingredientSelected,
          quantity: this.quantity ? this.quantity : null,
        })

        const ingredientsWithFormat = this.formatIngredients()

        this.$emit('updateSelection', ingredientsWithFormat)
      }

      this.$refs['search-autocomplete-ingredient'].reset()
      this.quantity = ''
    },
    formatIngredients() {
      return this.ingredientsSelected.map((ingredient) => {
        return {
          ingredient: ingredient.id,
          quantity: ingredient.quantity || null,
        }
      })
    },
  },
  async created() {
    if (!this.ingredientsStore) await this.loadIngredients()
    this.ingredients = [...this.ingredientsStore]
  },
  watch: {
    ingredientsStore() {
      this.ingredients = [...this.ingredientsStore]
    },
  },
}
</script>
