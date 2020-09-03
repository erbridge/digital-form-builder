const assert = require('cucumber-assert')
const { Given, When, Then } = require('cucumber')

Given('form is loaded {string}', function (form, next) {
  this.driver.get(this.formToUrl(form)).then(next)
})

Then('page loaded is {string}', function (expectedPage, next) {
  this.driver.getTitle().then(function (actualPage) {
    assert.equal(actualPage, expectedPage, 'Expected page (' + expectedPage + '). Actual page (' + actualPage + ').').then(next, next)
  })
})

When('YesNoField {string} is {string}', function (identifier, value, next) {
  if (value == 'Yes') {
    this.driver.findElement({ id: identifier }).click().then(next)
  } else {
    this.driver.findElement({ id: identifier + '-2' }).click().then(next)
  }
})

When('Button {string} is pressed', function (identifier, next) {
  this.driver.findElement({ id: identifier }).click().then(next)
})

When('SelectField {string} is {string}', function (identifier, value, next) {
  this.driver.findElement({ id: identifier }).sendKeys(value).then(next)
});

When('TextField {string} is {string}', function (identifier, value, next) {
  this.driver.findElement({ id: identifier }).sendKeys(value).then(next)
});