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
  } from "../stores";
  import { onMount } from "svelte";
  import { sortMasonry, NEXUS_TOOLS, debounce } from "../utils";
  import { CARD, PAGE, ICON } from "../default.config";
  import {
    GLOBAL_SITE,
    GET_CURRENT_PT_DOMAIN,
    GET_TORRENT_LIST_SELECTOR,
  } from "./index";
  import "../utils/masonry.pkgd.Kesa";
  import TestMteam from "./testMteam.svelte";
  // 父子参数 ------------------------------------------------

  /** 父传值: 原有种子列表dom*/
  export let originTable;

  /** 父传值: 瀑布流dom*/
  export let waterfallNode;

  // 组件函数 ------------------------------------------------
  let masonry;
  $: if (masonry) {
    CARD.CARD_WIDTH = $_card_width;
    console.log("卡片宽度:\t", CARD.CARD_WIDTH);

    CHANGE_CARD_LAYOUT();
  }

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

  /** 调整卡片布局 */
  function CHANGE_CARD_LAYOUT() {
    // console.log("card width changed.");
    masonry.options.gutter = GET_CARD_GUTTER(waterfallNode, $_card_width);
    masonry.options.columnWidth = $_card_width;
    sortMasonry("fast");
    sortMasonry("fast");
  }
  window.CHANGE_CARD_LAYOUT = CHANGE_CARD_LAYOUT;

  // 请求函数 ------------------------------------------------
  let infoList = [];
  // $: {
  //   console.log(infoList);
  // }

  function Request() {
    // ------------ 页面请求
    console.log("当前页面 path:\t", location.pathname);
    const url = "https://test2.m-team.cc/api/torrent/search";
    const payload = {
      categories: [
        "115",
        "120",
        "410",
        "429",
        "424",
        "430",
        "426",
        "437",
        "431",
        "432",
        "436",
        "425",
        "433",
        "411",
        "412",
        "413",
      ],
      pageNumber: 1,
      pageSize: 100,
      sortDirection: "DESC",
      sortField: "CREATED_DATE",
      visible: 1,
    };

    fetch(url, {
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
        masonry.reloadItems()

        // Nexus Tools
        NEXUS_TOOLS();

        // NOTE: 这里不能注释掉, 必须留着, 不然 MT 可能不加载 NEXUS_TOOLS
        // @ts-ignore
        window.NEXUS_TOOLS = NEXUS_TOOLS;
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
  }

  // URL path 劫持函数 ------------------------------------------------
  // 保存原始的 pushState 方法
  const originalPushState = history.pushState;
  function OverWritePushState() {
    // 重写 pushState 方法
    history.pushState = function (state, title, path) {
      // 在这里执行自定义逻辑
      // NOTE: 获取目标 URL Path
      // console.log("pushState ---> state:", state);
      // console.log("pushState ---> title:", title);
      console.log("pushState ---> URL:", path);

      // 调用原始的 pushState 方法
      originalPushState.apply(history, arguments);

      // 在这里可以执行额外的操作，例如触发自定义事件等
      // NOTE: 重新加载 Waterfall 内容
    };
  }

  onMount(() => {
    // 劫持 path 变化 => 页面内主循环函数
    OverWritePushState();

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

    // // 滚动到底部检测
    // window.addEventListener("scroll", function () {
    //   scan_and_launch();
    // });

    Request();
  });
</script>

<!-- 卡片渲染模版 -->
{#if $_current_domain == "test2.m-team.cc"}
  {#each infoList as info, index (info.id)}
    <TestMteam {index} torrentInfo={info} cardWidth={CARD.CARD_WIDTH} {ICON} />
  {/each}
{/if}
