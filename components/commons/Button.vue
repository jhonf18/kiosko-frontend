<template>
  <component
    :is="tag"
    :to="to"
    class="button"
    :class="`button-${variant} button-${size}`"
    @click="$emit('click')"
  >
    <slot></slot>
  </component>
</template>

<script scoped>
const variants = [
  'default',
  'success',
  'danger',
  'primary',
  'warning',
  'outline',
  'outline-danger',
  'outline-success',
  'outline-primary',
  'outline-warning',
]

const sizes = ['sm', 'md', 'lg', 'block', 'lg-block']

export default {
  props: {
    to: {
      type: String,
      required: false,
      default: '',
    },
    variant: {
      type: String,
      required: false,
      default: 'default',
      validator: (value) => variants.includes(value),
    },
    size: {
      type: String,
      required: false,
      default: 'md',
      validator: (value) => sizes.includes(value),
    },
  },
  data() {
    return {
      tag: 'span',
    }
  },
  mounted() {
    if (this.to !== '') {
      this.tag = 'nuxt-link'
    }
  },
}
</script>

<style lang="postcss">
/* ---------- Default styles --------- */
.button {
  @apply rounded-xl cursor-pointer transition-colors font-semibold;
}

/* ------------ sizes styles ---------- */
.button-sm {
  @apply px-3 py-2 text-xs;
}

.button-md {
  @apply px-4 py-3 text-sm;
}

.button-lg {
  @apply px-5 py-3;
}

.button-block {
  @apply w-full py-2 text-center block;
}

.button-lg-block {
  @apply w-full py-6 text-center block;
}

/* ------------ variant styles --------- */

.button-default {
  @apply bg-gray-300 hover:bg-gray-400;
}

.button-outline {
  @apply border border-gray-300 hover:bg-gray-400 hover:border-gray-400;
}

.button-success,
.button-danger,
.button-primary,
.button-warning {
  color: #fff;
}

.button-outline-danger,
.button-outline-primary,
.button-outline-success,
.button-outline-warning {
  @apply hover:text-white;
}

/* ---- variant success ---- */
.button-success {
  @apply bg-green-500 hover:bg-green-600;
}
.button-outline-success {
  @apply border border-green-500 hover:bg-green-600 hover:border-gray-600 text-green-500;
}

/* ----  variant danger  ----- */
.button-danger {
  @apply bg-red-500 hover:bg-red-600;
}

.button-outline-danger {
  @apply border border-red-500 hover:bg-red-600 hover:border-red-600 text-red-500;
}

/* --- variant primary  ----- */
.button-primary {
  @apply bg-primary-light hover:bg-primary;
}
.button-outline-primary {
  @apply border border-primary-light text-primary hover:border-primary hover:bg-primary;
}

/* ---- variant warning ----- */
.button-warning {
  @apply bg-yellow-500 hover:bg-yellow-600;
}

.button-outline-warning {
  @apply border border-yellow-500 hover:bg-yellow-600 text-yellow-500;
}
</style>
