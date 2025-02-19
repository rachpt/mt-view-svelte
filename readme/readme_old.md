# 为 PT 站点 打造的种子列表瀑布流视图 (现支持 Kame & MT)

<!-- TODO: 改为显示边栏的 -->
![gif_preview.gif](https://github.com/KesaubeEire/PT_TorrentList_Masonry/blob/main/preview/gif_preview.gif?raw=true)

<!-- TODO: 改为显示边栏的 -->
预览视频:

https://user-images.githubusercontent.com/20382002/236703818-427840b9-aaee-4133-9185-59244245cb7b.mov

<!-- https://raw.githubusercontent.com/KesaubeEire/PT_TorrentList_Masonry/main/preview/_input.mov -->
<!-- https://github.com/KesaubeEire/PT_TorrentList_Masonry/blob/main/preview/_input.mov?raw=true -->

| 新版 | 旧版 |
|-----|-----|
| [github 项目地址~](https://github.com/KesaubeEire/PT_Masonry_View_Svelte) | [旧版 github 项目地址~](https://github.com/KesaubeEire/PT_TorrentList_Masonry) |
| [油猴 项目地址~](https://greasyfork.org/zh-CN/scripts/470821) | [旧版 油猴 项目地址~](https://greasyfork.org/zh-CN/scripts/465249-pt种子列表无限下拉瀑布流视图) |


---

## 简介

RT, 本油猴脚本专为 PT 打造, 让你顺畅划划点点, 一页爽逛种子超市!
欢迎为项目提 [issue](https://github.com/KesaubeEire/PT_Masonry_View_Svelte/issues) 以及留言配置您想适配的站点~

相关事宜如果您在 tg 能找到我也可以直接联系我~

<!-- ![gif_preview.gif](./preview/gif_preview.gif) -->

---

## 使用说明

0. 注意事项
    1. 建议使用 Chrome 浏览器, 火狐等其他浏览器可能存在不知名问题(from tg by 天 胖)
    2. **不支持 Dark Passion 主题!!! 推荐 blue gene 主题!!!**

1. 本脚本功能:
   1. 对现有的种子列表模式进行增强
      1. 点击图片可以在内部窗口查看种子详情! 不需要新打开表情页了!!!
   1. 支持在已适配的站点将种子列表变为瀑布流视图
   1. 在侧边栏区域可以设置各种配置
      1. 可以拖拽侧边栏位置
      1. 可以切换显示模式: 原表格模式 & 瀑布流模式
      1. 可以呼出详细配置面板配置细节  
      (所有配置都能在同一个站点记忆, 不同的站点之间配置不共享)
      1. 如果找不到侧边栏, 页面最下面有 "重置瀑布流配置边栏位置" 的按钮  
   1. 鼠标悬浮预览
      1. 鼠标悬浮在卡片非图片区域可以显示种子详细数据内容
      1. 鼠标悬浮在标题区域可以显示标题全称, 默认只显示最多两行
      1. 可以选择整个图片悬浮触发预览或者局部触发预览
      1. 可以调整是否延迟显示大图以防止大图在无意中触发
   1. <span style="color: red"><b>点击图片可以在内部窗口查看种子详情! 不需要新打开表情页了!!!</b></span>
   1. <span style="color: red"><b>点击列和列之间的间隙也可以整理布局! 不需要鼠标移到右上角了!!!</b></span>
   1. 图片懒加载: 对电脑性能和服务器负担都比较小~
   1. 滑动或按钮可以无缝显示下一页的内容, 表格模式 & 瀑布流模式都支持!
2. 推荐设置:

   1. 如果 PT 站点是 NexusPHP 架构, 推荐将主题改为 Blue Gene  
      (一般更改主题方式: 控制面板->网站设定->界面风格)
   1. 某些站点限制网页刷新频率, 所以默认翻页是要点按钮的,  
      可以右上手动改为自动检测翻页, 请理解~

---

<details>
<summary>TODO LIST</summary>

- 宏观类
    - [ ] (已放弃) 在 readme.md 中把架构图画出来以防屎山(from tg by @兔纸)

- 功能类
    - [x] 原 table 也随着滑动到底部自动添加数据 (np架构可以)
    - [ ] TODO: ( 类似index的位置 )显示当前是否下载以及下载进度(from tg by @Charlie Swift)
    - [ ] TODO: 配置按钮区域可拖动
      - [ ] 排序区按钮(from tg by 天 胖)
      - [ ] 卡片宽度 & 间距宽度 调整
      - [ ] 简洁模式 & 详细模式 切换
      - [x] TODO: 图片中心眼睛 logo
        - [x] 跟随预览 & 中间预览 切换(from tg by 天 胖)
    - [x] 加个 ESC 按钮退出 iframe 显示(from tg by LNN)
    - [x] Nexus 触摸显示大图放个半秒再显示？避免划过显示一堆不想看的？(from tg by LNN & 龟龟)
    - [x] 配置一下标题的隐藏(from tg by LNN)
    - [x] 侧边栏右侧位置保护(from tg by 天 胖)
    - [x] 将是否打开原有列表记忆在 localstorage 里(from tg by 天 胖)
    - [x] 给列表模式加点击 iframe 显示详情(from tg by 天 胖)
    - [x] 配置悬浮预览大图的触发方式: 全图 or 局部 (以改善直接悬浮图片显示大图的体验) (from tg by 兔纸) 
      - [x] Kame
      - [x] M-Team
    - [x] TODO: 排列模式:按照列的模式加紧(from tg by 天 胖)  
    基本搞定了, 想想怎么在UI上整合进去就行, 代码也要改, 下面的不过是伪代码罢了.
        ```javascript
        function resizeMasonry(columns,gutter=10) {
          // 最少两列
          if(columns<=1 || gutter<=1) {
            console.warn('卡片列数或卡片间隔过小, 列数不小于2, 间隔不小于1')
            return
          }

          // 算宽度
          const widthContainer =  document.querySelector('div.waterfall').clientWidth;
          const widthCard = (widthContainer - (columns-1)*gutter)/(columns);

          // 配置宽度
          Array.from(document.querySelectorAll('.card')).forEach(el=>el.style.width = widthCard+'px'); 
          masonry.options.columnWidth = widthCard; 
          masonry.options.gutter = gutter ; 
          masonry.layout();

          // 往 localstorage 里写列数和间隔
        }
        ```

- 样式类
    - [x] iframe 两侧颜色降低亮度(from tg by LNN)
    - [x] 边栏整体向 bilibili-evolve 看齐(from tg by LNN)
    - [x] MT卡片分类文字居中(from tg by 天 胖)
    - [ ] TODO: 将 'new' 'hot' 和 index 一样放在图片上下左右
    - [x] (已放弃) 改改阴影, 学习 [如何用 CSS 中写出超级美丽的阴影效果](https://juejin.cn/post/7034323356459466760)(from tg by Kyaru)
    - [ ] 刚进种子页面会出现蚂蚁线, 考虑改进一下?(from tg by LNN)
    - [x] 在非瀑布流模式下点击下一页没用, 报错



- 站点指定修改类
    - [x] Kame: 给龟站的搜索箱默认设置为"不扩展", 否则平常占地方(from tg by LNN)
    - [x] Kame: "点此查看即将断种资源" 文字设置为黑色(from tg by LNN)
    - [x] Kame: 勋章 z-index 较低会被卡片挡住(from tg by bacz)

- 说明类
  - [ ] github & 油猴介绍 数据脱敏 (from tg by 天 胖)
      - [ ] 问一下每个站点的管理有没有必要
      - [ ] 去除匹配站点的域名展示
      - [ ] 去除匹配站点的原始匹配

- NOTE: 对 M-team 新架构的功能计划
  - [ ] 瀑布流
      - [x] 对 localstorage & URL path 相关参数的完整识别及劫持
        - [x] 获取当前所在 path -> 分区 / pageSize 获取下拉请求的 search 参数
        - [x] 搞定刷新的 loading
        - [x] 初始化加载 -> 封装参数转换函数 & localstorage 持久化函数的 文本 & 对象 的本地缓存
        - [x] 搞定加载下一页
      - [x] 卡片处理
        - [x] 获取背景颜色 -> 并封装到所有站点配置项目里
        - [x] 图片加载失败 & 无预览图片 svg 缺省图片 -> 已向其他支持的站点推广
        - [x] 对 icon 进行 svg 改造
        - [x] 将卡片各个部分的显示隐藏配置完整
      - [x] 整合 localstorage 条目, 像 newMT 的 localstorage 一样干净
  - [ ] 小 bug
      - [x] 处理 ant-submenu 等 z-index 遮挡问题
      - [x] 延时触发 Nexus_Tools, 避免懒加载失效
      - [x] 点到非 /browse 页面 loading 依然会出现
      - [x] /browse 出来又回来 originTable 出现了
      - [x] 详细配置面板样式小问题
      - [x] 无动画情况下更改显示条目的卡牌自动整理不起效
  - [ ] 对没有加载到的 src 进行预加载(大活儿, 不着急)
      ```javascript
      // 图片链接数组
      const imageUrls = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
      ];

      // 创建一个数组来存储预加载的图片
      const preloadedImages = [];

      // 遍历图片链接并预加载它们
      imageUrls.forEach((imageUrl) => {
        const img = new Image();
        img.src = imageUrl;

        // 将预加载的图片对象存储到数组中
        preloadedImages.push(img);
      });

      // 可以在需要时使用已经预加载的图片
      // 例如，将它们添加到页面上：
      preloadedImages.forEach((img) => {
        document.body.appendChild(img);
      });
      ```


</details>

---

<details>
<summary>旧版历史 TODO LIST</summary>

- 其他事务
  - [x] 将 油猴脚本从成人区撤离, 改为正常
  - [x] 将 特别区作为截图示范, 添加 /special.php 的适配
- 功能列表

  - [x] 懒加载(from tg by @兔纸)
    - [x] 懒加载完成后新图片出来之际整理瀑布流
    - [x] 修复了一些小的懒加载不出图的小 bug
  - [x] 触摸图片预览原图(from tg by @兔纸)
    - [x] 修正右边图片的预览位置
      - [x] <s>抄[某 pixiv 油猴脚本](https://github.com/Ocrosoft/PixivPreviewer)的实现(from tg by @兔纸)</s> 失败了, 有点复杂
      - [x] 自己改了改, 基本修正了
      - [x] 更好的四空间(四叉树)改造法基本完成, 等待大家反馈意见
        - [x] 做一个切换显示方式(尽量原图&最大显示)的切换变化, panel 完成后搞
  - [x] 默认将自动翻页改为按键翻页(from tg by @兔纸)
    - [x] <s>抄 NGA 的方式下拉到底后触点下一页(from tg by @兔纸)</s> 不太好用捏
    - [x] 给滑动翻页加一个防抖, 时间可以久一点
  - [x] 瀑布流基础排版
  - [x] 滑动到底部刷新页面
  - [x] 美化卡片内信息布局 & 样式

    - [x] <s>抄鲨鱼的 UI 样式, Free 的提示什么的(from tg by @兔纸)</s> 用原样了捏
    - [x] 基本布局
    - [x] 点击整个卡片跳转(from tg by @风言)
      - [x] 没有完全弄成那样, 会妨碍下载和收藏, 把图片和副标题点击跳网页做了
    - [x] 点击卡片不是打开新页面，而是在本页面打开 iframe 直接看内容，看完关掉，都不用切换页面了
    - [x] 卡片背景颜色适配主题(from tg by @LNN)
    - [x] 去掉副标题(from tg by @lslqtz)
    - [x] 右上角按钮 z-index 置顶(from tg by @lslqtz)
    - [x] 标签样式改为 div 的多行 flex(from tg by @bacz)

  - [ ] 将一些参数配置为可变

    - [x] 配置 LocalStorage 记录参数捏
    - [x] 单列宽度可调整(已 api 实现, 还需要简化操作方式)
      - [x] UI 化宽度调整 -> 右上角可设置单列 200px / 300px 切换
    - [x] 分卡片固定宽度模式和列数固定宽度模式
      - [x] 宽度固定模式: 默认模式(废弃)
      - [x] 列数固定模式: 默认固定列数可调, 不少于 x 列 (from tg by @兔纸)
    - [ ] 设置详情文字(副标题)和标签左对齐 or 居中(from tg by @阴天)
    - [x] 配置可以忽略详情只剩标题图片的简略模式
    - [x] MT 已适配

  - [ ] 花样小 bug

    - [x] 下载按钮 href
    - [x] 改为宽列后, 新增的卡片仍然按照原先的列宽生成卡片
    - [x] 当下拉页没有新内容时控制台优雅报错
    - [x] 缩放小于 95% 时右侧有空隙 -> 不清楚真实的 4K 屏幕会不会有影响, 只能先这样设置边框为 3px
    - [x] 点击收藏后刷新页面 or 直接更新收藏图标
      - [ ] UI 提示
    - [x] 标题过长的话半透明背景可能会导致文字与图片重叠 (from tg by @bacz)
    - [x] 测试网站地址漏了 (from tg by @bacz)
    - [x] 收藏按钮样式调整 (from tg by @bacz)
    - [x] 图片链接多此一举了, 直接搬原链即可 (from tg by @Kyaru)
    - [x] 预览大图片的 bug 基本修完, 可继续改进
    - [x] 集成 Masonry.js 到项目, 非常感谢胖哥!!!(from tg by 天 胖)
    - [x] 让下载和收藏都变成隐藏按钮: 现在下载还不是隐藏按钮
    - [ ] ...

  - [x] 站点状态对齐
    - [x] KamePT.js: 最新
      - [x] (卡片顶部种类样式待更新)
      - [x] free 时间被搞到了临时标签里, 取出来
    - [x] MTeam.js: 最新
    - [x] PTer.js: 最新
  

<details>
    <summary><s>记录一些小小的暴论(嘻嘻本人不要打我)</s></summary>
    <p>1. 违反用户直觉的都是垃圾程序 by兔纸(2023/05/08 18:39)</p>
</details>
</details>
