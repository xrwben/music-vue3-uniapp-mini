<template>
  <div class="music">
    <div class="tabs">
      <div
        :class="['tab-item', {'tab-active': item.id === currentTab}]"
        v-for="item in tabList"
        :key="item.id"
        @click="changeTab(item)">
        {{ item.type }}
      </div>
    </div>
    <div class="list-container" :class="bannerClass">
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
              <span v-for="(s, i) in item.artists" :key="i">{{ item.artists.length - 1 === i ? s.name : (s.name + '&') }}</span> - <span>{{ item.album.name }}</span>
            </div>
          </div>
          <i class="play-btn iconfont icon-play"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted, computed } from 'vue'
import { playerStore } from '@/store/index.js'
import { getTopSongApi } from '@/api/index.js'
import $mittBus from '@/utils/mittBus.js'

const store = playerStore()
const state = reactive({
  tabList: [
    { type: '华语', id: 7, pic: 'huayu' },
    { type: '欧美', id: 96, pic: 'oumei' },
    { type: '韩国', id: 16, pic: 'rihan' },
    { type: '日本', id: 8, pic: 'rihan' }
  ],
  currentTab: 7,
  songList: []
})
const { tabList, currentTab, songList } = toRefs(state)

const bannerClass = computed(() => {
  const tab = state.tabList.find(item => {
    return item.id === state.currentTab
  })
  return tab.pic
})

onMounted(() => {
  getList()
})

// 获取分类列表
const getList = () => {
  getTopSongApi({
    type: state.currentTab
  }).then(res => {
    state.songList = res.data
    console.log(state.songList)
  })
}
// 切换分类
const changeTab = (info) => {
  if (state.currentTab === info.id) {
    return
  }
  state.currentTab = info.id
  getList()
}
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
.music {
  .tabs {
    width: 100%;
    height: 80px;
    background: #fff;
    box-shadow: 0 0 4px 1px rgb(0 0 0 / 10%);
    padding: 0 80px;
    display: flex;
    justify-content: space-between;
    position: sticky;
    top: 0;
    .tab-item {
      height: 100%;
      color: #262338;
      font-size: 32px;
      line-height: 80px;
      &.tab-active {
        color: #3c90ee;
        font-weight: 700;
        border-bottom: 6px solid #3c90ee;
      }
    }
  }
  .list-container {
    padding-top: 206px;
    &.huayu {
      background: url("../../assets/img/huayu.png") no-repeat center top / 100% 240px;
    }
    &.oumei {
      background: url("../../assets/img/oumei.png") no-repeat center top / 100% 240px;
    }
    &.rihan {
      background: url("../../assets/img/rihan.png") no-repeat center top / 100% 240px;
    }
    .song-list {
      background: #fff;
      border-radius: 30px 30px 0 0;
      padding-bottom: 40px;
      .list-head {
        height: 150px;
        background: #fff;
        border-radius: 30px 30px 0 0;
        padding: 0 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
}
</style>