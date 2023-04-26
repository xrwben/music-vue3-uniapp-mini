<template>
  <div class="songlist" ref="songListRef">
    <div class="category-list">
      <p
        :class="['item', {'active': currentTag===item.name}]"
        v-for="item in categoryList.slice(0, 9)"
        :key="item.id"
        @click="changeTag(item.name)">
        {{ item.name }}
      </p>
    </div>
    <div class="songlist-wrapper">
      <div class="category-title">{{ currentTag }}</div>
      <div class="list-con">
        <div class="card" v-for="item in songList" :key="item.id" @click="goSongListDetails(item)">
          <div class="pic">
            <img :src="item.coverImgUrl+'?imageView=1&type=webp&thumbnail=210x0'" alt="">
            <div class="mask"><i class="iconfont icon-play-count"></i>{{ numberFormat(item.playCount) }}</div>
          </div>
          <div class="info">
            <p class="line-ellipsis-two name">{{ item.name }}</p>
          </div>
        </div>
      </div>
      <div class="loading-tips" ref="loadingTextRef">{{ !isLoadFinished ? '正在加载中..' : '没有更多了' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getSongListCategoryApi, getHighqualitySongListApi } from '@/api/index.js'
import { numberFormat } from '@/utils/utils.js'

const router = useRouter()

const songListRef = ref(null)
const loadingTextRef = ref(null)
const state = reactive({
  currentTag: '推荐歌单',
  categoryList: [],
  songList: [],
  page: {
    current: 0
  },
  isRequesting: false,
  isLoadFinished: false
})
const { currentTag, categoryList, songList, isLoadFinished } = toRefs(state)

// watch(() => state.isRequesting, () => {
//   scrollEvent()
// })
onMounted(() => {
  getCategoryList()
  getSongList()
  nextTick(() => {
    bindScrollEvent()
  })
})
onUnmounted(() => {
  unBindScrollEvent()
})
// 获取热门歌单分类
const getCategoryList = () => {
  getSongListCategoryApi().then(res => {
    res.tags.unshift({
      id: 0,
      name: '推荐歌单'
    })
    state.categoryList = res.tags
  })
}
// 获取歌单列表
const getSongList = () => {
  getHighqualitySongListApi({
    limit: 15,
    cat: state.currentTag === '推荐歌单' ? '全部' : state.currentTag,
    before: state.page.current
  }).then(res => {
    state.songList = state.songList.concat(res.playlists)
    state.page.current = res.lasttime
    if (!res.more) {
      state.isLoadFinished = true
    }
  }).finally(() => {
    state.isRequesting = false
  })
}
// 切换分类tag
const changeTag = (name) => {
  state.currentTag = name
  state.songList = []
  state.page.current = 0
  state.isLoadFinished = false
  getSongList()
}
// 跳转到歌单详情页
const goSongListDetails = (info) => {
  router.push({
    path: '/songlist-details',
    query: {
      songlist_id: info.id
    }
  })
}
// 滚动事件
const scrollEvent = () => {
  if (state.isRequesting || state.isLoadFinished) {
    return
  }
  const scrollerEle = songListRef.value.getBoundingClientRect()
  const loadingTextRect = loadingTextRef.value.getBoundingClientRect()
  // console.log(loadingTextRect.bottom - scrollerEle.bottom)
  if (loadingTextRect.bottom - scrollerEle.bottom <= 0) {
    console.log('到底了')
    state.isRequesting = true
    state.page.index++
    getSongList()
  }
}
// 绑定滚动事件
const bindScrollEvent = () => {
  const scrollerEle = getScroller(songListRef.value)
  console.log(scrollerEle)
  console.log(songListRef.value, loadingTextRef.value)
  songListRef.value.addEventListener('scroll', scrollEvent)
}
// 解绑滚动事件
const unBindScrollEvent = () => {
  songListRef.value && songListRef.value.removeEventListener('scroll', scrollEvent)
}
const getScroller = (el, root = window) => {
  // const overflowScrollReg = /scroll|auto/i
  let node = el
  while (
    node &&
    node.tagName !== 'HTML' &&
    node.tagName !== 'BODY' &&
    node.nodeType === 1 &&
    node !== root
  ) {
    const { overflowY } = window.getComputedStyle(node);
    if (/scroll|auto/i.test(overflowY)) {
      return node;
    }
    node = node.parentNode
  }

  return root;
}
</script>

<style lang="less" scoped>
.songlist {
  height: 100%;
  padding: 40px 0;
  overflow: auto;
  .category-list {
    width: 686px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      width: 220px;
      height: 75px;
      background: #f7f7f7;
      border-radius: 16px;
      color: #262338;
      font-size: 28px;
      margin-bottom: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active {
        background: #f9de1c;
      }
    }
  }
  .songlist-wrapper {
    width: 686px;
    margin: 40px auto 0;
    .category-title {
      height: 56px;
      color: #262338;
      font-size: 36px;
      font-weight: 700;
      line-height: 56px;
      margin-bottom: 36px;
    }
    .list-con {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .card {
        width: 210px;
        margin-bottom: 36px;
        .pic {
          width: 210px;
          height: 210px;
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
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            position: absolute;
            z-index: 2;
            bottom: 0;
            left: 0;
            & > i {
              margin-right: 12px;
              font-size: 32px;
            }
          }
          .song-mask {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
            left: 150px;
            bottom: 10px;
            & > i {
              margin: 0;
              font-size: 26px;
            }
          }
        }
        .info {
          width: 100%;
          color: #262338;
          font-size: 28px;
          margin-top: 20px;
          .line-ellipsis-one {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .line-ellipsis-two {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            line-clamp: 2;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .singer {
            color: #818894;
          }
        }
      }
    }
    .loading-tips {
      color: #a1a4b3;
      font-size: 24px;
      text-align: center;
      padding: 26px 0;
    }
  }
}
</style>