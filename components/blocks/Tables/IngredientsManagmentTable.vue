<template>
  <div>
    <div class="flex justify-between w-full px-4 mb-4">
      <Input
        type="search"
        idInput="search-ingredient"
        v-model="search"
        placeholder="Buscar ingrediente"
        @keyUp="searchIngredient"
      ></Input>
      <Button size="sm" variant="primary" @click="openModalAddIngredient">
        <span class="flex items-center w-full">
          <PlusIcon></PlusIcon>
          Agregar ingrediente
        </span>
      </Button>
    </div>
    <div class="relative overflow-x-auto w-full max-w-full mb-7">
      <table class="w-full">
        <thead>
          <tr class="border-b border-t bg-gray-100">
            <th
              scope="col"
              class="text-left text-gray-700 font-medium uppercase text-sm p-4 w-5/12 min-w-[100px]"
            >
              Nombre
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm p-4"
            >
              Tipo de ingrediente
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm p-4"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody v-if="ingredients && ingredients.length > 0">
          <tr
            v-for="ingredient in ingredients"
            :key="ingredient.id"
            class="border-b bg-white hover:bg-gray-100"
          >
            <td class="p-4">
              <div class="flex items-center font-semibold text-sm md:text-base">
                {{ ingredient.name }}
              </div>
            </td>

            <td class="p-4">
              {{ ingredient.type }}
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
                      <span class="hidden xl:inline-block">ingrediente</span>
                    </span>
                  </span>
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  @click="openDeleteModal(branchOffice)"
                >
                  <span class="flex w-full items-center">
                    <TrashIcon class="w-4 h-4 lg:w-5 lg:h-5"></TrashIcon>
                    <span class="hidden lg:block">
                      Eliminar
                      <span class="hidden xl:inline-block">ingrediente</span>
                    </span>
                  </span>
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        class="w-full p-6 text-center font-semibold"
        v-if="!ingredients || ingredients.length === 0">
        <h5>
          {{
            search.length > 0
              ? `No hay ingredientes con el nombre ${search}.`
              : 'No hay ingredientes.'
          }}
        </h5>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { normalizeText } from '~/assets/utils/normalize'
import { ingredientStoreNames } from '~/store/ingredient'

export default {
  name: 'IngredientsManagmentTable',
  data() {
    return { ingredients: [], search: '' }
  },
  async created() {
    if (!this.ingredientsStore) this.loadIngredients()
  },
  components: {
    PlusIcon: () => import('@/static/icons/plus.svg?inline'),
    EditIcon: () => import('@/static/icons/edit.svg?inline'),
    CheckIcon: () => import('@/static/icons/check.svg?inline'),
    TrashIcon: () => import('@/static/icons/trash.svg?inline'),
  },
  methods: {
    ...mapActions({
      loadIngredients: ingredientStoreNames.actions.load,
    }),
    searchIngredient() {
      const search = normalizeText(this.search.toLowerCase())
      this.ingredients = this.ingredientsStore.filter((ingredient) => {
        const name = normalizeText(ingredient.name.toLocaleLowerCase())
        return name.includes(search)
      })
    },
    openModalAddIngredient() {},
    openDeleteModal() {},
    openEditModal() {},
  },
  computed: {
    ...mapGetters({
      ingredientsStore: ingredientStoreNames.getters.get,
    }),
  },
  watch: {
    ingredientsStore: {
      handler() {
        if (this.ingredientsStore) this.ingredients = this.ingredientsStore
      },
      inmediate: true,
    },
  },
}
</script>
