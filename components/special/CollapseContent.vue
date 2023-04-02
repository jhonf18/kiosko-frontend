<template>
  <div>
    <div class="flex items-center mb-3 cursor-pointer" @click="toggleContent">
      <div class="min-w-[125px]">
        <h3 class="font-semibold">{{ title }}</h3>
      </div>
      <div class="border-t w-full"></div>
      <div class="min-w-[35px]">
        <ChevronDown
          class="transition-all duration-300 w-7 h-7"
          :class="{
            'rotate-180': isOpen,
          }"
        />
      </div>
    </div>
    <div
      :ref="refNameCollapse"
      class="gap-4 max-h-0 transition-all duration-300"
      :class="{ 'overflow-hidden': !isOpen }"
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
      required: true,
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
