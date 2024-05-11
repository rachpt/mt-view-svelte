<script>
  import AppNMT from "./main_newMT.svelte";
  import { get } from "svelte/store";
  import { _SITE_SETTING } from "./stores/index.js";

  export function showSideBar() {
    $_SITE_SETTING.mt.path_in_browse = true;
  }
  export function hideSideBar() {
    $_SITE_SETTING.mt.path_in_browse = false;
  }

  /** main_newMT.svelte 的容器 */
  let app;

  // 初始化 Store -> get(_SITE_SETTING).mt.path_in_browse 的参数
  if (location.pathname.includes("/browse") || location.pathname == "/browse") {
    get(_SITE_SETTING).mt.path_in_browse = true;
  }

  // 初始化 main_newMT.svelte
  if (location.pathname.includes("/browse")) {
    // 进入 main.svelte
    if (!app) {
      app = new AppNMT({
        target: (() => {
          const app = document.createElement("div");
          document.body.append(app);
          return app;
        })(),
      });
    }
  }

  // 保存原始的 pushState 方法
  const originalPushState = history.pushState;
  // 监听路径改变
  history.pushState = hijackPushState;
  function hijackPushState(state, title, path) {
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
      _SITE_SETTING.set(tmp);
      console.log("侧边栏: ", get(_SITE_SETTING).mt.path_in_browse);

      // 进入 main.svelte
      if (!app) {
        app = new AppNMT({
          target: (() => {
            const app = document.createElement("div");
            document.body.append(app);
            return app;
          })(),
        });
      }
    } else {
      // 不在 /browse 内, 全局变量隐藏侧边栏
      let tmp = get(_SITE_SETTING);
      tmp.mt.path_in_browse = false;
      _SITE_SETTING.set(tmp);
      console.log("侧边栏: ", get(_SITE_SETTING).mt.path_in_browse);
    }

    // FIXME: 别动这个就行
    // 调用原始的 pushState 方法
    originalPushState.apply(history, arguments);
  }

  // NOTE: 劫持 xhr, 感觉没啥用, 先停止了吧
  // window.XMLHttpRequest = Re_XMLHttpRequest;

  // 判断是否需要弹出提醒刷新页面
  // const btn = new BtnReload({
  //   target: document.body
  // });
</script>
