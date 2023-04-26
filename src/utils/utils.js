// 时间格式化
export const timeFormat = (value = 0) => {
  let minute = Math.floor(value / 60)
  let second = Math.floor(value % 60)
  return `${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`
}

// 数字过万的处理
export const numberFormat = (val) => {
  let num = 0
  if (val > 9999) {
    num = Math.round(val / 10000 * 10) / 10 + '万'
  } else if (val > 99999999) {
    num = Math.round(val / 100000000 * 10) / 10 + '亿'
  } else {
    num = val
  }
  return num
}

// 防抖函数
export const debounce = (fn, wait = 50) => {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn()
    }, wait)
  }
}

// 歌词解析
export const parseLyric = (lyric) => {
  // console.log(lyric)
  if (!lyric) {
    return []
  }
  let lyricArr = lyric.split('\n')
  lyricArr = lyricArr.filter((item) => {
    return item !== ''
  })
  lyricArr = lyricArr.map((item) => {
    const t = item.split(']')[0].split('[')[1].split(':')
    const time = Number(t[0]) * 60 + Number(t[1])
    const txt = item.split(']')[1].trim()
    return {
      time,
      txt
    }
  })
  // console.log(lyricArr)
  return lyricArr
}

// 歌词解析
export function _parseLyric(lrc) {
  const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g
  const lines = lrc.split('\n')
  const lyric = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const result = timeExp.exec(line)
    if (!result) {
      continue
    }
    const text = line.replace(timeExp, '').trim()
    if (text) {
      lyric.push({
        time: (result[1] * 6e4 + result[2] * 1e3 + (result[3] || 0) * 1) / 1e3,
        text
      })
    }
  }
  return lyric
}