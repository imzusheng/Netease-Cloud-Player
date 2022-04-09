import store from '@/store'
import axios from '@/util/axios'
import moment from 'moment'

/**
 *
 * fetch数据转json
 * @param {String} url 传入url
 * @param {Object|null} params
 * @returns {Promise<Object>} resJSON
 */
export const fetchToJson = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: {
          realIP: '127.0.0.1',
          ...params
        }
      })
      .then(res => res.data)
      .then(resData => resolve(resData))
      .catch(err => {
        console.error('fetch-error', err)
        store.commit('setLoading', false)
        const msg = err?.response?.data?.msg || err?.response?.data?.message || ''
        store.commit('setError', {
          status: true,
          msg
        })
      })
  })
}
// 提取歌手名字
export const pickUpName = (artists, Separator = '/') => {
  // 判断是否是数组
  if (Object.prototype.toString.call(artists) === '[object Array]') {
    return artists
      .map((n) => n.name || n.userName || n)
      .join(Separator)
  } else {
    return null
  }
}

// 转换播放数量单位为：万
export const countConvert = (count) => {
  return count > 10000 ? `${(count / 10000).toFixed(1)}万` : count
}

/**
 * 时间转换为格式 04:31
 * @param {Number|String} time timeStamp时间戳
 * @returns {string}
 */
export const durationConvert = (time) => {
  const _moment = moment.duration(time, 'second')
  return `${_moment.minutes() < 10 ? `0${_moment.minutes()}` : _moment.minutes()
  }:${_moment.seconds() < 10 ? `0${_moment.seconds()}` : _moment.seconds()
  }`
}

/**
 * 获取 [min,max]的随机数
 * Math.floor(Math.random()*10) 可均衡获取 0 到 9 的随机整数
 */
export const getRandomIndex = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 提取图片占比最大的颜色
 * @param imgSrc
 * @returns {Promise<String>}
 */
export const getMainColor = (imgSrc) => {
  function getRgba (data) {
    const race = {}
    const len = data.length

    let max = 0
    let color = ''
    let i = 0
    while (i < len) {
      if (data[i + 3] !== 0) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const c = 20
        const c2 = 230
        if (!(r < c && g < c && b < c) && !(r > c2 && g > c2 && b > c2)) {
          // k格式为 255, 255, 255, 1
          const k = `${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${data[i + 3] / 255}`
          // 利用temp对象统计该颜色出现的次数
          race[k] = race[k] ? race[k] + 1 : 1
          if (race[k] > max) {
            // 替换出现的最大次数
            max = race[k]
            // 当前出现次数最多的颜色
            color = k
          }
        }
      }
      i += 4
    }
    return color
  }

  return new Promise(resolve => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    // canvas.width = 200
    // canvas.height = 200
    const img = new Image()
    // 跨域
    img.setAttribute('crossOrigin', '')
    img.src = imgSrc
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 200, 200)
      const data = ctx.getImageData(0, 0, 200, 200).data
      const color = getRgba(data)
      const rgb = color.split(',')
      let r = parseInt(rgb[0])
      let g = parseInt(rgb[1])
      let b = parseInt(rgb[2])
      // 为了让颜色更匹配网站主题
      if (r > 200 || g > 200 || b > 200) {
        r -= 40
        g -= 40
        b -= 40
      } else if (r > 150 || g > 150 || b > 150) {
        r -= 20
        g -= 20
        b -= 20
      } else if (r < 30 || g < 30 || b < 30) {
        r += 20
        g += 20
        b += 20
      }
      resolve(`${r}, ${g}, ${b}, 1`)
    }
  })
}

// 防抖
export const throttle = (func, delay) => {
  let last, timer
  return function () {
    const now = Date.now()
    if (last && now - last < delay) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        func()
      }, delay)
    } else {
      last = now
      func()
    }
  }
}

