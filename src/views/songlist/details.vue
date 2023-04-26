<template>
  <div class="songlist-details">
    <div class="header">
      <img class="blur-bg" :src="detailsInfo?.coverImgUrl+'?imageView=1&type=webp&thumbnail=124x0'" alt="">
      <div class="details">
        <div class="pic">
          <img :src="detailsInfo?.coverImgUrl+'?imageView=1&type=webp&thumbnail=124x0'" alt="">
          <div class="mask"><i class="iconfont icon-play-count"></i>{{ numberFormat(detailsInfo?.playCount) }}</div>
        </div>
        <div class="desc">
          <div class="name txt-of-2">{{ detailsInfo?.name }}少时诵诗书少时诵诗书</div>
          <div class="tag">标签：{{ detailsInfo?.tags }}</div>
          <div class="creator">
            <img class="avatar" :src="detailsInfo?.creator.avatarUrl" alt="">
            <div class="nickname">{{ detailsInfo?.creator.nickname }}</div>
          </div>
        </div>
      </div>
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
import { numberFormat } from '@/utils/utils.js'
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
    id: route.query.songlist_id
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
  .header {
    width: 100%;
    height: 420px;
    position: relative;
    .blur-bg {
      width: 100%;
      height: 100%;
      backdrop-filter: blur(10px);
    }
    .details {
      width: 100%;
      height: 420px;
      background: rgb(255 255 255 / 90%);
      padding: 0 40px;
      display: flex;
      align-items: center;
      position: absolute;
      left: 0;
      top: 0;
      .pic {
        width: 248px;
        height: 248px;
        border-radius: 32px;
        overflow: hidden;
        position: relative;
        & > img {
          width: 100%;
          height: 100%;
        }
        .mask {
          max-width: 100%;
          height: 58px;
          border-radius: 0 26px;
          background: rgb(0 0 0 / 30%);
          color: #fff;
          font-size: 26px;
          font-weight: 700;
          padding: 0 26px;
          display: flex;
          align-items: center;
          position: absolute;
          bottom: 0;
          left: 0;
          & > i {
            margin-right: 12px;
            font-size: 32px;
          }
        }
      }
      .desc {
        flex: 1;
        color: #272439;
        margin-left: 40px;
        .name {
          font-size: 38px;
          font-weight: 700;
          line-height: 48px;
        }
        .tag {
          font-size: 24px;
          margin-top: 15px;
        }
        .creator {
          margin-top: 30px;
          display: flex;
          align-items: center;
          .avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
          }
          .nickname {
            font-size: 24px;
            margin-left: 18px;
          }
        }
      }
    }
  }
  .song-list {
    background: #fff;
    border-radius: 30px 30px 0 0;
    padding-bottom: 40px;
    margin-top: -20px;
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