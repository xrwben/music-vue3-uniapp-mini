<template>
  <div class="swiper-container" ref="swiper">
    <div :class="[vertical ? 'track-vertical' : 'track-horizontal']" ref="track" :style="trackStyle">
      <div class="swiper-item" v-for="(item, i) in swiperList" :data-index="item" :key="i">
        <img :src="item.imageUrl" alt="" @click="clickItem(i)">
      </div>
    </div>
    <div :class="['swiper-indicators', vertical ? 'indicators-vertical' : 'indicators-horizontal']" v-if="indicator">
      <div :class="['indicator', {'active': i===currentIndex}]" v-for="(item, i) in swiperList" :key="i" @click.stop="slideTo(i)"></div>
    </div>
    <div class="swiper-btn" v-if="showButton">
      <div class="prev" @click="slidePrev"></div>
      <div class="next" @click="slideNext"></div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, onMounted, onUnmounted, computed, nextTick } from 'vue';

const props = defineProps({
  disabled: { // 禁止拖动
    type: Boolean,
    default: false
  },
  loop: { // 是否循环
    type: Boolean,
    default: true
  },
  autoplay: { // 自动播放时间间隔
    type: Number,
    default: 8000
  },
  vertical: {
    type: Boolean,
    default: false
  },
  speed: { // 过度时间
    type: Number,
    default: 400
  },
  threshold: { // 移动超过百分比则换页
    type: Number,
    default: 0.5
  },
  // 是否显示索引
  indicator: {
    type: Boolean,
    default: true
  },
  // 默认索引
  defaultIndex: {
    type: Number,
    default: 0
  },
  // 是否显示
  showButton: {
    type: Boolean,
    default: false
  },
  // 渲染列表
  dataList: {
    type: Array,
    default: null
  }
})

// const { disabled, loop, autoplay, vertical, speed, threshold, indicator, defaultIndex, showButton } = toRefs(props)

const state = reactive({
  swiperList: [
    // { type: 1, name: 'slid-1', pic: 'https://tdesign.gtimg.com/site/swiper/02.png' },
    // { type: 2, name: 'slid-2', pic: 'https://tdesign.gtimg.com/site/swiper/03.png' },
    // { type: 3, name: 'slid-3', pic: 'https://i1.mifile.cn/a4/xmad_15517939170939_oiXCK.jpg' },
  ],
  pageList: [], // 轮播列表
  draging: false, // 是否正在拖动
  currentIndex: 0, // 当前项索引
  currentOffset: 0, // 当前容器偏移量
  dragState: {}, // 拖动详情
  timerIns: null, // 定时器
});
const swiper = ref(null);
const track = ref(null);

const { swiperList, currentIndex } = toRefs(state)

// 容器宽高
const swiperSize = computed(() => {
  const direction = props.vertical ? 'height' : 'width'
  return swiper.value.getBoundingClientRect()[direction];
});
const trackStyle = computed(() => {
  return {
    transform: `translate${props.vertical ? 'Y' : 'X'}(${state.currentOffset}px)`,
    transition: `transform ${state.draging ? 0 : props.speed}ms ease`
  }
});
// 是否循环
const isLoop = computed(() => {
  return props.loop && state.pageList.length > 1;
});


