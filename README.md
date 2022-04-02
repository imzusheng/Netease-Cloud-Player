# vue2-netease-cloud-music

VUE | 从 0 搭建「网易云音乐」WEB 端

## 技术

1.图片懒加载

```javascript
// IntersectionObserver
const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((item) => {
    // 图片出现在视野内
    if (item.intersectionRatio > 0) {
      // 加载真正的src
      item.target.src = item.target.getAttribute('data-source-src')
      intersectionObserver.unobserve(item.target)
    }
  })
})
// dom更新完成 开始观察
this.$nextTick(() => {
  document.querySelectorAll('.section-common-list img').forEach((ele) => intersectionObserver.observe(ele))
})
```

2.提取图片主题色

```javascript
/**
 * 提取图片占比最大的颜色
 * @param {ImageData} data
 * @returns {String} rgba 255, 255, 255, 1
 */
export const getMainColor = (imgSrc) => {
  function getRgba(data) {
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
  return new Promise((resolve) => {
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
```
