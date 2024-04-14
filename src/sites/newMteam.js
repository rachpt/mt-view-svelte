import { _iframe_switch, _iframe_url } from '../stores'
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
    console.log('======= M-Team 特殊操作 =======');
    // 原表格点击标题显示 iframe
    table_Iframe_Set();

    // 原图片悬浮显示大图 
    old_form_show_pic();
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

  // return lists.length
}

// TODO: 和原来的 NEXUS TOOLS 合并一下.
console.log('------------------------ NEXUS TOOLS Without jQuery ------------------------');
// ---------------------------------------
// 内部函数
// ---------------------------------------
/**获取最小宽高比
 * @param {*} pic 图片
 * @param {*} container 容器
 * @returns 
 */
function getMinRatio(pic, container) {
  return Math.min(container.width / pic.width, container.height / pic.height)
}

/**获取图片位置
 * @param {*} event 鼠标事件对象
 * @param {*} imgEle 图片元素对象
 * @returns
 */
function previewPosition(falseEvent, imgEle) {
  // 获取图片的原始宽度和高度
  let imgWidth = imgEle.naturalWidth ?? 0;
  let imgHeight = imgEle.naturalHeight ?? 0;

  // 计算图片的宽高比
  let ratio = imgWidth / imgHeight;

  // 设置图片的偏移量, 初始为 10
  let offsetX = 0;
  let offsetY = 0;

  // 获取鼠标位置
  const mouseX = falseEvent.clientX;
  const mouseY = falseEvent.clientY;
  // 获取视口宽高
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 定义视口缓冲距离
  const borderY = 10
  const borderX = 10

  // 获取鼠标位置到视口上下左右的距离
  const distanceToTop = mouseY;
  const distanceToBottom = viewportHeight - mouseY;
  const distanceToLeft = mouseX;
  const distanceToRight = viewportWidth - mouseX;

  // 定义size对象
  const picSize = {
    width: imgWidth,
    height: imgHeight
  }
  const containerSize = {
    bot: {
      width: viewportWidth,
      height: distanceToBottom,
    },
    top: {
      width: viewportWidth,
      height: distanceToTop,
    },
    right: {
      width: distanceToRight,
      height: viewportHeight,
    },
    left: {
      width: distanceToLeft,
      height: viewportHeight,
    },
  }

  /**定义可容纳最大比例 */
  let maxRatio = 0
  /**定义可容纳最大比例的位置 */
  let maxPosition = ''

  for (const key in containerSize) {
    if (Object.hasOwnProperty.call(containerSize, key)) {
      const element = containerSize[key];
      if (getMinRatio(picSize, element) > maxRatio) {
        maxRatio = getMinRatio(picSize, element)
        maxPosition = key
      }
    }
  }

  // console.log(`最大的位置: ${maxPosition}  
  // top: ${getMinRatio(picSize, containerSize['top'])}  
  // bot: ${getMinRatio(picSize, containerSize['bot'])}  
  // left: ${getMinRatio(picSize, containerSize['left'])}  
  // right: ${getMinRatio(picSize, containerSize['right'])}
  // `);

  const result = {
    top: {
      left: 0,
      top: 0,
      width: viewportWidth + 'px',
      height: distanceToTop + 'px',
    },
    bot: {
      left: 0,
      top: distanceToTop + 'px',
      width: viewportWidth + 'px',
      height: distanceToBottom + 'px',
    },
    left: {
      left: 0,
      top: 0,
      width: distanceToLeft + 'px',
      height: viewportHeight + 'px',
    },
    right: {
      left: distanceToLeft + 'px',
      top: 0,
      width: distanceToRight + 'px',
      height: viewportHeight + 'px',
    },
    default: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    },
  }

  const container = maxPosition != '' ? result[maxPosition] : result['default']
  return container

  // console.log(
  //   '2_Bottom:', distanceToBottom,
  //   '2_Top:', distanceToTop,
  //   '2_Left:', distanceToLeft,
  //   '2_Right:', distanceToRight
  // )

  // return {
  //   left: falseEvent.pageX + position.offsetX,
  //   top: falseEvent.pageY + position.offsetY,
  //   width: position.imgWidth,
  //   height: position.imgHeight,
  // };

}

/**创建 kp_container 用以预览大图
 * @param {*} color 
 * @returns 
 */
function createKesaPreview(color) {
  const parent = document.createElement('div');
  parent.id = 'kp_container';
  parent.style.backgroundColor = color;
  parent.style.opacity = '1';
  parent.style.position = 'Fixed';
  parent.style.zIndex = '20000';
  parent.style.pointerEvents = 'none';
  parent.style.transition = 'all .3s';

  const img1 = document.createElement('img');
  img1.className = 'kp_img';
  img1.style.position = 'absolute';
  img1.style.zIndex = '20002';
  img1.style.pointerEvents = 'none';
  img1.style.width = '100%';
  img1.style.height = '100%';
  img1.style.objectFit = 'contain';
  parent.appendChild(img1);

  const img2 = document.createElement('img');
  img2.className = 'kp_img';
  img2.style.position = 'absolute';
  img2.style.zIndex = '20001';
  img2.style.pointerEvents = 'none';
  img2.style.width = '100%';
  img2.style.height = '100%';
  img2.style.objectFit = 'cover';
  img2.style.filter = 'blur(8px)';
  parent.appendChild(img2);

  return parent;
}

// ---------------------------------------
// 1. 大图预览 preview
// ---------------------------------------

// 判断是否有 #kp_container, 没有就新建一个
const existingContainer = document.getElementById('kp_container');
const kesa_preview = existingContainer ? existingContainer : createKesaPreview('');
// 将 kesa_preview 添加到body元素中
document.body.appendChild(kesa_preview);

/** timer 用来搞延迟加载图片的 */
const selector = ".preview_Origin";
let buffer = null;

function handleMouseOver(falseEvent, imgEle) {
  // NOTE: 全图悬浮 和 局部悬浮的 图像dom 判定
  // imgEle = e.target;
  // console.log(e);

  // NOTE: 加一个延迟, 让突然划过去的指针不被大图干扰


  // NOTE: 这里加了个判断是否开启触摸显示大图的 boolean
  let src = imgEle.getAttribute("src");
  if (src) {
    if (kesa_preview) {
      const kpImgElements = kesa_preview.querySelectorAll('.kp_img');
      kpImgElements.forEach(kpImg => {
        kpImg.setAttribute('src', src);
      });
    }
  }
  const cssPos = previewPosition(falseEvent, imgEle);
  kesa_preview.style.left = cssPos.left;
  kesa_preview.style.top = cssPos.top;
  kesa_preview.style.width = cssPos.width;
  kesa_preview.style.height = cssPos.height;
  kesa_preview.style.display = 'block';
}

function handleMouseOut() {
  kesa_preview.style.display = 'none';
}

function handleMouseMove(falseEvent, imgEle) {
  const cssPos = previewPosition(falseEvent, imgEle);
  kesa_preview.style.left = cssPos.left;
  kesa_preview.style.top = cssPos.top;
  kesa_preview.style.width = cssPos.width;
  kesa_preview.style.height = cssPos.height;
}

// NOTE: 悬浮大图触发方式
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