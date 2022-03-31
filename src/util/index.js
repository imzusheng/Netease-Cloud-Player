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
