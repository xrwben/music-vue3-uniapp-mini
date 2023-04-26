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
/*
  名称: 新歌速递
  必选参数:
    type => 地区类型id（0-全部 7-华语 96-欧美 8-日本 16-韩国）
  调用例子: /top/song?type=96
*/
export const getTopSongApi = (params) => {
  return http.get('/top/song', { params, loading: true })
}
// 推荐歌单
export const getRecommendSongListApi = (params) => {
  return http.get(api.recommendSongList, { params })
}
// 歌单分类
export const getSongListCategoryApi = (params) => {
  return http.get(api.songListCategory, { params })
}
// 精品歌单分类列表
export const getHighqualitySongListApi = (params) => {
  return http.get(api.highqualitySongList, { params, loading: true })
}
// 歌单详情
export const getSongListDetailsApi = (params) => {
  return http.get(api.songListDetails, { params })
}
// 推荐歌手
export const getTopSingerApi = (params) => {
  return http.get(api.topSinger, { params })
}
// 推荐榜单
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
// 搜索
export const searchApi = (params) => {
  return http.get(api.search, { params })
}
// 搜索建议
export const searchSuggestApi = (params) => {
  return http.get(api.searchSuggest, { params })
}
// 热门搜索
export const searchHotApi = () => {
  return http.get(api.searchHot)
}