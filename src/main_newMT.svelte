<script>
  import "./app.css";
  import "./utils/masonry.pkgd.Kesa";
  import { onMount } from "svelte";
  import Sidepanel from "./sidepanel.svelte";
  import NEW_MT_Waterfall from "./sites/_index_newMT.svelte";
  import {
    _Global_Masonry,
    _list_viewMode,
    _iframe_switch,
    _iframe_url,
    _current_domain,
    _show_configPanel,
  } from "./stores";
  import { GET_TORRENT_LIST_SELECTOR, GLOBAL_SITE } from "./sites";
  import BtnTurnPage from "./component/btnTurnPage.svelte";
  import { fade } from "svelte/transition";
  // ------------------------------------------------

  console.log(
    `[${new Date().toLocaleTimeString()}]<----------------------HMR_NewMT---------------------->`
  );

  // 1. 隐藏原种子列表并进行前置操作 --------------------------------------------------------------------------------------
  let _ORIGIN_TL_Node = document.querySelector(GET_TORRENT_LIST_SELECTOR());
  window._ORIGIN_TL_Node = _ORIGIN_TL_Node;

  /**重置原列表节点DOM*/
  function update_ORIGIN_TL_Node() {
    console.log("--------> 更新 _ORIGIN_TL_Node");

    if (
      document.querySelector(GET_TORRENT_LIST_SELECTOR()) != _ORIGIN_TL_Node
    ) {
      console.log("--------> 已替换 _ORIGIN_TL_Node");
      _ORIGIN_TL_Node = document.querySelector(GET_TORRENT_LIST_SELECTOR());
      // console.log(_ORIGIN_TL_Node);

      // 重新配置原表格DOM显示 or 隐藏
      _ORIGIN_TL_Node.style.display = $_list_viewMode ? "none" : "block";
    }
  }

  // while (!_ORIGIN_TL_Node) {
  //   _ORIGIN_TL_Node = document.querySelector(GET_TORRENT_LIST_SELECTOR());
  // }
  let triggerNext = false;

  // ----------------------------
  // FIXME: 不记得这里是干什么了, 实在没啥用可以删掉

  function stopChecking() {
    if (observer) {
      observer.disconnect();
      console.log("Stopped checking for DOM element.");
    }
  }

  function checkForElement() {
    const targetElement = document.querySelector(GET_TORRENT_LIST_SELECTOR());

    if (targetElement) {
      stopChecking();
      console.log("DOM element exists:", targetElement);
      triggerNext = true;
      // 在这里执行您想要的操作
    } else {
      console.log("DOM element not found, still checking...");
    }
  }

  // checkForElement(); // 立即检查一次
  // let observer;
  // observer = new MutationObserver(checkForElement);
  // observer.observe(document.body, { childList: true, subtree: true });

  // 面板相关 ------------------------------------------------

  /** 关闭 iframe */
  function toggleIframe() {
    $_iframe_switch = 0;
  }

  /** esc 控制关闭所有面板 */
  function key_closePanels(event) {
    // console.log(event);
    if (event.key === "Escape") {
      console.log(event);
      $_iframe_switch = 0;
      $_show_configPanel = false;
    }
  }

  // ----------------------------

  // 隐藏原有视图
  // @ts-ignore
  // _ORIGIN_TL_Node.style.display = "none";

  // 这里检测 Masonry 是否加载成功了 ------------------
  // @ts-ignore
  while (!Masonry) {
    console.log("等待初始化......");
  }

  // FIXME: 打包模式读不到一开始的 DOM, 这样处理了
  // $: {
  //   // 一组: 原表格
  //   _ORIGIN_TL_Node.style.display = $_list_viewMode ? "none" : "block";
  //   // 一组: 瀑布流 + 按钮
  //   nextPageNode.style.display = $_list_viewMode ? "block" : "none";
  //   waterfallNode.style.display = $_list_viewMode ? "block" : "none";
  // }

  // 给状态栏上 z-index

  // ------------------------------------------------
  let masonry;
  /** 启动项目配置*/

  // FIXME: 打包模式读不到一开始的 DOM, 这样处理了
  /**延迟获取 DOM
   * @param selector
   * @param maxRetries
   * @param interval
   * @param func 获取后的回调函数
   */
  function getDOMElement(
    selector,
    maxRetries = 5,
    interval = 200,
    func = (el) => {}
  ) {
    const element = document.querySelector(selector);
    if (element) {
      func(element);
      return element;
    }

    if (maxRetries > 0) {
      // 如果还有重试次数，延迟一段时间后再次尝试
      setTimeout(() => {
        getDOMElement(selector, maxRetries - 1, interval, func);
      }, interval);
    } else {
      // 达到最大重试次数后仍未找到元素，可以在这里添加处理逻辑
      console.log(`无法找到元素: ${selector}`);
    }
  }

  /**瀑布流DOM*/
  let waterfallNode;
  /**瀑布流父DOM*/
  let waterfallParentNode;
  /**翻页 Button DOM*/
  let nextPageNode;

  // 获取固定 DOM 并开始挂载
  const stateBar = getDOMElement(
    ".ant-card.ant-card-small",
    5,
    200,
    (_stateBar) => {
      // 获取 DOM
      const parentNode = _stateBar.parentNode;

      // ----- 声明: 瀑布流DOM & 瀑布流父DOM
      // 瀑布流DOM
      waterfallNode = document.createElement("div");
      waterfallNode.classList.add("waterfall");
      waterfallNode.classList.add("waterfall_newMT");
      // 瀑布流父DOM
      waterfallParentNode = document.createElement("div");
      waterfallParentNode.classList.add("waterfallParent");
      // 父子安排
      waterfallParentNode.append(waterfallNode);

      // 将瀑布流父节点放置在表格节点上面
      parentNode.insertBefore(waterfallParentNode, _stateBar.nextSibling);
      // console.log(waterfallNode);

      // ------声明: 翻页 Button DOM
      nextPageNode = document.createElement("div");
      // 添加class
      nextPageNode.classList.add("nextPage");
      // 放进 瀑布流父DOM 里
      waterfallParentNode.append(nextPageNode);

      // ----- 挂载: 各种 Svelte 组件

      // UI -> 1. 边栏配置
      const componentSidePanel = new Sidepanel({
        target: document.body,
      });

      // UI -> 2. 瀑布流配置
      const newMT_Masonry = new NEW_MT_Waterfall({
        target: waterfallNode,
        props: {
          // 传递给组件的属性

          // 瀑布流DOM & 瀑布流父DOM
          waterfallNode,
          waterfallParentNode,

          // 原列表DOM
          // _ORIGIN_TL_Node,

          // 重置原列表节点DOM函数
          update_ORIGIN_TL_Node,
        },
      });

      // UI -> 3. 原表格下一页按钮配置
      const componentBtnTurnPage = new BtnTurnPage({
        target: nextPageNode,
      });
    }
  );
