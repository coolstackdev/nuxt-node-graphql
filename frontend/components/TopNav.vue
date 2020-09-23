<template>
  <nav
    class="flex items-center justify-between flex-wrap bg-teal-500 p-6 shadow-md"
  >
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <Icon name="globe" class="mr-2" />
      <span class="font-semibold text-xl tracking-tight">
        Timezone Management
      </span>
    </div>
    <div class="block lg:hidden">
      <button
        class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
        @click="toggle()"
      >
        <Icon name="menu" size="small" />
      </button>
    </div>
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm lg:flex-grow"></div>
      <div v-if="showMenu">
        <div v-if="$auth.user">
          <span
            v-if="isManager"
            :class="activePage === 'users' ? 'active' : ''"
            class="nav-link"
            @click="goToUsers"
          >
            Users
          </span>
          <span
            :class="activePage === 'timezones' ? 'active' : ''"
            class="nav-link"
            @click="goToTimezones"
          >
            Timezones
          </span>
          <nuxt-link
            :class="activePage === 'profile' ? 'active' : ''"
            to="/profile"
            class="nav-link"
          >
            Profile
          </nuxt-link>
          <span class="nav-link" @click.prevent="logout"> Logout </span>
        </div>
        <div v-if="!$auth.user">
          <nuxt-link
            :class="activePage === 'login' ? 'active' : ''"
            to="/auth/login"
            class="nav-link"
          >
            Login
          </nuxt-link>
          <nuxt-link
            :class="activePage === 'register' ? 'active' : ''"
            to="/auth/register"
            class="nav-link"
          >
            Register
          </nuxt-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import Icon from "@/components/Icon"
export default {
  components: {
    Icon,
  },
  data() {
    return {
      toggleMenu: false,
      activePage: "",
    }
  },
  computed: {
    isMobile() {
      return document.documentElement.clientWidth < 769
    },
    showMenu() {
      if (!this.isMobile) {
        return true
      }
      return this.toggleMenu
    },
    isManager() {
      if (this.$auth.user?.role === "admin") return true
      if (this.$auth.user?.role === "manager") return true

      return false
    },
  },
  watch: {
    $route(to) {
      if (to.name.includes("users")) this.activePage = "users"
      if (to.name.includes("timezones")) this.activePage = "timezones"
      if (to.name.includes("profile")) this.activePage = "profile"
      if (to.name.includes("login")) this.activePage = "login"
      if (to.name.includes("register")) this.activePage = "register"
    },
  },
  methods: {
    toggle() {
      this.toggleMenu = !this.toggleMenu
    },
    goToUsers() {
      this.$store.commit("setSearch", "")
      this.$router.push("/users")
    },
    goToTimezones() {
      this.$store.commit("setSearch", "")
      this.$router.push("/timezones")
    },
    async logout() {
      try {
        await this.$auth.logout()
        this.$router.push("/auth/login")
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style>
.nav-link {
  @apply block mt-4 text-teal-200 mr-4 cursor-pointer;
}

.nav-link:hover {
  @apply text-white;
}

.active {
  @apply text-white font-bold;
}

@screen lg {
  .nav-link {
    @apply inline-block mt-0;
  }
}
</style>
