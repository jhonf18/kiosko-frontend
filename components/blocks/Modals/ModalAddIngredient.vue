<template>
  <Modal
    :id="`modal-${nameRef}-custom`"
    :ref="`modal-${nameRef}-custom`"
    title="Añadir ingrediente"
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
        label="Nombre del ingrediente"
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
  name: 'ModalAddCategory',
  data() {
    return {
      buttonText: 'Crear ingrediente',
      loading: false,
      nameRef: 'add-ingredient',
      ingredient: {
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
      addIngredient: ingredientStoreNames.mutations.add,
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
        const ingredient = await this.$ingredientRepository.create({
          name: this.ingredient.name,
          type: this.ingredient.type,
        })

        this.setLoading(false)
        this.emtpyFields()
        this.close()

        this.addIngredient(ingredient)
      } catch (err) {
        return this.exitProcess(formatErrorMessages(err.message))
      }
    },
    setLoading(state) {
      this.buttonText = state ? 'Creando ...' : 'Crear ingrediente'
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
    },
    close() {
      this.$refs[`modal-${this.nameRef}-custom`].closeByButton()
    },
  },
}
</script>
