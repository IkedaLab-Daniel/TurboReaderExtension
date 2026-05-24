// 获取url地址中的某个字段的值
function getUrl(name, url) {
  url = url || window.location.search;
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = url.substr(1).match(reg);
  if (r !== null) {
    return r[2];
  }
  return null;
}
const isShow = getUrl('headershow');
if (isShow == 'true') {
  const stylee = document.createElement('style');
  const styles = document.createElement('style');
  const sHtml = '::-webkit-scrollbar {display: none;}';
  const hHtml = ' #KLT-header {display: none !important;}';
  stylee.innerHTML = sHtml;
  styles.innerHTML = hHtml;
  document.getElementsByTagName('head').item(0).appendChild(stylee);
  const headerEl = document.getElementById('KLT-header');
  headerEl && headerEl.appendChild(styles);
}

// 解决课程学习页刷新页面头部闪现的问题
if (location.pathname.includes('course-learn') || location.pathname.includes('application-learn')) {
  const headerEl = document.getElementById('KLT-header');
  const footerEl = document.getElementById('KLT-footer');
  headerEl && (headerEl.style.display = 'none');
  footerEl && (footerEl.style.display = 'none');
}
