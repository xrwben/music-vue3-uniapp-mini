<template>
  <div class="player" v-show="true">
    <div class="blur-bg">
      <img :src="songDetails?.pic" alt="">
    </div>
    <div class="play-con">
      <div class="btn-close" @click="hidePlayer"><i class="iconfont icon-arrow-close"></i></div>
      <div class="name">{{ songDetails?.name }}</div>
      <div class="singer txt-of">
        <span v-for="(item, index) of songDetails?.singer" :key="index">{{ songDetails?.singer.length - 1 === index ? item : (item + '&') }}</span>
      </div>
      <div class="play-lyric">
        <div class="pic-lyric">
          <div class="rotate" @click="changePlayState">
            <div :class="['avatar', store.isPlaying ? 'running': 'paused']">
              <img :src="songDetails?.pic" alt="">
            </div>
            <span class="icon"><i :class="['iconfont', store.isPlaying ? 'icon-pause-simple' : 'icon-play-simple']"></i></span>
          </div>
          <div class="minilyric" ref="lyricConRef">
            <div class="roll-con" ref="lyricRef">
              <p :class="['txt-of', {'active': currentLyricIndex === index }]" :data-time="item.time" v-for="(item, index) in lyric" :key="index">{{ index }}{{ item.txt }}</p>
            </div>
          </div>
        </div>
        <div class="lyric"></div>
      </div>
      <div class="play-bar">
        <div class="progress">
          <span class="time">{{ timeFormat(currentTime) }}</span>
          <div class="bar">
            <div class="finished-bar" :style="`width: ${currentProgress}%`"></div>
          </div>
          <span class="time">{{ timeFormat(totalTime) }}</span>
        </div>
      </div>
      <div class="control-btn">
        <i class="hide iconfont icon-arrow-close"></i>
        <i class="prev iconfont icon-prev"></i>
        <i :class="['play-pause', 'iconfont', store.isPlaying ? 'icon-pause' : 'icon-play']" @click="changePlayState"></i>
        <i class="next iconfont icon-next"></i>
        <i class="play-list iconfont icon-play-list"></i>
      </div>
    </div>
    <audio ref="audioEle" :src="store.songUrl" controls style="position: fixed; z-index: 1000; bottom: 0;"></audio>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, toRefs, computed, watch, nextTick } from 'vue'
import { getSongDetailApi, getSongUrlApi, getLyricApi } from '@/api/index.js'
import $mittBus from '@/utils/mittBus.js'
import { playerStore } from '@/store/index.js'
import { timeFormat, parseLyric } from '@/utils/utils.js'

const store = playerStore()
console.log(store)

// const isPlaying = ref(false)
const audioEle = ref(null)
const lyricConRef = ref(null)
// const lyricRef = ref(null)
const state = reactive({
  currentTime: 0, // 当前播放时间
  currentProgress: 0, // 当前缓冲进度
  totalTime: 0, // 总播放时间
  songDetails: null,
  lyric: [], // 歌词
})
const { currentTime, currentProgress, totalTime, songDetails, lyric } = toRefs(state)

// 当前高亮歌词行
const currentLyricIndex = computed(() => {
  let line = state.lyric.findIndex((item) => {
    return item.time >= state.currentTime
  })
  // console.log(line)
  return line <= 0 ? 0 : line - 1
})

watch(() => store.songId, (songId) => {
  console.log('数据变化了', songId)
  getSongUrl()
  getSongDetail()
  getLyric()
})

onMounted(() => {
  // getSongUrl()
  // getSongDetail()
  // getLyric()
  nextTick(() => {
    audioEvent()
  })
})

