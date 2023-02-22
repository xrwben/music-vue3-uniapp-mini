<template>
  <div class="music">
    <div class="search" @click="search">
      <i></i><span>搜索你想听的歌曲</span>
    </div>
    <div class="banner">
      <swiper
        v-if="bannerList.length"
        :data-list="bannerList">
      </swiper>
    </div>
    <div class="module-recommend recommend-song">
      <div class="recommend-head">
        <div class="title">推荐歌曲</div>
        <span class="more" @click="router.push('/music-category')">更多<i class="iconfont icon-arrow-right"></i></span>
      </div>
      <div class="recommend-con">
        <div class="recommend-card" v-for="item in musicList" :key="item.id">
          <div class="pic">
            <img :src="item.picUrl" alt="">
            <div class="mask song-mask"><i :class="['iconfont', true ? 'icon-play-simple': 'icon-pause-simple']"></i></div>
          </div>
          <div class="info">
            <p class="line-ellipsis-one name">{{ item.name }}</p>
            <p class="line-ellipsis-one singer">{{ item.song.artists[0].name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="module-recommend recommend-song-list">
      <div class="recommend-head">
        <div class="title">推荐歌单</div>
        <span class="more">更多<i class="iconfont icon-arrow-right"></i></span>
      </div>
      <div class="recommend-con">
        <div class="recommend-card" v-for="item in songList" :key="item.id">
          <div class="pic">
            <img :src="item.picUrl" alt="">
            <div class="mask"><i class="iconfont icon-play-count"></i>{{ item.playCount }}</div>
          </div>
          <div class="info">
            <p class="line-ellipsis-two name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="module-recommend recommend-singer">
      <div class="recommend-head">
        <div class="title">热门歌手</div>
        <span class="more">更多<i class="iconfont icon-arrow-right"></i></span>
      </div>
      <div class="recommend-con">
        <div class="recommend-card" v-for="item in singerList" :key="item.id">
          <div class="pic">
            <img :src="item.picUrl" alt="">
          </div>
          <div class="info">
            <p class="line-ellipsis-one name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="module-recommend module-rank">
      <div class="recommend-head">
        <div class="title">排行榜</div>
        <span class="more">更多<i class="iconfont icon-arrow-right"></i></span>
      </div>
      <div class="rank-con">
        <div class="rank-card" v-for="item in rankList" :key="item.id">
          <div class="pic">
            <img :src="item.coverImgUrl" alt="">
          </div>
          <div class="rank-details">
            <p class="rank-title">{{ item.name }}</p>
            <p class="song-name" v-for="(song, i) in item.tracks" :key="i">
              {{ i + 1 }}. {{ song.first }} - {{ song.second }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swiper from '@/components/Swiper.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { getBannerListApi, getRecommendMusicApi, getRecommendSongListApi, getTopSingerApi, getTopRankApi } from '@/api/index.js'

const router = useRouter()

const bannerList = ref([])
const musicList = ref([])
const songList = ref([])
const singerList = ref([])
const rankList = ref([])

onMounted(() => {
  getBannerData()
  getRecommendSong()
  getRecommendSongList()
  getTopSinger()
  getTopRank()
})

// 跳转搜索页
const search = () => {
  router.push({
    path: '/search'
  })
}
// 获取轮播图列表
const getBannerData = () => {
  getBannerListApi().then(res => {
    bannerList.value = res.banners
  })
}
// 获取推荐歌曲
const getRecommendSong = () => {
  getRecommendMusicApi({
    limit: 6
  }).then(res => {
    musicList.value = res.result
  })
}
// 获取推荐歌单
const getRecommendSongList = () => {
  getRecommendSongListApi({
    limit: 6
  }).then(res => {
    console.log(res)
    songList.value = res.result
  })
}
// 获取热门歌手
const getTopSinger = () => {
  getTopSingerApi({
    limit: 3
  }).then(res => {
    console.log(res)
    singerList.value = res.artists
  })
}
// 获取排行榜
const getTopRank = () => {
  getTopRankApi().then(res => {
    console.log(res)
    rankList.value = res.list.slice(0, 3)
  })
}
</script>

<style lang="less">
.music {
  padding: 20px 0;
  .search {
    width: 686px;
    height: 64px;
    background: #f2f4f5;
    border-radius: 40px;
    color: #a1a4b3;
    font-size: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }
  .banner {
    width: 100%;
    height: 216px;
    margin: 20px auto;
  }
  .module-recommend {
    width: 686px;
    margin: 40px auto 15px;
    .recommend-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      .title {
        color: #262338;
        font-size: 36px;
        font-weight: 700;
      }
      .more {
        color: #818894;
        font-size: 26px;
        display: flex;
        align-items: center;
        & > i {
          font-size: 28px;
          margin-left: 4px;
          margin-top: 2px;
        }
      }
    }
    .recommend-con {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .recommend-card {
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
  }
  .recommend-singer {
    .recommend-con {
      .recommend-card {
        width: 218px;
        background: rgb(98 119 192 / 4%);
        border-radius: 10px;
        padding: 25px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: black;
        .pic {
          width: 158px;
          height: 158px;
          border-radius: 50%;
        }
        .info {
          text-align: center;
        }
      }
    }
  }
  .module-rank {
    .rank-con {
      .rank-card {
        background: #fff;
        border-radius: 32px;
        display: flex;
        align-items: center;
        margin-bottom: 30px;
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
        }
        .rank-details {
          width: 430px;
          margin-left: 40px;
          & > p {
            color: #a1a4b3;
            font-size: 22px;
            line-height: 30px;
            margin-bottom: 8px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .rank-title {
            color: #262338;
            font-size: 28px;
            margin-bottom: 12px;
          }
        }
      }
    }
  }
}
</style>