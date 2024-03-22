/**
 * 全局工具类函数~
 */

import { get } from 'svelte/store'
import { _show_nexus_pic, _trigger_nexus_pic, _delay_nexus_pic, _animated } from '../stores'

export { debounce, debounceImmediate, throttle, sortMasonry, NEXUS_TOOLS, parseLocalStorage }
/**瀑布流执行次数 */
const _SORT_COUNT = {
  /**外部呼叫函数次数 */
  Call: 0,
  /**函数实际执行次数 */
  Run: 0,
}
// NOTE: 1. 抽象工具-------------------------------
/** 防抖函数 -> 先不执行
 * @param {function} func 操作函数
 * @param {number} delay 延迟
 * @returns
 */
let timer = null;
function debounce(func, delay) {
  return function () {
    if (timer) {
      console.warn('debounce dupe!!!!!!');
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      func.apply(this, arguments);
      // console.log('防抖: ', func.name);
      timer = null;
    }, delay);
  };
}

/** 防抖函数 -> 立即执行
 * @param {function} func 操作函数
 * @param {number} delay 延迟
 * @returns
 */
function debounceImmediate(func, delay) {
  let timeout;
  return function () {
    const immediate = !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      // func.apply(this, arguments);
      timeout = null;
    }, delay);

    if (immediate) {
      func.apply(this, arguments);
    }
  };
}


/** 节流函数
 * @param {*} func 操作函数
 * @param {*} delay 延迟
 * @returns 
 */
function throttle(func, delay) {
  let timerId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastExecTime;

    if (!timerId && elapsedTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = currentTime;
        timerId = null;
      }, delay - elapsedTime);
    }
  };
}

// NOTE: 2. 瀑布流整理调用-------------------------------
/**设置节流 Masonry 执行体*/
const throttleSort = throttle(doSortMasonry, 1500);
const throttleSort_fast = throttle(doSortMasonry, 30);

/**实际执行整理 Masonry */
function doSortMasonry() {
  _SORT_COUNT.Run++
  // console.log(`实际执行次数: ${_time}`);
  console.log(`呼叫整理次数: ${_SORT_COUNT.Call}   实际整理次数: ${_SORT_COUNT.Run}`);
  masonry.layout()
}

/**外部呼叫整理 Masonry: 根据速度调整, 有动画和无动画是不一样的捏
 * @param {*} speed 速度
 */
function sortMasonry(speed = 'normal') {
  if (get(_animated)) {
    _SORT_COUNT.Call++
    if (masonry) {
      if (speed === 'fast') {
        throttleSort_fast()
      } else {
        throttleSort()
      }
    }
  }

  else {
    _SORT_COUNT.Call++
    if (masonry)
      doSortMasonry()
  }
}

