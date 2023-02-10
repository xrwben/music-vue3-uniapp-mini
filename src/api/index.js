import http from '@/utils/http.js';
import api from './api.config.js';

export const getPlayListAPI = (params) => {
  return http.get(api.getPlayList, { params, loading: true })
}