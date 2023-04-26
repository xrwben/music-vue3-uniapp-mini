<template>
  <div class="search">
    <div class="search-head">
      <div class="search-input">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜索你想听的歌曲" v-model.trim="searchKey" @input="searchSuggestEvent">
        <i class="iconfont icon-clear" @click="clearSearch"></i>
      </div>
      <div class="search-btn">
        <span class="btn-cancel" v-if="!searchKey" @click="router.go(-1)">取消</span>
        <span class="btn-confirm" v-else @click="searchEvent('')">搜索</span>
      </div>
    </div>
    <div class="search-suggest" v-if="searchKey && suggestList.length">
      <div class="suggest-tips txt-of">搜索：<span>{{ searchKey }}</span></div>
      <div class="suggest-item txt-of" v-for="(item, index) in suggestList" :key="index" @click="searchEvent(item.keyword)">
        <i class="iconfont icon-search"></i>
        <span>{{ searchKey }}</span>{{ item.keyword.replace(searchKey, '') }}
      </div>
    </div>
    <div class="search-result" v-if="searchKey && resultList.length && !suggestList.length">
      <div class="result-item" v-for="(item, index) in resultList" :key="index" @click="playSong(item)">
        <div class="song-name txt-of" v-html="item.name.replace(searchKey, `<em class='highlight'>${searchKey}</em>`)"></div>
        <div class="desc txt-of">
          <span class="ar" v-for="(ar, _i) in item.ar" :key="ar.id">{{ ar.name }}<i v-if="_i < item.ar.length - 1">&</i></span>
          <span class="al">{{ item.al.name }}</span>
        </div>
      </div>
    </div>
    <div class="search-history" v-if="!searchKey && searchHistory.length">
      <div class="category-title">
        <span>历史记录</span>
        <i class="iconfont icon-delete" @click="searchHistory=[]"></i>
      </div>
      <div class="history-list">
        <div class="list-item" v-for="(item, index) in searchHistory" :key="index" @click="searchEvent(item)">
          <p class="txt-of">{{ item }}</p>
        </div>
      </div>
    </div>
    <div class="search-hot" v-if="!searchKey">
      <div class="category-title">
        <span>热门搜索</span>
      </div>
      <div class="hot-list">
        <div class="list-item" v-for="(item, index) in hotList" :key="index" @click="searchEvent(item.first)">
          <div :class="['serial-number', 'serial-number-'+(index+1)]">{{ index + 1 }}</div>
          <div class="song-name txt-of">{{ item.first }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { playerStore } from '@/store/index.js'
import { searchApi, searchSuggestApi, searchHotApi } from '@/api/index.js'
import { debounce } from '@/utils/utils.js'
import $mittBus from '@/utils/mittBus.js'

const router = useRouter()
const store = playerStore()
const state = reactive({
  searchKey: '',
  suggestList: [],
  resultList: [],
  searchHistory: JSON.parse(localStorage.getItem('searchHistory') || []),
  hotList: []
})
const { searchKey, suggestList, resultList, searchHistory, hotList } = toRefs(state)
// 搜索建议
const searchSuggestEvent = debounce(() => {
  if (!state.searchKey) {
    return
  }
  searchSuggestApi({
    keywords: state.searchKey,
    type: 'mobile'
  }).then(res => {
    state.suggestList = res.result.allMatch
  })
}, 200)
// 清除搜索
const clearSearch = () => {
  state.searchKey = ''
  state.suggestList = []
  state.resultList = []
}
// 点击搜索歌曲
const searchEvent = (val) => {
  if (val) {
    state.searchKey = val
  }
  // 添加历史记录
  if (!state.searchHistory.includes(state.searchKey)) {
    state.searchHistory.push(state.searchKey)
    localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory))
  }
  state.suggestList = []
  searchApi({
    keywords: state.searchKey
  }).then(res => {
    state.resultList = res.result.songs
  })
}
// 搜索热门
const getSearchHot = () => {
  searchHotApi().then(res => {
    state.hotList = res.result.hots
  })
}
getSearchHot()
// 播放
const playSong = (info) => {
  $mittBus.emit('controlPlayerMittBus', true)
  store.$patch((state) => {
    state.songId = info.id
  })
}
</script>

<style lang="less" scoped>
  .search {
    .search-head {
      width: 686px;
      height: 80px;
      margin: 28px auto 0;
      color: rgb(38 35 56 / 50%);
      display: flex;
      justify-content: space-between;
      align-items: center;
      .search-input {
        width: 585px;
        height: 100%;
        background: #f7f7f7;
        border-radius: 40px;
        padding: 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        & > i {
          font-size: 34px;
        }
        & > input {
          width: 440px;
          height: 44px;
          color: #000;
          font-size: 32px;
        }
        .icon-clear {
          color: #e6e6e6;
          font-size: 44px;
        }
      }
      .search-btn {
        width: 74px;
        font-size: 32px;
      }
    }
    .search-suggest {
      color: #000;
      font-size: 32px;
      padding: 20px 40px;
      .suggest-tips, .suggest-item {
        height: 100px;
        line-height: 100px;
        & > i {
          color: rgb(38 35 56 / 50%);
          font-size: 34px;
          margin-right: 15px;
        }
        & > span {
          color: #598ecd;
        }
      }
    }
    .search-result {
      padding: 40px 40px 0;
      .result-item {
        height: 86px;
        margin-bottom: 50px;
        .song-name {
          font-size: 32px;
          font-weight: 500;
          color: #262338;
          line-height: 45px;
          /deep/.highlight {
            color: #598ecd;
          }
        }
        .desc {
          color: #a1a4b3;
          font-size: 24px;
          line-height: 34px;
          display: flex;
          align-items: center;
          margin-top: 8px;
          .ar {
            & > i {
              margin: 0 5px;
            }
          }
          .al {
            margin-left: 15px;
          }
        }
      }
    }
    .search-history {
      margin-top: 20px;
      padding: 0 40px;
      .category-title {
        color: #262338;
        font-size: 40px;
        font-weight: 700;
        padding: 25px 0 35px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        & > i {
          color: rgb(38 35 56 / 50%);
          font-size: 34px;
        }
      }
      .history-list {
        display: flex;
        flex-wrap: wrap;
        .list-item {
          max-width: 680px;
          height: 64px;
          background: #f7f7f7;
          border-radius: 40px;
          font-size: 28px;
          color: #262338;
          padding: 0 38px;
          margin: 0 30px 30px 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .search-hot {
      margin-top: 20px;
      padding: 0 40px 40px;
      .category-title {
        color: #262338;
        font-size: 40px;
        font-weight: 700;
        padding: 25px 0 35px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .hot-list {
        .list-item {
          height: 70px;
          color: #262338;
          font-size: 32px;
          line-height: 70px;
          padding: 0 5px;
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          .serial-number {
            width: 54px;
            color: #a1a4b3;
            font-size: 36px;
            font-weight: 700;
            text-align: center;
            margin-right: 44px;
          }
          .serial-number-1 {
            color: #f84824;
          }
          .serial-number-2 {
            color: #f47f1b;
          }
          .serial-number-3 {
            color: #ffb11f;
          }
          .song-name {
            flex: 1;
          }
        }
      }
    }
  }
</style>