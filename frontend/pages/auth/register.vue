<template>
  <div class="w-full flex justify-center pt-10 md:pt-20">
    <div class="w-full max-w-xs">
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
        tag="form"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        @submit.prevent="register"
      >
        <div class="mb-4">
          <TextField
            v-model="form.name"
            rules="required"
            name="name"
            label="Full name"
            placeholder="John Doe"
          />
        </div>
        <div class="mb-4">
          <TextField
            v-model="form.email"
            rules="required|email"
            name="email"
            label="Email"
            placeholder="john@doe.com"
          />
        </div>
        <div class="mb-6">
          <TextField
            v-model="form.password"
            vid="password"
            rules="required|min:6"
            name="password"
            type="password"
            label="Password"
            placeholder="*********"
          />
        </div>
        <div class="mb-6">
          <TextField
            v-model="form.confirm"
            rules="required|confirmed:password"
            name="confirm"
            type="password"
            label="Confirm Password"
            placeholder="*********"
          />
        </div>
        <div class="flex items-center justify-between">
          <Button
            :disabled="invalid"
            text="Register"
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
        name: "",
        email: "",
        password: "",
        confirm: "",
      },
    }
  },
  methods: {
    async register() {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) return

      try {
        await this.$axios.post("/api/v1/auth/register", this.form)
        await this.$auth.login({ data: this.form })
        this.$router.push("/timezones")
      } catch (e) {
        let errorMsg = ""
        if (e.response.data.message === "Validation Error")
          errorMsg = e.response.data.errors[0].messages[0]
        else errorMsg = e.response.data.message

        if (!errorMsg) errorMsg = "Unknown Error occurred"

        this.$swal({
          position: "top-end",
          icon: "error",
          title: errorMsg,
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
