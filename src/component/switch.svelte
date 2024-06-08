<script>
  import IconLabel from "../assets/icon_label.svelte";
  import "../stores";

  /** switch 类型: 默认是 switch, 可变为 range */
  export let type = "switch";

  /** 固定条目名称 */
  export let title_fixed = "";
  /** 活动条目名称: 肯定 */
  export let title_green = "";
  /** 活动条目名称: 否定 */
  export let title_red = "";
  /** 悬浮提示(dom 的 title 属性) */
  export let label = "";
  /** 回调函数(仅在 Switch 模式下有用) */
  export let func = null;

  /** checkbox 和 附属 label 的绑定 id */
  const id = Math.random().toFixed(8);
  // console.log(id);

  /** checkbox 的绑定变量 */
  export let checked = false;
  /** 绿色是 true 还是 false */
  export let green_state = true;

  // range ----------------------------

  /** range 模式默认值 */
  // export let value = 0;
</script>

<div class="switch">
  <div class="s_title" title={label}>
    {#if label}
      <IconLabel></IconLabel>
      <div class="_hint">{@html label}</div>
    {/if}

    <!-- 固定条目名称 -->
    {title_fixed}
    <!-- 活动条目名称 -->
    {#if title_green || title_red}
      :&nbsp;

      {#if green_state}
        {#if checked}
          <span class="title_green">{title_green}</span>
        {:else}
          <span class="title_red">{title_red}</span>
        {/if}
      {:else if checked}
        <span class="title_red">{title_red}</span>
      {:else}
        <span class="title_green">{title_green}</span>
      {/if}
    {/if}
  </div>

  <!-- toggle Switch -->
  {#if type == "switch"}
    <div class="s_switch">
      <input
        type="checkbox"
        id="_t{id}"
        bind:checked
        on:change={() => {
          console.log(title_fixed, checked);
          // @ts-ignore
          if (func) func();
        }}
      />
      <label for="_t{id}" />
    </div>
  {/if}

  <!-- range 这里目前需要用插槽解决问题 -->
  {#if type == "range"}
    <slot />
  {/if}
</div>

<style scoped>
  *,
  :after,
  :before {
    box-sizing: content-box;
  }
  .switch {
    width: 100%;

    height: 30px;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .s_title {
    display: flex;
    align-items: center;

    font-size: 14px;

    position: relative;
  }

  .title_green {
    color: green;
    font-weight: 800;
  }
  .title_red {
    color: red;
    font-weight: 800;
  }

  /* -------------------- */

  /* 用了比较复杂的方式实现了纯 css 的 hint */
  .s_title:has(.hint):hover ._hint {
    display: block;
  }

  ._hint {
    display: none;

    position: absolute;
    bottom: 28px;
    left: 0;
    width: max-content;
    height: auto;
    background-color: white;
    border: 1px solid black;
    border-radius: 8px;
    padding: 4px 8px;
    box-sizing: content-box;
    z-index: 1;
  }

  /* -------------------- */

  input[type="checkbox"] {
    width: 0px;
    height: 0px;
    display: none;
    visibility: hidden;
  }

  label {
    width: 48px;
    height: 12px;
    display: inline-block;
    position: relative;
    background-color: #777;
    border: 2px solid #555;
    border-radius: 30px;

    transition: all 0.2s;

    &::after {
      content: "";
      display: block;
      width: 24px;
      height: 24px;
      background-color: #555;
      position: absolute;
      border-radius: 50%;
      left: -2px;
      top: -6px;
      transition: transform 0.2s;
    }
  }

  input[type="checkbox"]:checked ~ label {
    background-color: #00a0fc;
    border-color: #006dc9;
  }
  input[type="checkbox"]:checked ~ label::after {
    background-color: #0054b0;
    transform: translateX(28px);
  }
</style>
