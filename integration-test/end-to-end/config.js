const chromedriver = require('chromedriver')

module.exports = {
  timeout: 10000,
  baseURL: 'http://localhost:3009',
  browser: 'chrome',
  browserCapabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        'headless',
        'window-size=1440,900',
        'disable-gpu'
      ]
    },
    javascriptEnabled: true,
    acceptSslCerts: true,
    path: chromedriver.path
  }
};