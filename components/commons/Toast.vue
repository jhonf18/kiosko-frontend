<template>
  <div
    v-if="visible"
    class="toast-wraper"
    :class="`toast-${toastContent.type}`"
  >
    <div class="content" :class="{ 'show-toast': visible }">
      <div class="mr-2">
        <FaceSad v-if="toastContent.type === 'error'" class="face" />
        <FaceHappy v-else-if="toastContent.type === 'success'" class="face" />
        <FaceConfuzed
          v-else-if="toastContent.type === 'warning'"
          class="face"
        />
      </div>
      <span class="mr-2 text-sm w-56 max-w-56" v-if="!toast.show">
        <slot></slot>
      </span>
      <span v-else>
        <p>
          {{ toast.text }}
        </p>
      </span>
      <button
        class="button-close"
        type="button"
        aria-label="Cerrar notificación"
        @click="hide"
      >
        <CloseIcon width="20" />
      </button>
    </div>
  </div>
</template>

<script>
import { generalStoreNames } from '@/store/general'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Toast',
  components: {
    FaceSad: () => import('@/static/icons/face-sad.svg?inline'),
    FaceHappy: () => import('@/static/icons/face-happy.svg?inline'),
    FaceConfuzed: () => import('@/static/icons/face-confuzed.svg?inline'),
    CloseIcon: () => import('@/static/icons/x.svg?inline'),
  },
  props: {
    type: {
      type: String,
      required: false,
      default: 'error', //error, warning, success
    },
    visibleTime: {
      type: Number,
      required: false,
      default: 3,
    },
  },
  data() {
    return {
      visible: false,
      toastContent: {
        visibleTime: 3,
        type: 'error',
      },
      timeout: () => {},
    }
  },
  mounted() {
    this.toastContent.visibleTime = this.visibleTime
    this.toastContent.type = this.type
  },
  methods: {
    ...mapMutations({
      resetToast: generalStoreNames.mutations.removeToast,
    }),
    show() {
      this.visible = true
      this.startCountDown()
    },
    startCountDown() {
      this.timeout = setTimeout(() => {
        this.visible = false
        this.resetToast()
      }, this.toastContent.visibleTime * 1000)
    },
    hide() {
      this.visible = false
      this.resetToast()
      clearTimeout(this.timeout)
    },
  },
  beforeDestroy() {
    this.visible = false
    this.resetToast()
    clearTimeout(this.timeout)
  },
  computed: {
    ...mapGetters({
      toast: generalStoreNames.getters.getToast,
    }),
  },
  mounted() {
    this.toastContent.type = this.type
    this.toastContent.visibleTime = this.visibleTime
  },
  watch: {
    'toast.show'(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.toastContent.type = this.toast.type
        this.toastContent.visibleTime = this.toast.visibleTime
        this.show()
      }
      if (!newValue) {
        this.visible = false
        this.resetToast()
      }
    },
  },
}
</script>

<style scoped lang="postcss">
.toast-wraper {
  @apply fixed z-50 left-8 bottom-8 grid shadow-md rounded-md;
}

.content {
  @apply flex items-center px-3 py-4 bg-white relative rounded-md overflow-hidden;
}

.content::before {
  content: '';
  @apply absolute top-0 left-0 w-full h-1;
}

.toast-error .content::before {
  @apply bg-red-600;
}

.toast-success .content::before {
  @apply bg-green-600;
}

.toast-warning .content::before {
  @apply bg-yellow-500;
}

.face {
  @apply stroke-current;
}

.toast-error .face {
  @apply text-red-600;
}

.toast-success .face {
  @apply text-green-600;
}

.toast-warning .face {
  @apply text-yellow-500;
}

.button-close {
  @apply rounded-full hover:bg-gray-200 w-7 h-7 flex justify-center items-center;
}

.show-toast {
  animation: show-toast 0.3s;
}

@keyframes show-toast {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
