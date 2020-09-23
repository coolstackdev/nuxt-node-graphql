<template>
  <div>
    <div class="flex">
      <span class="inputselect_label">
        {{ label }}
      </span>
    </div>
    <div class="flex">
      <div class="flex-1">
        <select
          :value="value"
          :class="classes.inputselect"
          :name="name"
          :disabled="disabled"
          @change="$emit('input', $event.target.value)"
        >
          <option
            v-for="(option, index) in options"
            :key="index"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "user",
    },
    name: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    classes() {
      return {
        inputselect: {
          inputselect: true,
          border: true,
          "placeholder-gray-20": true,
        },
      }
    },
  },
}
</script>
<style scoped>
.inputselect {
  @apply w-full bg-white py-1 px-2 outline-none rounded text-base leading-normal text-gray-800;
  box-sizing: border-box;
  height: 32px;
}

.inputselect:focus {
  @apply border-teal-500;
  transition: all 0.2s ease-out;
}

.inputselect:disabled {
  @apply bg-gray-100 border-gray-100;
}

.inputselect_label {
  @apply leading-tight text-sm text-gray-600 mb-1;
}
</style>
