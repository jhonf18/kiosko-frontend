<template>
  <div class="accordion-item">
    <div class="accordion-header" @click="toggleContent">
      <div class="flex items-center">
        <slot name="title"></slot>
        <div class="ml-auto flex items-center">
          <button
            type="button"
            aria-label="Alternar visualización de las clases"
          >
            <ChevronDown
              class="transition-all duration-300"
              :class="{
                'rotate-180': isOpen,
              }"
            />
          </button>
        </div>
      </div>
      <p class="text-sm">{{ subtitle }}</p>
    </div>
    <div
      :id="`accordion-${id}`"
      :ref="`accordion-${id}`"
      class="accordion-content"
      :style="styles"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    ChevronDown: () => import('@/static/icons/chevron-down.svg?inline'),
    LockIcon: () => import('@/static/icons/lock.svg?inline'),
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      styles: {
        maxHeight: 0,
      },
      isOpen: false,
    }
  },
  methods: {
    toggleContent() {
      if (this.styles.maxHeight) {
        this.isOpen = false
        this.styles.maxHeight = 0
      } else {
        const ul = this.$refs[`accordion-${this.id}`]
        this.isOpen = true
        this.styles.maxHeight = ul.scrollHeight + 'px'
      }
    },
  },
}
</script>

<style scoped lang="postcss">
.accordion-item {
  @apply border-l border-r border-b border-gray-200 bg-white;
}
.accordion-item:first-child {
  @apply border-t border-gray-200 rounded-t-lg overflow-hidden;
}

.accordion-item:last-child {
  @apply border-b border-gray-200;
}

.accordion-header {
  @apply flex flex-col cursor-pointer py-2 px-3 bg-gray-100;
}

.accordion-content {
  @apply px-4 overflow-hidden max-h-0 transition-all duration-300;
}

.accordion-content-item {
  @apply p-2 flex transition-colors hover:bg-gray-200 cursor-pointer mb-2 rounded;
}

.accordion-content-item:first-child {
  @apply mt-2;
}
</style>
