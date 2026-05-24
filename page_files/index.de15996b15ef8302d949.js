
  window.addEventListener('load', function () {
    var urls = ["//r-h2.huaweistatic.com/s/gray/hwtalent/lst/uemConfig.js?_t=202508100815","//r-h2.huaweistatic.com/s/gray/hwtalent/lst/assets/js/outPage/index.ab0441451ccafe635373.js"];
    urls.forEach(function(e) {
      var script = document.createElement('script');
      script.attributes = 'defer';
      script.src = e;
      document.body.appendChild(script);
    });
  });