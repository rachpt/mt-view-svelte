<script>
  import {
    _current_domain,
    _Global_Masonry,
    _card_width,
    _current_bgColor,
    _turnPage,
    _iframe_switch,
    _iframe_url,
    _show_configPanel,
    _list_viewMode,
  } from "../stores";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {
    sortMasonry,
    NEXUS_TOOLS,
    // @ts-ignore
    debounce,
    parseLocalStorage,
    debounceImmediate,
  } from "../utils";
  // @ts-ignore
  import { CARD, PAGE } from "../default.config";
  import {
    // @ts-ignore
    GLOBAL_SITE,
    GET_CURRENT_PT_DOMAIN,
    // @ts-ignore
    GET_TORRENT_LIST_SELECTOR,
    GET_SITE_BACKGROUND_COLOR,
  } from "./index";
  import "../utils/masonry.pkgd.Kesa";
  import TestMteam from "./testMteam.svelte";
  import { config } from "./testMteam";
  // 父子参数 ------------------------------------------------

  /** 父传值: 瀑布流dom*/
  export let waterfallNode;

  /** 父传值: 瀑布流父dom*/
  export let waterfallParentNode;

  /** 父传值: 原列表dom*/
  // export let _ORIGIN_TL_Node;

  /** 父传值: 重置原列表节点DOM函数*/
  export let update_ORIGIN_TL_Node;

  // 0. 变量声明 & 配置 ------------------------------------------------

  // search api
  const searchApiURL = config.HOST + config.API.search.url;

  // NOTE: 这里不能注释掉, 必须留着, 不然 MT 可能不加载 NEXUS_TOOLS
  // Nexus_Tools 绑定
  // @ts-ignore
  window.NEXUS_TOOLS = NEXUS_TOOLS;

  // 瀑布流变量声明
  let masonry;

  // 卡片宽度变化相应
  // @ts-ignore
  $: if (masonry) {
    CARD.CARD_WIDTH = $_card_width;
    console.log("卡片宽度:\t", CARD.CARD_WIDTH);

    CHANGE_CARD_LAYOUT();
  }

  // loading 相关变量
  /** loading 样式变化 trigger 声明 */
  let loading_hide = false;
  /** loading 第一次 trigger 声明 */
  let loading_first = true;

  // loading 初始化 -> 瀑布流父 DOM 保留高度
  waterfallParentNode.style.height = "116px";

  // 1. 获取当前域名 & 背景颜色 --------------------------------------------------------------------------------------
  $_current_domain = GET_CURRENT_PT_DOMAIN();

  /** 获取主题背景色 */
  const bgColor = GET_SITE_BACKGROUND_COLOR();
  $_current_bgColor = bgColor;
  console.log("背景颜色:", bgColor);

  // 2. 组件函数 ------------------------------------------------
  /** 根据容器宽度和卡片宽度动态调整卡片间隔 gutter
   * @param {object} containerDom 容器dom
   * @param {number} card_width 卡片宽度
   */
  // @ts-ignore
  function GET_CARD_GUTTER(containerDom, card_width) {
    // 获取容器宽度
    const _width = containerDom.clientWidth;
    // console.log(containerDom);

    // 获取一个合适的 gutter
    const card_real_width = card_width + CARD.CARD_BORDER;
    const columns = Math.floor(_width / card_real_width);
    const gutter = (_width - columns * card_real_width) / (columns - 1);
    console.log(`列数:${columns} 间隔:${gutter}`);
    console.log(
      `容器宽:${_width} 列宽:${
        masonry ? masonry.columnWidth : "masonry 丢失!!!"
      }`
    );

    return Math.floor(gutter);
  }

  /** 切换显示模式 */
  function ChangeShowMode() {
    const _$_ORIGIN_TL_Node = document.querySelector(
      GET_TORRENT_LIST_SELECTOR()
    );
    const _$nextPageNode = document.querySelector(".nextPage");
    const _$waterfallNode = document.querySelector(
      ".waterfall.waterfall_newMT"
    );
    // 一组: 原表格
    _$_ORIGIN_TL_Node.style.display = $_list_viewMode ? "none" : "block";
    // 一组: 瀑布流 + 按钮
    _$nextPageNode.style.display = $_list_viewMode ? "block" : "none";
    _$waterfallNode.style.display = $_list_viewMode ? "block" : "none";
  }

  /** 调整卡片布局 */
  function CHANGE_CARD_LAYOUT() {
    ChangeShowMode();

    // console.log("card width changed.");
    masonry.options.gutter = GET_CARD_GUTTER(waterfallNode, $_card_width);
    masonry.options.columnWidth = $_card_width;
    sortMasonry("fast");
    sortMasonry("fast");
  }
  // @ts-ignore
  window.CHANGE_CARD_LAYOUT = CHANGE_CARD_LAYOUT;

  // 3. 请求函数 ------------------------------------------------
  let infoList = [];
  // $: {
  //   console.log(infoList);
  // }

  /**初始化 search 请求->已封装好载荷(payload)*/
  function RequestExample() {
    // ------------ 页面请求
    console.log("当前页面 path:\t", location.pathname);

    // 获取 safe category list
    // const safeInfo = parseLocalStorage("persist:persist").sysinfo.categoryList["safe"];

    let pageSize = Number(
      parseLocalStorage("persist:persist").sysinfo.pageSize.torrent ?? 20
    );

    const payload = {
      categories: UrlPath_2_ParamList(),
      pageNumber: 1,
      pageSize,
      sortDirection: "DESC",
      sortField: "CREATED_DATE",
    };

    fetch(searchApiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        // 在这里处理返回的数据
        console.log(data);
        const list = data.data.data;

        // 处理数据
        infoList = [...list];
      })
      .then(() => {
        // 这里专用
        masonry.reloadItems();

        // loading 解除 & loading 非第一次标记
        loading_first = false;
        loading_hide = true;
        waterfallParentNode.style.height = "auto";

        // Nexus Tools 延时生效
        masonry.once("layoutComplete", () => {
          NEXUS_TOOLS();
        });
        // setTimeout(NEXUS_TOOLS, 600);
      })
      .catch((error) => {
        // 处理错误
        console.error("网络请求错误:", error);
      });
  }

  /** payload 示例
  /* categories:[],
  /* pageNumber: 7,
  /* pageSize: 100,
  /* sortDirection: "DESC",
  /* sortField: "CREATED_DATE",
  /* visible: 1,
  */

  /**常规 search 请求
   * 详见 {@link https://test2.m-team.cc/api/doc.html#/%E5%B8%B8%E8%A7%84%E6%8E%A5%E5%8F%A3/%E7%A7%8D%E5%AD%90/search newMT接口文档}
   * @param {object} payload - 自定义载荷(payload)
   * @param {number[]} payload.categories - 分类
   * @param {number} payload.pageNumber - 页数
   * @param {number} payload.pageSize - 每页种子数
   * @param {string} payload.sortDirection - 正倒序(ACS,DESC)
   * @param {string} payload.sortField - 自定义载荷(CREATED_DATE,SIZE)
   * @param {function} successCallback - 成功后的回调函数
   */

  function Request(payload, successCallback = null) {
    // ------------ 页面请求
    console.log("当前页面 path:\t", location.pathname);
    // const url = "https://test2.m-team.cc/api/torrent/search";

    fetch(searchApiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        // 在这里处理返回的数据
        console.log(data);
        const list = data.data.data;

        // 处理数据
        infoList = [...list];
      })
      .then(() => {
        // 这里专用
        masonry.reloadItems();

        // loading 解除
        loading_hide = true;

        // Nexus Tools 延时生效
        masonry.once("layoutComplete", () => {
          NEXUS_TOOLS();
        });

        if (successCallback) successCallback();
        // setTimeout(NEXUS_TOOLS, 600);
      })
      .catch((error) => {
        // 处理错误
        console.error("网络请求错误:", error);
      });
  }

  // 4. URL path 劫持函数 ------------------------------------------------

  /**URL路径转化 => search api 参数列表
   * @param path 默认值为 URL pathname
   */
  function UrlPath_2_ParamList(path = location.pathname) {
    const categoryParam =
      // @ts-ignore
      path == "/browse" ? "safe" : path.slice("/browse/".length);
    console.log(`search param:\t`, categoryParam);
    // 从 localstorage 中获取 category 相应的 categoryParam
    const lsInfo = parseLocalStorage("persist:persist");
    // @ts-ignore
    return Array.from(lsInfo.sysinfo.categoryList[categoryParam]);
  }

  // FIXME: 这里在每次切换 /browse 又回来之后, _ORIGIN_TL_Node 会丢失
  // 解决方法: 每次跳页面重置 _ORIGIN_TL_Node

  // 保存原始的 pushState 方法
  const originalPushState = history.pushState;
  /**劫持pushState方法*/
  function OverWritePushState() {
    // 重写 pushState 方法
    // @ts-ignore
    history.pushState = function (state, title, path) {
      // loading 开启
      loading_hide = false;

      // 在这里执行自定义逻辑
      // NOTE: 获取目标 URL Path
      // console.log("pushState ---> state:", state);
      // console.log("pushState ---> title:", title);
      console.log(
        `%c ====> URL跳转劫持: %c${path}`,
        "color: cyan",
        "color: white"
      );

      // 判读是否在 /browse path 内, 在就进行 search api 筛选
      // @ts-ignore
      if (path.includes("/browse/") || path == "/browse") {
        console.log("--->属于 browse 范围, search 启动");

        // 在 /browse 内即显示 waterfallParentNode
        waterfallParentNode.style.display = "block";

        // 从 path 中获取 search api 中 category 的部分
        // @ts-ignore
        const searchApiList = UrlPath_2_ParamList(path);

        // 获取 pageSize
        const lsInfo = parseLocalStorage("persist:persist");
        const pageSizeParam = Number(lsInfo.sysinfo.pageSize.torrent);

        // 装载 payload
        const payload = {
          categories: searchApiList,
          pageNumber: 1,
          pageSize: pageSizeParam,
          sortDirection: "DESC",
          sortField: "CREATED_DATE",
        };

        // 默认每次切换页面重置 ORIGIN_TL_Node
        Request(payload, update_ORIGIN_TL_Node);
      } else {
        // 不在 /browse 内即不显示 waterfallParentNode
        waterfallParentNode.style.display = "none";
      }

      // FIXME: 别动这个就行
      // 调用原始的 pushState 方法
      originalPushState.apply(history, arguments);

      // 在这里可以执行额外的操作，例如触发自定义事件等
      // NOTE: [可选]重新加载 Waterfall 内容
    };
  }

  // 5. 翻页相关部分 ------------------------------------------------
  // 设定初始页数
  PAGE.$setPage(1);

  /** 延迟加载事件 */
  let debounceLoad;
  // 对延迟加载事件进行防抖
  debounceLoad = debounceImmediate(loadNextPage, PAGE.GAP);

  /**NOTE: 滚动DOM ( newMT 的 滚动DOM 不是 body, 是 .ant-layout)*/
  const scrollDOM = document.querySelector(".ant-layout");
  /**滑动翻页函数判定*/
  function scan_and_launch() {
    const scrollHeight = scrollDOM.scrollHeight;
    const clientHeight = scrollDOM.clientHeight;
    const scrollTop = scrollDOM.scrollTop || scrollDOM.scrollTop;
    // console.log(scrollHeight, clientHeight, scrollTop);
    if (scrollTop + clientHeight >= scrollHeight - PAGE.DISTANCE_newMT) {
      // TODO: 注意写这里
      if ($_turnPage) {
        debounceLoad();
      } else {
        console.log("加载模式: 按钮");
      }

      // 这里整理一下瀑布流, 往往这里会出一点格式问题
      sortMasonry();
    }
  }

  /**页数记录专用对象*/
  const PageManager = {};

  /** 加载下一页的本体函数 */
  function loadNextPage() {
    // -- 1. 对 目标页数页数 & 单页数量 进行统计 -> 打包要 POST 的 payload
    const payload = {
      categories: UrlPath_2_ParamList(),
      pageNumber: PAGE.$getCurrentPage() + 1,
      pageSize: Number(
        parseLocalStorage("persist:persist").sysinfo.pageSize.torrent
      ),
      sortDirection: "DESC",
      sortField: "CREATED_DATE",
    };

    // -- 2. fetch payload, 并在获得后更新 List
    fetch(searchApiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        // 在这里处理返回的数据
        console.log(data);
        const list = data.data.data;

        // 处理数据
        infoList = [...infoList, ...list];
      })
      .then(() => {
        // 这里专用
        masonry.reloadItems();

        // Nexus Tools 延时生效
        masonry.once("layoutComplete", () => {
          NEXUS_TOOLS();
        });

        // -- 3. 收尾, 更新当前页数等
        // 页数处理
        PAGE.$turnPage();
      })
      .catch((error) => {
        // 处理错误
        console.error("网络请求错误:", error);
      });
  }
  // window.loadNextPage = loadNextPage;

  /** 翻页组件调用函数
   * @param event
   */
  function turnPage() {
    // 加载下一页
    if (!$_turnPage) debounceLoad();
  }
  window.$$$turnPage = turnPage;

  // 6. onMount 启动 ------------------------------------------------
  /** onMount, 启动!!!!!!!!!!!!!!!!*/
  onMount(() => {
    // 生成瀑布流
    // @ts-ignore
    masonry = new Masonry(waterfallNode, {
      itemSelector: ".card",
      columnWidth: $_card_width,
      gutter: GET_CARD_GUTTER(waterfallNode, $_card_width),
    });

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
    scrollDOM.addEventListener("scroll", function () {
      if ($_list_viewMode) scan_and_launch();
    });

    // 初始化 search 请求
    RequestExample();

    // 劫持 path 变化 => 页面内主循环函数
    OverWritePushState();
  });
