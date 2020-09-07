const seleniumWebdriver = require('selenium-webdriver')
const { Before, After, Status } = require('cucumber')
const { browserCapabilities } = require('../../config')

Before(function () {
  return this.driver = new seleniumWebdriver
    .Builder()
    .withCapabilities(browserCapabilities)
    .build()
})

After(function () {
  return this.driver.quit()
})

After(function (testCase) {
  let world = this
  if (testCase.result.status === Status.FAILED) {
    return this.driver.takeScreenshot().then(function (screenshot) {
      return world.attach(screenshot, 'image/png')
    })
  }
})