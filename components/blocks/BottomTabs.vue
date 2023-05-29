<template>
  <div class="flex flex-wrap">
    <div class="w-full">
      <div class="relative flex flex-col bg-white w-full">
        <div
          v-for="tabNumber in tabs"
          :class="{
            hidden: openTab !== tabNumber,
            block: openTab === tabNumber,
          }"
        >
          <slot
            :name="`menu-content-${tabNumber}`"
            :active="openTab === tabNumber"
          ></slot>
        </div>
      </div>
      <ul
        class="flex flex-nowrap fixed bottom-0 left-0 w-full border-t shadow-lg bg-white"
      >
        <li
          class="flex-auto"
          v-for="tabNumber in tabs"
          :key="tabNumber"
          @click="toggleTabs(tabNumber)"
        >
          <slot
            :name="`menu-header-${tabNumber}`"
            :active="openTab === tabNumber"
          ></slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BottomTabs',
  data() {
    return {
      openTab: 1,
      tabs: 3,
    }
  },
  methods: {
    toggleTabs: function (tabNumber) {
      this.openTab = tabNumber
    },
  },
}
</script>
