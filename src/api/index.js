import http from '@/utils/http.js';
import api from './api.config.js';

// 获取首页banner
export const getBannerListApi = () => {
  return http.get(api.getBannerList)
}
// 推荐音乐
export const getRecommendMusicApi = (params) => {
  return http.get(api.recommendSong, { params })
}
// 推荐歌单
export const getRecommendSongListApi = (params) => {
  return http.get(api.recommendSongList, { params })
}
// 推荐歌手
export const getTopSingerApi = (params) => {
  return http.get(api.topSinger, { params })
}
// 推荐歌手
export const getTopRankApi = (params) => {
  return http.get(api.rank, { params })
}
// 获取歌曲详情
export const getSongDetailApi = (params) => {
  return http.get(api.songDetail, { params })
}
// 获取歌曲地址
export const getSongUrlApi = (params) => {
  return http.get(api.songUrl, { params })
}
// 获取歌词
export const getLyricApi = (params) => {
  return http.get(api.lyric, { params })
}

export const getPlayListAPI = (params) => {
  return http.get(api.getPlayList, { params, loading: true })
}