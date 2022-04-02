/**
 * fetch数据转json
 * @param {String} url 传入url
 * @returns Promise resJSON
 */
export const fetchToJson = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url).then((res) => {
      res.json().then((resJson) => {
        if (resJson.code === 200) {
          resolve(resJson)
        } else {
          reject(resJson)
        }
      })
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
      i += 4
    }
    return color
  }
  return new Promise(resolve => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 200
    canvas.height = 200
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
        r -= 80
        g -= 80
        b -= 80
      } else if (r > 150 || g > 150 || b > 150) {
        r -= 40
        g -= 40
        b -= 40
      } else if (r < 50 || g < 50 || b < 50) {
        r += 80
        g += 80
        b += 80
      }
      resolve(`${r}, ${g}, ${b}, 1`)
    }
  })
}
