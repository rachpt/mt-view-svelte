<script>
  import {
    _current_domain,
    _Global_Masonry,
    _current_bgColor,
    _turnPage,
    _iframe_switch,
    _iframe_url,
    _show_configPanel,
    _animated,
    _card_layout,
  } from "../stores";
  import { onMount, afterUpdate } from "svelte";

  import {
    sortMasonry,
    NEXUS_TOOLS,
    debounce,
    debounceImmediate,
  } from "../utils";
  import {
    GLOBAL_SITE,
    getCurrentPtDomain,
    GET_TORRENT_LIST_SELECTOR,
    GET_SITE_BACKGROUND_COLOR,
  } from "./index";
  import "../utils/masonry.pkgd.Kesa";

  import { CARD, PAGE, ICON } from "../default.config";

  // import { config as config_Kame } from "./kamept";
  import Kamept from "./kamept.svelte";

  // 父子参数 ------------------------------------------------

  /** 父传值: 原有种子列表dom*/
  export let originTable;

  /** 父传值: 瀑布流dom*/
  export let waterfallNode;

  // 变量声明 ------------------------------------------------
  // NOTE: 这里不能注释掉, 必须留着, 不然 MT 可能不加载 NEXUS_TOOLS
  // @ts-ignore
  window.NEXUS_TOOLS = NEXUS_TOOLS;

  // 组件函数 ------------------------------------------------

  /** 整理卡片布局 */
  function CHANGE_CARD_LAYOUT() {
    // console.log("card width changed.");

    resizeMasonry($_card_layout.column, $_card_layout.gap);
    sortMasonry("fast");
    sortMasonry("fast");
  }
  // @ts-ignore
  window.CHANGE_CARD_LAYOUT = CHANGE_CARD_LAYOUT;

  /**调整瀑布流列数 & 间隔
   * @param {number} columns 列数
   * @param {number} gutter 间隔(px)
   * @returns {number} 卡片宽度
   */
  function resizeMasonry(columns, gutter = 10) {
    // 最少两列
    if (columns <= 1 || gutter <= 1) {
      console.warn("卡片列数或卡片间隔过小, 列数不小于2, 间隔不小于1");
      return;
    }

    // 算宽度
    const widthContainer = document.querySelector("div.waterfall").clientWidth;
    const widthCard = (widthContainer - (columns - 1) * gutter) / columns;

    // 配置宽度
    Array.from(document.querySelectorAll(".card")).forEach(
      (/** @type {HTMLDivElement} */ el) => (el.style.width = widthCard + "px")
    );

    if (masonry) {
      masonry.options.columnWidth = widthCard;
      masonry.options.gutter = gutter;
      masonry.layout();
    }

    // 往 localstorage 里写列数和间隔

    return widthCard;
  }

  // 翻页相关 ------------------------------------------------

  /** 控制加载按钮是否激活 */
  let isButtonDisabled = false;
  /** 控制翻页 & onMount 响应 */
  let onMountSignal = false;
  /** 加载文字 */
  const LOAD_TEXT = {
    normal: "点击加载下一页",
    suspend: `下一页加载CD: ${PAGE.GAP} ms`,
    disable: "不可用",
  };

  /** 翻页
   * @param event
   */
  function turnPage(event) {
    // 防止默认行为的发生
    // console.log(event);
    if (event) event.preventDefault();

    // 加载下一页
    if (!$_turnPage) debounceLoad();

    // 加载下一页3秒防抖
    if (!isButtonDisabled) {
      isButtonDisabled = true;
      setTimeout(() => {
        isButtonDisabled = false;
      }, PAGE.GAP);
    }
  }
  // @ts-ignore
  window.$$$turnPage = turnPage;

  // ------------------------------------------------
  // FIXME: 瀑布流渲染流程------------------------------------------------

  // 1. 获取当前域名 & 背景颜色 --------------------------------------------------------------------------------------
  $_current_domain = getCurrentPtDomain();
  // console.log($_current_domain);

  /** 获取主题背景色 */
  const bgColor = GET_SITE_BACKGROUND_COLOR();
  $_current_bgColor = bgColor;
  console.log("背景颜色:", bgColor);

  // 2. 根据当前域名拿到对应的数据 --------------------------------------------------------------------------------------
  const config = GLOBAL_SITE[$_current_domain];
  let infoList = [];
  infoList = [...infoList, ...config.TORRENT_LIST_TO_JSON(originTable)];

  console.log("---> 环境:\t", import.meta.env.VITE_APP_ENV);

  if (import.meta.env.VITE_APP_ENV == "development") {
    console.log(infoList);
  }

  // NOTE: 如果站点有特殊操作, 这里执行
  GLOBAL_SITE[$_current_domain]?.special();

  // 3. 开整瀑布流 --------------------------------------------------------------------------------------

  let masonry;
  $: if (masonry) {
    CARD.CARD_WIDTH = resizeMasonry($_card_layout.column, $_card_layout.gap);
    console.log("卡片宽度:\t", CARD.CARD_WIDTH);

    CHANGE_CARD_LAYOUT();
  }

  // FIXME:
  // 4. 底部检测 & 加载下一页 --------------------------------------------------------------------------------------
  // |-- 4.1 检测是否到了底部

  /** 延迟加载事件 */
  let debounceLoad;
  function scan_and_launch() {
    const scrollHeight = document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop + clientHeight >= scrollHeight - PAGE.DISTANCE) {
      if ($_turnPage) debounceLoad();
      else {
        console.log("加载模式: 按钮");
      }

      // 这里整理一下瀑布流, 往往这里会出一点格式问题
      sortMasonry();
    }
  }

  // |-- 4.2 加载下一页
  debounceLoad = debounceImmediate(loadNextPage, PAGE.GAP);

  /** 加载下一页的本体函数 */
  function loadNextPage() {
    console.log("到页面底部啦!!! Scrolled to bottom!");
    // |--|-- 4.2.1 获取下一页的链接
    // 使用 URLSearchParams 对象获取当前网页的查询参数
    const urlSearchParams = new URLSearchParams(window.location.search);

    // 获取名为 "page" 的参数的值 -> 初始为页面值, 更新为更新值
    PAGE.PAGE_CURRENT = PAGE.IS_ORIGIN
      ? Number(urlSearchParams.get("page"))
      : PAGE.PAGE_CURRENT;

    // PAGE 初始页面值获取
    if (PAGE.IS_ORIGIN) PAGE.PAGE_ORIGIN = PAGE.PAGE_CURRENT;

    // 如果 "page" 参数不存在，则将页数设为 0，否则打印当前页数
    if (!PAGE.PAGE_CURRENT) {
      console.log(
        `网页链接没有page参数, 无法跳转下一页, 生成PAGE.PAGE_CURRENT为0`
      );
      PAGE.PAGE_CURRENT = 0;
    } else {
      console.log("当前页数: " + PAGE.PAGE_CURRENT);
    }

    // 将页数加 1，并设置为新的 "page" 参数的值
    // @ts-ignore
    PAGE.PAGE_NEXT = parseInt(PAGE.PAGE_CURRENT) + 1;
    // @ts-ignore
    urlSearchParams.set("page", PAGE.PAGE_NEXT);

    // 生成新的链接，包括原网页的域名、路径和新的查询参数
    PAGE.NEXT_URL =
      window.location.origin +
      window.location.pathname +
      "?" +
      urlSearchParams.toString();

    // 打印新的链接
    console.log("New URL:", PAGE.NEXT_URL);

    // TODO: 搞个 list 放入所有生成的新链接, 如果新链接存在就不 fetch 新数据

    // |--|-- 4.2.2 加载下一页 html 获取 json 信息对象
    fetch(PAGE.NEXT_URL)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const table = doc.querySelector(GET_TORRENT_LIST_SELECTOR());

        // NOTE: 原表格随着下一页加载增多
        // FIXME: 目前这里没有问题, 但是保不准其他站点会有问题, 到时候再说吧
        // console.log(table);
        // 获取下一页表格
        const list = Array.from(table.cloneNode(true).children[0].children);
        // 改第一行的标题名称
        list[0].children[1].textContent = `
        ↓ 新加载第${PAGE.PAGE_NEXT - PAGE.PAGE_ORIGIN}页`;

        console.log(PAGE.PAGE_ORIGIN);
        // 将新表格加入原表格
        originTable.children[0].append(...list);

        // NOTE: 如果站点有下一页加载后操作, 这里执行
        // GLOBAL_SITE[$_current_domain]?.pageLoaded();
        typeof GLOBAL_SITE[$_current_domain]?.pageLoaded === "function"
          ? GLOBAL_SITE[$_current_domain]?.pageLoaded()
          : null;

        // NOTE: 瀑布流
        infoList = [...infoList, ...config.TORRENT_LIST_TO_JSON(table)];

        // // |--|-- 4.2.3 渲染 下一页信息 并 加到 waterfallNode 里面来
        // PUT_TORRENT_INTO_MASONRY(table, waterfallNode, false, masonry);
        // // PUT_TORRENT_INTO_MASONRY(_ORIGIN_TL_Node, waterfallNode, false, masonry);

        // // 生成新的时候再改一次图片宽度
        // CHANGE_CARD_WIDTH(CARD.CARD_WIDTH, waterfallNode, masonry);

        // FIXME: 这里没搞定捏

        // 页数更新, 在上面几行更新会导致没有下一页的情况下仍然触发
        PAGE.IS_ORIGIN = false;
        PAGE.PAGE_CURRENT = PAGE.PAGE_NEXT;

        // NOTE: 配置 onMount 和 翻页的协同响应, 避免被其他 dom 刷新干扰重复调用
        onMountSignal = true;
        setTimeout(() => {
          onMountSignal = false;
        }, 1000);
      })
      .catch((error) => {
        // console.error(error);
        console.warn("获取不到下页信息, 可能到头了");
        console.warn(error);
      });
  }

  // NOTE: 响应式变化: 卡片动画缓动
  $: {
    if (masonry) masonry.options.transitionDuration = $_animated ? "0.4s" : "0";
  }

  /** 启动项目配置*/
  onMount(() => {
    // 生成瀑布流
    // @ts-ignore
    masonry = new Masonry(waterfallNode, {
      itemSelector: ".card",
      columnWidth: resizeMasonry($_card_layout.column, $_card_layout.gap),
      gutter: $_card_layout.gap,

      // transitions Duration 默认值为 0.4
      transitionDuration: $_animated ? 0.4 : 0,
    });

    resizeMasonry($_card_layout.column, $_card_layout.gap);

    // 绑定各种全局变量
    // @ts-ignore
    window.masonry = masonry;
    $_Global_Masonry = masonry;

    // 初始化整理布局
    masonry.layout("fast");
    masonry.layout("fast");

    // 给瀑布流节点放一个手动点击整理的功能
    waterfallNode.addEventListener("click", (event) => {
      // 模拟 self, 只有在点击本身而非子元素的时候时触发效果
      if (event.target === event.currentTarget) {
        if (masonry) masonry.layout();
        console.log("Masonry 已整理~");
      }
    });

    // 滚动到底部检测
    window.addEventListener("scroll", function () {
      scan_and_launch();
    });

    // Nexus Tools
    NEXUS_TOOLS();
  });

  /** 更新项目配置*/
  afterUpdate(() => {
    // console.log("afterUpdate-------------------->");

    // 配置 onMount 和 翻页的协同响应, 避免被其他 dom 刷新干扰重复调用
    if (masonry && onMountSignal) {
      masonry.reloadItems();
      masonry.layout();

      // NOTE: 修复了直接调用 Nexus 会导致懒加载失效的 bug
      masonry.once("layoutComplete", () => {
        NEXUS_TOOLS();
      });
    }
  });
</script>

<!-- 卡片渲染模版 -->
{#if $_current_domain == "kamept.com"}
  {#each infoList as info (info.torrentIndex)}
    <Kamept torrentInfo={info} cardWidth={CARD.CARD_WIDTH} {ICON} />
  {/each}
{:else}
  <div>else</div>
{/if}

<!-- 点击加载下一页的按钮 -->
<div>
  <button
    id="turnPage"
    on:click={turnPage}
    disabled={$_turnPage || isButtonDisabled}
  >
    {#if $_turnPage}
      {LOAD_TEXT.disable}
    {:else if isButtonDisabled}
      {LOAD_TEXT.suspend}
    {:else}
      {LOAD_TEXT.normal}
    {/if}
  </button>
</div>

<style>
  /* 卡片: 收藏按钮 */
  #turnPage {
    width: 100%;
    height: 32px;
    border-radius: 16px;
    line-height: 20px;
    font-size: 14px;

    position: absolute;
    bottom: 0px;
  }
</style>
