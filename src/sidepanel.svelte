<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {
    _current_bgColor,
    _Global_Masonry,
    _list_viewMode,
    _CARD_SHOW,
    _SITE_SETTING,
    _turnPage,
    _iframe_switch,
    _panelPos,
    _show_debug_btn,
    _show_nexus_pic,
    _trigger_nexus_pic,
    _delay_nexus_pic,
    _show_configPanel,
    _current_domain,
    _animated,
    _card_layout,
  } from "./stores";

  import { sortMasonry } from "./utils";
  import Switch from "./component/switch.svelte";

  // ------------------------------------------------

  import SVG_CONFIG from "./assets/icon_config.svg";
  import SVG_MASONRY from "./assets/icon_masonry.svg";
  import SVG_LIST from "./assets/icon_list.svg";
  import IconCross from "./assets/icon_cross.svelte";
  import IconSort from "./assets/icon_sort.svelte";

  // 配置拖拽侧边栏 ------------------------------------------------
  /** 侧边栏的 dom 对象 */
  let sideDom;
  /** 是否触发移动 trigger */
  let isMouseDown = false;
  /** 侧边栏横坐标 */
  let offsetX = 0;
  /** 侧边栏纵坐标 */
  let offsetY = 0;

  const onMouseDown = (e) => {
    e.preventDefault();
    isMouseDown = true;
    offsetX = e.clientX - sideDom.getBoundingClientRect().left;
    offsetY = e.clientY - sideDom.getBoundingClientRect().top;
  };

  const onMouseMove = (e) => {
    // NOTE: 这里还是别取消这个, 会指针指在别的地方的
    // e.preventDefault();

    if (!isMouseDown) return;
    const res_X = posRangeIn(
      e.clientX - offsetX,
      0,
      window.innerWidth - (sideDom.getBoundingClientRect().width + 5),
    );
    const res_Y = posRangeIn(
      e.clientY - offsetY,
      0,
      window.innerHeight - (sideDom.getBoundingClientRect().height + 5),
    );

    // console.log(sideDom.getBoundingClientRect().width);

    $_panelPos = { x: res_X, y: res_Y };
  };

  const onMouseUp = () => {
    isMouseDown = false;
  };

  /** 重置瀑布流边栏位置 */
  function resetPanelPos() {
    if ($_panelPos.x == 0 && $_panelPos.y == 0) alert("无需重置瀑布流边栏位置");
    $_panelPos = { x: 0, y: 0 };
  }

  /** 给指定变量设置上下范围
   * @param target 指定变量
   * @param min 下边界值
   * @param max 上边界值
   */
  function posRangeIn(target, min, max) {
    if (target <= min) target = min;
    if (target >= max) target = max;
    return target;
  }

  // ------------------------------------------------

  /** 按钮1函数: 显示原有列表*/
  function __show_originTable() {
    $_list_viewMode = !$_list_viewMode;

    // @ts-ignore
    if (window.CHANGE_CARD_LAYOUT) window.CHANGE_CARD_LAYOUT();
  }

  /** 按钮2函数: 手动整理瀑布流布局*/
  // @ts-ignore
  function __sort_masonry() {
    // @ts-ignore
    $_Global_Masonry.layout();
  }

  /** 显示所有详情界面 */
  function config_showAllDetails() {
    $_CARD_SHOW.all = !$_CARD_SHOW.all;

    setTimeout(() => {
      sortMasonry();
    }, 0);
  }

  /** 模式切换按钮标签 */
  let label_switchMode = $_turnPage ? "滚动加载" : "按钮加载";
  function config_switchMode() {
    $_turnPage = !$_turnPage;
    label_switchMode = $_turnPage ? "滚动加载" : "按钮加载";
  }

  /** 切换下一页加载模式 */
  function config_changeLoadMode() {
    $_iframe_switch = $_iframe_switch == 0 ? 1 : 0;
  }

  // ------------------------------------------------

  onMount(() => {
    // 拖拽边栏监听
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });
</script>

