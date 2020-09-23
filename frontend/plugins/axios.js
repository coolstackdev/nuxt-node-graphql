export default function ({ $axios, store }) {
  $axios.onRequest((config) => {
    store.commit("setLoading", true)
    return config
  })

  $axios.onResponse((response) => {
    store.commit("setLoading", false)
    return response
  })

  $axios.onError((error) => {
    store.commit("setLoading", false)
    throw error
  })
}
