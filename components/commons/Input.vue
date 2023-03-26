<template>
  <div>
    <label
      v-if="label !== ''"
      :for="idInput"
      class="font-medium text-sm mb-1 text-gray-600"
    >
      {{ label }}
    </label>
    <div class="relative">
      <template v-if="label !== ''">
        <input
          :id="idInput"
          :value="value"
          :disabled="disabled"
          :type="type"
          :placeholder="placeholder"
          class="px-4 border border-gray-300 w-full rounded focus:outline-none focus:border-gray-400"
          :class="{
            'error-input':
              onError === 'empty' ||
              onError === 'not-equal' ||
              (onError === 'invalid' && type !== 'password'),
            'warning-input-pwd': onError === 'invalid' && type === 'password',
            'py-2.5 text-sm': size === 'md',
            'py-4 text-base': size === 'lg',
          }"
          v-on="$listeners"
          @input="onInput"
          @blur="onBlur"
        />
      </template>
      <template v-else>
        <label>
          <input
            :id="idInput"
            :value="value"
            :disabled="disabled"
            :type="type"
            :placeholder="placeholder"
            class="px-4 border border-gray-300 w-full rounded focus:outline-none focus:border-gray-400"
            :class="{
              'error-input': onError === 'empty' || onError === 'not-equal',
              'warning-input-pwd': onError === 'invalid',
              'py-2.5 text-sm': size === 'md',
              'py-4 text-base': size === 'lg',
            }"
            v-on="$listeners"
            @input.trim="onInput"
            @blur="onBlur"
          />
        </label>
      </template>
      <template v-if="type === 'password'">
        <EyesIcon
          v-if="!input.visible"
          :class="`eyes-icon-${size}`"
          @click="onChangeVisible"
        />
        <EyesOffIcon
          v-else
          :class="`eyes-icon-${size}`"
          @click="onChangeVisible"
        />
      </template>
      <p v-if="onError === 'empty'" class="error-input-form">
        Este campo es requerido
      </p>
      <p v-else-if="onError === 'invalid'" class="error-input-form-warning">
        {{ invalidMessage }}
      </p>
      <p v-else-if="onError === 'not-equal'" class="error-input-form">
        Las contraseñas son distintas
      </p>
    </div>
  </div>
</template>

<script>
import {
  isEmpty,
  isInvalidEmail,
  isInvalidName,
  isInvalidPassword,
  isNotEqualPasswords,
} from '~/assets/utils/validations'

const TYPES = ['text', 'number', 'email', 'url', 'password']

export default {
  components: {
    EyesIcon: () => import('@/static/icons/eyes.svg?inline'),
    EyesOffIcon: () => import('@/static/icons/eyes-off.svg?inline'),
  },
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    idInput: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
      validator: (type) => TYPES.includes(type),
    },
    placeholder: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      default: '',
    },
    validations: {
      type: String,
      validator: (type) => ['true', ''].includes(type),
      default: '',
    },
    required: {
      type: String,
      validator: (type) => ['true', ''].includes(type),
      default: '',
    },
    typeValidation: {
      type: String,
      validator: (type) => ['name', 'email', 'password', ''].includes(type),
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    invalidMessage: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'md',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      input: {
        type: this.type,
        visible: false,
      },
      blur: false,
      valueModel: '',
    }
  },
  computed: {
    onError() {
      if (this.validations === 'true') {
        // the value is required
        if (this.required === 'true') {
          const result = isEmpty(this.value, this.blur)
          if (result) return result
        }

        let result = ''

        if (this.typeValidation === 'name')
          result = isInvalidName(this.valueModel, this.blur)
        else if (this.typeValidation === 'email')
          result = isInvalidEmail(this.value, this.blur)
        else if (this.typeValidation === 'password') {
          if (this.password === '') result = isInvalidPassword(this.valueModel)
          else result = isNotEqualPasswords(this.valueModel, this.password)
        }

        if (result && result !== '') return result
        else return 'valid'
      } else {
        return 'valid'
      }
    },
  },
  methods: {
    onChangeVisible() {
      if (this.type === 'password') {
        this.input.visible = !this.input.visible
        if (this.input.type === 'password') {
          this.input.type = 'text'
        } else {
          this.input.type = 'password'
        }
      }
    },
    onInput(e) {
      this.valueModel = e.target.value
      this.$emit('update', e.target.value)
    },
    onBlur(e) {
      this.blur = true
    },
  },
}
</script>

<style scoped lang="postcss">
.eyes-icon-lg {
  @apply stroke-current text-gray-400 absolute right-3 top-4 cursor-pointer;
}

.eyes-icon-md {
  @apply stroke-current text-gray-400 absolute right-2 top-2.5 cursor-pointer;
}

.is-error {
  @apply mb-4;
}

.error-input-form {
  @apply text-xs text-red-600 ml-1;
}

.error-input-form-warning {
  @apply text-xs text-yellow-500 ml-1;
}

.error-input {
  @apply border-red-600 focus:border-red-600 text-red-600;
}

.error-input ~ .eyes-icon {
  @apply text-red-600 stroke-current;
}

.warning-input-pwd {
  @apply border-yellow-500 focus:border-yellow-500 text-yellow-500;
}

.warning-input-pwd ~ .eyes-icon {
  @apply text-yellow-500 stroke-current;
}
</style>
