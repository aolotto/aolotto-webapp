function getBrowserVersion(browserType, UserAgent) {
  let versions = '';

  switch (browserType) {
      case 'IE':
          versions = UserAgent.match(/(msie\s|trident.*rv:)([\w.]+)/)[2];
          break;
      case 'Chrome':
          for (let mt in navigator.mimeTypes) {
              //360 pc      
              if (navigator.mimeTypes[mt]['type'] == 'application/360softmgrplugin') {
                  browserType = '360';
              }
          }
          versions = UserAgent.match(/chrome\/([\d.]+)/)[1];
          break;

      case 'Firefox':
          versions = UserAgent.match(/firefox\/([\d.]+)/)[1];
          break;
      case 'Opera':
          versions = UserAgent.match(/opera\/([\d.]+)/)[1];
          break;
      case 'Safari':
          versions = UserAgent.match(/version\/([\d.]+)/)[1];
          break;
      case 'Edge':
          versions = UserAgent.match(/edge\/([\d.]+)/)[1];
          break;
      case 'QQBrowser':
          versions = UserAgent.match(/qqbrowser\/([\d.]+)/)[1];
          break;
  }

  return parseInt(versions);
}


function getBrowser() {
  const UserAgent = navigator.userAgent.toLowerCase();
  const browserInfo = {};

  const browserObj = {
      IE: window.ActiveXObject || "ActiveXObject" in window,
      Chrome: UserAgent.indexOf('chrome') > -1 && UserAgent.indexOf('safari') > -1,
      Firefox: UserAgent.indexOf('firefox') > -1,
      Opera: UserAgent.indexOf('opera') > -1,
      Safari: UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') == -1,
      Edge: UserAgent.indexOf('edge') > -1,
      QQBrowser: /qqbrowser/.test(UserAgent),
      WeixinBrowser: /MicroMessenger/i.test(UserAgent)
  };

  for (let key in browserObj) {
      if (browserObj.hasOwnProperty(key) && browserObj[key]) {
          browserInfo.browser = key;
          browserInfo.versions = getBrowserVersion(key, UserAgent);
          break
      }
  }

  return browserInfo;
}


// 比如vue3+elementPlus要求浏览器最低版本要求 Edge ≥ 79	Firefox ≥ 78 Chrome ≥ 64	Safari ≥ 12 
const browserList = [
  {
      browser: 'Edge',
      versions: 78
  },
  {
      browser: 'Firefox',
      versions: 120
  },
  {
      browser: 'Chrome',
      versions: 120
  },
  {
      browser: 'Safari',
      versions: 16
  }
]




export function isUpgradeBrowser() {
  const { browser, versions } = getBrowser()

  for (const objKey of browserList) {
      if (objKey.browser === browser && versions < objKey.versions) {
          // 需要升级
          return {
              browser,
              versions,
              lowestVersions: objKey.versions,
              isUpdate: true
          }
      }
  }

  // 默认不需要升级
  return {
      browser,
      versions,
      isUpdate: false
  }
}


