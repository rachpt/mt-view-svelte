import BtnReload from './component/btnReload.svelte';
import AppNP from './main.svelte';
import AppNMT from './main_newMT.svelte';
import { get } from 'svelte/store'
import { _SITE_SETTING } from './stores';
// ----
import { GET_TORRENT_LIST_SELECTOR, GET_SITE_ARCHITECTURE } from './sites/index.js';
// -------------------------------------------------------------

console.log("________PT-TorrentList-Masonry________");

// -------------------------------------------------------------
// ---> neWMT 架构
if (GET_SITE_ARCHITECTURE() == 'NEW_MT') {

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

  /** main_newMT.svelte 的容器 */
  let app;

  // 初始化 Store -> get(_SITE_SETTING).mt.path_in_browse 的参数
  if (location.pathname.includes('/browse') || location.pathname == '/browse') {
    get(_SITE_SETTING).mt.path_in_browse = true;
  }

  // 初始化 main_newMT.svelte
  if (location.pathname.includes("/browse")) {
    // 进入 main.svelte
    if (!app) {
      app = new AppNMT({
        target: (() => {
          const app = document.createElement('div');
          document.body.append(app);
          return app;
        })(),
      });
    }
  }

  // 保存原始的 pushState 方法
  const originalPushState = history.pushState;
  // 监听路径改变
  history.pushState = function (state, title, path) {
    // 在这里执行自定义逻辑
    // NOTE: 获取目标 URL Path
    // console.log("pushState ---> state:", state);
    // console.log("pushState ---> title:", title);
    console.log(
      `%c [main] ====> URL跳转劫持: %c${path}`,
      "color: green",
      "color: white",
    );

    // 判读是否在 /browse path 内, 在就进行 search api 筛选
    // @ts-ignore
    if (path.includes("/browse") || path == "/browse") {

      // 在 /browse 内, 全局变量显示侧边栏
      let tmp = get(_SITE_SETTING);
      tmp.mt.path_in_browse = true;
      _SITE_SETTING.set(tmp)
      console.log('侧边栏: ', get(_SITE_SETTING).mt.path_in_browse);

      // 进入 main.svelte
      if (!app) {
        app = new AppNMT({
          target: (() => {
            const app = document.createElement('div');
            document.body.append(app);
            return app;
          })(),
        });
      }
    } else {
      // 不在 /browse 内, 全局变量隐藏侧边栏
      let tmp = get(_SITE_SETTING);
      tmp.mt.path_in_browse = false;
      _SITE_SETTING.set(tmp)
      console.log('侧边栏: ', get(_SITE_SETTING).mt.path_in_browse);
    }

    // FIXME: 别动这个就行
    // 调用原始的 pushState 方法
    originalPushState.apply(history, arguments);
  };



  // NOTE: 劫持 xhr, 感觉没啥用, 先停止了吧
  // window.XMLHttpRequest = Re_XMLHttpRequest;

  // 判断是否需要弹出提醒刷新页面
  // const btn = new BtnReload({
  //   target: document.body
  // });


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