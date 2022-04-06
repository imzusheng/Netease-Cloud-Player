import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://localhost:3000'

axios.defaults.baseURL = baseURL
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = localStorage.getItem('token')
//   return config
// })

// 响应拦截器
axios.interceptors.response.use(async function (response) {
  return response
}, error => {
  return Promise.reject(error)
})

export default axios
