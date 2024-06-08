import { config as config_Kame } from "./kamept";
import { config as config_newMteam } from "./mteam";

/** 站点参数相关参数顶层对象 */
const sites = {
  "kamept.com": config_Kame,

  // 新 M-Team
  "kp.m-team.cc": config_newMteam,
  "xp.m-team.io": config_newMteam,
  "xp.m-team.cc": config_newMteam,
  "ap.m-team.cc": config_newMteam,

  // 新 M-Team 测试站
  "test2.m-team.cc": config_newMteam,
};

/** 获得当前PT站的名字 @returns 当前PT站名 */
export function getCurrentPtDomain() {
  return window.location.hostname;
}

/** 判断该页面是否存在种子列表
 * @returns selector
 */
let cache_selector;
export function GET_TORRENT_LIST_SELECTOR() {
  if (cache_selector) return cache_selector;

  const domain = getCurrentPtDomain();
  console.log("|-> 当前站点: ", domain);
  console.log("|-> 当前页面: ", window.location.pathname);

  const res = sites[domain]?.torrentListTable ?? null;
  console.log("|-> 站点selector:", res);
  cache_selector = res;
  return res;
}

/** NOTE: 获取站点架构: 主要应对新MT架构的
 * nexusPHP: SITE[domain]?.architecture = null
 */
export function GET_SITE_ARCHITECTURE() {
  const domain = getCurrentPtDomain();
  console.log("PT架构:\t", sites[domain]?.architecture);
  return sites[domain]?.architecture;
}

/**NOTE: 获取站点背景颜色 */
export function GET_SITE_BACKGROUND_COLOR() {
  const domain = getCurrentPtDomain();
  return sites[domain]?.get_bg_color();
}

export { sites as GLOBAL_SITE };
