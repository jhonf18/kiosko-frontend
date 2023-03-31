<template>
  <Modal
    :id="`modal-${nameRef}-custom`"
    :ref="`modal-${nameRef}-custom`"
    title="Editar ingrediente"
    size="lg"
    :footer="false"
  >
    <h5 class="mb-2 font-medium">Datos básicos</h5>
    <div class="grid lg:grid-cols-2 gap-4 mb-4">
      <Input
        v-model.trim="ingredient.name"
        id-input="input-category-name"
        type="text"
        placeholder="Categoría ...."
        label="Nombre"
      ></Input>
      <SelectInput
        label="Tipo de ingrediente"
        :options="optionsSelect"
        v-model="ingredient.type"
      ></SelectInput>
    </div>
    <div class="flex justify-end mt-8 mb-2">
      <ButtonWithSpinner
        @click="editIngredient"
        :loading="loading"
        :text="buttonText"
      ></ButtonWithSpinner>
    </div>
  </Modal>
</template>

<script>
import { mapMutations } from 'vuex'
import { formatErrorMessages } from '~/assets/utils/formatErrorMessage'
import { generalStoreNames } from '~/store/general'
import { ingredientStoreNames } from '~/store/ingredient'

export default {
  name: 'ModalEditCategory',
  props: {
    ingredientForEdit: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      buttonText: 'Editar ingrediente',
      loading: false,
      nameRef: 'edit-ingredient',
      ingredient: {
        id: '',
        name: '',
        type: null,
      },
      optionsSelect: [
        { name: 'Tipo de ingrediente', value: null },
        { name: 'PROTEÍNA', value: 'PROTEÍNA' },
        { name: 'COSEPAN', value: 'COSEPAN' },
        { name: 'OTROS', value: 'OTROS' },
      ],
    }
  },
  methods: {
    ...mapMutations({
      showToast: generalStoreNames.mutations.showToast,
      updateIngredient: ingredientStoreNames.mutations.update,
    }),
    async editIngredient() {
      if (this.loading) return

      this.setLoading(true)

      if (this.ingredient.name.length === 0) {
        return this.exitProcess('Debes ingresar el nombre del ingrediente')
      }

      if (!this.ingredient.type) {
        return this.exitProcess('Debes ingresar el tipo de ingrediente')
      }

      try {
        const ingredient = await this.$ingredientRepository.update(
          this.ingredient.id,
          {
            name: this.ingredient.name,
            type: this.ingredient.type,
          }
        )

        this.setLoading(false)
        this.emtpyFields()
        this.close()

        this.updateIngredient(ingredient)
      } catch (err) {
        return this.exitProcess(formatErrorMessages(err.message))
      }
    },
    setLoading(state) {
      this.buttonText = state ? 'Editando ...' : 'Editar ingrediente'
      this.loading = state
    },
    exitProcess(msg) {
      this.showToast({ text: msg })
      this.setLoading(false)
    },
    emtpyFields() {
      this.ingredient = { name: '', type: null }
    },
    open() {
      this.$refs[`modal-${this.nameRef}-custom`].open()
      this.ingredient = { ...this.ingredientForEdit }
    },
    close() {
      this.$refs[`modal-${this.nameRef}-custom`].closeByButton()
    },
  },
  watch: {
    ingredientForEdit: {
      handler() {
        this.ingredient = { ...this.ingredientForEdit }
      },
      inmediate: true,
    },
  },
}
</script>
