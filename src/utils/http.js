import axios from 'axios'
import { showToast } from 'vant'

const axiosIns = axios.create({
  baseURL: '/api-music',
  timeout: 30000,
  withCredentials: true,
})

// 添加请求拦截器
axiosIns.interceptors.request.use((config) => {
  // console.log(config)
  return config
}, (error) => {
  return Promise.reject(error);
})

// 添加响应拦截器
axiosIns.interceptors.response.use((response) => {
  // console.log('response>>>', response)
  if (response.data.code !== 200) {
    showToast(response.data.message || '服务器异常')
    // return Promise.reject(response);
  }
  return Promise.resolve(response);
}, (error) => {
  // console.error('error>>>>', error.response)
  showToast(error.response.statusText || '服务器异常')
  return Promise.reject(error);
})

// 封装请求
export default {
  get: (url, options = { params: null, loading: false, origin: false }) => {
    const { params, loading, origin } = options
    return new Promise((resolve, reject) => {
      let loadingIns = loading ? showToast({
        type: 'loading',
        duration: 0,
        forbidClick: true,
        message: typeof loading === 'string' ? loading : '正在加载...'
      }) : null
      axiosIns.get(url, { params }).then(res => {
        if (res.data.code === 200) {
          loadingIns && loadingIns.close()
        }
        resolve(origin ? res : res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  post: (url, options = { params: null, loading: false, origin: false }) => {
    const { params, loading, origin } = options
    return new Promise((resolve, reject) => {
      let loadingIns = loading ? showToast({
        type: 'loading',
        duration: 0,
        forbidClick: true,
        message: typeof loading === 'string' ? loading : '正在加载...'
      }) : null
      axiosIns.post(url, params).then(res => {
        if (res.data.code === 200) {
          loadingIns && loadingIns.close()
        }
        resolve(origin ? res : res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}