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

  $: {
    // 一组: 原表格
    _ORIGIN_TL_Node.style.display = $_list_viewMode ? "none" : "block";

    // 一组: 瀑布流 + 按钮
    nextPageNode.style.display = $_list_viewMode ? "block" : "none";
    waterfallNode.style.display = $_list_viewMode ? "block" : "none";
  }

  // FIXME: 放置节点位置不再是原表格位置, 而是状态栏
  // 表格父节点
  const stateBar = document.querySelector(".ant-card-small");
  const parentNode = stateBar.parentNode;

  // 放置随表格的下一页按钮的节点
  const nextPageNode = document.createElement("div");
  // 添加class
  nextPageNode.classList.add("nextPage");
  // 将随表格的下一页按钮的节点放置在表格节点上面
  parentNode.insertBefore(nextPageNode, stateBar.nextSibling);

  // 放置瀑布流的节点
  const waterfallNode = document.createElement("div");
  // 添加class
  waterfallNode.classList.add("waterfall");
  waterfallNode.classList.add("waterfall_newMT");
  // 将瀑布流节点放置在表格节点上面
  parentNode.insertBefore(waterfallNode, stateBar.nextSibling);
  // console.log(waterfallNode);

  // 给状态栏上 z-index

  // ------------------------------------------------
  let masonry;
  /** 启动项目配置*/
  onMount(() => {
    // UI -> 1. 边栏配置
    const componentSidePanel = new Sidepanel({
      target: document.body,
    });

    // UI -> 2. 瀑布流配置
    // -------------- NEW_MT 架构组件
    const newMT_Masonry = new NEW_MT_Waterfall({
      target: waterfallNode,
      props: {
        // 传递给组件的属性
        originTable: _ORIGIN_TL_Node,
        waterfallNode,
      },
    });

    // UI -> 3. 原表格下一页按钮配置
    const componentBtnTurnPage = new BtnTurnPage({
      target: nextPageNode,
    });
  });
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
