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
            label="Name"
            placeholder="EDT"
          />
        </div>
        <div class="mb-4">
          <TextField
            v-model="form.city"
            rules="required"
            name="city"
            label="City"
            placeholder="New York"
          />
        </div>
        <div class="mb-4">
          <TextField
            v-model="form.differenceToGMT"
            rules="required|timezone_difference"
            name="differenceToGMT"
            label="Different To GMT"
            placeholder="-4"
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
        city: "",
        differenceToGMT: "",
      },
    }
  },
  async mounted() {
    const id = this.$route.params.id
    const timezone = await this.$axios.$get(`/api/v1/timezones/${id}`)

    // set values
    this.form.id = timezone.id
    this.form.name = timezone.name
    this.form.city = timezone.city
    this.form.differenceToGMT = timezone.differenceToGMT
  },
  methods: {
    async update() {
      try {
        await this.$store.dispatch("updateTimezone", this.form)

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
        this.$router.push("/timezones")
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
