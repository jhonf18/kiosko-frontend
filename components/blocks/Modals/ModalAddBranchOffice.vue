<template>
  <Modal
    :id="`component-${id}`"
    :ref="`component-${id}`"
    target="modal-add-branch-office"
    title="Agregar una nueva sucursal"
    size="sm"
    @close="onClose"
  >
    Modal branch office
  </Modal>
</template>

<script>
export default {
  name: 'ModalAddBranchOffice',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  methods: {
    open() {
      this.$refs[`component-${this.id}`].open()
    },
    onClose() {
      console.log('close modal')
    },
  },
}
</script>
