<script>
  import {
    _Global_Masonry,
    _CARD_SHOW,
    _current_bgColor,
    _iframe_switch,
    _iframe_url,
    _trigger_nexus_pic,
  } from "../stores";
  import { sortMasonry } from "../utils";
  import { config } from "./kamept";
  import _PicErrorLOGO from "../assets/pic_error.svg";

  // ------------------------------------------------

  /** 调用瀑布流整理*/
  function sort_masonry() {
    sortMasonry();
  }

  /**执行收藏动作并对制定卡片切换图标
   * @param {string} jsCodeLink js的收藏代码
   * @param {string} card_id 种子卡片id
   */
  function COLLET_AND_ICON_CHANGE(jsCodeLink, card_id) {
    // console.log(jsCodeLink, card_id);
    try {
      // 收藏链接
      window.location.href = jsCodeLink;

      // 临时更改收藏 ICON
      torrentInfo.collectState =
        torrentInfo.collectState == "Unbookmarked"
          ? "Bookmarked"
          : "Unbookmarked";

      console.log(`执行脚本${jsCodeLink}成功, 已经收藏或者取消~`);
    } catch (error) {
      // GUI 通知一下捏
      console.error(error);
    }
  }

  /** 根据背景颜色动态调整文字黑白
   * @param background 背景颜色(带#)
   */
  function getTextColor(background) {
    // 移除颜色字符串中的 '#'
    const color = background.replace("#", "");

    // 提取红、绿、蓝通道的值
    const red = parseInt(color.substr(0, 2), 16);
    const green = parseInt(color.substr(2, 2), 16);
    const blue = parseInt(color.substr(4, 2), 16);

    // 计算亮度
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

    // 如果亮度低于阈值128，则返回白色；否则返回黑色
    return brightness < 128 ? "white" : "black";
  }

  function showDetailIframe() {
    $_iframe_switch = 1;
    $_iframe_url = torrentInfo.torrentLink + "#kdescr";
  }

  // ------------------------------------------------

  /** 父传值: 种子信息*/
  export let torrentInfo;
  /** 父传值: 卡片宽度*/
  export let cardWidth;
  /** 父传值: 静态图片链接*/
  export let ICON;

  // ------------------------------------------------

  /** 本地: 是否显示详情*/
  let _hover = false;
  function card_show_detail() {
    _hover = true;
  }
  function card_hide_detail() {
    _hover = false;
  }

  /** 本地: 图片是否加载错误*/
  let _picError = false;
</script>

<div
  class="card"
  style="
    width: {cardWidth}px; 
    z-index:{10000 - torrentInfo.torrentIndex}; 
    background-color:{$_current_bgColor}"
