<template>
  <div class="w-full flex justify-center pt-10 md:pt-20">
    <div class="w-full max-w-xs">
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
        tag="form"
        class="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
        @submit.prevent="update"
      >
        <div class="mb-4">
          <TextField
            v-model="form.name"
            rules="required"
            name="name"
            label="Full Name"
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
        <div class="mb-4">
          <TextField
            v-model="form.role"
            disabled
            name="role"
            label="Role"
            placeholder="user"
          />
        </div>
        <div class="mb-6">
          <TextField
            v-model="form.password"
            vid="password"
            rules="min:6"
            name="password"
            type="password"
            label="Password"
            placeholder="*********"
          />
        </div>
        <div class="mb-6">
          <TextField
            v-model="form.confirm"
            :rules="
              !!form.password
                ? 'required|confirmed:password'
                : 'confirmed:password'
            "
            name="confirm"
            type="password"
            label="Confirm Password"
            placeholder="*********"
          />
        </div>
        <div class="flex items-center justify-between">
          <Button
            :disabled="invalid"
            text="Update"
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
  middleware: "auth",
  components: {
    Button,
  },
  data() {
    return {
      form: {
        id: "",
        name: "",
        email: "",
        role: "",
        password: "",
        confirm: "",
      },
    }
  },
  async mounted() {
    const data = await this.$axios.$get(`/api/v1/users/profile`)

    // set values
    this.form.id = data.user.id
    this.form.name = data.user.name
    this.form.email = data.user.email
    this.form.role = data.user.role
  },
  methods: {
    async update() {
      try {
        await this.$store.dispatch("updateProfile", this.form)

        this.$swal({
          position: "top-end",
          icon: "success",
          title: "Successfully updated",
          showConfirmButton: false,
          toast: true,
          timer: 2000,
        })

        // clear search keyword from store
        this.$store.commit("setSearch", "")
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
