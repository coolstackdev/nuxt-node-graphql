import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const state = () => ({
  loading: false,
  error: null,
  timezones: [],
  users: [],
  pagination: null,
  perPage: 5,
  search: "",
})

const mutations = {
  setError(state, payload) {
    state.error = payload
  },
  setLoading(state, payload) {
    state.loading = payload
  },
  setTimezones(state, payload) {
    state.timezones = payload
  },
  addTimezone(state, payload) {
    state.timezones.push(payload)
  },
  removeTimezone(state, id) {
    const newTimezones = state.timezones.filter(
      (timezone) => timezone.id !== id
    )
    state.timezones = newTimezones
  },
  setUsers(state, payload) {
    state.users = payload
  },
  addUser(state, payload) {
    state.users.push(payload)
  },
  removeUser(state, id) {
    const newUsers = state.users.filter((user) => user.id !== id)
    state.users = newUsers
  },
  setPagination(state, payload) {
    state.pagination = payload
  },
  setPerPage(state, payload) {
    state.perPage = payload
  },
  setSearch(state, payload) {
    state.search = payload
  },
}

const actions = {
  createTimezone({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post("/api/v1/timezones", payload)
        .then((response) => {
          commit("addTimezone", response)
          resolve(response)
        })
        .catch((err) => {
          console.log(err)
          commit("setError", err)
          reject(err)
        })
    })
  },
  updateTimezone({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$put(`/api/v1/timezones/${payload.id}`, payload)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          console.log(err)
          commit("setError", err)
          reject(err)
        })
    })
  },
  deleteTimezone({ commit }, id) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$delete(`/api/v1/timezones/${id}`)
        .then((response) => {
          commit("removeTimezone", id)
          resolve(response)
        })
        .catch((err) => {
          console.log(err)
          commit("setError", err)
          reject(err)
        })
    })
  },
  async getTimezones({ commit, state }, payload) {
    try {
      const currentPage = payload ? payload.currentPage : 1
      const perPage = state.perPage || 5
      const search = state.search || ""

      // change the endpoint url according to role (admin or other)
      let uri = "/api/v1/timezones"
      if (this.$auth.user.role !== "admin") uri += "/my"

      // get timezones data as well as pagination data
      const response = await this.$axios.$get(
        `${uri}?page=${currentPage}&search=${search}&perPage=${perPage}`
      )
      commit("setTimezones", response.timezones)

      const { page, totalPages, total } = response
      const paginationObj = {
        currentPage: parseInt(page),
        totalPages: totalPages,
        currentPageItemsCount: response.timezones.length,
        totalCount: total,
      }

      commit("setPagination", paginationObj)
    } catch (err) {
      console.log(err)
      commit("setError", err)
    }
  },
  createUser({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post("/api/v1/users", payload)
        .then((response) => {
          commit("addUser", response)
          resolve(response)
        })
        .catch((err) => {
          console.log(err)
          commit("setError", err)
          reject(err)
        })
    })
  },
  updateUser({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$put(`/api/v1/users/${payload.id}`, payload)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          console.log(err)
          commit("setError", err)
          reject(err)
        })
    })
  },
  updateProfile({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$put(`/api/v1/users/profile`, payload)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          console.log(err)
          commit("setError", err)
          reject(err)
        })
    })
  },
  deleteUser({ commit }, id) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$delete(`/api/v1/users/${id}`)
        .then((response) => {
          commit("removeUser", id)
          resolve(response)
        })
        .catch((err) => {
          console.log(err)
          commit("setError", err)
          reject(err)
        })
    })
  },
  async getUsers({ commit, state }, payload) {
    try {
      const currentPage = payload ? payload.currentPage : 1
      const perPage = state.perPage || 5
      const search = state.search || ""

      // change the endpoint url according to role (admin or other)
      let uri = "/api/v1/users"
      if (this.$auth.user.role === "user") return

      // get users data as well as pagination data
      const response = await this.$axios.$get(
        `${uri}?page=${currentPage}&search=${search}&perPage=${perPage}`
      )
      commit("setUsers", response.users)

      const { page, totalPages, total } = response
      const paginationObj = {
        currentPage: parseInt(page),
        totalPages: totalPages,
        currentPageItemsCount: response.users.length,
        totalCount: total,
      }

      commit("setPagination", paginationObj)
    } catch (err) {
      console.log(err)
      commit("setError", err)
    }
  },
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
