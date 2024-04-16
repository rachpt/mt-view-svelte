import { _iframe_switch, _iframe_url } from '../stores'
import { handleMouseMove, handleMouseOut, handleMouseOver } from '../utils'
// -------------------------------
import SVG_Size from "@/assets/icon_size.svg";
import SVG_Comment from "@/assets/icon_comment.svg";
import SVG_Seeders from "@/assets/icon_seeders.svg";
import SVG_Leechers from "@/assets/icon_leechers.svg";
import SVG_Download from "@/assets/icon_download.svg";
import SVG_Collection from "@/assets/icon_collection.svg";
import SVG_Time from "@/assets/icon_time.svg";
import SVG_Preview from "@/assets/icon_preview.svg";
// -------------------------------
export { CONFIG as config };
const CONFIG = {
  /** 是否非 NexusPHP 架构 */
  noneNexusPHP: true,

  /** 架构 */
  architecture: "NEW_MT",

  /** 默认的种子表格 dom selector */
  // torrentListTable: "div.ant-table-wrapper",
  torrentListTable: "div.app-content__inner",

  /** 加载图片等待时的默认图片 */
  LOADING_PIC: "/static/media/logo.80b63235eaf702e44a8d.png",

  /** 网站 host*/
  /** FIXME: 没用的字段了*/
  HOST: "https://test2.m-team.cc",

  /** 网站 api */
  API: {
    /** 查询 */
    search: {
      url: "/api/torrent/search",
      method: "POST",

      // payload 示例
      // payload: {
      //   categories: [],
      //   pageNumber: 7,
      //   pageSize: 100,
      //   sortDirection: "DESC",
      //   sortField: "CREATED_DATE",
      //   visible: 1,
      // }
    },
    genDlToken: {
      url: "/api/torrent/genDlToken",
      method: "POST",
    },
    collection: {
      url: "/api/torrent/collection",
      method: "POST",
    },
  },

  /**如果站点有自定义的icon, 可以用自定义的 */
  ICON: {
    /** 大小图标 */
    SIZE: SVG_Size,
    /** 评论图标 */
    COMMENT: SVG_Comment,
    /** 上传人数图标 */
    SEEDERS: SVG_Seeders,
    /** 下载人数图标 */
    LEECHERS: SVG_Leechers,
    /** 下载图标 */
    DOWNLOAD: SVG_Download,
    /** 收藏图标 */
    COLLECTION: SVG_Collection,
    /** 置顶图标 (没用, 看的是 css URL) */
    PIN: '/static/trans.gif',
    /** 时间图标 */
    TIME: SVG_Time,
    /** 预览图标 */
    PREVIEW: SVG_Preview
  },

  /**如果站点有必要设置分类颜色, 可以用自定义的 */
  CATEGORY_COLOR: {
    // 成人分类
    410: '#f52bcb', // 有码 HD
    429: '#f52bcb', // 无码 HD
    424: '#db55a9', // 有码 Xvid
    430: '#db55a9', // 无码 Xvid
    437: '#f77afa', // 有码 DVD
    426: '#f77afa', // 无码 DVD
    431: '#19a7ec', // 有码 BluRay
    432: '#19a7ec', // 无码 BluRay
    440: '#f52bcb', // GAY
    436: '#bb1e9a', // 0 day
    425: '#bb1e9a', // 写真 video
    433: '#bb1e9a', // 写真 pic
    411: '#f49800', // H-Game
    412: '#f49800', // H-Anime
    413: '#f49800', // H-Comic

    // 综合分类
    401: '#c74854', // Movie SD
    419: '#c01a20', // Movie HD
    420: '#c74854', // Movie DVD    
    421: '#00a0e9', // Movie BluRay
    439: '#1b2a51', // Movie Remux
    403: '#c74854', // TV SD
    402: '#276fb8', // TV HD
    435: '#4dbebd ', // TV DVD
    438: '#1897d6', // TV BluRay
    404: '#23ac38', // 纪录教育
    405: '#996c34', // Anime
    407: '#23ac38', // Sport
    422: '#f39800', // Software
    423: '#f39800', // Game
    427: '#f39800', // EBook
    409: '#996c34', // Other

    // 音乐分类
    406: '#8a57a1', // MV
    408: '#8a57a1', // Music AAC/ALAC
    434: '#8a57a1', // Music 无损
  },

  CATEGORY_NAME: {
    // 成人分类
    410: ' 有码 HD',
    429: ' 无码 HD',
    424: ' 有码 Xvid',
    430: ' 无码 Xvid',
    437: ' 有码 DVD',
    426: ' 无码 DVD',
    431: ' 有码 BluRay',
    432: ' 无码 BluRay',
    440: ' GAY',
    436: ' 0 day',
    425: ' 写真 video',
    433: ' 写真 pic',
    411: ' H-Game',
    412: ' H-Anime',
    413: ' H-Comic',

    // 综合分类
    401: 'Movie SD',
    419: 'Movie HD',
    420: 'Movie DVD    ',
    421: 'Movie BluRay',
    439: 'Movie Remux',
    403: 'TV SD',
    402: 'TV HD',
    435: ' TV DVD',
    438: 'TV BluRay',
    404: '纪录教育',
    405: 'Anime',
    407: 'Sport',
    422: 'Software',
    423: 'Game',
    427: 'EBook',
    409: 'Other',

    // 音乐分类
    406: 'MV',
    408: 'Music AAC/ALAC',
    434: 'Music 无损',
  },

  /** 索引 */
  INDEX: 0,

  /** iframe 宽度 */
  Iframe_Width: 1260,

  /**获取背景颜色*/
  get_bg_color: function () {
    return getComputedStyle(document.documentElement).getPropertyValue(
      "--bg-3"
    );
  },

  /** NOTE: 站点特殊操作 */
  special: function () {
    // console.log('======= M-Team 特殊操作 =======');
    // 原表格点击标题显示 iframe
    let len1 = table_Iframe_Set();

    // 原图片悬浮显示大图 
    let len2 = old_form_show_pic();

    return len1 && len2;
  },

  /** NOTE: 站点下一页加载后操作 */
  pageLoaded: function () {
  }
};

