<template>
  <div class="w-full py-10 px-40">
    <div class="flex w-full mb-4">
      <TextField v-model="search" placeholder="Search..." class="w-40" />
      <Button
        icon="user-add"
        text="Add User"
        class="ml-auto"
        primary
        medium
        @click="$router.push('/users/add')"
      />
    </div>
    <div v-if="!loading" class="w-full">
      <div v-if="users && users.length">
        <table class="table-auto w-full">
          <thead>
            <tr class="text-left">
              <th class="border px-4 py-2">#</th>
              <th class="border px-4 py-2">Full Name</th>
              <th class="border px-4 py-2">Email</th>
              <th class="border px-4 py-2">Role</th>
              <th class="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="index">
              <td class="border px-4 py-2">{{ startIndex + index + 1 }}</td>
              <td class="border px-4 py-2">{{ user.name }}</td>
              <td class="border px-4 py-2">{{ user.email }}</td>
              <td class="border px-4 py-2">{{ user.role }}</td>
              <td class="border px-4 py-2">
                <div v-if="hasPermission(user)">
                  <Button
                    :to="`/users/edit/${user.id}`"
                    icon="edit"
                    primary
                    medium
                  />
                  <Button
                    v-if="user.id !== $auth.user.id"
                    icon="delete"
                    secondary
                    medium
                    @click="deleteUser(user.id)"
                  />
                </div>
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
    }
  },
  computed: {
    ...mapState({
      loading: (state) => state.loading,
      users: (state) => state.users,
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
      this.$store.dispatch("getUsers")
    },
    search(val) {
      this.$store.commit("setSearch", val)
      this.$store.dispatch("getUsers")
    },
  },
  mounted() {
    this.$store.dispatch("getUsers")
    this.search = this.$store.state.search
  },
  methods: {
    hasPermission(user) {
      // if admin, can access all actions
      if (this.$auth.user.role === "admin") return true

      // if manager, can access all user except for 'admin' user
      if (this.$auth.user.role === "manager" && user.role !== "admin")
        return true

      return false
    },
    deleteUser(id) {
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
            await this.$store.dispatch("deleteUser", id)
            this.$swal({
              position: "top-end",
              icon: "success",
              title: "Successfully deleted",
              showConfirmButton: false,
              toast: true,
              timer: 2000,
            })

            this.$store.dispatch("getUsers")
          } catch (err) {
            console.log(err)
          }
        }
      })
    },
    handlePagination(val) {
      this.$store.dispatch("getUsers", {
        currentPage: val,
      })
    },
  },
}
</script>

<style></style>
