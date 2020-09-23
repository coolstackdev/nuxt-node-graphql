<template>
  <validation-provider
    v-slot="{ errors }"
    :vid="vid"
    :rules="rules"
    :disabled="validationDisabled"
    tag="div"
  >
    <div class="flex">
      <span class="textfield_label">
        {{ label }}
      </span>
    </div>
    <div :class="`flex ${errors.length > 0 ? 'has-error' : ''}`">
      <div class="flex-1">
        <input
          :value="value"
          :type="type"
          :placeholder="placeholder"
          :name="name"
          :disabled="disabled"
          :class="[
            errors.length && !validationDisabled
              ? 'textfield_border--error'
              : 'textfield_border',
            classes.textfield,
          ]"
          autocomplete="off"
          @input="$emit('input', $event.target.value)"
        />
        <div v-if="errors.length && !validationDisabled" class="flex mt-1">
          <span class="textfield_error">{{ errors[0] }}</span>
        </div>
      </div>
    </div>
  </validation-provider>
</template>

<script>
export default {
  props: {
    vid: {
      type: String,
      default: undefined,
    },
    value: {
      type: [Number, String],
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    name: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    rules: {
      type: String,
      default: "",
    },
    validationDisabled: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      return {
        textfield: {
          textfield: true,
          border: true,
          "placeholder-gray-20": true,
        },
      }
    },
  },
}
</script>
<style scoped>
.textfield {
  @apply w-full py-1 px-2 outline-none rounded text-base leading-normal text-gray-800;
  box-sizing: border-box;
}

.textfield:focus {
  @apply border-teal-500;
  transition: all 0.2s ease-out;
}

.textfield:disabled {
  @apply bg-gray-100 border-gray-100;
}

.textfield_border--error {
  @apply border-red-500;
  transition: all 0.2s ease-out;
}

.textfield_label {
  @apply leading-tight text-sm text-gray-600 mb-1;
}

.textfield_error {
  @apply flex-grow leading-none text-sm text-red-500 mt-2;
  transition: all 0.2s ease-out;
}
</style>