/** 原表格点击标题显示 iframe */
function table_Iframe_Set() {
  const lists = Array.from(document.querySelectorAll('.ant-table-row-level-0 .ant-col a[href]'))

  lists.forEach(
    function (el) {
      el.addEventListener('click', function (event) {
        // 阻止 a 标签的默认行为
        event.preventDefault();

        // 对 iframe 进行操作
        _iframe_switch.set(1)

        // console.log(el.children[0].children[0].children[1].querySelector('a').href);
        _iframe_url.set(el.href)

        // console.log(el.href);
      })
    }
  )
  return lists.length
}

/** 原图片悬浮显示大图 */
function old_form_show_pic() {
  // 获取所有具有类名 .ant-image-mask 的元素
  const elementsToRemove = document.querySelectorAll('.ant-image-mask');
  // 遍历并删除这些元素
  elementsToRemove.forEach(element => {
    element.remove();
  });

  // 添加指定的
  const lists = Array.from(document.querySelectorAll('.torrent-list__thumbnail'))
  lists.forEach(el => {
    el.classList += ' preview_Origin'
  })

  return lists.length
}

// NOTE: 原表格悬浮大图触发
const selector = ".preview_Origin";
document.body.addEventListener("mouseover", function (e) {
  // 全图触发
  // console.log(get(_trigger_nexus_pic));
  // @ts-ignore
  if (e.target.matches(selector)) {
    // @ts-ignore
    const event = e;
    const imgEle = e.target;
    // console.log(event);
    handleMouseOver(event, imgEle);
  }
});

document.body.addEventListener("mouseout", function (e) {
  // @ts-ignore
  if (e.target.matches(selector)) {
    // @ts-ignore
    handleMouseOut(e);
  }
});

document.body.addEventListener("mousemove", function (e) {
  // @ts-ignore
  if (e.target.matches(selector)) {
    // @ts-ignore
    const imgEle = e.target;
    handleMouseMove(e, imgEle);
  }
});