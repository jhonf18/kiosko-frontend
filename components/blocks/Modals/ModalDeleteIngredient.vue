<template>
  <Modal
    :id="`modal-${nameRef}-custom`"
    :ref="`modal-${nameRef}-custom`"
    title="Eliminar ingrediente"
    size="lg"
    :footer="false"
  >
    <Message header="Importante" variant="danger" class="mb-4">
      Este es un proceso irreversible, afectaría a los productos que estén
      relacionados a este ingrediente ¿estás seguro de borrar el ingrediente?
    </Message>
    <h5 class="mb-2 font-medium">Datos básicos</h5>
    <div class="grid lg:grid-cols-2 gap-4 mb-4">
      <Input
        v-model.trim="ingredient.name"
        id-input="input-category-name"
        type="text"
        placeholder="Categoría ...."
        label="Nombre del ingrediente"
        :disabled="true"
      ></Input>
      <SelectInput
        label="Tipo de ingrediente"
        :disabled="true"
        :options="optionsSelect"
        v-model="ingredient.type"
      ></SelectInput>
    </div>
    <div class="flex justify-end mt-8 mb-2">
      <ButtonWithSpinner
        @click="$refs['modal-confirm-pwd-for-delete-ingredient'].open()"
        :loading="loading"
        :text="buttonText"
        variant="danger"
      ></ButtonWithSpinner>
    </div>
    <ModalConfirmPassword
      id="modal-confirm-pwd-for-delete-ingredient"
      ref="modal-confirm-pwd-for-delete-ingredient"
      @correctPassword="deleteIngredient"
    ></ModalConfirmPassword>
  </Modal>
</template>

<script>
import { mapMutations } from 'vuex'
import { formatErrorMessages } from '~/assets/utils/formatErrorMessage'
import { generalStoreNames } from '~/store/general'
import { ingredientStoreNames } from '~/store/ingredient'
import ModalConfirmPassword from './ModalConfirmPassword.vue'

export default {
  name: 'ModalAddCategory',
  props: {
    ingredient: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      buttonText: 'Eliminar ingrediente',
      loading: false,
      nameRef: 'delete-ingredient',
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
      deleteIngredientStore: ingredientStoreNames.mutations.delete,
    }),
    async deleteIngredient() {
      if (this.loading) return
      this.setLoading(true)

      try {
        const result = await this.$ingredientRepository.delete(
          this.ingredient.id
        )
        this.setLoading(false)
        this.close()
        this.deleteIngredientStore({ ingredientID: this.ingredient.id })
      } catch (err) {
        return this.exitProcess(formatErrorMessages(err.message))
      }
    },
    setLoading(state) {
      this.buttonText = state ? 'Eliminando ...' : 'Eliminar ingrediente'
      this.loading = state
    },
    exitProcess(msg) {
      this.showToast({ text: msg })
      this.setLoading(false)
    },
    open() {
      this.$refs[`modal-${this.nameRef}-custom`].open()
    },
    close() {
      this.$refs[`modal-${this.nameRef}-custom`].closeByButton()
    },
  },
  components: { ModalConfirmPassword },
}
</script>
