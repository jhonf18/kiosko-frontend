<template>
  <div
    class="w-full rounded border px-4 py-3 shadow-sm"
    :class="`container-message-${variant}`"
    v-if="!hidde"
  >
    <div
      class="text-base font-semibold grid grid-cols-12"
      :class="`message-header-${variant}`"
    >
      <span class="col-span-11">
        {{ header }}
      </span>
      <CloseIcon
        class="w-5 h-5 fill-red-500 ml-auto cursor-pointer"
        :class="`message-header-icon-${variant}`"
        @click="hidde = true"
      ></CloseIcon>
    </div>
    <p class="text-sm mt-2">
      <slot></slot>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: false,
      default: 'info',
      validator: (value) => ['info', 'danger', 'success'].includes(value),
    },
  },
  data() {
    return {
      hidde: false,
    }
  },
  components: {
    CloseIcon: () => import('@/static/icons/x.svg?inline'),
  },
}
</script>

<style lang="postcss" scoped>
/* Variant info styles */
.container-message-info {
  @apply bg-primary-light/60;
}
.message-header-info {
  @apply text-primary-dark;
}
.message-header-icon-info {
  @apply stroke-primary-dark;
}

/* Variant danger styles */
.container-message-danger {
  @apply bg-red-500/60 border-red-500;
}
.message-header-danger {
  @apply text-red-900;
}
.message-header-icon-danger {
  @apply stroke-red-900;
}

/* Variant success styles */
.container-message-success {
  @apply bg-green-300 border-green-400;
}
.message-header-success {
  @apply text-green-900;
}
.message-header-icon-success {
  @apply stroke-green-900;
}
</style>