// 获取歌曲地址
const getSongUrl = () => {
  getSongUrlApi({
    id: store.songId
  }).then(res => {
    audioEle.value.src = res.data[0].url
    store.$patch((state) => {
      state.songUrl = res.data[0].url
    })
    // https://music.163.com/song/media/outer/url?id=2016688503.mp3
  })
}
// 获取歌曲详情
const getSongDetail = () => {
  getSongDetailApi({
    // ids: '2016688503'
    ids: store.songId
  }).then(res => {
    // console.log('>>>', res)
    state.songDetails = {
      name: res.songs[0].name,
      singer: res.songs[0].ar.map(item => item.name),
      pic: res.songs[0].al.picUrl + '?imageView&thumbnail=240y240&quality=75&tostatic=0'
    }
    store.$patch((state) => {
      state.songImg = res.songs[0].al.picUrl + '?imageView&thumbnail=240y240&quality=75&tostatic=0'
    })
  })
}
// 获取歌词
const getLyric = () => {
  getLyricApi({
    id: store.songId
  }).then(res => {
    state.lyric = parseLyric(res.lrc.lyric)
    // console.log(_parseLyric(res.lrc.lyric))
  })
}
const changePlayState = () => {
  store.isPlaying = !store.isPlaying
  if (store.isPlaying) {
    audioEle.value.play()
  } else {
    audioEle.value.pause()
  }
}
// 隐藏播放器
const hidePlayer = () => {
  $mittBus.emit('controlPlayerMittBus', false)
}
// audio事件
const audioEvent = () => {
  audioEle.value.addEventListener('canplay', () => {
    console.log('canplay事件')
    state.totalTime = audioEle.value.duration
    changePlayState()
  })
  audioEle.value.addEventListener('timeupdate', () => {
    // console.log(currentLyricIndex.value, audioEle.value.currentTime)
    state.currentTime = audioEle.value.currentTime
    state.currentProgress = audioEle.value.currentTime / audioEle.value.duration * 100
    lyricRollup()
  })
  audioEle.value.addEventListener('ended', () => {
    console.log('ended事件')
  })
}
const lyricRollup = () => {
  if (!state.lyric.length) {
    return
  }
  const lyricContainerHeight = lyricConRef.value.getBoundingClientRect().height
  const currentLyric = lyricConRef.value.querySelector('.active')
  // console.log(currentLyric)
  const currentLyricHeight = currentLyric.getBoundingClientRect().height
  // console.log(lyricContainerHeight, currentLyricHeight, currentLyric.offsetTop)
  const _scrollTop = currentLyric.offsetTop - (lyricContainerHeight - currentLyricHeight) / 2
  // console.log(_scrollTop)
  lyricConRef.value.scrollTo({
    top: _scrollTop,
    left: 0,
    behavior: 'smooth'
  })
}
</script>

<style lang="less" scoped>
.player {
  background: #252a40;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: hidden;
  .blur-bg {
    width: 100%;
    height: 100%;
    opacity: 0.5;
    filter: blur(20px);
    transform: scale(1.5);
    transform-origin: 50% 50%;
    & > img {
      width: 100%;
      height: 100%;
    }
  }
  .play-con {
    width: 100%;
    height: 100%;
    // padding: 40px 0 0;
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: center;
    overflow: auto;
    .btn-close {
      padding: 12px;
      position: absolute;
      left: 20px;
      top: 20px;
      & > i {
        color: #fff;
        font-size: 32px;
      }
    }
    .name {
      width: 686px;
      color: #fff;
      font-size: 40px;
      line-height: 56px;
      margin: 40px auto 0;
    }
    .singer {
      color: #fff;
      font-size: 24px;
      line-height: 32px;
      margin: 5px auto 0;
    }
    .play-lyric {
      width: 100%;
      margin: 40px auto 0;
      .pic-lyric {
        .rotate {
          width: 480px;
          height: 480px;
          margin: 0 auto;
          position: relative;
          .avatar {
            width: 100%;
            height: 100%;
            border: 16px solid rgb(216 216 216 / 16%);
            border-radius: 50%;
            overflow: hidden;
            &.running {
              animation: avatar-rotate 20s linear infinite forwards running;
            }
            &.paused {
              animation: avatar-rotate 20s linear infinite forwards paused;
            }

            @keyframes avatar-rotate {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
            & > img {
              width: 100%;
              height: 100%;
            }
          }
          .icon {
            width: 132px;
            height: 132px;
            background: rgb(0 0 0 / 50%);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            & > i {
              color: #fff;
              font-size: 54px;
            }
          }
        }
        .minilyric {
          width: 90%;
          height: 350px;
          margin: 26px auto 0;
          mask-image: linear-gradient(180deg, hsl(0deg 0% 100% / 0%),hsl(0deg 0% 100% / 60%) 10%,#fff 35%,#fff 75%,hsl(0deg 0% 100% / 60%) 85%,hsl(0deg 0% 100% / 0%));
          overflow: auto;
          .roll-con {
            width: 100%;
            color: #fff;
            font-size: 30px;
            position: relative;
            & > p {
              width: 100%;
              height: 70px;
              line-height: 70px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              &.active {
                color: #f9de1c;
              }
            }
          }
        }
      }
    }
    .play-bar {
      margin: 32px auto 0;
      .progress {
        width: 680px;
        display: flex;
        align-items: center;
        margin: 0 auto;
        .time {
          color: #fff9;
          font-size: 22px;
          font-weight: 700;
        }
        .bar {
          flex: 1;
          height: 10px;
          background: rgb(255 255 255 / 10%);
          border-radius: 10px;
          margin: 0 24px;
          .finished-bar {
            height: 100%;
            background: #fff;
            border-radius: 10px;
            position: relative;
            &::after {
              content: "";
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: #fff;
              box-shadow: 0 2px 4px 0 rgb(0 0 0 / 8%);
              position: absolute;
              right: -18px;
              top: -7px;
            }
          }
        }
      }
    }
    .control-btn {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 60px 50px 20px;
      & > i {
        color: #fff;
        font-size: 66px;
      }
      .hide {
        color: transparent;
        font-size: 34px;
      }
      .play-pause {
        font-size: 80px;
      }
      .play-list {
        font-size: 56px;
      }
    }
  }
}
</style>