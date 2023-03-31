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
                  @click="openEditModal(ingredient)"
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
                  @click="openDeleteModal(ingredient)"
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
        v-if="!ingredients || ingredients.length === 0"
      >
        <h5>
          {{
            search.length > 0
              ? `No hay ingredientes con el nombre ${search}.`
              : 'No hay ingredientes.'
          }}
        </h5>
      </div>
    </div>
    <ModalAddIngredient ref="modal-add-ingredient"></ModalAddIngredient>
    <ModalEditIngredient
      ref="modal-edit-ingredient"
      :ingredientForEdit="ingredientForEdit"
    ></ModalEditIngredient>
    <ModalDeleteIngredient
      ref="modal-delete-ingredient"
      :ingredient="ingredientForEdit"
    ></ModalDeleteIngredient>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { normalizeText } from '~/assets/utils/normalize'
import { ingredientStoreNames } from '~/store/ingredient'
import ModalAddIngredient from '../Modals/ModalAddIngredient.vue'
import ModalDeleteIngredient from '../Modals/ModalDeleteIngredient.vue'
import ModalEditIngredient from '../Modals/ModalEditIngredient.vue'

export default {
  name: 'IngredientsManagmentTable',
  data() {
    return {
      ingredients: [],
      search: '',
      ingredientForEdit: { name: '', type: null },
    }
  },
  async created() {
    if (!this.ingredientsStore) await this.loadIngredients()

    this.ingredients = this.ingredientsStore
  },
  components: {
    PlusIcon: () => import('@/static/icons/plus.svg?inline'),
    EditIcon: () => import('@/static/icons/edit.svg?inline'),
    CheckIcon: () => import('@/static/icons/check.svg?inline'),
    TrashIcon: () => import('@/static/icons/trash.svg?inline'),
    ModalEditIngredient,
    ModalAddIngredient,
    ModalDeleteIngredient,
  },
  methods: {
    ...mapActions({
      loadIngredients: ingredientStoreNames.actions.load,
    }),
    searchIngredient() {
      // TODO: Limpiar parametro de busqueda al dar click en la x, también despues de editar el perfil
      const search = normalizeText(this.search.toLowerCase())
      this.ingredients = this.ingredientsStore.filter((ingredient) => {
        const name = normalizeText(ingredient.name.toLocaleLowerCase())
        return name.includes(search)
      })
    },
    openModalAddIngredient() {
      this.$refs['modal-add-ingredient'].open()
    },
    openDeleteModal(ingredient) {
      this.ingredientForEdit = ingredient
      this.$refs['modal-delete-ingredient'].open()
    },
    openEditModal(ingredient) {
      this.ingredientForEdit = ingredient
      this.$refs['modal-edit-ingredient'].open()
    },
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
