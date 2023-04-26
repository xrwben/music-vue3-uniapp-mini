import { defineStore } from 'pinia'

export const playerStore = defineStore({
  id: 'player',
  state: () => {
    return {
      // audio: new Audio(),
      playList: [],//播放列表,
      isPlaying: false, //是否播放中
      songId: 0,
      songImg: '',
      // playMode: 0,//循环模式 0 单曲循环 1 列表循环 2随机播放
    }
  },
  getters: {

  }
})