<script>
  import {
    _Global_Masonry,
    _CARD_SHOW,
    _SITE_SETTING,
    _current_bgColor,
    _iframe_switch,
    _iframe_url,
  } from "../stores";
  import { sortMasonry } from "../utils";
  import { config } from "./testMteam";
  import _PicErrorLOGO from "../assets/pic_error.svg";
  import _PicNoLOGO from "../assets/pic_no.svg";

  // ------------------------------------------------

  /**fetch API 处理
   * @param api API名称
   * @param payload 载荷
   * @param func 回调处理函数
   */
  function fetchData(api, payload, func) {
    if (!config.API[api]) {
      console.warn(`没有名为 ${api} 的 API 接口.`);
      return;
    }
    const url = config.HOST + config.API[api].url;
    const method = config.API[api].method;

    fetch(url, { method, body: payload })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        func(data);
      })
      .catch((error) => console.error(error));
  }
  // @ts-ignore
  window.fetchData = fetchData;

  // ------------------------------------------------

  /** 调用瀑布流整理*/
  function sort_masonry() {
    sortMasonry();
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

  /**显示 iframe*/
  function showDetailIframe() {
    $_iframe_switch = 1;
    $_iframe_url = torrentInfo.torrentLink + "#kdescr";
    $_iframe_url = "https://test2.m-team.cc/detail/" + torrentInfo.id;
  }

  // ------------------------------------------------

  /** 父传值: 种子序号*/
  export let index;
  /** 父传值: 种子信息*/
  export let torrentInfo;
  /** 父传值: 卡片宽度*/
  export let cardWidth;

  /** 父传值: 静态图片链接*/
  // export let ICON;

  // ------------------------------------------------
  // 下载免费打折相关
  const _discount = torrentInfo.status.discount;
  const _discountEndTime = torrentInfo.status.discountEndTime;
  const _discountText = {
    FREE: "免费",
    PERCENT_50: "50%",
  };
  const _discountCalcTime = () => {
    const now = new Date();
    const end = new Date(_discountEndTime);
    const res = Math.floor((end.getTime() - now.getTime()) / (1000 * 3600));
    // console.log(res);
    return res;
  };

  // ------------------------------------------------
  // 上传时间相关
  const _createdDate = torrentInfo.status.createdDate;
  const _createdCalcTime = () => {
    const now = new Date();
    const then = new Date(_createdDate);
    const gap = now.getTime() - then.getTime();

    const day = Math.floor(gap / (1000 * 3600 * 24));
    const hour = Math.floor((gap % (1000 * 3600 * 24)) / (1000 * 3600));

    return { day, hour };
  };
  const _CT = _createdCalcTime();

  // ------------------------------------------------

  // 示例: 下载
  // const formdata = new FormData();
  // formdata.append("id", 713437);
  // fetchData("genDlToken", formdata, (data) => console.log(data));

  // 示例: 收藏 -> make true 是收藏, false 是取消收藏
  // const formdata = new FormData();
  // formdata.append("id", 713437);
  // formdata.append("make", true);
  // fetchData("collection", formdata, (data) => console.log(data));

  /**下载种子*/
  function torrent_download() {
    const formdata = new FormData();
    formdata.append("id", torrentInfo.id);
    fetchData("genDlToken", formdata, (data) => {
      console.log(data);
      if (data.data) window.open(data.data, "_blank");
    });
  }

  // ------------------------------------------------
  // 收藏相关

  /**是否收藏的 Boolean*/
  let collectionMark = Boolean(torrentInfo.collection);

  const formdata = new FormData();
  formdata.append("id", torrentInfo.id);
  // @ts-ignore
  formdata.append("make", !collectionMark);

  /**svelte promise await*/
  let promise;

  async function torrent_collection(api, payload, func) {
    if (!config.API[api]) {
      console.warn(`没有名为 ${api} 的 API 接口.`);
      return;
    }
    const url = config.HOST + config.API[api].url;
    const method = config.API[api].method;

    const res = await fetch(url, { method, body: payload });
    const json = await res.json();

    if (res.ok) {
      func(json);
      return json;
    } else {
      throw new Error(json);
    }
  }

  function handleCollection() {
    promise = torrent_collection("collection", formdata, collectionCallBack);
  }

  function collectionCallBack(data) {
    console.log(data);
    collectionMark = !collectionMark;
  }

  // ------------------------------------------------

  /** 本地: 是否显示详情*/
  let _hover = false;
  function card_show_detail() {
    _hover = true;

    // 鼠标悬浮显示边框阴影
    thisDom.style.boxShadow = `
    ${_categoryColor ?? _defaultColor} 5px 5px 0px, 
    rgba(0, 0, 0, 0.1) -1px -1px 0px`;
  }
  function card_hide_detail() {
    _hover = false;

    // 鼠标移开边框阴影消失
    thisDom.style.boxShadow = "";
  }

  /** 本地: 图片是否加载错误*/
  let _picError = false;

  /** 本地: 分类颜色*/
  const _categoryColor = config.CATEGORY_COLOR[torrentInfo.category];
  const _defaultColor = "rgba(255, 255, 255, 0.5)";

  // bind:this
  let thisDom;
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  class="card"
  style="
    display:{torrentInfo.category == '440' && $_SITE_SETTING.mt.hide_gay
    ? 'none'
    : 'block'};
    width: {cardWidth}px; 
    z-index:{10000 - index}; 
    border-color: {_categoryColor ?? _defaultColor};
    background-color:{$_current_bgColor};
    background: linear-gradient(
      to bottom, 
      {_categoryColor ?? _defaultColor} 18px,
      {$_current_bgColor} 18px);
    "
  bind:this={thisDom}
>
  <div
    class="card-holder"
    on:mouseenter={card_show_detail}
    on:mouseleave={card_hide_detail}
    style="background: linear-gradient (to bottom, 
      {_categoryColor ?? _defaultColor} 18px,
      rgba(255, 255, 255, 0.4) 18px,
      rgba(255, 255, 255, 0));"
  >
    <!-- 分区类别 -->
    <div
      class="card-category"
      data-href={"https://test2.m-team.cc/browse?cat=" + torrentInfo.category}
      style="
        background-color: 
          {_categoryColor ?? 'transparent'};
        color:
          {_categoryColor ? getTextColor(_categoryColor) : 'black'}"
    >
      <!-- 分类图标 -->
      <img class="card_category-img" src={torrentInfo._categoryImg} alt="" />
      <!-- 分类名称 -->
      {config.CATEGORY_NAME[torrentInfo.category]}
    </div>

    <!-- 标题 & 跳转详情链接 -->
    {#if $_CARD_SHOW.title || _hover}
      <div class="card-title">
        <a class="two-lines" href={"/detail/" + torrentInfo.id} target="_blank">
          <!-- FIXME: 标签没有找到 -->
          <b>{torrentInfo.name}</b>
        </a>
      </div>
    {/if}

    <!-- NOTE: 预览图, 图片加载错误会显示 svg -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="card-image" on:click={showDetailIframe}>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      {#if !_picError}
        <!-- NOTE: 正常显示图片 -->
        {#if torrentInfo.imageList[0]}
          <img
            class="nexus-lazy-load_Kesa"
            src={config.LOADING_PIC}
            data-src={torrentInfo.imageList[0] ? torrentInfo.imageList[0] : ""}
            alt={torrentInfo.name}
            on:load={sort_masonry}
            on:error={() => {
              // console.log(`________pic error: ${index}`);
              _picError = true;
            }}
          />
        {:else}
          <!-- NOTE: 种子没有图片 -->
          <div class="pic_error" style="">
            <div>
              <img
                style="height: 100%;width: 100px;"
                src={_PicNoLOGO}
                alt="no pic"
                on:load={sort_masonry}
              />
            </div>
            <div>本种没有图片</div>
          </div>
        {/if}
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
        {index + 1}
      </div>
    </div>

    <!-- NOTE: 完整内部显示 -->
    {#if $_CARD_SHOW.all || _hover}
      <!-- 副标题 -->
      {#if torrentInfo.smallDescr}
        <div class="card-description">
          <a href={torrentInfo.torrentLink}>
            {torrentInfo.smallDescr}
          </a>
        </div>
      {/if}

      <!-- TODO: 置顶 && 免费类型&剩余时间 -->
      <!-- 置顶 && 免费类型&剩余时间 -->
      {#if torrentInfo.status.discount || torrentInfo.status.toppingLevel}
        <div class="cl-tags">
          <!-- 置顶 -->
          {#if torrentInfo.status.toppingLevel}
            <!-- <div class="_tag">{torrentInfo.status.toppingLevel}</div> -->
            <img
              style="
              background: url(/static/media/icons.8bb5446ebbbd07050285.gif) 0 -202px;
              height: 14px;
              width: 14px;"
              src={config.ICON.PIN}
              alt="SVG_Comment"
            />
            &nbsp;
          {/if}

          <!-- 免费类型 -->
          {#if _discount != "NORMAL"}
            <div
              class="_tag"
              class:_tag_discount_free={_discount == "FREE"}
              class:_tag_discount_50={_discount == "PERCENT_50"}
            >
              {_discountText[_discount]}{_discountEndTime
                ? " : " + _discountCalcTime() + " 小时"
                : ""}
            </div>
          {/if}
        </div>
      {/if}

      <!-- 来自开发者的介绍:
        if ((val & 1) === 1) { ret.push("diy"); DIV }
        if ((val & 2) === 2) { ret.push("dub"); 国配 }
        if ((val & 4) === 4) { ret.push("sub"); 中字 } 
      -->
      {#if torrentInfo.labels != 0}
        <div class="cl-tags">
          <!--  标签 Tags -->
          {#if (torrentInfo.labels & 1) === 1}
            <div class="_tag _tag_diy">DIY</div>
          {/if}
          {#if (torrentInfo.labels & 2) === 2}
            <div class="_tag _tag_dub">国配</div>
          {/if}
          {#if (torrentInfo.labels & 4) === 4}
            <div class="_tag _tag_sub">中字</div>
          {/if}
        </div>
      {/if}

      <div class="card-details">
        <!-- 各种功能: 大小/下载/收藏 -->
        <div class="card-line">
          <div class="cl-center">
            <!-- 大小 -->
            <div class="cl-btn">
              <span class="icon_holder">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  height="25"
                  width="25"
                  xmlns="http://www.w3.org/2000/svg"
                  style="
                    vertical-align: middle; 
                    --darkreader-inline-fill: currentColor; 
                    --darkreader-inline-stroke: currentColor;"
                >
                  <path
                    d="M12 5c-3.859 0-7 3.141-7 7s3.141 7 7 7 7-3.141 7-7-3.141-7-7-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"
                  />
                  <path
                    d="M12 9c-1.627 0-3 1.373-3 3s1.373 3 3 3 3-1.373 3-3-1.373-3-3-3z"
                  />
                </svg>
              </span>
              &nbsp;{(Number(torrentInfo.size) / 1024 / 1024 / 1024).toFixed(
                2
              ) + "G"}
            </div>

            <!-- 下载 -->
            &nbsp;&nbsp;
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              class="cl-btn"
              on:click={torrent_download}
              style="cursor: pointer;"
            >
              <span class="icon_holder">
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="download"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"
                  />
                </svg>
              </span>
              <!-- &nbsp;下载 -->
            </div>

            <!-- 收藏 -->
            &nbsp;&nbsp;
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              class="cl-btn"
              on:click={handleCollection}
              style="cursor: pointer;"
            >
              <span class="icon_holder">
                <!-- NOTE:svelte promise 测试 -->
                {#await promise}
                  <span style="display: flex; align-items: center;">···</span>
                {:then res}
                  <!-- <p>{res.message}</p> -->
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="star"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                    style="color: {collectionMark ? 'orange' : 'black'}"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"
                    />
                  </svg>
                {:catch error}
                  <p style="color: red">{error.message}</p>
                {/await}
              </span>
            </div>
          </div>
        </div>

        <!-- 种子id, 默认不显示 -->
        <!--<div class="card-line"><b>Torrent ID:</b> ${torrentId}</div> -->

        <!-- 上传时间 -->
        <div class="card-line cl-btn">
          <!-- <b>上传时间:</b> -->
          <img src={config.ICON.TIME} alt="SVG_Time" />
          &nbsp;{`${_CT.day} 日`}
          {_CT.hour ? `${_CT.hour} 时` : ""}
        </div>

        <!-- 各种数据: 评论/上传/下载/完成 -->
        <div class="card-line">
          <img src={config.ICON.COMMENT} alt="SVG_Comment" />
          &nbsp;
          <b>{torrentInfo.status.comments}</b>
          &nbsp;&nbsp;
          <img src={config.ICON.SEEDERS} alt="SVG_Seeders" />
          &nbsp;
          <b>{torrentInfo.status.seeders}</b>
          &nbsp;&nbsp;
          <img src={config.ICON.LEECHERS} alt="SVG_Leechers" />
          &nbsp;
          <b>{torrentInfo.status.leechers}</b>
        </div>
      </div>
    {/if}

    <!-- NOTE: 可选外部显示 -->
    {#if !($_CARD_SHOW.all || _hover)}
      <!-- TODO: 置顶 && 免费类型&剩余时间 -->
      <!-- 置顶 && 免费类型&剩余时间 -->
      {#if $_CARD_SHOW.free && (torrentInfo.status.discount || torrentInfo.status.toppingLevel)}
        <div class="cl-tags">
          <!-- 置顶 -->
          {#if torrentInfo.status.toppingLevel}
            <!-- <div class="_tag">{torrentInfo.status.toppingLevel}</div> -->
            <img
              style="
              background: url(/static/media/icons.8bb5446ebbbd07050285.gif) 0 -202px;
              height: 14px;
              width: 14px;"
              src={config.ICON.PIN}
              alt="SVG_Comment"
            />
            &nbsp;
          {/if}

          <!-- 免费类型 -->
          {#if _discount != "NORMAL"}
            <div
              class="_tag"
              class:_tag_discount_free={_discount == "FREE"}
              class:_tag_discount_50={_discount == "PERCENT_50"}
            >
              {_discountText[_discount]}{_discountEndTime
                ? " : " + _discountCalcTime() + " 小时"
                : ""}
            </div>
          {/if}
        </div>
      {/if}

      <!-- 副标题 -->
      {#if $_CARD_SHOW.sub_title && torrentInfo.smallDescr}
        <div class="card-description">
          <a href={torrentInfo.torrentLink}>
            {torrentInfo.smallDescr}
          </a>
        </div>
      {/if}

      <!-- 标签 Tags -->
      <!-- 来自开发者的介绍:
        if ((val & 1) === 1) { ret.push("diy"); DIV }
        if ((val & 2) === 2) { ret.push("dub"); 国配 }
        if ((val & 4) === 4) { ret.push("sub"); 中字 } 
      -->
      {#if $_CARD_SHOW.tags && torrentInfo.labels != 0}
        <div class="cl-tags">
          <!--  标签 Tags -->
          {#if (torrentInfo.labels & 1) === 1}
            <div class="_tag _tag_diy">DIY</div>
          {/if}
          {#if (torrentInfo.labels & 2) === 2}
            <div class="_tag _tag_dub">国配</div>
          {/if}
          {#if (torrentInfo.labels & 4) === 4}
            <div class="_tag _tag_sub">中字</div>
          {/if}
        </div>
      {/if}

      <div class="card-details">
        <!-- 各种功能: 大小/下载/收藏 -->
        {#if $_CARD_SHOW.size_download_collect}
          <div class="card-line">
            <div class="cl-center">
              <!-- 大小 -->
              <div class="cl-btn">
                <span class="icon_holder">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 24 24"
                    height="25"
                    width="25"
                    xmlns="http://www.w3.org/2000/svg"
                    style="
                    vertical-align: middle; 
                    --darkreader-inline-fill: currentColor; 
                    --darkreader-inline-stroke: currentColor;"
                  >
                    <path
                      d="M12 5c-3.859 0-7 3.141-7 7s3.141 7 7 7 7-3.141 7-7-3.141-7-7-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"
                    />
                    <path
                      d="M12 9c-1.627 0-3 1.373-3 3s1.373 3 3 3 3-1.373 3-3-1.373-3-3-3z"
                    />
                  </svg>
                </span>
                &nbsp;{(Number(torrentInfo.size) / 1024 / 1024 / 1024).toFixed(
                  2
                ) + "G"}
              </div>

              <!-- 下载 -->
              &nbsp;&nbsp;
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                class="cl-btn"
                on:click={torrent_download}
                style="cursor: pointer;"
              >
                <span class="icon_holder">
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="download"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"
                    />
                  </svg>
                </span>
                <!-- &nbsp;下载 -->
              </div>

              <!-- 收藏 -->
              &nbsp;&nbsp;
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                class="cl-btn"
                on:click={handleCollection}
                style="cursor: pointer;"
              >
                <span class="icon_holder">
                  <!-- NOTE:svelte promise 测试 -->
                  {#await promise}
                    <span style="display: flex; align-items: center;">···</span>
                  {:then res}
                    <!-- <p>{res.message}</p> -->
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="star"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      style="color: {collectionMark ? 'orange' : 'black'}"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"
                      />
                    </svg>
                  {:catch error}
                    <p style="color: red">{error.message}</p>
                  {/await}
                </span>
              </div>
            </div>
          </div>
        {/if}

        <!-- 种子id, 默认不显示 -->
        <!--<div class="card-line"><b>Torrent ID:</b> ${torrentId}</div> -->

        <!-- 上传时间 -->
        {#if $_CARD_SHOW.upload_time}
          <div class="card-line cl-btn">
            <!-- <b>上传时间:</b> -->
            <img src={config.ICON.TIME} alt="SVG_Time" />
            &nbsp;{`${_CT.day} 日`}
            {_CT.hour ? `${_CT.hour} 时` : ""}
          </div>
        {/if}

        <!-- 各种数据: 评论/上传/下载/完成 -->
        {#if $_CARD_SHOW.statistics}
          <div class="card-line">
            <img src={config.ICON.COMMENT} alt="SVG_Comment" />
            &nbsp;
            <b>{torrentInfo.status.comments}</b>
            &nbsp;&nbsp;
            <img src={config.ICON.SEEDERS} alt="SVG_Seeders" />
            &nbsp;
            <b>{torrentInfo.status.seeders}</b>
            &nbsp;&nbsp;
            <img src={config.ICON.LEECHERS} alt="SVG_Leechers" />
            &nbsp;
            <b>{torrentInfo.status.leechers}</b>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  /* 卡片分类 */
  .card-category {
    height: 18px;
    padding: 0 2px;
    border: 1px;
    background: black;
    color: white;
    font-weight: 900;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 卡片种类tag预览图 */
  .card_category-img {
    /* height: 18px; */
    height: 32px;

    background-size: 100% 141%;
    background-position: center top;

    /* padding-left: 5%; */
    padding-top: 6px;
  }

  /* ---------------------------- */

  /* 卡片 */
  .card {
    /* width: ${CARD.CARD_WIDTH}px; */
    /* width: 200px; */
    border: 2px solid;
    border-radius: 16px;
    /* background-color: ${themeColor}; */
    /* box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); */
    /* margin: 10px; */
    margin: 6px 0;

    overflow: hidden;

    /* cursor: pointer; */

    box-shadow: rgba(0, 0, 0, 0.3) 0px 6px 0px, rgba(0, 0, 0, 0.1) -1px -1px 0px;
    transition: box-shadow 0.2s;
  }

  /* 指针卡片悬浮效果 */
  .card:hover {
    /* box-shadow: rgba(115, 0, 255, 0.3) 5px 5px 0px, rgba(0, 0, 0, 0.1) -1px -1px 0px; */
  }

  /* 卡片标题 */
  .card-title {
    padding: 2px 0;
  }

  /* 卡片内部容器 */
  .card-holder {
    background-color: rgba(255, 255, 255, 0.5);
    /* background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.4),
      rgba(255, 255, 255, 0)
    ); */
    /* padding-bottom: 6px; */
  }

  /* 卡片行默认样式 */
  .card-line {
    margin-top: 1px;
    margin-bottom: 2px;

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

    color: black;
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
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    gap: 2px;

    padding-top: 4px;
    padding-bottom: 4px;
  }

  /* ICON */
  .icon_holder {
    border-color: #2f4879;
    border-radius: 100px;
    height: 20px;
    width: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .cl-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    /* flex-wrap: wrap; */

    /* gap: 2px; */

    padding: 1px 6px;

    /* border: 1px solid black; */
    border-radius: 8px;

    background-color: rgb(237, 243, 255);
  }

  /* 标签 */
  ._tag {
    /* padding: 1px 6px; */
    height: 1.3em;
    line-height: 1.3em;
    padding: 0 0.5em;
    border-radius: 6px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  }
  ._tag_diy {
    color: #ffffff;
    background-color: rgb(90, 189, 72);
  }
  ._tag_dub {
    color: #ffffff;
    background-color: rgb(90, 59, 20);
  }
  ._tag_sub {
    color: #ffffff;
    background-color: rgb(59, 74, 127);
  }
  ._tag_discount_50 {
    background-color: rgb(255, 85, 0);
    color: #ffffff;
  }
  ._tag_discount_free {
    background-color: rgb(16, 142, 233);
    color: #ffffff;
  }

  /* 卡片简介总容器 */
  .card-details {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    padding-top: 2px;
    padding-bottom: 2px;
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

  /* 卡片副标题 */
  .card-description {
    padding-left: 4px;
    padding-right: 4px;
    padding: 2px 4px 2px;
  }

  .card-description a {
    color: black;
  }

  .card-description a:hover {
    color: black;
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

  /* 卡片: 收藏按钮 */
  .btnCollet {
    padding: 1px 2px;
    cursor: pointer;
  }

  .tempTags {
    background-color: #ffffff;
    margin-left: 2px;
    padding-left: 2px;
    padding-right: 2px;
    border-radius: 4px;
  }
</style>
