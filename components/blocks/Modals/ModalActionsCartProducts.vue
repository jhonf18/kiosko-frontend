<template>
  <Modal
    :id="`component-${nameRef}`"
    :ref="`component-${nameRef}`"
    size="sm"
    title="Acciones"
    :footer="false"
  >
    <div class="w-full">
      <Button
        variant="outline-primary"
        size="block"
        class="mb-4"
        @click="editProduct()"
      >
        <span class="flex justify-center items-center">
          <EditIcon></EditIcon>
          Editar producto
        </span>
      </Button>
      <Button variant="danger" size="block" @click="deleteProduct()">
        <span class="flex justify-center items-center">
          <TrashIcon></TrashIcon>
          Eliminar producto
        </span>
      </Button>
    </div>
    <ModalActionsEditProduct
      ref="component-modal-actions-edit-product"
      :product="product"
      @updateProduct="updateProduct"
    ></ModalActionsEditProduct>
  </Modal>
</template>

<script>
import ModalActionsEditProduct from './ModalActionsEditProduct.vue'

export default {
  name: 'ModalActionsCartProducts',
  props: {
    order: {
      type: Object,
      required: true,
    },
    product: {
      type: Object,
      required: true,
    },
    indexOrder: {
      type: Number,
      required: true,
    },
    indexProduct: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      nameRef: 'modal-actions-cart-products',
      option: 'select-action',
    }
  },
  methods: {
    open() {
      this.$refs[`component-${this.nameRef}`].open()
    },
    close() {
      this.$refs[`component-${this.nameRef}`].closeByButton()
    },
    editProduct() {
      this.$refs['component-modal-actions-edit-product'].open()
    },
    deleteProduct() {
      this.$emit('deleteProduct', {
        order: this.order,
        product: this.product,
        indexOrder: this.indexOrder,
        indexProduct: this.indexProduct,
      })
    },
    updateProduct({
      comments,
      ingredients_selected,
      ingredients_selected_text,
    }) {
      this.$emit('updateProduct', {
        order: this.order,
        product: {
          ...this.product,
          comments,
          ingredients_selected,
          ingredients_selected_text,
        },
        indexOrder: this.indexOrder,
        indexProduct: this.indexProduct,
      })
    },
  },
  components: {
    ModalActionsEditProduct,
    TrashIcon: () => import('@/static/icons/trash.svg?inline'),
    EditIcon: () => import('@/static/icons/edit.svg?inline'),
  },
}
</script>

<style scoped lang="postcss">
.list {
  transition: all 0.5s;
}
.list-enter, .list-leave-to
/* .card-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: scale(0);
}
.list-enter-to {
  opacity: 1;
  transform: scale(1);
}
/*
.list-leave-active {
  position: absolute;
}
*/

.list-move {
  opacity: 1;
  transition: all 0.5s;
}
</style>