>
  <div
    class="card-holder"
    on:mouseenter={card_show_detail}
    on:mouseleave={card_hide_detail}
  >
    <!-- 分区类别 -->
    <div
      class="card-category"
      data-href={torrentInfo.categoryLink}
      style="
        background-color: 
          {config.CATEGORY[torrentInfo.categoryNumber] ?? 'transparent'};
        color:
          {config.CATEGORY[torrentInfo.categoryNumber]
        ? getTextColor(config.CATEGORY[torrentInfo.categoryNumber])
        : 'black'}"
    >
      <!-- TODO: 颜色这里和龟龟商量怎么搞分类的颜色捏 -->
      <!-- style="background: ${CONFIG.CATEGORY[categoryNumber]};" -->

      <!-- TODO: 图片这里先注释了, 和龟龟商量捏 -->
      <!-- ${_categoryImg.outerHTML} -->
      {torrentInfo.category}
    </div>

    <!-- 标题 & 跳转详情链接 -->
    {#if $_CARD_SHOW.title || _hover}
      <div class="card-title">
        <a class="two-lines" href={torrentInfo.torrentLink} target="_blank">
          <!-- FIXME: 不知道这里的标签没有显示是否修复 -->
          {@html torrentInfo.tempTagDom
            ? torrentInfo.tempTagDom.map((e) => e.outerHTML).join("&nbsp;")
            : ""}
          <b>{torrentInfo.torrent_name}</b>
        </a>
      </div>
    {/if}

    <!-- 预览图 -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="card-image" on:click={showDetailIframe}>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      {#if !_picError}
        <!-- NOTE: 正常显示图片 -->
        <img
          class="nexus-lazy-load_Kesa"
          src={config.LOADING_PIC}
          data-src={torrentInfo.picLink}
          alt={torrentInfo.torrentName}
          on:load={sort_masonry}
          on:error={() => {
            // console.log(`________pic error: ${index}`);
            _picError = true;
          }}
        />
      {:else}
        <!-- NOTE: 图片加载失败 -> 缺省 svg 图片 -->
        <div class="pic_error" style="">
          <div>
            <img
              style="height: 100%;width: 100px;"
              src={_PicErrorLOGO}
              alt="pic error"
              on:load={sort_masonry}
            />
          </div>
          <div>图片加载失败</div>
        </div>
      {/if}

      <!-- 索引标号 -->
      <div class="card-index">
        {torrentInfo.torrentIndex + 1}
      </div>

      <!-- 局部悬浮预览 -->
      {#if $_trigger_nexus_pic}
        <div class="hover-trigger">
          <!-- {torrentInfo.torrentIndex + 1} -->
          <img style="pointer-events: none;" src={ICON.PREVIEW} alt="PREVIEW" />
        </div>
      {/if}
    </div>

    <!-- NOTE: 完整内部显示 -->
    {#if $_CARD_SHOW.all || _hover}
      <!-- 置顶 && 免费类型&剩余时间 -->
      {#if torrentInfo.free_type || torrentInfo.pattMsg}
        <div class="card-alter">
          <div class="top_and_free {torrentInfo.free_type}">
            <!-- 置顶等级 -->
            {#if torrentInfo.place_at_the_top.length != 0}
              {@html Array.from(torrentInfo.place_at_the_top).map(
                (e) => e.outerHTML,
              ) + "&nbsp;"}
            {/if}

            <!-- 免费类型 & 免费剩余时间 -->
            {#if torrentInfo.freeTypeImg}
              {@html torrentInfo.freeTypeImg.outerHTML}
            {/if}
            {#if torrentInfo.free_remaining_time}
              &nbsp;<b> {torrentInfo.free_remaining_time} </b>
            {/if}
          </div>
        </div>
      {/if}

      <!-- 副标题 -->
      {#if torrentInfo.description}
        <a class="card-description" href={torrentInfo.torrentLink}>
          {torrentInfo.description}
        </a>
      {/if}

      <!-- 标签 Tags -->
      <div class="cl-tags">
        {@html torrentInfo.tagsDOM
          .map((el) => {
            const _tag = document.createElement("div");
            _tag.innerHTML = el.outerHTML;
            // console.log(_tag);
            return _tag.outerHTML;
          })
          .join("")}
      </div>

      <div class="card-details">
        <!-- 各种功能: 大小/下载/收藏 -->
        <div class="card-line">
          <!-- 大小 -->
          <div class="cl-center">
            {@html ICON.SIZE}&nbsp;{torrentInfo.size}
          </div>

          <!-- 下载 -->
          &nbsp;&nbsp;
          <div class="cl-center">
            {@html ICON.DOWNLOAD}&nbsp;
            <b><a href={torrentInfo.downloadLink}>下载</a></b>
          </div>

          <!-- 收藏 -->
          &nbsp;&nbsp;
          <div class="cl-center">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              class="btnCollet cl-center"
              id="tI_{torrentInfo.torrentIndex}"
              on:click={() =>
                COLLET_AND_ICON_CHANGE(
                  torrentInfo.collectLink,
                  "tI_" + torrentInfo.torrentIndex,
                )}
            >
              {@html torrentInfo.collectState == "Unbookmarked"
                ? ICON.COLLET
                : ICON.COLLETED}
              &nbsp;<b>收藏</b>
            </div>
          </div>
        </div>

        <!-- 种子id, 默认不显示 -->
        <!--<div class="card-line"><b>Torrent ID:</b> ${torrentId}</div> -->

        <!-- 上传时间 -->
        <div class="card-line"><b>上传时间:</b> {torrentInfo.upload_date}</div>

        <!-- 各种数据: 评论/上传/下载/完成 -->
        <div class="card-line">
          {@html ICON.COMMENT}&nbsp;<b>{torrentInfo.comments}</b>&nbsp;&nbsp;
          {@html ICON.SEEDERS}&nbsp;<b>{torrentInfo.seeders}</b>&nbsp;&nbsp;
          {@html ICON.LEECHERS}&nbsp;<b>{torrentInfo.leechers}</b>&nbsp;&nbsp;
          {@html ICON.SNATCHED}&nbsp;<b>{torrentInfo.snatched}</b>
        </div>
      </div>
    {/if}

    <!-- NOTE: 可选外部显示 -->
    {#if !($_CARD_SHOW.all || _hover)}
      <!-- 置顶 && 免费类型&剩余时间 -->
      {#if $_CARD_SHOW.free && (torrentInfo.free_type || torrentInfo.pattMsg)}
        <div class="card-alter">
          <div class="top_and_free {torrentInfo.free_type}">
            <!-- 置顶等级 -->
            {#if torrentInfo.place_at_the_top.length != 0}
              {@html Array.from(torrentInfo.place_at_the_top).map(
                (e) => e.outerHTML,
              ) + "&nbsp;"}
            {/if}

            <!-- 免费类型 & 免费剩余时间 -->
            {#if torrentInfo.freeTypeImg}
              {@html torrentInfo.freeTypeImg.outerHTML}
            {/if}
            {#if torrentInfo.free_remaining_time}
              &nbsp;<b> {torrentInfo.free_remaining_time} </b>
            {/if}
          </div>
        </div>
      {/if}

      <!-- 副标题 -->
      {#if $_CARD_SHOW.sub_title && torrentInfo.description}
        <a class="card-description" href={torrentInfo.torrentLink}>
          {torrentInfo.description}
        </a>
      {/if}

      <!-- 标签 Tags -->
      {#if $_CARD_SHOW.tags}
        <div class="cl-tags">
          {@html torrentInfo.tagsDOM
            .map((el) => {
              const _tag = document.createElement("div");
              _tag.innerHTML = el.outerHTML;
              // console.log(_tag);
              return _tag.outerHTML;
            })
            .join("")}
        </div>
      {/if}

      <div class="card-details">
        <!-- 各种功能: 大小/下载/收藏 -->
        {#if $_CARD_SHOW.size_download_collect}
          <div class="card-line">
            <!-- 大小 -->
            <div class="cl-center">
              {@html ICON.SIZE}&nbsp;{torrentInfo.size}
            </div>

            <!-- 下载 -->
            &nbsp;&nbsp;
            <div class="cl-center">
              {@html ICON.DOWNLOAD}&nbsp;
              <b><a href={torrentInfo.downloadLink}>下载</a></b>
            </div>

            <!-- 收藏 -->
            &nbsp;&nbsp;
            <div class="cl-center">
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                class="btnCollet cl-center"
                id="tI_{torrentInfo.torrentIndex}"
                on:click={() =>
                  COLLET_AND_ICON_CHANGE(
                    torrentInfo.collectLink,
                    "tI_" + torrentInfo.torrentIndex,
                  )}
              >
                {@html torrentInfo.collectState == "Unbookmarked"
                  ? ICON.COLLET
                  : ICON.COLLETED}
                &nbsp;<b>收藏</b>
              </div>
            </div>
          </div>
        {/if}

        <!-- 种子id, 默认不显示 -->
        <!--<div class="card-line"><b>Torrent ID:</b> ${torrentId}</div> -->

        <!-- 上传时间 -->
        {#if $_CARD_SHOW.upload_time}
          <div class="card-line">
            <b>上传时间:</b>
            {torrentInfo.upload_date}
          </div>
        {/if}

        <!-- 各种数据: 评论/上传/下载/完成 -->
        {#if $_CARD_SHOW.statistics}
          <div class="card-line">
            {@html ICON.COMMENT}&nbsp;<b>{torrentInfo.comments}</b>&nbsp;&nbsp;
            {@html ICON.SEEDERS}&nbsp;<b>{torrentInfo.seeders}</b>&nbsp;&nbsp;
            {@html ICON.LEECHERS}&nbsp;<b>{torrentInfo.leechers}</b>&nbsp;&nbsp;
            {@html ICON.SNATCHED}&nbsp;<b>{torrentInfo.snatched}</b>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  /* 卡片 */
  .card {
    /* width: ${CARD.CARD_WIDTH}px; */
    /* width: 200px; */
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    /* background-color: ${themeColor}; */
    /* box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); */
    /* margin: 10px; */
    margin: 6px 0;

    overflow: hidden;

    cursor: pointer;

    box-shadow:
      rgba(0, 0, 0, 0.3) 3px 3px 0px,
      rgba(0, 0, 0, 0.1) -1px -1px 0px;
    transition: box-shadow 0.2s;
  }

  /* 指针卡片悬浮效果 */
  .card:hover {
    box-shadow:
      rgba(115, 0, 255, 0.3) 5px 5px 0px,
      rgba(0, 0, 0, 0.1) -1px -1px 0px;
  }

  /* 卡片标题 */
  .card-title {
    padding: 2px 0;
  }

  /* 卡片内部容器 */
  .card-holder {
    background-color: rgba(255, 255, 255, 0.5);
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.4),
      rgba(255, 255, 255, 0)
    );
    /* padding-bottom: 6px; */
  }

  /* 卡片分类 */
  .card-category {
    text-align: center;
    letter-spacing: 2px;
    font-weight: 700;
  }

  /* 卡片行默认样式 */
  .card-line {
    margin-top: 1px;
    margin-bottom: 1px;

    display: flex;
    justify-content: space-evenly;
    align-items: center;

    height: 20px;
  }

  /* 卡片标题: 默认两行 */
  .two-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    transition: color 0.3s;
  }

  /* 卡片标题: hover时变为正常 */
  .two-lines:hover {
    -webkit-line-clamp: 100;
  }

  /* 卡片信息: flex 居中 */
  .cl-center {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  /* 卡片信息行: 标签行 */
  .cl-tags {
    display: flex;
    justify-content: left;
    align-items: center;
    flex-wrap: wrap;

    gap: 2px;

    transform: translateX(4px);

    /* padding-top: 2px; */
    /* padding-bottom: 2px; */
  }

  .cl-tags:has(span) {
    padding-top: 2px;
  }

  /* 卡片简介总容器 */
  .card-details {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    /* padding-top: 2px; */
  }

  /* 卡片图像div */
  .card-image {
    height: 100%;
    position: relative;
    /* margin-bottom: 2px; */
  }

  /* 卡片图像div -> img标签 */
  .card-image img {
    width: 100%;
    object-fit: cover;
    
    /* NOTE: 这个是 Kame 专用, 不知道为什么图片的底边会多出来 3px */
    margin-bottom: -3px;
  }

  /* 卡片可选信息 */
  .card-alter {
    text-align: center;
    height: 20px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 置顶 && 免费类型&剩余时间 */
  .top_and_free {
    padding: 2px;
    border-radius: 4px;
    margin-bottom: 2px;

    display: flex;
    justify-content: center;
    align-items: center;

    line-height: 11px;
    height: 11px;
    font-size: 10px;
  }
  ._Free {
    color: blue;
    /* background-color: #00e6 */
  }

  ._2XFree {
    color: green;
    /* background-color: #0e0 */
  }

  /* 卡片索引 */
  .card-description {
    padding-left: 4px;
    padding-right: 4px;
  }

  /* 卡片索引 */
  .card-index {
    position: absolute;
    top: 0;
    left: 0;
    padding-right: 9px;
    padding-left: 2px;
    margin: 0;
    height: 20px;
    line-height: 16px;
    font-size: 16px;

    background-color: rgba(0, 0, 0);
    color: yellow;
    border-top-right-radius: 100px;
    border-bottom-right-radius: 100px;

    display: flex;
    align-items: center;

    pointer-events: none;
  }

  /* 悬浮预览: 局部触发器 */
  .hover-trigger {
    position: absolute;
    top: 8px;
    right: 8px;
    /* padding-right: 19px; */
    /* padding-left: 2px; */
    padding: 0;
    width: 42px;
    margin: 0;
    height: 40px;
    line-height: 16px;
    font-size: 16px;

    /* background-color: rgb(255, 187, 16); */

    opacity: 0.75;

    /* color: yellow; */
    /* border-top-right-radius: 0px; */
    /* border-bottom-left-radius: 100px; */
    border-radius: 9999px;

    display: flex;
    align-items: center;

    /* pointer-events: none; */

    &:hover {
      opacity: 1;
    }
  }

  /* 卡片: 收藏按钮 */
  .btnCollet {
    padding: 1px 2px;
    cursor: pointer;
  }

  /* 上面是我自己脚本的css */
  /* --------------------------------------- */
  /* 下面是改进原有的css */

  /* 临时标签_热门 */
  .hot {
    padding: 0 2px;
    border-radius: 8px;
    background: white;
    margin: 2px;
  }
  /* 临时标签_新 */
  .new {
    padding: 0 2px;
    border-radius: 8px;
    background: white;
    margin: 2px;
  }
</style>
