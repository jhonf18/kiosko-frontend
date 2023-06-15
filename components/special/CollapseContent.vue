<template>
  <div
    :class="{ 'border border-gray shadow-md px-2 py-2 rounded': withShadow }"
  >
    <div
      class="flex items-center cursor-pointer w-full"
      @click="toggleContent"
      :class="{ 'px-3 py-4': big }"
    >
      <div class="min-w-[125px]" :class="{ 'w-full': !title }">
        <h3 class="font-semibold" v-if="title">{{ title }}</h3>
        <slot name="title"></slot>
      </div>
      <div class="border-t w-full" v-if="title"></div>
      <div class="min-w-[35px]">
        <ChevronDown
          class="transition-all duration-300 w-7 h-7"
          :class="{
            'rotate-180': isOpen,
            '!w-9 !h-9': big,
          }"
        />
      </div>
    </div>
    <div
      :ref="refNameCollapse"
      class="gap-4 max-h-0 transition-all duration-300"
      :class="{ 'overflow-hidden': !isOpen, 'mt-3': isOpen }"
      :style="styles"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollapseContent',
  props: {
    title: {
      type: String,
      required: false,
    },
    withShadow: {
      type: Boolean,
      required: false,
      default: false,
    },
    big: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    const refNameCollapse = `component-collapse-${new Date().getTime()}`
    return {
      refNameCollapse,
      isOpen: false,
      styles: {
        maxHeight: 0,
      },
    }
  },
  methods: {
    toggleContent() {
      if (this.styles.maxHeight) {
        this.isOpen = false
        this.styles.maxHeight = 0
      } else {
        const ul = this.$refs[this.refNameCollapse]
        this.isOpen = true
        this.styles.maxHeight = ul.scrollHeight + 'px'
      }
    },
    resizeNow() {
      if (this.isOpen) {
        const ul = this.$refs[this.refNameCollapse]
        this.styles.maxHeight = ul.scrollHeight + 30 + 'px'
      }
    },
  },
  components: {
    ChevronDown: () => import('@/static/icons/chevron-down.svg?inline'),
  },
}
</script>
