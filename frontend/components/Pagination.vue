<template>
  <div
    v-if="!loading"
    class="bg-white py-3 flex items-center justify-between border-t border-gray-200"
  >
    <div
      v-if="pagination"
      class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
    >
      <div>
        <p class="text-sm leading-5 text-gray-700">
          Showing
          <span class="font-medium">{{ startCount }}</span>
          to
          <span class="font-medium">{{ endCount }}</span>
          of
          <span class="font-medium">{{
            pagination ? pagination.totalCount : 0
          }}</span>
          results
        </p>
      </div>
      <div class="ml-10 flex text-sm leading-5 text-gray-700 items-center">
        <span class="mr-2">Rows per page: </span>
        <select v-model="rowsPerPage" class="px-2 py-1 bg-white border">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
      <div>
        <nav v-if="updated" class="relative z-0 inline-flex shadow-sm">
          <span
            class="rounded-l-md pagination-item cursor-pointer"
            :class="pagination.currentPage === 1 ? 'disabled' : ''"
            aria-label="Previous"
            @click.prevent="handlePagination('prev')"
          >
            <Icon name="chevron-left" size="small" />
          </span>
          <span
            v-for="(page, index) in arrPages"
            :key="index"
            class="pagination-item"
            :class="
              page === pagination.currentPage ? 'active' : 'cursor-pointer'
            "
            @click="handlePagination(page)"
          >
            {{ page }}
          </span>
          <span
            class="rounded-r-md pagination-item cursor-pointer"
            aria-label="Next"
            :class="
              pagination.currentPage === pagination.totalPages ? 'disabled' : ''
            "
            @click.prevent="handlePagination('next')"
          >
            <Icon name="chevron-right" size="small" />
          </span>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import Icon from "@/components/Icon"

export default {
  components: {
    Icon,
  },
  data() {
    return {
      arrPages: [],
      rowsPerPage: 0,
      updated: false,
    }
  },
  computed: {
    ...mapState({
      loading: (state) => state.loading,
      pagination: (state) => state.pagination,
      perPage: (state) => state.perPage,
    }),
    startCount() {
      if (!this.pagination) return 0
      return (this.pagination.currentPage - 1) * this.perPage + 1
    },
    endCount() {
      if (!this.pagination) return 0
      return this.startCount + this.pagination.currentPageItemsCount - 1
    },
  },
  watch: {
    rowsPerPage(val) {
      // update for 'pagination' array
      this.updated = false

      this.$store.commit("setPerPage", parseInt(val))

      if (this.pagination)
        setTimeout(() => {
          this.arrPages = this.makePaginationArray(
            this.pagination.currentPage,
            this.pagination.totalPages
          )
          this.updated = true
        }, 100)
    },
  },
  mounted() {
    this.rowsPerPage = this.perPage

    if (this.pagination)
      this.arrPages = this.makePaginationArray(
        this.pagination.currentPage,
        this.pagination.totalPages
      )

    this.updated = true
  },
  methods: {
    makePaginationArray(c, m) {
      let current = c,
        last = m,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l

      for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || (i >= left && i < right)) {
          range.push(i)
        }
      }

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1)
          } else if (i - l !== 1) {
            rangeWithDots.push("...")
          }
        }
        rangeWithDots.push(i)
        l = i
      }

      return rangeWithDots
    },
    handlePagination(val) {
      // ignore when current page is clicked
      if (val === this.pagination.currentPage) return

      // ignore 'prev' event when current page is 1
      if (val === "prev")
        if (this.pagination.currentPage !== 1) {
          this.$emit("handlePagination", this.pagination.currentPage - 1)
          return
        } else {
          return
        }

      // ignore 'next' event when current page is last
      if (val === "next")
        if (this.pagination.currentPage !== this.pagination.totalPages) {
          this.$emit("handlePagination", this.pagination.currentPage + 1)
          return
        } else {
          return
        }

      // ignore event when '...' clicked
      if (val === "...") {
        return
      }

      // if pages clicked, emit current page
      this.$emit("handlePagination", val)
    },
  },
}
</script>
<style scoped>
.pagination-item {
  @apply relative -ml-px px-4 py-2  inline-flex items-center border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 transition ease-in-out duration-150;
}
.pagination-item:hover {
  @apply text-gray-500;
}
.pagination-item:focus {
  @apply z-10 outline-none border-blue-300;
}
.pagination-item:active {
  @apply bg-gray-100 text-gray-700;
}
.active,
.active:hover {
  @apply text-teal-600;
}
.disabled,
.disabled:hover {
  @apply text-gray-400 bg-gray-200 cursor-not-allowed;
}
</style>
