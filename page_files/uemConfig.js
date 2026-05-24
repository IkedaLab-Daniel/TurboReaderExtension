var env = 'beta';
var isPro = window.__global_isProd;
if (isPro) {
  env = 'pro';
}

var uemAppidObj = {
  LCMS: { beta: 'ab26adab010d4e26300c4f65c2c7ff0b', prod: 'd212a7d5ff7518a4c747702995982ada', },
  CAMS: { beta: 'b65cda68ead9c2fbd309a3a7f0b97397', prod: 'a192d49ca9102971738ef942da4bb9d5', },
  ECMS: { beta: 'e622387d179ccd5e13a8f8d023b6c7a7', prod: '7f2d8d98cc7257e7454c426b65a87596', },
  TMS: { beta: '432c94cbc06d6ba5fc43b95f24b184cc', prod: '24806436a9f8494a0a3b47651d301255', },
  UBMS: { beta: '74027d7ce29263f4095ae6e0536d2aca', prod: '603c13f89cc102e1c2e37fa147a7ab03', },
  getAppid(key) {
    const appObj = this[key] || this.UBMS;
    return isPro ? appObj.prod : appObj.beta;
  },
};

function getAppkeysFromAppIds() {
  var pathname = location.pathname;
  var isLCMS = pathname.includes('/development/');
  var isCAMS = pathname.includes('/activities/');
  var isTMS = pathname.includes('/alliance/');
  var isECMS = pathname.includes('/certification/');
  var isUBMS = pathname.includes('/backplatform/');
  if (isLCMS) {
    return uemAppidObj.getAppid('LCMS');
  }
  if (isCAMS) {
    return uemAppidObj.getAppid('CAMS');
  }
  if (isTMS) {
    return uemAppidObj.getAppid('TMS');
  }
  if (isECMS) {
    return uemAppidObj.getAppid('ECMS');
  }
  if (isUBMS) {
    return uemAppidObj.getAppid('UBMS');
  }
  return uemAppidObj.getAppid('UBMS');
}
/**
 * var env = "beta"; // 测试环境
 * var isPro = window.location.hostname === "his.huawei.com"; // 是否是生产环境的判断逻辑
 * if (isPro) {
 *   env = "pro"; // 生产环境
 * }
 * @description 以上获取环境变量的代码仅供参考，请以您的实际环境判断为准！
 */

// 埋码AppKey配置
var uemAppKeys = {
  edition: 'his', // 红版"his" || 蓝版"heds"
  env: env,
  appKeys: {
    beta: getAppkeysFromAppIds(), // 从UEM的beta环境获取的埋码Key
    pro: getAppkeysFromAppIds(), // 从UEM的生产环境获取的埋码Key
  },
};
// 采集器初始化
(function (w, d, u, n) {
  try {
    const conn = navigator.connection;
    const isSlow = performance && performance.timing && performance.timing.navigationStart && (new Date().getTime() -  performance.timing.navigationStart > 2000);
    if (isSlow || conn && (['slow-2g', '2g'].indexOf(conn.effectiveType) !== -1 || conn.downlink < 1)) { // 网络慢的场景不加载UEM
      return;
    }
    if (d.getElementById('uem_f')) {
      throw Error('请不要重复初始化UEM采集器');
    }
    u = JSON.parse(JSON.stringify(u));
    if (!w[n]) {
      w.GlobalHwaNamespace = w.GlobalHwaNamespace || [];
      w.GlobalHwaNamespace.push(n);
      w[n] = function () {
        (w[n].q = w[n].q || []).push(arguments);
      };
      w.trackerload = function () {
        (w[n].q = w[n].q && w[n].q.length ? w[n].q : []).unshift(arguments);
      };
      w[n].q = w[n].q || [];
    }
    var protocol, host, path, hostMap, hostArr, hostRoot;
    var fnHeds = function () {
      path = '/aiops/uem/agent';
      hostMap = u.tenant && u.tenant.webHost;
      hostArr = w.location.hostname.split('.');
      if (!hostMap && hostArr.length > 1) {
        hostRoot = hostArr.slice(-2).join('.');
        hostMap = { beta: 'console.heds-beta2.' + hostRoot, pro: 'console.heds.' + hostRoot, };
        u.tenant = u.tenant || {};
        u.tenant.webHost = hostMap;
      } else {
        hostMap = {};
      }
      host = hostMap[u.env] || '';
      if (!host) {
        throw Error('请配置UEM.tenant.webHost或者改为二级域名以上的环境');
      }
    };
    if (u.edition === 'heds') {
      fnHeds();
    } else if (u.platform === 'welink') {
      u.forceSecureTracker = true;
      path = '/dist';
      host = window.__global_currentSites.mcloud || '';
      w.hwahost = host + '/ProxyForText/hwa_trackload';
      host += '/fg/ProxyForDownLoad/hwa_f';
    } else {
      path = '/dist';
      host = window.__global_currentSites.hwa || '';
    }
    protocol = u.forceSecureTracker === true || w.location.protocol === 'https:' ? 'https://' : 'http://';
    w.aids = u;
    w.space = n;
    var ts = new Date().toJSON().split('T')[0];
    var script = d.createElement('script');
    script.id = 'uem_f';
    script.src = protocol + host + path + '/uem_f.js?_=' + ts;
    if (u.async !== false) {
      script.setAttribute('async', '1');
    }
    script.setAttribute('style', 'display:none;');
    var where =
      d.getElementsByTagName('head')[0].firstChild ||
      d.getElementsByTagName('head')[0].lastChild ||
      d.getElementsByTagName('script')[0];
    if (where) {
      where.parentNode.insertBefore(script, where);
    } else {
      d.getElementsByTagName('head')[0].appendChild(script);
    }
  } catch (e) {
    if (!w[n]) {
      w[n] = function () {
        return undefined;
      };
    }
  }
})(window, document, uemAppKeys, 'hwa');
