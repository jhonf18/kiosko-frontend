<template>
  <div class="mx-6">
    <div class="mt-8">
      <ul class="flex">
        <li
          v-for="tab in tabs"
          class="mr-6"
          :class="{ 'is-active': tab.isActive }"
        >
          <a
            class="border border-primary rounded-lg px-2.5 py-2 font-semibold hover:bg-primary hover:border-primary transition-colors duration-150 hover:text-white"
            :href="tab.href"
            @click="selectTab(tab)"
          >
            {{ tab.name }}
          </a>
        </li>
      </ul>
    </div>

    <div class="mt-5">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  data() {
    return {
      tabs: [],
    }
  },
  created() {
    this.tabs = this.$children
  },
  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach((tab) => {
        tab.isActive = tab.name === selectedTab.name
      })
    },
  },
}
</script>

<style scoped>
.tabs ul {
  @apply flex;
}

.is-active a {
  @apply bg-primary text-white;
}
</style>
