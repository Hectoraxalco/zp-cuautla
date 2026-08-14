(function () {
  var HOSTNAMES_PRODUCCION = ['zpcuautla.com.mx'];
  if (HOSTNAMES_PRODUCCION.indexOf(location.hostname) === -1) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', 'G-R8CPSSXHQD');

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-R8CPSSXHQD';
  document.head.appendChild(script);
})();
