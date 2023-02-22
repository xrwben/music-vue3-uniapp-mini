<template>
  <div class="tab-bar">
    <div :class="['tab-item', {'active': currentTab === 'music'}]" @click="changeTab('music')">
      <i class="iconfont icon-tab-music"></i>
      <p>音乐</p>
    </div>
    <div class="icon-play">
      <div class="circle" @click="showPlayer">
        <div class="default-pic" v-if="!imgSrc"></div>
        <div class="play">
          <img :src="imgSrc" alt="">
          <div class="btn-play"><i class="iconfont icon-play-simple"></i></div>
        </div>
      </div>
    </div>
    <div :class="['tab-item', {'active': currentTab === 'mv'}]" @click="changeTab('mv')">
      <i class="iconfont icon-tab-mv"></i>
      <p>MV</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentTab = ref('music')

const changeTab = (type) => {
  currentTab.value = type
}
const showPlayer = () => {

}

const imgSrc = 'http://p1.music.126.net/WremGGGNBEfHb2HflFIgXg==/109951168313333599.jpg'
</script>

<style lang="less" scoped>
  .tab-bar {
    width: 100%;
    height: 100px;
    background: #fff;
    box-shadow: 0 -1px 5px 1px rgb(0 0 0 / 5%);
    padding: 0 110px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 5;
    .tab-item {
      color: #818894;
      text-align: center;
      &.active {
        color: #3c90ee;
      }
      & > i {
        font-size: 48px;
      }
      & > p {
        font-size: 20px;
      }
    }
    .icon-play {
      width: 140px;
      height: 140px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      &::before {
        content: '';
        width: 140px;
        height: 140px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 -1px 5px 1px rgb(0 0 0 / 5%);
        clip-path: ellipse(70px 70px at 50% 10px);
        position: absolute;
        top: 0;
        left: 0;
      }
      .circle {
        width: 120px;
        height: 120px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 4px 1px rgb(0 0 0 / 10%);
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        padding: 5px;
        overflow: hidden;
        .default-pic {
          width: 100%;
          height: 100%;
          background: url("@/assets/img/icon-play-default.png") no-repeat center;
          background-size: cover;
        }
        .play {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          & > img {
            width: 100%;
            height: 100%;
          }
          .btn-play {
            width: 64px;
            height: 64px;
            background: rgb(0 0 0 / 50%);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            & > i {
              color: #fff;
              font-size: 34px;
            }
          }
        }
      }
    }
  }
</style>