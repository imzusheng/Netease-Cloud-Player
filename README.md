# [高颜值网易云音乐](https://demo.zusheng.club/cloud_music/#/)

正在用 vue3、vite、typescript 仿 AppleMusic 重新写了一个移动端的播放器

![图片](http://cdn.zusheng.club/screenshots/blog/vite-music.gif)

[体验一下 demo(建议手机)](https://demo.zusheng.club/music)

## 前言

API 源自[网易云音乐 NodeJS 版 API](http://github.com/Binaryify/NeteaseCloudMusicApi)，非常感谢 API 提供者。

最近一项考试需要用到 vue2 所有没有选择 3，本身也很少接触 Audio API。发现如此全面的网易云音乐 API 后来踩踩坑，交互界面参考 Spotify、YouTuBe Music，后续考虑用 vue3、vite、typescript 练手。

目前仍在开发，如果对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！

## 演示

1. 主页

![图片](http://cdn.zusheng.club/screenshots/cloud-music/01.png)

![图片](http://cdn.zusheng.club/screenshots/cloud-music/02.png)

2. 自动提取主题色

![图片](http://cdn.zusheng.club/screenshots/cloud-music/gif_02.gif)

![图片](http://cdn.zusheng.club/screenshots/cloud-music/03.png)

3. 播放 mv

![图片](http://cdn.zusheng.club/screenshots/cloud-music/07.png)

4. 艺人详情

![图片](http://cdn.zusheng.club/screenshots/cloud-music/gif_01.gif)

5. 播放列表

![图片](http://cdn.zusheng.club/screenshots/cloud-music/05.png)

## 项目中遇到的问题和总结记录

- [虚拟无限滚动列表组件](https://blog.zusheng.club/Blog/Detail?_id=6257ca3adccd7d03d37e93ad)

- [用 Observer API 配合 Vue 自定义指令实现全局图片懒加载](https://blog.zusheng.club/Blog/Detail?_id=6261568ddccd7d03d37e93af)

- [Vue3 中使用 mapActions 和 mapMutations 语法糖](https://blog.zusheng.club/Blog/Detail?_id=6261568ddccd7d03d37e93af)

- [Canvas 提取图片主题色](https://blog.zusheng.club/Blog/Detail?_id=6261568ddccd7d03d37e93af)

- [Canvas 压缩图片分辨率](https://blog.zusheng.club/Blog/Detail?_id=6261568ddccd7d03d37e93af)

- [mouse 和 touch 冲突](https://blog.zusheng.club/Blog/Detail?_id=6261568ddccd7d03d37e93af)

## 技术栈

- vue2
- axios
- vue-cli
- less
- fetch

## 特点

- [x] 推荐歌单
- [x] 推荐 MV
- [x] 推荐歌手
- [x] 推荐新曲
- [x] 视频播放器
- [x] 音乐播放器
- [x] 显示播放进度
- [x] 拖动调整进度
- [x] 全局图片懒加载
- [x] 自动提取封面主题色
- [x] 显示缓存进度
- [x] 播放错误重连
- [x] 播放列表
- [x] 刷新恢复播放
- [x] 搜索所有内容
- [x] 搜索提示
- [x] vip 提示
- [ ] 登录
- [x] 自动连播
- [x] 选择码率
- [x] 随机播放
- [x] 播放模式
- [ ] 歌词

[我的博客](https://blog.zusheng.club)

[项目地址](https://demo.zusheng.club/cloud_music/#/)
