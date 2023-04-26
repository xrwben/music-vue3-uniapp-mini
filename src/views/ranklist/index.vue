<template>
  <div class="songlist">
    <div class="recommend">
      <div class="title">云音乐特色榜</div>
      <div class="rank-con">
        <div class="rank-card" v-for="item in rankList.slice(0, 4)" :key="item.id" @click="goRankDetails(item)">
          <div class="pic">
            <img :src="item.coverImgUrl+'?imageView=1&type=webp&thumbnail=210x0'" alt="">
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
    <div class="recommend">
      <div class="title">全球媒体榜</div>
      <div class="rank-con-card">
        <div class="rank-list" v-for="item in rankList.slice(4)" :key="item.id" @click="goRankDetails(item)">
          <img class="pic" :src="item.coverImgUrl+'?imageView=1&type=webp&thumbnail=210x0'" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { getTopRankApi } from '@/api/index.js'

const router = useRouter()

const rankList = ref([])

onMounted(() => {
  getTopRank()
})
// 获取排行榜
const getTopRank = () => {
  getTopRankApi().then(res => {
    rankList.value = res.list
  })
}
// 跳转到榜单详情页
const goRankDetails = (info) => {
  router.push({
    path: '/ranklist-details',
    query: {
      rank_id: info.id
    }
  })
}
</script>

<style lang="less" scoped>
.songlist {
  background: #f8f8f8;
  padding: 20px 0;
  .recommend {
    width: 686px;
    margin: 0 auto;
    .title {
      color: #262338;
      font-size: 40px;
      font-weight: bold;
      line-height: 56px;
      padding: 26px 0;
    }
    .rank-con {
      width: 100%;
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
    .rank-con-card {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .rank-list {
        width: 210px;
        height: 210px;
        border-radius: 32px;
        margin-bottom: 28px;
        overflow: hidden;
        .pic {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>