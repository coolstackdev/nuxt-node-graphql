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
            rules="min:6"
            vid="password"
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
import TextField from "@/components/TextField"
import InputSelect from "@/components/InputSelect"

export default {
  middleware: "auth",
  components: {
    Button,
    InputSelect,
    TextField,
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
      roles: ["user", "manager", "admin"],
    }
  },
  async mounted() {
    if (this.$auth.user.role !== "admin") this.roles = ["user", "manager"]

    const id = this.$route.params.id
    const user = await this.$axios.$get(`/api/v1/users/${id}`)

    // set values
    this.form.id = user.id
    this.form.name = user.name
    this.form.email = user.email
    this.form.role = user.role
  },
  methods: {
    async update() {
      try {
        await this.$store.dispatch("updateUser", this.form)

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
        this.$router.push("/users")
      } catch (e) {
        this.$swal({
          position: "top-end",
          icon: "warning",
          title: "Error occurred",
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
