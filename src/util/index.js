import store from '@/store'
import axios from '@/util/axios'

/**
 * fetch数据转json
 * @param {String} url 传入url
 * @returns Promise resJSON
 */
export const fetchToJson = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => res.data)
      .then(resData => resolve(resData))
      .catch(err => {
        store.commit('setLoading', false)
        store.commit('setError', {
          status: true,
          msg: err.response.data.msg || err.response.data.message || ''
        })
        console.error('fetch-error', err)
      })
  })
}
// 提取歌手名字
export const pickUpName = (artists, Separator = '/') => {
  // 判断是否是数组
  if (Object.prototype.toString.call(artists) === '[object Array]') {
    return artists
      .map((n) => {
        if (n.name) return n.name
        else return n
      })
      .join(Separator)
  } else {
    return null
  }
}

/**
 * 提取图片占比最大的颜色
 * @param {ImageData} data
 * @returns {String} rgba 255, 255, 255, 1
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

      // 处理后的宽高 比例1:1，默认等于原始宽高
      let setImgWidth = rawImgWidth
      let setImgHeight = rawImageHeight

      // 宽屏图时，设置为等比例
      if (rawImgWidth / rawImageHeight > 1) {
        // 重新设置宽高
        setImgWidth = setImgHeight = rawImageHeight
      } else if (rawImgWidth / rawImageHeight < 1) {
        // 重新设置宽高
        setImgWidth = setImgHeight = rawImgWidth
      }

      // 创建画布
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      // 压缩比例，默认等于50%
      let compressionRatio = 0.5

      switch (true) {
        case setImgWidth > 4000:
          compressionRatio = 0.025
          break

        case setImgWidth > 3000:
          compressionRatio = 0.05
          break

        case setImgWidth > 2000:
          compressionRatio = 0.075
          break

        case setImgWidth > 1000:
          compressionRatio = 0.1
          break

        case setImgWidth > 500:
          compressionRatio = 0.2
          break

        default:
          break
      }

      // 画布宽高等于处理后的宽高
      canvas.width = setImgWidth * compressionRatio
      canvas.height = setImgHeight * compressionRatio

      // console.log(rawImgWidth, rawImageHeight, setImgWidth, setImgHeight)

      // 裁剪图片
      context.drawImage(
        tempImg,
        // 裁剪起始点
        0, 0,
        // 裁剪大小
        setImgWidth,
        setImgHeight,
        // 画布起始点
        0, 0,
        // 画布大小
        setImgWidth * compressionRatio,
        setImgHeight * compressionRatio
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
        // item.target.src = rawSrc
        // 压缩图片
        compressionImage(rawSrc).then((src) => {
          item.target.src = src
        }).catch(e => {
          item.target.src = rawSrc
        })
      }
    })
  })
  // 开始观察
  refs.forEach((ele) => {
    if (ele) {
      intersectionObserver.observe(ele)
    }
  })
}
