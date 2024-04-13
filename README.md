# [PT_Masonry] PT 瀑布流视图<br><span style="font-size:20px;">目前支持站点: </span><span style="font-size:20px;font-weight:700;color:red;"> Kame MT </span>

<!-- ./video.mp4 -->

https://github.com/KesaubeEire/PT_Masonry_View_Svelte/raw/newMT/readme/video.mp4

![pic_cover](./readme/pic_cover.png)

<s style="color:gray;">(虽然 M-Team 也自带了,但我纠结很久还是不放弃了捏 🤡)</s>  
这是一个有着丰富配置选项的瀑布流脚本, 功能包括但不限于:

- 悬浮预览查看大图
  <br>
  <span style="color:green;">大图尽可能大</span>

  ![pic_hover](./readme/pic_hover.png)

- 内置种子详情窗口
  <br>
  <span style="color:orange;">不需要在新页面看种子详情了!</span>

  ![pic_detail](./readme/pic_detail.png)

- 界面可配置选项丰富

  ![pic_config](./readme/pic_config.png)

  - <span style="color:orange;">MT 专属: 屏蔽 Gay 片</span>
  - 卡片信息自由配置
  - 瀑布流加载方式可选: 点击加载 & 滚动加载
  - 自由调整瀑布流列数和间隔
  - 其他细节选项...

---

## 小技巧:

(可能会时常调整)

<!-- TODO: 这里要调整 -->

- 点击卡片之间的缝隙可以手动整理卡片
- <details>
  <summary>
    双击切换按钮可以重置瀑布流布局
    <span style="color:cyan;">[点击查看预览图]</span>
    <br>
    <span style="color:orange;">改变浏览器宽度的话布局会乱</span>
  </summary>

  ![pic_flowPanel](./readme/pic_flowPanel.png)

---

<div style="display:flex;justify-content:center;align-items:start;">

<div style="padding:10px;flex:1;">

## 其他特色

- 图片懒加载: 节省性能
- 开启动画比关闭动画节省性能: 重绘次数减少
- 填充文本...

</div>

<div style="padding:10px;flex:1;">

## 其他信息

- [Full Readme(含 TODO)](https://github.com/KesaubeEire/PT_Masonry_View_Svelte/blob/newMT/README.md)
- [Github 地址](https://github.com/KesaubeEire/PT_Masonry_View_Svelte)
- [油猴 地址](https://greasyfork.org/zh-CN/scripts/470821)
- [旧版 Readme(24.4.14)](./readme/readme_old.md)
- [旧版 Github 地址](https://github.com/KesaubeEire/PT_TorrentList_Masonry)
- [旧版 油猴 地址](https://greasyfork.org/zh-CN/scripts/465249-pt种子列表无限下拉瀑布流视图)

</div>

</div>

## TODO LIST

- 重要功能
  - [ ] 劫持 XMLHttpRequest 重构瀑布流
  - [ ] 悬浮预览重构 (pic,trigger_dom,exit_dom)
  - [ ] 适配 mnk?
- 次要
  - [ ] 配置栏的配色固定起来, 防止本站 CSS 污染
  - [ ] 内置说明里标记同步 user.config 的版本号
  - [ ] 更新 M-Team 的电子书分区
- 体验
  - [x] 做一个全新的 readme [2024.4.14]
  - [ ] 优化滚动模式体验: 翻页条显示加载中之类的状态
  - [ ] 搞个内置的使用说明
  - [ ] 在 M-Team 的论坛好好优化一下介绍
