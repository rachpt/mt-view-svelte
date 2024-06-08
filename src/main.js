import AppNP from './main.svelte';
import { _SITE_SETTING } from './stores';
import SideBar_SWITCH from './afterMain_mt.svelte';
// ----
import { GET_TORRENT_LIST_SELECTOR, GET_SITE_ARCHITECTURE } from './sites/index.js';
// -------------------------------------------------------------

console.log("________PT-TorrentList-Masonry________");

// -------------------------------------------------------------
// ---> neWMT 架构
if (GET_SITE_ARCHITECTURE() == 'NEW_MT') {

  // 初始化 main_newMT.svelte => 套一层 svelte 用以保护 Store 环境, 否则有bug
  const app1 = new SideBar_SWITCH({
    target: (() => {
      const app = document.createElement('div');
      document.body.append(app);
      return app;
    })(),
  });

  // -------------- 建立 xhr 劫持

  // 保存原生的 XMLHttpRequest 对象
  const originalXMLHttpRequest = window.XMLHttpRequest;

  // TODO: 重写 XMLHttpRequest 对象
  function Re_XMLHttpRequest() {
    const xhr = new originalXMLHttpRequest();

    // 保存原始的 open 方法
    const originalOpen = xhr.open;

    // 重写 open 方法
    xhr.open = function (method, url, async, user, password) {
      // 检查是否是特定的请求
      if (url === "https://test2.m-team.cc/api/torrent/search") {
        // 这里可以对特定请求进行拦截和处理

        // 示例：修改请求头
        // xhr.setRequestHeader("Authorization", "Bearer your-access-token");

        // 示例：修改请求头
        // xhr.setRequestHeader(
        //   "Content-Type",
        //   "application/json;charset=UTF-8"
        // );
        console.log(xhr);
      }

      // 继续使用原始的 open 方法
      originalOpen.apply(xhr, arguments);
    };
    // console.log(xhr);

    return xhr;
  };
}
else {
  // -------------------------------------------------------------
  // ---> NexusPHP 架构: 没有相应站点的种子列表 selector 或 种子列表 dom 不存在 就不进行整个程序

  /** 相应站点的种子列表 selector */
  const list_selector = GET_TORRENT_LIST_SELECTOR();
  /**原种子列表DOM */
  const _ORIGIN_TL_Node = document.querySelector(list_selector);

  // 进入 main.svelte
  if (list_selector && !!_ORIGIN_TL_Node) {
    const app = new AppNP({
      target: (() => {
        const app = document.createElement('div');
        document.body.append(app);
        return app;
      })(),
    });
  }
  else { console.log('未识别到种子列表捏~') }
}