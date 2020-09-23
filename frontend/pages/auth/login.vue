<template>
  <div class="w-full flex justify-center pt-10 md:pt-20">
    <div class="w-full max-w-xs">
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
        tag="form"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        @submit.prevent="login"
      >
        <div class="mb-6">
          <TextField
            v-model="form.email"
            vid="email"
            rules="required|email"
            name="email"
            type="email"
            label="Email"
            placeholder="john@doe.com"
          />
        </div>
        <div class="mb-6">
          <TextField
            v-model="form.password"
            rules="required"
            name="password"
            type="password"
            label="Password"
            placeholder="*********"
          />
        </div>
        <div class="flex items-center justify-between">
          <Button
            :disabled="invalid"
            text="Log In"
            primary
            medium
            type="submit"
          />
        </div>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import Button from "@/components/Button"
export default {
  components: {
    Button,
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    }
  },
  methods: {
    async login() {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) return

      try {
        await this.$auth.login({ data: this.form })
        this.$router.push("/timezones")
      } catch (e) {
        console.log(e)
        this.$swal({
          position: "top-end",
          icon: "error",
          title: e.response.data.message,
          showConfirmButton: false,
          toast: true,
          timer: 2000,
        })
      }
    },
  },
}
</script>

<style></style>
