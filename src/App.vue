<template>
  <!-- <header>导航</header> -->
  <div class="page-route">
    <router-view></router-view>
  </div>
  <div class="footer">
    <tab-bar></tab-bar>
    <player v-show="showPlayer"></player>
  </div>
</template>

<script setup>
import TabBar from '@/components/TabBar.vue'
import Player from '@/components/Player.vue'
import { ref } from 'vue'
import $mittBus from '@/utils/mittBus.js'
// import { getPlayListAPI } from '@/api/index.js'

const showPlayer = ref(false)

$mittBus.on('controlPlayerMittBus', (data) => {
  showPlayer.value = data
})

// getPlayListAPI({
//   id: 3778678
// }).then(res => {
//   console.log(res)
// })
// import { examStore } from '@/store/index.js'

// const store = examStore()

// const getUserInfo = () => {
//   getUserInfoAPI().then((res) => {
//     const { code, success, data } = res
//     if (code === '200' && success) {
//       store.$patch((state) => {
//         state.userInfo = data
//         localStorage.setItem('Tencent_Exam_User_Info', JSON.stringify(data))
//       })
//     }
//   })
// }
// getUserInfo()
</script>

<style lang="less">
  @import "@/style/app.less";
  #app {
    width: 100%;
    height: 100vh;
    background: #fff;
    overflow: hidden;
    .page-route {
      height: 100%;
      overflow: auto;
      padding-bottom: 100px;
    }
    // .footer {
    //   width: 100%;
    //   position: fixed;
    //   bottom: 0;
    //   left: 0;
    // }
  }
</style>