<!-- ---------- NOTE:侧边栏  ---------- -->
<div
  class="sideP"
  bind:this={sideDom}
  style="
  top:{$_panelPos.y}px;
  left:{$_panelPos.x}px;
  background-color:{$_current_bgColor};
  display:
    {$_current_domain.includes('m-team')
    ? $_SITE_SETTING.mt.path_in_browse
      ? 'block'
      : 'none'
    : 'block'};
  "
>
  <!-- 侧边栏拖拽条 -->
  <div class="sideP__title" on:mousedown={onMouseDown} />

  <!-- 按钮列表 -->
  <div class="sideP__out">
    <!-- 按钮1: 显示原有列表 -->
    <button class="sideP__btn" on:click={__show_originTable}>
      {#if $_list_viewMode}
        <div>
          <img src={SVG_MASONRY} alt="SVG_MASONRY" />
        </div>
        <div>瀑布</div>
      {:else}
        <div>
          <!-- svg 列表图标 -->
          <img src={SVG_LIST} alt="SVG_LIST" />
        </div>
        <div>列表</div>
      {/if}
    </button>

    <!-- 按钮2: 手动整理布局 -->
    <button class="sideP__btn" on:click={__sort_masonry}>
      <IconSort></IconSort>
      <div>整理</div>
    </button>

    <!-- 按钮3: 呼出详细配置栏 -->
    <button
      class="sideP__btn"
      on:click={() => {
        $_show_configPanel = !$_show_configPanel;
      }}
    >
      <div>
        <!-- svg 设置图标 -->
        <img src={SVG_CONFIG} alt="SVG_CONFIG" />
      </div>
      <div>配置</div>
    </button>

    {#if $_show_debug_btn}
      <!-- 按钮5: debug -->
      <button class="sideP__btn" on:click={config_showAllDetails}>
        显示详情
      </button>

      <!-- 按钮6: debug -->
      <button class="sideP__btn" on:click={config_switchMode}>
        {label_switchMode}
      </button>

      <!-- 按钮6: debug -->
      <button class="sideP__btn" on:click={config_changeLoadMode}>
        iframe
      </button>
    {/if}
  </div>
</div>

<!-- ---------- NOTE:详细配置面板  ---------- -->
{#if $_show_configPanel}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="configP"
    transition:fade={{ duration: 100 }}
    on:click|self={() => ($_show_configPanel = false)}
  >
    <div class="configP_holder">
      <!-- 标题区 -->
      <div class="configP_title">
        <p style="margin: auto 0">详细配置面板</p>
        <!-- ---------------- 返回按钮 ---------------- -->
        <button on:click={() => ($_show_configPanel = false)}>
          <IconCross></IconCross>
        </button>
      </div>

      <!-- --------------------------------NOTE:配置区-------------------------------- -->

      <!-- ---------------- 站点专业配置 ---------------- -->

      <!-- MT 专用配置 -->
      {#if $_current_domain.includes("m-team")}
        <div class="section">
          <h1 class="s_title">MT专用配置</h1>
          <div class="s_panel">
            <Switch
              title_fixed="隐藏Gay分区卡片"
              title_green="隐藏(默认)"
              title_red="显示(狠人)"
              bind:checked={$_SITE_SETTING.mt.hide_gay}
              func={() => {
                window.NEXUS_TOOLS();
              }}
            />
          </div>
        </div>
      {/if}

      <!-- ---------------- 常用配置 ---------------- -->
      <div class="section">
        <h1 class="s_title">常用配置</h1>
        <div class="s_panel">
          <Switch
            title_fixed={"显示模式"}
            title_green="瀑布流"
            title_red="原始表格"
            label={$_current_domain.includes("m-team")
              ? ""
              : "原始表格模式仅支持点击图片显示iframe和加载下一页"}
            bind:checked={$_list_viewMode}
            func={() => {
              // @ts-ignore
              window.CHANGE_CARD_LAYOUT();
            }}
          />

          <br />
          <Switch
            title_fixed={"加载下一页方式"}
            title_green="按钮(默认)"
            title_red="滚动(谨慎使用)"
            label="滚动模式下 MT 等网站频繁使用可能会导致 120"
            bind:checked={$_turnPage}
            green_state={false}
          />

          <br />
          <Switch
            title_fixed={"卡片移动动画"}
            title_green="开启"
            title_red="关闭"
            label="开启关闭瀑布流卡片高度变化时的缓动动画"
            bind:checked={$_animated}
            green_state={true}
          />

          <br />
          <Switch
            title_fixed={"悬浮预览大图"}
            title_green="默认开启"
            title_red="核心功能->确定不用再关"
            bind:checked={$_show_nexus_pic}
          />
          <!-- NOTE: 这里配置悬浮预览大图的触发方式 -->
          <Switch
            title_fixed={"预览大图方式"}
            title_green="局部悬浮预览区域"
            title_red="全图悬浮预览"
            label="开发中 <br> 为优化用户预览大图体验 <br> 鼠标放到图片上就显示大图会遮挡信息 <br> 指定在图片的局部 区域放大"
            bind:checked={$_trigger_nexus_pic}
          />

          {#if $_show_nexus_pic}
            <Switch
              title_fixed={`悬浮预览延迟${
                $_delay_nexus_pic ? ":" + $_delay_nexus_pic + "ms" : ""
              }`}
              title_red={`${$_delay_nexus_pic ? "" : "无延迟"}`}
              label="防止无意滑动时大图打开妨碍预览"
              type="range"
            >
              <input
                type="range"
                bind:value={$_delay_nexus_pic}
                min="0"
                max="1500"
                step="100"
                list="values"
              />
            </Switch>
          {/if}

          <br />
          <Switch
            title_fixed={"侧边栏debug按钮"}
            title_green="隐藏(默认)"
            title_red="显示(开发用)"
            bind:checked={$_show_debug_btn}
            green_state={false}
          />
        </div>
      </div>

      <!-- ---------------- 卡片布局 ---------------- -->
      <div class="section">
        <h1 class="s_title">卡片布局</h1>
        <div class="s_panel">
          <Switch
            title_fixed={`卡片列数: ${$_card_layout.column}`}
            label="范围: 2~7 列"
            type="range"
          >
            <input
              type="range"
              bind:value={$_card_layout.column}
              min="2"
              max="7"
              step="1"
              list="values"
              on:change={window.CHANGE_CARD_LAYOUT}
            />
          </Switch>
          <Switch
            title_fixed={`卡片间距: ${$_card_layout.gap}px`}
            label="范围: 2~100 px"
            type="range"
          >
            <input
              type="range"
              bind:value={$_card_layout.gap}
              min="2"
              max="100"
              step="1"
              list="values"
              on:change={window.CHANGE_CARD_LAYOUT}
            />
          </Switch>
        </div>
      </div>

      <!-- ---------------- 卡片信息 ---------------- -->
      <div class="section">
        <h1 class="s_title">卡片信息</h1>
        <div class="s_panel">
          <!-- 按钮: 显示详情 -->
          <Switch
            title_fixed="卡片信息"
            title_green="显示下方所选信息(精简)"
            title_red="显示所有信息(较乱)"
            bind:checked={$_CARD_SHOW.all}
            green_state={false}
            func={sortMasonry}
          />
          <!-- <button class="sideP__btn" on:click={config_showAllDetails}>显示所有详情界面</button> -->
        </div>

        <!-- 子面板: 配置常驻卡片信息 -->
        <div class="section">
          <h3 class="s_title">配置常驻卡片信息</h3>
          <div class="s_panel">
            <Switch
              title_fixed="显示种子名称"
              bind:checked={$_CARD_SHOW.title}
              func={sortMasonry}
            />
            <Switch
              title_fixed="显示置顶和免费"
              bind:checked={$_CARD_SHOW.free}
              func={sortMasonry}
            />
            <Switch
              title_fixed="显示副标题"
              bind:checked={$_CARD_SHOW.sub_title}
              func={sortMasonry}
            />
            <Switch
              title_fixed="显示标签"
              bind:checked={$_CARD_SHOW.tags}
              func={sortMasonry}
            />
            <Switch
              title_fixed="显示 [大小/下载/收藏]"
              bind:checked={$_CARD_SHOW.size_download_collect}
              func={sortMasonry}
            />
            <Switch
              title_fixed="显示上传时间"
              bind:checked={$_CARD_SHOW.upload_time}
              func={sortMasonry}
            />
            <Switch
              title_fixed="显示 [评论/上传/下载/完成]"
              bind:checked={$_CARD_SHOW.statistics}
              func={sortMasonry}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- 按钮: 重置瀑布流配置边栏位置 -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="reset_panel_pos" on:click={resetPanelPos}>重置瀑布流配置边栏位置</div>

<style>
  .sideP {
    position: fixed;

    /* 已动态配置 */
    /* left: 0px; */
    /* top: 0px; */

    /* transition: top 0.1s; */
    /* transition: left 0.1s; */

    opacity: 0.4;

    margin: 4px 2px;

    /* 已动态配置 */
    /* background-color: #9ac6ff; */

    border-radius: 8px;
    overflow: hidden;

    z-index: 40000;

    border: 2px solid transparent;

    &:hover {
      opacity: 1;
      border: 2px solid yellow;
    }
  }

  .sideP__title {
    width: 100%;
    height: 8px;

    background-color: yellow;

    &:hover {
      cursor: move;
    }
  }

  .sideP__out {
    display: flex;
    flex-direction: column;
  }

  .sideP__btn {
    width: 72px;
    font-size: 14px;

    background-color: gray;
    color: white;

    padding: 4px 8px;

    margin: 4px;
    border-radius: 8px;

    cursor: pointer;

    border: none;

    &:hover {
      background-color: rgb(101, 49, 255);
    }
  }

  .configP {
    position: fixed;

    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;

    padding: 0;
    margin: 0;

    z-index: 50000;

    color: black;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .configP_holder {
    /* 修复 newMT 架构 重置css 的样式覆盖*/
    box-sizing: content-box;

    position: absolute;
    right: 20px;
    top: 20px;
    overflow-y: scroll;

    width: 360px;
    max-height: calc(100vh - 40px);
    padding: 0;
    margin: 0;

    /* border-top-left-radius: 24px; */
    /* border-bottom-left-radius: 24px; */
    border-radius: 24px;
    border: 2px solid black;

    background-color: rgb(212, 231, 255);

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .configP_title {
    position: fixed;

    box-sizing: border-box;
    width: inherit;

    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 40px;
    padding: 0 10px;

    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    border-bottom: 2px solid black;

    background-color: rgb(154, 198, 255);

    z-index: 2;

    & p {
      font-size: 18px;
      font-weight: 500;
    }

    & button {
      border: none;
      padding: 0;
      margin: 0;
      background-color: transparent;
    }
  }

  .section {
    margin: 16px 18px;

    & button {
      border-radius: 10px;
      margin: 4px;
      padding: 12px 16px;
    }

    & .s_title {
      text-align: center;
    }

    & .s_panel {
      display: flex;
      flex-direction: column;
      /* flex-wrap: wrap; */
      justify-content: space-evenly;
      align-items: center;
    }

    & .s_checkbox {
      padding: 12px;
      margin: 4px;
      border-radius: 10px;
      border: 1px solid black;

      font-size: 14px;
      display: flex;
      align-items: center;
    }

    & h1 {
      font-size: 14pt;
    }
  }

  .configP_holder .section:nth-child(2) {
    margin-top: 48px;
  }

  #reset_panel_pos {
    width: 100%;
    text-align: center;
    /* background-color: #fff; */
    border: 1px solid black;
    border-radius: 16px;
    /* padding: 8px 0; */
  }
</style>
