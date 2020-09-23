<template>
  <component
    :is="options.is"
    :class="classes.root"
    v-bind="options"
    :disabled="disabled"
    v-on="$listeners"
  >
    <icon v-if="icon" :name="icon" :class="classes.icon" :size="iconSize" />
    <span> {{ text }} </span>
  </component>
</template>

<script>
import Icon from "@/components/Icon"

export default {
  components: {
    Icon,
  },
  props: {
    text: { type: String, default: null },
    icon: { type: String, default: null },
    small: { type: Boolean, default: false },
    medium: { type: Boolean, default: false },
    large: { type: Boolean, default: false },
    primary: { type: Boolean, default: false },
    light: { type: Boolean, default: false },
    secondary: { type: Boolean, default: false },
    rounded: { type: Boolean, default: false },
    white: { type: Boolean, default: false },
    to: { type: String, default: "" },
    href: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    iconSize() {
      if (this.large) return "medium"
      if (this.medium) return "small"
      if (this.small) return "micro"
      return "medium"
    },
    classes() {
      return {
        root: {
          btn: true,
          "cursor-pointer": !this.disabled,
          "leading-normal text-base px-6 py-3": this.large,
          "leading-normal text-md px-3 py-2": this.medium,
          "leading-normal text-sm px-3 py-2": this.small,
          "btn-primary": this.primary,
          "btn-secondary": this.secondary,
          "btn-light": this.light,
          "btn-white": this.white,
          "btn-rounded": this.rounded,
          "opacity-50 cursor-not-allowed": this.disabled,
        },
        icon: {
          "btn--icon": this.icon,
          "mr-1 xs:mr-3": this.text,
        },
      }
    },
    options() {
      const data = {
        is: "button",
      }
      if (this.to || this.href) {
        data.is = "nuxt-link"
        data.tag = "button"
      }
      if (this.to) data.to = this.to
      if (this.href) data.href = this.href
      return data
    },
  },
}
</script>
<style scoped>
.btn {
  @apply rounded inline-flex items-center justify-center;
  transition: all 0.2s ease-out;
}

.btn-primary {
  @apply bg-teal-400 text-white outline-none;
}

.btn-primary:hover {
  @apply bg-teal-300;
}

.btn-secondary {
  @apply bg-red-400 text-white outline-none;
}

.btn-light {
  @apply text-white bg-blue-300;
}
.btn-light:hover {
  background: #367ab7;
}
.btn-secondary:hover {
  @apply bg-red-300;
}

.btn-white {
  @apply bg-white outline-none;
  box-shadow: 0px 2px 12px #00000029;
}

.btn-white:hover {
  box-shadow: 0px 2px 12px #00000048;
}
.btn-rounded {
  @apply rounded-full;
  padding: 14px;
}
</style>
