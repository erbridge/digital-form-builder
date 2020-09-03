require('chromedriver')
const seleniumWebdriver = require('selenium-webdriver');
const {Before, After} = require('cucumber');
const {browser} = require('../../config');

Before(function() {
  return this.driver = new seleniumWebdriver
    .Builder()
    .forBrowser(browser)
    .build();
});

After(function() {
  return this.driver.quit();
});