</script>

<div
  class:masonry_Holder_unload_1st={!loading_hide && loading_first}
  class:masonry_Holder_loaded_1st={loading_hide && loading_first}
  class:masonry_Holder_unloaded={!loading_hide && !loading_first}
  class:masonry_Holder_loaded={loading_hide && !loading_first}
>
  {#if !loading_hide}
    <!-- loading 占位 -->
    <div class="loading_Holder" transition:fade={{ duration: 600 }}>
      <div class="loading_SubHolder">
        <div class="loading_Text">页面切换加载中...</div>
      </div>
    </div>
  {/if}

  <!-- 卡片渲染模版 -->
  {#if $_current_domain == "test2.m-team.cc"}
    {#each infoList as info, index (info.id)}
      <TestMteam {index} torrentInfo={info} cardWidth={CARD.CARD_WIDTH} />
    {/each}
  {/if}
</div>

<style>
  /* 四种 loading 状态的 Masonry Holder */
  .masonry_Holder_unload_1st {
    height: 96px;
    background: grey;
    position: relative;
  }
  .masonry_Holder_loaded_1st {
    position: unset;
    background: transparent;
    padding: 0;
  }
  .masonry_Holder_unloaded {
    position: unset;
    background: transparent;
  }
  .masonry_Holder_loaded {
    position: relative;
    background: transparent;
  }

  /* loading holder 的几个样式 */
  .loading_Holder {
    background-color: #bccad6;

    position: absolute;

    width: 100%;
    height: 100%;

    z-index: 10001;

    border-radius: 8px;

    display: flex;
    /* align-items: center; */
    justify-content: center;

    /* opacity: 0.9; */
  }
  .loading_SubHolder {
    position: relative;
    padding: 40px 0;
  }

  .loading_Text {
    position: sticky;
    top: 40px;
  }
</style>
