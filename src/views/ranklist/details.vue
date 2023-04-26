<template>
  <div class="songlist-details">
    <div class="banner">
      <img class="pic" :src="detailsInfo?.coverImgUrl+'?imageView=1&type=webp&thumbnail=375x0'" alt="">
      <div class="time">{{ detailsInfo?.updateTime }} 更新</div>
    </div>
    <div class="song-list">
      <div class="list-head">
        <span class="count">共100首</span>
        <div class="play-all" @click="playAllSong"><i class="iconfont icon-play"></i>播放全部</div>
      </div>
      <div class="list-item" v-for="(item, index) in songList" :key="item.id" @click="playSong(item)">
        <span class="serial-number">{{ index + 1 }}</span>
        <div class="info">
          <div class="name txt-of">{{ item.name }}</div>
          <div class="singer txt-of">
            <span v-for="(s, i) in item.ar" :key="i">{{ item.ar.length - 1 === i ? s.name : (s.name + '&') }}</span> - <span>{{ item.al.name }}</span>
          </div>
        </div>
        <i class="play-btn iconfont icon-play"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { playerStore } from '@/store/index.js'
import { getSongListDetailsApi } from '@/api/index.js'
// import { timeFormat } from '@/utils/utils.js'
import $mittBus from '@/utils/mittBus.js'

const route = useRoute()
const store = playerStore()
const state = reactive({
  detailsInfo: null,
  songList: []
})
const { detailsInfo, songList } = toRefs(state)

const getDetails = () => {
  getSongListDetailsApi({
    id: route.query.rank_id
  }).then(res => {
    console.log(res)
    state.detailsInfo = res.playlist
    state.songList = res.playlist.tracks
  })
}
getDetails()
// 播放所有歌曲
const playAllSong = () => {
  $mittBus.emit('controlPlayerMittBus', true)
  playSong(state.songList[0])
  store.$patch((states) => {
    states.playList = state.songList
    states.songId = state.songList[0].id
  })
}
// 播放歌曲
const playSong = (info) => {
  console.log(info)
  $mittBus.emit('controlPlayerMittBus', true)
  store.$patch((state) => {
    state.songId = info.id
  })
}
</script>

<style lang="less" scoped>
.songlist-details {
  background: #fff;
  .banner {
    width: 100%;
    height: 440px;
    overflow: hidden;
    position: relative;
    .pic {
      width: 100%;
      height: auto;
      margin-top: -175px;
    }
    .time {
      color: #fff;
      font-size: 30px;
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 90px;
    }
  }
  .song-list {
    background: #fff;
    border-radius: 30px 30px 0 0;
    padding-bottom: 40px;
    margin-top: -40px;
    .list-head {
      height: 150px;
      background: #fff;
      border-radius: 30px 30px 0 0;
      padding: 0 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      .count {
        color: #262338;
        font-size: 40px;
        font-weight: 700;
        line-height: 56px;
      }
      .play-all {
        width: 208px;
        height: 80px;
        background: rgb(247 247 247);
        border-radius: 40px;
        color: rgb(83 81 94);
        font-size: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        & > i {
          font-size: 48px;
          margin-right: 10px;
        }
      }
    }
    .list-item {
      width: 100%;
      height: 125px;
      display: flex;
      align-items: center;
      .serial-number {
        width: 115px;
        color: #a1a4b3;
        font-size: 36px;
        font-weight: 700;
        text-align: center;
      }
      .info {
        flex: 1;
        width: 0;
        .name {
          color: #262338;
          font-size: 32px;
          font-weight: 700;
          line-height: 45px;
        }
        .singer {
          width: 100%;
          color: #a1a4b3;
          font-size: 24px;
          line-height: 34px;
          margin-top: 7px;
        }
      }
      .play-btn {
        width: 180px;
        color: #a1a4b3;
        font-size: 52px;
        text-align: center;
      }
    }
  }
}
</style>