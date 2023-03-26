<template>
  <Modal
    :id="`modal-${nameRef}-${id}`"
    :ref="`modal-${nameRef}-${id}`"
    title="Eliminar sucursal"
    size="lg"
    :footer="false"
  >
    <Message header="Eliminar cuenta" variant="danger" class="mb-4">
      Este es un proceso irreversible, ¿estás seguro de borrar el usuario?
    </Message>
    <h5 class="font-medium mb-3">Datos del usuario</h5>
    <ul class="max-w-md space-y-1 list-disc list-inside mb-4 text-sm">
      <li v-for="(value, key, index) in userForShow" :key="index">
        <span class="uppercase font-medium">{{ value.text }}: </span>
        <span v-if="key !== 'role'">
          {{ value.content }}
        </span>
        <span v-else>{{ value.content | roleName }}</span>
      </li>
    </ul>
    <div class="flex justify-end mt-8 mb-2">
      <ButtonWithSpinner
        @click="openModalConfirmPassword"
        :loading="loading"
        :text="button.text"
        variant="danger"
      ></ButtonWithSpinner>
    </div>
    <ModalConfirmPassword
      id="branch-office"
      ref="modal-confirm-pwd-for-delete-user"
      @correctPassword="deleteUser"
    ></ModalConfirmPassword>
  </Modal>
</template>

<script>
import { mapMutations } from 'vuex'
import { branchOfficeStoreNames } from '~/store/branchOffice'
import { generalStoreNames } from '~/store/general'
import { userStoreNames } from '~/store/user'
import ModalConfirmPassword from './ModalConfirmPassword.vue'
const nameRef = 'delete-user'

export default {
  name: 'ModalDeleteBranchOffice',
  props: {
    id: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      default: (rawProps) => {
        return {
          name: '',
          nickname: '',
          email: '',
          branch_office: {},
          role: '',
        }
      },
      required: true,
    },
  },
  data() {
    return {
      button: {
        text: 'Eliminar usuario',
      },
      nameRef,
      loading: false,
      userForShow: {
        name: { content: '', text: '' },
        nickname: { content: '', text: '' },
        email: { content: '', text: '' },
        role: { content: '', text: '' },
        branch_office: { content: {}, text: '' },
      },
    }
  },
  methods: {
    ...mapMutations({
      showToast: generalStoreNames.mutations.showToast,
      deleteEmployee: branchOfficeStoreNames.mutations.deleteEmployee,
      deleteUserStore: userStoreNames.mutations.delete,
    }),
    async deleteUser() {
      if (this.loading) return

      this.isLoading(true)

      try {
        await this.$userRepository.delete(this.user.id)

        if (this.user.branch_office) {
          this.deleteEmployee({
            userID: this.user.id,
            branchOfficeID: this.user.branch_office.id,
          })
        }

        this.deleteUserStore({ userID: this.user.id })

        this.showToast({
          text: 'Se ha eliminado el usuario satisfactoriamente.',
          type: 'success',
          visibleTime: 2,
        })
      } catch (err) {
        this.showToast({
          text: err.message,
          type: 'error',
          visibleTime: 3,
        })
        this.isLoading(false)
      }

      setTimeout(() => {
        this.close()
      }, 2000)
    },
    openModalConfirmPassword() {
      if (this.loading) return
      this.$refs['modal-confirm-pwd-for-delete-user'].open()
    },
    isLoading(state) {
      if (state) this.button.text = 'Eliminando ...'
      else this.button.text = 'Eliminar usuario'
      this.loading = state
    },
    open() {
      this.$refs[`modal-${this.nameRef}-${this.id}`].open()
    },
    close() {
      this.$refs[`modal-${this.nameRef}-${this.id}`].closeByButton()
    },
  },
  components: { ModalConfirmPassword },
  watch: {
    user: {
      handler() {
        const namesOfKeys = [
          { text: 'name', changeTo: 'Nombre' },
          { text: 'email', changeTo: 'Email' },
          { text: 'branch_office', changeTo: 'Sucursal' },
          { text: 'role', changeTo: 'Rol' },
          { text: 'active', changeTo: 'Estado' },
        ]
        let userForShow = {}
        Object.entries(this.user).map(([key, value]) => {
          const nameOfKey = namesOfKeys.find((e) => e.text === key)

          if (nameOfKey) {
            userForShow[key] = { text: nameOfKey.changeTo, content: value }
            if (key === 'branch_office') {
              userForShow[key].content = !value ? 'No asignada' : value.name
              return
            }
            if (key === 'active') {
              userForShow[key].content = value ? 'Activo' : 'Inhabilitado'
              return
            }
          }
        })

        this.userForShow = userForShow
      },
      inmediate: true,
    },
  },
}
</script>