const clickItem = (i) => {
  console.log('click>>>', i)
}
const init = () => {
  // 获取所有轮播列表
  const children = track.value.querySelectorAll('.swiper-item');
  state.pageList = children;

  // 循环前后添加一个clone元素
  if (isLoop.value) {
    const firstClone = state.pageList[0].cloneNode(true);
    const lastClone = state.pageList[state.pageList.length - 1].cloneNode(true);
    track.value.insertBefore(lastClone, state.pageList[0])
    track.value.appendChild(firstClone)
  }
  // 处理默认索引
  state.currentIndex = props.defaultIndex;
  correctionPosition();
  // 自动轮播
  startAutoplay();
  // 禁止拖动
  if (props.disabled || state.pageList.length <= 1) {
    return
  }
  track.value.addEventListener('touchstart', dragStartEvent);
  track.value.addEventListener('touchmove', dragMoveEvent);
  track.value.addEventListener('touchend', dragEndEvent);
  track.value.addEventListener('transitionend', transitionEndEvent)
  // window.addEventListener('visibilitychange', onVisibilityChange)
}
// 开始自动播放
const startAutoplay = () => {
  if (props.autoplay && isLoop.value) {
    stopAutoplay();
    state.timerIns = setTimeout(() => {
      slideNext();
      startAutoplay()
    }, props.autoplay)
  }
}
// 停止自动播放
const stopAutoplay = () => {
  state.timerIns && clearTimeout(state.timerIns)
}
// 页面可见性
// const onVisibilityChange = () => {
// 	console.log(document.visibilityState);
// 	if (document.visibilityState === 'visible') {
// 		startAutoplay()
// 	} else {
// 		stopAutoplay()
// 	}
// },
const dragStartEvent = (e) => {
  // 开始拖动则停止自动轮播
  stopAutoplay()
  const touch = e.changedTouches ? e.changedTouches[0] : e;
  // 开始拖动标志
  state.draging = true;
  // 记录开始时间
  state.dragState.startTime = Date.now();
  // 记录开始X、Y坐标
  state.dragState.startX = touch.pageX;
  state.dragState.startY = touch.pageY;
}
const dragMoveEvent = (e) => {
  const touch = e.changedTouches ? e.changedTouches[0] : e;
  // 记录移动的当前X、Y坐标
  state.dragState.endX = touch.pageX;
  state.dragState.endY = touch.pageY;
  const offset = props.vertical ? state.dragState.endY - state.dragState.startY : state.dragState.endX - state.dragState.startX;
  // 拖动
  move(offset);
}
const dragEndEvent = (e) => {
  const touch = e.changedTouches ? e.changedTouches[0] : e;
  // 结束拖动标志
  state.draging = false;
  // 记录结束X、Y坐标
  state.dragState.endX = touch.pageX;
  state.dragState.endY = touch.pageY;
  const dragDuration = Date.now() - state.dragState.startTime;
  const offset = props.vertical ? state.dragState.endY - state.dragState.startY : state.dragState.endX - state.dragState.startX;
  // 满足切换条件则改变索引
  if (Math.abs(offset / dragDuration) >= 0.25 || Math.abs(offset) >= swiperSize.value * props.threshold) {
    offset < 0 ? state.currentIndex++ : state.currentIndex--
  }
  move(0);
  startAutoplay()
}
const move = (offset) => {
  const num = isLoop.value ? 1 : 0;
  // 目标索引
  let targetIndex = (state.currentIndex + state.pageList.length) % state.pageList.length;
  // 目标距离
  let targetOffset = -(state.currentIndex + num) * swiperSize.value + offset;
  // 非循环边界处理
  if (!isLoop.value) {
    if (state.currentIndex <= 0) {
      targetIndex = 0;
    }
    if (state.currentIndex >= state.pageList.length - 1) {
      targetIndex = state.pageList.length - 1
    }
    if (targetOffset >= 0) {
      targetOffset = 0
    }
    if (targetOffset <= -(state.pageList.length - 1) * swiperSize.value) {
      targetOffset = -(state.pageList.length - 1) * swiperSize.value
    }
  }
  state.currentIndex = targetIndex
  state.currentOffset = targetOffset
}
// transition结束事件
const transitionEndEvent = () => {
  if (isLoop.value) {
    correctionPosition()
  }
  startAutoplay()
}
// 修改偏移位置
const correctionPosition = () => {
  const num = isLoop.value ? 1 : 0
  if (state.currentOffset === 0 || state.currentOffset === -swiperSize.value * (state.pageList.length + 1)) {
    state.draging = true
    const targetOffset = -(state.currentIndex + num) * swiperSize.value
    state.currentOffset = targetOffset
  }
}
// 点击跳转到指定位置
const slideTo = (i) => {
  if (state.currentIndex === i) {
    return
  }
  stopAutoplay()
  state.currentIndex = i
  state.draging = false
  move(0)
}
// 上一张
const slidePrev = () => {
  stopAutoplay()
  state.currentIndex--
  nextTick(() => {
    state.draging = false
    move(0)
  })
}
// 下一张
const slideNext = () => {
  stopAutoplay()
  state.currentIndex++
  // requestAnimationFrame(() => {
  // 	state.draging = false
  // 	move(0)
  // })
  nextTick(() => {
    state.draging = false
    move(0)
  })
}

onMounted (() => {
  state.swiperList = props.dataList
  console.log(state.swiperList)
  nextTick(() => {
    init()
  })
})
onUnmounted (() => {
  state.timerIns && clearInterval(state.timerIns);
})
</script>

<style lang="less" scoped>
.swiper-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.track-horizontal {
  width: auto;
  height: 100%;
  display: flex;
}
.track-vertical {
  width: 100%;
  height: 100%;
}
.swiper-item {
  width: 100%;
  height: 100%;
  padding: 0 32px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}
.swiper-item img {
  width: 100%;
  height: 100%;
  border-radius: 14px;
}
.content {
  height: 100%;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.swiper-indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 100;
}
.indicators-horizontal {
  width: 100%;
  left: 0;
  bottom: 10px;
}
.indicators-vertical {
  flex-direction: column;
  height: 100%;
  top: 0;
  right: 10px;
}
.indicator {
  width: 10px;
  height: 10px;
  background: rgb(255 255 255 / 50%);
  border-radius: 50%;
  margin: 3px;
}
.indicator.active {
  background: #fff;
}
.swiper-btn .prev, .swiper-btn .next {
  width: 20px;
  height: 20px;
  background: rgb(0 0 0 / 50%);
  border-radius: 50%;
  color: #fff;
  font-size: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.swiper-btn .prev {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.swiper-btn .prev::before {
  content: '';
  width: 6px;
  height: 6px;
  border: 2px solid #fff;
  border-right: none;
  border-top: none;
  transform: translateX(1px) rotate(45deg);
}
.swiper-btn .next {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.swiper-btn .next::before {
  content: '';
  width: 6px;
  height: 6px;
  border: 2px solid #fff;
  border-left: none;
  border-bottom: none;
  transform: translateX(-1px) rotate(45deg);
}
</style>