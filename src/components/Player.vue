<template>
  <div class="player" v-show="true">
    <div class="blur-bg">
      <img src="https://img3.kuwo.cn/star/albumcover/500/82/2/2805730747.jpg" alt="">
    </div>
    <div class="play-con">
      <div class="name txt-of">一半疯了一半算了</div>
      <div class="singer txt-of">苏谭谭</div>
      <div class="play-lyric">
        <div class="pic-lyric">
          <div class="rotate" @click="changePlayState">
            <div :class="['avatar', isPlaying ? 'running': 'paused']">
              <img src="https://img3.kuwo.cn/star/albumcover/500/82/2/2805730747.jpg" alt="">
            </div>
            <span class="icon"><i :class="['iconfont', isPlaying ? 'icon-play-simple' : 'icon-pause-simple']"></i></span>
          </div>
          <div class="minilyric">
            <div class="roll-con">
              <p>去有风的地方 (《去有风的地方》电视剧主题曲) - 郁可唯</p>
              <p class="active">词：汪拾米</p>
              <p>词：汪拾米</p>
              <p>词：汪拾米</p>
              <p>发行：华策音乐（天津）有限公司</p>
              <p>发行：华策音乐（天津）有限公司</p>
              <p>发行：华策音乐（天津）有限公司</p>
              <p>发行：华策音乐（天津）有限公司</p>
              <p>发行：华策音乐（天津）有限公司</p>
              <p>发行：华策音乐（天津）有限公司</p>
              <p>发行：华策音乐（天津）有限公司</p>
              <p>发行：华策音乐（天津）有限公司</p>
              <p>发行：华策音乐（天津）有限公司</p>
              <p>发行：华策音乐（天津）有限公司</p>
              <p>发行：华策音乐（天津）有限公司</p>
              <p>发行：华策音乐（天津）有限公司</p>
            </div>
          </div>
        </div>
        <div class="lyric"></div>
      </div>
      <div class="play-bar">
        <div class="progress">
          <span class="time">00:59</span>
          <div class="bar">
            <div class="finished-bar" style="width: 39%"></div>
          </div>
          <span class="time">00:59</span>
        </div>
      </div>
      <div class="control-btn">
        <i></i>
        <i class="prev iconfont icon-prev"></i>
        <i :class="['play-pause', 'iconfont', isPlaying ? 'icon-play' : 'icon-pause']"></i>
        <i class="next iconfont icon-next"></i>
        <i class="play-list iconfont icon-play-list"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getSongDetailApi, getSongUrlApi, getLyricApi } from '@/api/index.js'

// 获取歌曲详情
const getSongDetail = () => {
  getSongDetailApi({
    ids: '2016688503'
  }).then(res => {
    console.log(res)
  })
}
getSongDetail()
// 获取歌曲地址
const getSongUrl = () => {
  getSongUrlApi({
    id: '2016688503'
  }).then(res => {
    console.log(res)
    // https://music.163.com/song/media/outer/url?id=2016688503.mp3
  })
}
getSongUrl()
// 获取歌词
const getLyric = () => {
  getLyricApi({
    id: '2016688503'
  }).then(res => {
    console.log(res)
  })
}
getLyric()

const isPlaying = ref(false)

const changePlayState = () => {
  isPlaying.value = !isPlaying.value
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
    padding: 40px 0;
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .name {
      color: #fff;
      font-size: 40px;
    }
    .singer {
      color: #fff;
      font-size: 24px;
      margin: 5px auto 0;
    }
    .play-lyric {
      margin: 40px auto 0;
      .pic-lyric {
        .rotate {
          width: 500px;
          height: 500px;
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
            color: #fff;
            font-size: 32px;
            & > p {
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
              right: -12px;
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
      padding: 60px 50px;
      & > i {
        color: #fff;
        font-size: 66px;
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