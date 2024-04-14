<script>
  import { onDestroy } from "svelte";

  function Reload() {
    location.reload();
  }

  /** 起始链接是否是 list page */
  let firstLinkBrowse;
  /** 当前链接是否是 list page */
  let currentLinkBrowse;
  /** 起始开关 */
  let first = true;
  /** 响应开关 */
  let trigger = false;

  if (first) {
    firstLinkBrowse = location.pathname.includes("/browse");
    first = false;
  }

  let interval = setInterval(() => {
    currentLinkBrowse = location.pathname.includes("/browse");
    // console.log("first:\t", firstLinkBrowse, "current:\t", currentLinkBrowse);
    trigger = !firstLinkBrowse && currentLinkBrowse;
  }, 2000);

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div>
  <button
    style={trigger ? "display: block" : "display:none"}
    id="_Reload"
    on:click={Reload}>检测到种子列表<br />刷新以显示瀑布流</button
  >
</div>

<!-- TODO: 美化一下这个按钮 -->
<style>
  #_Reload {
    position: fixed;
    top: 0;
    left: 0;
  }
</style>
