<template>
  <div class="w-full flex justify-center pt-10 md:pt-20">
    <div class="w-full max-w-xs">
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
        tag="form"
        class="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
        @submit.prevent="create"
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
          <InputSelect
            v-model="form.role"
            name="role"
            label="Role"
            :options="roles"
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
            text="Create"
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
import TextField from "@/components/TextField"

export default {
  middleware: "auth",
  components: {
    Button,
    TextField,
  },
  data() {
    return {
      form: {
        name: "",
        email: "",
        role: "user",
        password: "",
        comfirm: "",
      },
      roles: ["user", "manager", "admin"],
    }
  },
  mounted() {
    if (this.$auth.user.role !== "admin") this.roles = ["user", "manager"]
  },
  methods: {
    async create() {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) return

      try {
        await this.$store.dispatch("createUser", this.form)
        this.$swal({
          position: "top-end",
          icon: "success",
          title: "Successfully created",
          showConfirmButton: false,
          toast: true,
          timer: 2000,
        })

        // clear search keyword from store
        this.$store.commit("setSearch", "")
        this.$router.push("/users")
      } catch (err) {
        this.$swal({
          position: "top-end",
          icon: "error",
          title: err.response.data.message,
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
