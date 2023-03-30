<template>
  <div class="px-6 py-4">
    <h2 class="text-xl font-semibold mb-4">Cambiar contraseña</h2>
    <Message header="Editar perfil" class="mb-4">
      En esta sección puedes cambiar tu nombre y/o la contraseña.
    </Message>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <Input
        label="Nombre"
        v-model="user.name"
        idInput="edit-user-name"
        validations="true"
        required="true"
        typeValidation="name"
        type="text"
        placeholder="Nombre"
        invalidMessage="El nombre ingresado no es válido."
        size="md"
      ></Input>
      <Input
        label="Email del empleado"
        v-model.trim="user.email"
        id-input="edit-user-email"
        :disabled="true"
        type="email"
        placeholder="example@kioksollanero.com"
        size="md"
      ></Input>
      <Input
        label="Nombre de usuario del empleado"
        v-model.trim="user.nickname"
        id-input="edit-user-nickname"
        :disabled="true"
        type="text"
        typeValidation="name"
        placeholder="example@kioksollanero.com"
        size="md"
      ></Input>
      <div class="w-full border-t col-span-2 mt-2">
        <h5 class="font-medium mt-4">Cambiar contraseña</h5>
      </div>
      <Input
        label="Contraseña "
        placeholder="Contraseña"
        v-model.trim="user.password_1"
        :password="user.password_2"
        idInput="edit-user-password-1"
        validations="true"
        type="password"
        typeValidation="password"
        invalidMessage="La contraseña es muy débil."
        size="md"
      ></Input>
      <Input
        label="Repetir contraseña"
        placeholder="Repetir contraseña"
        v-model.trim="user.password_2"
        idInput="edit-user-password-2"
        validations="true"
        :password="user.password_1"
        type="password"
        typeValidation="password"
        invalidMessage="La contraseña es muy débil."
        size="md"
      ></Input>
    </div>
    <div class="flex justify-end mt-8 mb-2">
      <ButtonWithSpinner
        @click="openModalConfirmPassword"
        :loading="loading"
        :text="buttonText"
      ></ButtonWithSpinner>
    </div>
    <ModalConfirmPassword
      id="modal-confirm-pwd-for-update-user"
      ref="modal-confirm-pwd-for-update-user"
      @correctPassword="editUser"
      title="Ingresa tu contraseña actual"
    ></ModalConfirmPassword>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { formatErrorMessages } from '~/assets/utils/formatErrorMessage'
import ModalConfirmPassword from '~/components/blocks/Modals/ModalConfirmPassword.vue'
import { generalStoreNames } from '~/store/general'
import { userStoreNames } from '~/store/user'

export default {
  name: 'SettingsPage',
  layout: 'dashboard',
  data() {
    return {
      loading: false,
      buttonText: 'Editar perfil',
      user: {
        name: '',
        nickname: '',
        email: '',
        password_1: '',
        password_2: '',
      },
      roles: [],
    }
  },
  components: {
    ModalConfirmPassword,
  },
  mounted() {
    this.setRoles(this.rolesStore)
    this.user = { ...this.$auth.user }
  },
  computed: {
    ...mapGetters({
      rolesStore: userStoreNames.getters.getRoles,
    }),
  },
  methods: {
    ...mapMutations({
      showToast: generalStoreNames.mutations.showToast,
    }),
    setRoles(roles) {
      this.roles = [{ name: 'Roles', value: null, selected: true }, ...roles]
    },
    async editUser() {
      if (this.loading) return

      this.setLoading(true)

      if (!this.user.name || this.user.name.length === 0) {
        this.showToast({
          text: 'El nombre no puede estar vacío.',
          type: 'error',
        })
        this.setLoading(false)
        return
      }

      let password = null
      if (this.user.password_1 && this.user.password_2) {
        if (this.user.password_1 !== this.user.password_2) {
          this.showToast({
            text: 'Las contraseñas son distintas.',
            type: 'error',
          })
          this.setLoading(false)
          return
        }

        password = this.user.password_1
      }

      password = password && password.length > 0 ? password : null

      try {
        await this.$userRepository.update(this.$auth.user.id, {
          name: this.user.name,
          password,
          role: this.$auth.user.role,
          active: true,
        })

        await this.$auth.fetchUser()

        this.showToast({
          text: 'Se ha actualizado el usuario satisfactoriamente.',
          type: 'success',
          visibleTime: 2,
        })
        this.setLoading(false)
      } catch (err) {
        this.showToast({
          text: formatErrorMessages(err.message),
          type: 'error',
          visibleTime: 3,
        })
        return this.setLoading(false)
      }
    },
    openModalConfirmPassword() {
      this.$refs['modal-confirm-pwd-for-update-user'].open()
    },
    setLoading(state) {
      this.buttonText = state ? 'Editando ...' : 'Editar perfil'
      this.loading = state
    },
  },
  watch: {
    rolesStore(newValue) {
      this.setRoles(newValue)
    },
  },
}
</script>