</script>

<!-- iframe 详情 -->
{#if $_iframe_switch}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id="_iframe" on:click={toggleIframe} transition:fade={{ duration: 300 }}>
    <div class="_iframe">
      <iframe
        src={$_iframe_url}
        frameborder="0"
        title="wow"
        style="width:
      {GLOBAL_SITE[$_current_domain]
          ? GLOBAL_SITE[$_current_domain].Iframe_Width
          : 1000}px"
      />
      <div class="_iframeCloseBtn" on:click={toggleIframe}>
        <!-- svg 关闭 icon -->
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_iconCarrier">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#1C274C"
              stroke-width="1.5"
            />
            <path
              d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
              stroke="#1C274C"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
{/if}

<!-- NOTE: svelte 绑定 window -> 按 escape 退出各种子面板 -->
<svelte:window on:keydown|capture={key_closePanels} />

<style>
  div#_iframe {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 38, 38, 0.607);
    z-index: 30000;

    display: flex;
  }

  div._iframe {
    /* width: 1246px; */
    height: 96%;

    margin: auto;

    position: relative;
  }

  div._iframe iframe {
    height: 100%;

    border-radius: 20px;
  }

  ._iframeCloseBtn {
    width: 40px;
    height: 40px;
    background: white;

    position: absolute;

    top: 10px;
    right: 10px;

    border-radius: 40px;
  }
</style>
