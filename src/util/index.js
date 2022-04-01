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
  return artists
    .map((n) => {
      if (n.name) return n.name
      else return n
    })
    .join(Separator)
}

/**
 * 提取图片占比最大的颜色
 * @param {ImageData} data
 * @returns {String} rgba 255, 255, 255, 1
 */
export const getMainColor = (data) => {
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
