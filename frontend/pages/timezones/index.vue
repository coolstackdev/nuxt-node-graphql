<template>
  <div class="w-full py-10 px-40">
    <div class="flex w-full mb-4">
      <TextField v-model="search" placeholder="Search..." class="w-40" />
      <Button
        icon="document-add"
        text="Add Timezone"
        class="ml-auto"
        primary
        medium
        @click="$router.push('/timezones/add')"
      />
    </div>
    <div v-if="!loading" class="w-full">
      <div v-if="timezones && timezones.length">
        <table class="table-auto w-full">
          <thead>
            <tr class="text-left">
              <th class="border px-4 py-2">#</th>
              <th class="border px-4 py-2">Name</th>
              <th class="border px-4 py-2">City</th>
              <th class="border px-4 py-2">Current Time</th>
              <th class="border px-4 py-2">
                Time difference to local time(hours)
              </th>
              <th class="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(timezone, index) in timezones" :key="index">
              <td class="border px-4 py-2">{{ startIndex + index + 1 }}</td>
              <td class="border px-4 py-2">{{ timezone.name }}</td>
              <td class="border px-4 py-2">{{ timezone.city }}</td>
              <td class="border px-4 py-2">
                {{
                  arrTimes.length === timezones.length
                    ? arrTimes[index][0]
                    : "loading.."
                }}
              </td>
              <td class="border px-4 py-2">
                {{
                  arrTimes.length === timezones.length
                    ? arrTimes[index][1]
                    : "loading.."
                }}
              </td>
              <td class="border px-4 py-2">
                <Button
                  :to="`/timezones/edit/${timezone.id}`"
                  icon="edit"
                  primary
                  medium
                />
                <Button
                  icon="delete"
                  secondary
                  medium
                  @click="deleteTimezone(timezone.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination @handlePagination="handlePagination" />
      </div>
      <div v-else class="w-full flex justify-center pt-20 text-gray-700">
        No records found
      </div>
    </div>
    <div v-else class="w-full justify-center pt-10">Loading...</div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import moment from "moment"
import Button from "@/components/Button"
import TextField from "@/components/TextField"
import Pagination from "@/components/Pagination"
export default {
  middleware: "auth",
  components: {
    Button,
    TextField,
    Pagination,
  },
  data() {
    return {
      search: "",
      arrTimes: [],
    }
  },
  computed: {
    ...mapState({
      loading: (state) => state.loading,
      timezones: (state) => state.timezones,
      pagination: (state) => state.pagination,
      perPage: (state) => state.perPage,
    }),
    startIndex() {
      if (!this.pagination) return 0
      return (this.pagination.currentPage - 1) * this.perPage
    },
  },
  watch: {
    perPage() {
      this.$store.dispatch("getTimezones")
    },
    search(val) {
      this.$store.commit("setSearch", val)
      this.$store.dispatch("getTimezones")
    },
  },
  mounted() {
    this.$store.dispatch("getTimezones")
    setInterval(() => {
      this.updateTimes()
    }, 1000)
    this.search = this.$store.state.search
  },
  methods: {
    deleteTimezone(id) {
      // show confirm dialog
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        // if yes, delete action
        if (result.value) {
          try {
            await this.$store.dispatch("deleteTimezone", id)
            this.$swal({
              position: "top-end",
              icon: "success",
              title: "Successfully deleted",
              showConfirmButton: false,
              toast: true,
              timer: 2000,
            })
            this.$store.dispatch("getTimezones")
          } catch (err) {
            console.log(err)
          }
        }
      })
    },
    handlePagination(val) {
      this.$store.dispatch("getTimezones", {
        currentPage: val,
      })
    },
    updateTimes() {
      if (this.timezones && this.timezones.length) {
        const localDiff = new Date().getTimezoneOffset() / 60
        this.arrTimes = []
        this.timezones.forEach((element) => {
          const timezoneTime = moment()
            .utc()
            .add(element.differenceToGMT, "hours")
          this.arrTimes.push([
            timezoneTime.format("YYYY-MM-DD, h:mm:ss a"),
            element.differenceToGMT + localDiff,
          ])
        })
      }
    },
  },
}
</script>
<style></style>