// NOTE: 3. Nexus 工具(触摸预览 + 懒加载)-------------------------------
/**NEXUS 预览工具箱, 提供图片预览和图片懒加载, 个人修改版, 原生 js 无 jQuery*/
function NEXUS_TOOLS() {
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
  function previewPosition(event, imgEle) {
    // 获取图片的原始宽度和高度
    let imgWidth = imgEle.naturalWidth ?? 0;
    let imgHeight = imgEle.naturalHeight ?? 0;

    // 计算图片的宽高比
    let ratio = imgWidth / imgHeight;

    // 设置图片的偏移量, 初始为 10
    let offsetX = 0;
    let offsetY = 0;

    // 获取鼠标位置
    const mouseX = event.clientX;
    const mouseY = event.clientY;
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
    //   left: event.pageX + position.offsetX,
    //   top: event.pageY + position.offsetY,
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
  let imgEle;

  // 判断是否有 #kp_container, 没有就新建一个
  const existingContainer = document.getElementById('kp_container');
  const kesa_preview = existingContainer ? existingContainer : createKesaPreview('');
  // 将 kesa_preview 添加到body元素中
  document.body.appendChild(kesa_preview);


  /** timer 用来搞延迟加载图片的 */
  const selector = "img.preview_Kesa";
  let buffer = null;

  function handleMouseOver(e) {
    // NOTE: 全图悬浮 和 局部悬浮的 图像dom 判定
    imgEle = get(_trigger_nexus_pic) == 0 ? e.target : e.relatedTarget;
    // console.log(e);

    // NOTE: 加一个延迟, 让突然划过去的指针不被大图干扰
    buffer = setTimeout(() => {

      // NOTE: 这里加了个判断是否开启触摸显示大图的 boolean
      if (get(_show_nexus_pic)) {
        let src = imgEle.getAttribute("src");
        if (src) {
          if (kesa_preview) {
            const kpImgElements = kesa_preview.querySelectorAll('.kp_img');
            kpImgElements.forEach(kpImg => {
              kpImg.setAttribute('src', src);
            });
          }
        }
        const cssPos = previewPosition(e, imgEle);
        kesa_preview.style.left = cssPos.left;
        kesa_preview.style.top = cssPos.top;
        kesa_preview.style.width = cssPos.width;
        kesa_preview.style.height = cssPos.height;
        kesa_preview.style.display = 'block';
      }
    }, get(_delay_nexus_pic));
  }

  function handleMouseOut() {
    kesa_preview.style.display = 'none';
    if (buffer) clearTimeout(buffer);
  }

  function handleMouseMove(e) {
    const cssPos = previewPosition(e, imgEle);
    kesa_preview.style.left = cssPos.left;
    kesa_preview.style.top = cssPos.top;
    kesa_preview.style.width = cssPos.width;
    kesa_preview.style.height = cssPos.height;
  }

  // NOTE: 悬浮大图触发方式
  document.body.addEventListener("mouseover", function (e) {

    // 全图触发
    console.log(get(_trigger_nexus_pic));
    if (get(_trigger_nexus_pic) == 0) {
      // @ts-ignore
      if (e.target.matches(selector)) {
        // @ts-ignore
        handleMouseOver(e);
      }
    }

    // 局部触发
    if (get(_trigger_nexus_pic) == 1) {
      // @ts-ignore
      if (e.target.matches('div.hover-trigger')) {
        // @ts-ignore
        handleMouseOver(e);
        // console.log(e);
      }
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
      handleMouseMove(e);
    }
  });

  // ---------------------------------------
  // 2. 懒加载 lazy load
  // ---------------------------------------
  if ("IntersectionObserver" in window) {
    let imgList = [...document.querySelectorAll(".nexus-lazy-load_Kesa")];
    // console.log(imgList);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const intersectionRatio = entry.intersectionRatio;
        if (entry.isIntersecting && !el.classList.contains("preview_Kesa")
        ) {
          // 懒加载成功
          const source = el.dataset.src;
          el.src = source;
          el.classList.add("preview_Kesa");

          // 加载完图片后重新布局 Masonry
          // 这里是真实图片的加载
          sortMasonry();
        }
        // el.onload = el.onerror = () => io.unobserve(el);
      });
    });
    imgList.forEach((img) => io.observe(img));
  }
}

// NOTE: 4. 解析还原 localstorage 对象
const ls_test_list = {};
// window.ls_test_list = ls_test_list;

// 
/**从 localStorage 中原数据对象 
 * 'persist:persist' & 'persist:torrent'
 * @param {*} key localStorage 的 item_key 值
 */
function parseLocalStorage(key) {
  const storage = localStorage.getItem(key);

  if (storage) {
    try {
      // 缓存读取: 本地 localstorage 文本缓存和对象缓存
      if (ls_test_list[key]) {
        if (storage === ls_test_list[key].string) {
          console.log('%c====> 读取 localstorage 缓存成功~', 'color: green;');
          return ls_test_list[key].object
        }
        else {
          console.log('%c====> 更新 localstorage 缓存~', 'color: orange;');
          // console.log('对比前后 localstorage :\t', storage === ls_test_list[key].string);
          // console.log(ls_test_list[key].timestamp);

          // console.log(storage);
          // console.log(ls_test_list[key].string);
        }
      }
      else {
        // 没有时初始化
        ls_test_list[key] = {}
      }

      // 尝试解析值为 JSON
      const parsedValue = JSON.parse(storage);

      // 检查是否解析成功且是一个对象
      if (typeof parsedValue === 'object' && parsedValue !== null) {
        // 遍历对象的属性
        for (const key in parsedValue) {
          if (Object.hasOwnProperty.call(parsedValue, key)) {
            const value = parsedValue[key];

            // 检查值是否是被字符串化后的对象
            if (typeof value === 'string') {
              // if (typeof value === 'string' && value.includes('\\{') && value.includes('\\}')) {
              try {
                const parsedObject = JSON.parse(value);
                parsedValue[key] = parsedObject;
              } catch (error) {
                // 忽略解析错误
              }
            }
          }
        }

        // DEBUG: 对比 缓存 和 ls 的数据
        // if (ls_test_list[key]) {
        // console.log(ls_test_list[key].object);
        // console.log(parsedValue);
        // }

        // 缓存写入: localstorage 文本缓存和对象缓存
        ls_test_list[key].string = storage
        ls_test_list[key].object = parsedValue
        ls_test_list[key].timestamp = new Date().getTime();

        // 此时 parsedValue 包含了还原后的对象，包括那些被字符串化的对象
        // console.log('还原后的对象:', parsedValue);
        return parsedValue;
      } else {
        console.error('localStorage 中的值不是一个对象');
      }
    } catch (error) {
      console.error('无法解析 localStorage 中的值为 JSON:', error);
    }
  } else {
    console.error(`localStorage 中不存在 key 为 ${key} 的值, 可能是本站 api 改变了`);
  }
}

window.parseLocalStorage = parseLocalStorage;