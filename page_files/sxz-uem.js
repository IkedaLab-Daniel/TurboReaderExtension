var env = "pro";

/**
 * var env = "beta"; // 测试环境
 * var isPro = window.location.hostname === "console.heds.huawei.com"; // 是否是生产环境的判断逻辑
 * if (isPro) {
 *   env = "pro"; // 生产环境
 * }
 * @description 以上获取环境变量的代码仅供参考，请以您的实际环境判断为准！
 */

// 埋码AppKey配置
var uemAppKeys = {
  edition: "heds", // 蓝版"heds" || 红版"his"
  env: env, //环境变量
  appKeys: {
    beta: "", //从UEM的beta环境获取的埋码Key
    pro: "3b52a08735269da5ae213abf101fd9b6" //从UEM的生产环境获取的埋码Key
  },
  enterpriseId: "88888888888888888888888888888888",
  tenant: {
    webHost: {
      beta: "console.heds-beta2.huawei.com",
      pro: "console.horiz.huawei.com"
    }
  } // 租户地址
};

// 采集器初始化
// 采集器初始化
(function (w, d, u, n) {
  try {
    if (d.getElementById("uem_f")) {
      throw Error("请不要重复初始化UEM采集器");
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
      path = "/aiops/uem/agent";
      hostMap = u.tenant && u.tenant.webHost;
      hostArr = w.location.hostname.split(".");
      if (!hostMap && hostArr.length > 1) {
        hostRoot = hostArr.slice(-2).join(".");
        hostMap = {
          beta: "console.heds-beta2." + hostRoot,
          pro: "console.heds." + hostRoot
        };
      }
      hostMap = hostMap || {};
      u.tenant = u.tenant || {};
      u.tenant.webHost = hostMap;
      host = hostMap[u.env] || "";
      if (!host) {
        throw Error("请配置UEM.tenant.webHost或者将网站改为二级域名以上的环境");
      }
    };
    if (u.edition === "heds") {
      fnHeds();
    } else if (u.platform === "welink") {
      path = "/dist";
      hostMap = {
        beta: "mcloud-uat.huawei.com/mcloud/mag",
        pro: "w3m.huawei.com/mcloud/mag"
      };
      host = hostMap[u.env] || "";
      w.hwahost = host + "/ProxyForText/hwa_trackload";
      host += "/fg/ProxyForDownLoad/hwa_f";
    } else {
      path = "/dist";
      hostMap = {
        beta: "hwa-beta.his.huawei.com",
        pro: "hwa.his.huawei.com"
      };
      host = hostMap[u.env] || "";
    }
    if (u.forceSecureTracker !== false) {
      u.forceSecureTracker = true;
    }
    protocol =
      u.forceSecureTracker === true || w.location.protocol === "https:"
        ? "https://"
        : "http://";
    w.aids = u;
    w.space = n;
    var ts = new Date().toJSON().split("T")[0];
    var script = d.createElement("script");
    script.id = "uem_f";
    script.src = protocol + host + path + "/uem_f.js?_=" + ts;
    if (u.async !== false) {
      script.setAttribute("async", "1");
    }
    script.setAttribute("style", "display:none;");
    var where =
      d.getElementsByTagName("head")[0].firstChild ||
      d.getElementsByTagName("head")[0].lastChild ||
      d.getElementsByTagName("script")[0];
    if (where) {
      where.parentNode.insertBefore(script, where);
    } else {
      d.getElementsByTagName("head")[0].appendChild(script);
    }
  } catch (e) {
    if (!w[n]) {
      w[n] = function () {
        return undefined;
      };
    }
  }
})(window, document, uemAppKeys, "hwa");