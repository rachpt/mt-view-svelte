import { writable } from 'svelte/store';
import { sortMasonry } from "../utils";

// ----------------------------------------------------------------
// localstorage 持久化处理 -------------------------------------
/**localstorage 里瀑布流字段对象的 key 名称*/
const persistName = 'Kesa:Masonry';

/** localstorage 数据持久化 svelte stores 函数
 * @param {*} key 在 localstorage 瀑布流对象里的 key 值
 * @param {*} startValue 初始化默认值
 * @returns svelte stores 对象
 */
function persistStore(key, startValue) {
  // 判断 localstorage 中有无瀑布流字段对象
  if (!localStorage.getItem(persistName)) localStorage.setItem(persistName, "{}");

  // 有 ls 中的值就挂载, 没有就从默认值创建, 并根据值注册 svelte store 初始化对象
  const savedValue = JSON.parse(localStorage.getItem(persistName))[key];
  const initialValue = savedValue ?? startValue;
  const store = writable(initialValue);

  // 对 svelte store 对象进行订阅以取得全局变化调用
  store.subscribe(value => {
    const data = JSON.parse(localStorage.getItem(persistName)) ?? {};
    data[key] = value;
    localStorage.setItem(persistName, JSON.stringify(data));
  });

  // FIXME: 对旧版本词条的处理, 过几个月也许可以去掉这个玩意儿, 减少损害其他东西的可能性
  if (localStorage.getItem(key)) localStorage.removeItem(key)

  return store;
}

// ----------------------------------------------------------------

// 全局类变量 -------------------------------------
/** 全局Masonry */
export const _Global_Masonry = writable({});



// iframe变量 -------------------------------------
/** iframe 开关 */
export const _iframe_switch = writable(0)
/** iframe 网址 */
export const _iframe_url = writable('https://kamept.com/index.php')

// 站点类变量 -------------------------------------
/** 当前所在站点域名 */
// export const _current_domain = writable("")
export const _current_domain = persistStore('_domain', "");

/** 当前所在站点背景颜色 */
export const _current_bgColor = persistStore('_bgColor', "");

// 配置类变量 -------------------------------------
/** 种子列表显示模式: 表格(0) or 瀑布流(1) */
export const _list_viewMode = persistStore('_listViewMode', 1);

/** 是否显示侧边栏 */
export const _show_configPanel = writable(false)

/** 侧边栏位置: x->left y->top */
export const _panelPos = persistStore('_panelPos', { x: 0, y: 0 })

/** 加载下一页方式: 点击false(0) 滚动true(1) */
export const _turnPage = persistStore('_turnPage', false);

/** 是否显示侧边栏 debug 按钮 */
export const _show_debug_btn = persistStore('_show_debug_btn', 0);

/** 是否显示鼠标悬浮预览大图 */
export const _show_nexus_pic = persistStore('_show_nexus_pic', 1);

/** 是否延迟显示悬浮预览大图 */
export const _delay_nexus_pic = persistStore('_delay_nexus_pic', 600);

// 卡片类变量 -------------------------------------

/** 是否显示卡片过渡动画 */
export const _animated = persistStore('_animated', true);

/** 卡片宽度 */
// export const _card_width = writable(200);
export const _card_width = persistStore('_card_width', 300);

/** 卡片设置: 全站点配置 & 各个站点配置 */
const site_setting = {
  mt: {
    // 隐藏gay卡片: 默认为true
    hide_gay: true
  }
}
export const _SITE_SETTING = persistStore('_SITE_SETTING', site_setting);
let mark1 = false
_SITE_SETTING.subscribe(value => {
  // 初始化时不寻找 masonry
  if (!mark1) {
    mark1 = true;
  }
  else {
    sortMasonry('fast');
    sortMasonry('fast');
    sortMasonry();
    sortMasonry();
  }
})

/** 卡片显示_总开关 对象*/
const show_switch = {
  // 全局总开关
  all: false,

  // 显示标题
  title: true,
  // 显示置顶和免费
  free: false,
  // 显示副标题
  sub_title: false,
  // 显示标签
  tags: false,
  // 显示大小&下载&收藏
  size_download_collect: false,
  // 显示上传时间
  upload_time: false,
  // 显示评论/上传/下载/完成
  statistics: false,
}
// export const _CARD_SHOW = writable(show_switch);
/** 卡片显示_总开关 Store对象 */
export const _CARD_SHOW = persistStore('_card_show', show_switch);
let mark = false;
_CARD_SHOW.subscribe(value => {
  // console.log(get(_CARD_SHOW));

  // 初始化时不寻找 masonry
  if (!mark) {
    mark = true;
  }
  else {
    sortMasonry('fast');
    sortMasonry('fast');
    sortMasonry();
    sortMasonry();
  }
});


