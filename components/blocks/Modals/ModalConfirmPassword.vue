<template>
  <Modal
    :id="`modal-confirm-password-${id}`"
    :ref="`modal-confirm-password-${id}`"
    :title="title ? title : 'Confirmar contraseña'"
    size="md"
    :footer="false"
  >
    <Input
      label="Ingresa la contraseña de tu cuenta"
      v-model="password"
      id-input="verify-password-for-confirm"
      type="password"
      placeholder="Contraseña"
      class="mb-4"
      size="md"
    ></Input>
    <div class="flex justify-end mt-8 mb-2">
      <ButtonWithSpinner
        @click="verifyPassword"
        :loading="loading"
        :text="button.text"
        variant="danger"
      ></ButtonWithSpinner>
    </div>
  </Modal>
</template>

<script>
import { mapMutations } from 'vuex'
import { generalStoreNames } from '~/store/general'

export default {
  name: 'ModalConfirmPassword',
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  data() {
    return {
      button: { text: 'Confirmar contraseña' },
      loading: false,
      password: '',
    }
  },
  methods: {
    ...mapMutations({
      showToast: generalStoreNames.mutations.showToast,
    }),
    async verifyPassword() {
      if (this.loading) return

      this.setLoading(true)

      if (this.password.length === 0) {
        this.showToast({
          text: 'Debes ingresar la contraseña',
          type: 'error',
          visibleTime: 3,
        })
        return this.setLoading(false)
      }

      try {
        const result = await this.$userRepository.verifyPassword(this.password)
        if (result.status === 'SUCCESS') {
          this.close()
          this.$emit('correctPassword')
        } else {
          this.showToast({
            text: result.message,
            type: 'error',
            visibleTime: 3,
          })
        }

        this.setLoading(false)
      } catch (err) {
        this.showToast({
          text: err.message,
          type: 'error',
          visibleTime: 3,
        })
        this.setLoading(false)
      }
    },
    setLoading(state) {
      this.loading = state
    },
    open() {
      this.$refs[`modal-confirm-password-${this.id}`].open()
    },
    close() {
      this.$refs[`modal-confirm-password-${this.id}`].closeByButton()
    },
  },
}
</script>