/**
 * 压缩图片
 * @param {String} imgSrc
 * @returns {Promise} canvas.toDataURL('image/jpg')
 */
export const compressionImage = (imgSrc) => {
  const tempImg = new Image()
  // 跨域
  tempImg.setAttribute('crossOrigin', 'Anonymous')
  tempImg.src = imgSrc
  return new Promise(resolve => {
    tempImg.onload = function () {
      // 图片原始宽高
      const rawImgWidth = tempImg.width
      const rawImageHeight = tempImg.height

      // 处理后的宽高，默认等于原始宽高
      let setImgWidth = rawImgWidth
      let setImgHeight = rawImageHeight

      // 宽屏图的宽高比
      const ratio = 4 / 3
      // 设置图像目标宽度为250px
      const targetWidth = 250

      if (rawImgWidth / rawImageHeight > 1.1) {
        // 宽屏图时，设置比例为ratio
        // 重新设置宽高
        setImgHeight = rawImageHeight
        setImgWidth = ratio * rawImageHeight
      } else if (rawImgWidth / rawImageHeight < 1.1) {
        // 竖屏图，还没遇到过
        setImgWidth = setImgHeight = rawImgWidth
      }

      // 创建画布
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      // 图像压缩比例
      const compressionRatio = targetWidth / setImgWidth
      // 画布宽高等于设定的比例 ratio
      canvas.width = setImgWidth * compressionRatio
      canvas.height = setImgHeight * compressionRatio

      // 再次矫正
      // rawImgWidth / rawImageHeight > setImgWidth / setImgHeight 说明图片的宽度被压缩了，图像变形需要矫正：(rawImgWidth / rawImageHeight) * setImgHeight
      // rawImgWidth / rawImageHeight < setImgWidth / setImgHeight 说明图片的高度度被压缩了：(rawImageHeight * setImgWidth) / rawImgWidth
      // console.log(rawImgWidth, rawImageHeight, setImgWidth, setImgHeight, (rawImgWidth / rawImageHeight), (setImgWidth / setImgHeight))
      if (rawImgWidth / rawImageHeight > setImgWidth / setImgHeight) {
        setImgWidth = (rawImgWidth / rawImageHeight) * setImgHeight
      } else if (rawImgWidth / rawImageHeight < setImgWidth / setImgHeight) {
        setImgHeight = (rawImageHeight * setImgWidth) / rawImgWidth
      }

      // 裁剪图片
      context.drawImage(
        tempImg,
        0, 0,
        // 保留图片的分辨率(裁剪)
        rawImgWidth,
        rawImageHeight,
        // 画布起始点
        0, 0,
        // canvas内图像大小(影响图片拉伸)，如果修改了图像宽高，比例还和canvas相同，图像会被拉伸
        setImgWidth * compressionRatio,
        setImgHeight * compressionRatio
        // ((rawImageHeight * setImgWidth) / rawImgWidth) * compressionRatio
      )
      resolve(canvas.toDataURL('image/jpg'))
    }
  })
}

/**
 * 图片懒加载
 * 传入需要观察的图片引用
 */
export const lazyLoadImg = (refs) => {
  // IntersectionObserver
  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((item) => {
      // 图片出现，挂上src
      if (item.intersectionRatio > 0) {
        // 停止观察
        intersectionObserver.unobserve(item.target)
        const rawSrc = item.target.getAttribute('data-pic-src')
        item.target.src = rawSrc
        // 压缩图片
        // compressionImage(rawSrc).then((src) => {
        //   item.target.src = src
        // }).catch(e => {
        //   item.target.src = rawSrc
        // })
      }
    })
  }, {
    threshold: [0]
  })
  // 开始观察
  if (typeof refs !== 'undefined') {
    if (refs.length) {
      refs.forEach((ele) => {
        if (ele) {
          intersectionObserver.observe(ele)
        }
      })
    } else {
      intersectionObserver.observe(refs)
    }
  }
}
