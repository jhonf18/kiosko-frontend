<template>
  <div class="w-full bg-white" :class="{ relative: !isInHeaderMobile }">
    <template v-if="label">
      <label class="font-medium text-sm mb-1 text-gray-600">{{ label }}</label>
      <input
        ref="searchInput"
        :value="search"
        type="search"
        autocomplete="off"
        class="input-search pl-3 pr-2 py-2.5 text-sm border border-gray-300 w-full rounded focus:outline-none focus:border-gray-400"
        :placeholder="placeholder"
        @input="onChange"
        @keydown.down="onArrowDown"
        @keydown.up="onArrowUp"
        @keydown.enter="onEnter"
        @keydown.prevent.esc="onEscape"
        @focus="onFocus"
      />
    </template>
    <template v-else>
      <label>
        <input
          ref="searchInput"
          :value="search"
          type="search"
          autocomplete="off"
          class="input-search pl-3 pr-2 py-2.5 text-sm border border-gray-300 w-full rounded focus:outline-none focus:border-gray-400"
          :placeholder="placeholder"
          @input="onChange"
          @keydown.down="onArrowDown"
          @keydown.up="onArrowUp"
          @keydown.enter="onEnter"
          @keydown.prevent.esc="onEscape"
          @focus="onFocus"
        />
      </label>
    </template>
    <div
      v-show="isOpen"
      class="absolute z-50 left-0 w-full container-search-result"
      :class="{ 'top-10': !label, 'top-14': label }"
    >
      <ul
        v-show="isOpen"
        ref="ulContainerList"
        style="scroll-behavior: smooth"
        class="w-full max-h-full bg-white border border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-200 scrollbar-track-gray-100"
      >
        <li
          v-for="(result, i) in results"
          :key="i"
          :ref="`item-result-${i}`"
          tabindex="1"
          class="text-sm cursor-pointer hover:bg-gray-200 focus:bg-gray-300"
          :class="{
            'is-active': i === arrowCounter,
            'py-2.5 px-2': variant !== 'header',
          }"
          @click="setResult(result)"
        >
          <template v-if="variant === 'header'">
            <nuxt-link class="p-2 w-full block" :to="`${result.href}`">
              <template v-if="result.type === 'course'">
                {{ result.title }}
              </template>
              <template v-else>
                {{ result.name }}
              </template>
            </nuxt-link>
          </template>
          <template v-else>
            {{ result.name }}
          </template>
        </li>
        <li
          v-if="results.length === 0 && !isLoading"
          class="p-4 text-center font-medium"
        >
          <span class="text-base">
            ¡Ops! No hemos encontrado resultados para tu búsqueda
            <span> &#x1F615; </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { normalizeText } from '~/assets/utils/normalize'

export default {
  name: 'SearchWithAutocomplete',
  props: {
    items: {
      type: Array,
      required: false,
      default: () => [],
    },
    isAsync: {
      type: Boolean,
      required: false,
      default: false,
    },
    isInHeaderMobile: {
      type: Boolean,
      required: false,
      default: false,
    },
    variant: {
      type: String,
      required: false,
      validator: (value) => {
        return ['header', ''].includes(value)
      },
      default: '',
    },
    placeholder: {
      type: String,
      required: false,
      default: 'Ingresar ...',
    },
    label: {
      type: String,
      required: false,
      default: null,
    },
    cleanFieldAutomatic: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      isOpen: false,
      results: [],
      search: '',
      isLoading: false,
      arrowCounter: -1,
    }
  },
  watch: {
    items(value, oldValue) {
      if (value.length !== oldValue.length) {
        this.results = value
        this.isLoading = false
      }
    },
  },
  mounted() {
    if (this.autofocus) {
      this.$refs.searchInput.focus()
    }
    document.addEventListener('click', this.handleClickOutside)
  },
  destroyed() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    setResult(result) {
      this.$emit('selectedItem', result)
      this.search = this.cleanFieldAutomatic ? '' : result.name
      this.results = []
      this.isOpen = false
    },
    filterResults() {
      if (this.variant === 'header') {
        const search = normalizeText(this.search.toLowerCase())
        this.results = this.items.filter((item) => {
          let searchBy = 'title'
          if (item.type === 'user') {
            searchBy = 'name'
          }
          const name = normalizeText(item[searchBy].toLocaleLowerCase())
          return name.includes(search)
        })
      } else {
        const search = normalizeText(this.search.toLowerCase())
        this.results = this.items.filter((item) => {
          const name = normalizeText(item.name.toLocaleLowerCase())
          return name.includes(search)
        })
      }
    },
    onChange(e) {
      this.search = e.target.value

      if (this.search === '') {
        this.isOpen = false
        this.results = []
        return
      }
      this.$emit('input', this.search)

      if (this.isAsync) {
        this.isLoading = true
      } else {
        this.arrowCounter = -1
        this.filterResults()
        this.isOpen = true
      }
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false
        this.arrowCounter = -1
      }
    },
    onArrowDown(e) {
      if (this.search === '') return

      if (this.arrowCounter < this.results.length - 1) {
        this.arrowCounter = this.arrowCounter + 1
        if (
          this.arrowCounter % 4 === 0 &&
          this.arrowCounter > 0 &&
          this.results.length > 3
        ) {
          this.$refs.ulContainerList.childNodes[
            this.arrowCounter
          ].scrollIntoView(true)
        }
      }
    },
    onArrowUp(e) {
      if (this.search === '') return

      if (this.arrowCounter === 0) {
        e.preventDefault()
        this.arrowCounter = -1
      } else if (this.arrowCounter > 0) {
        e.preventDefault()
        this.arrowCounter = this.arrowCounter - 1
        if (
          this.arrowCounter % 4 === 0 &&
          this.arrowCounter >= 4 &&
          this.results.length > 3
        ) {
          this.$refs.ulContainerList.childNodes[
            this.arrowCounter - 4
          ].scrollIntoView(true)
        } else if (this.arrowCounter < 4 && this.results.length > 3) {
          this.$refs.ulContainerList.childNodes[0].scrollIntoView(true)
        }
      }
    },
    onEnter() {
      if (this.arrowCounter === -1) return

      if (this.variant === 'header') {
        this.isOpen = false
        this.$router.push({
          path: `${this.results[this.arrowCounter].href}`,
        })
      } else {
        this.$emit('selectedItem', this.results[this.arrowCounter])
        this.isOpen = false
      }

      this.search = this.cleanFieldAutomatic
        ? ''
        : this.results[this.arrowCounter].name
    },
    onEscape() {
      this.isOpen = false
      this.$refs.searchInput.blur()
    },
    onFocus() {
      if (this.results.length !== 0) {
        this.isOpen = true
      }
    },
    reset() {
      this.search = ''
      this.results = []
      this.isOpen = false
    },
  },
}
</script>

<style scoped lang="postcss">
.container-search-result {
  height: 200px;
}

.is-active {
  @apply bg-gray-300;
}

.input-search {
  background: url('/icons/search.svg') center right 1.1rem/1.1rem no-repeat;
}
</style>
