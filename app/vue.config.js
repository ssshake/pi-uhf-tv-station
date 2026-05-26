module.exports = {
  pwa: {
    name: 'Pi TV Remote',
    short_name: 'Pi TV',
    themeColor: '#676f96',
    msTileColor: '#18191c',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    manifestOptions: {
      description: 'Remote control for Pi UHF TV Station',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#d4d4d4',
      start_url: '.',
      scope: '.',
    },
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png',
      androidChrome192: 'img/icons/android-chrome-192x192.png',
      androidChrome512: 'img/icons/android-chrome-512x512.png',
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },
};
