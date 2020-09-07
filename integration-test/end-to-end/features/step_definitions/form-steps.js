const assert = require('cucumber-assert')
const { Given, When, Then } = require('cucumber')

Given('Form {string} is loaded', function (form, next) {
  this.driver.get(this.formToUrl(form)).then(next)
})

Then('Page {string} is loaded', function (expectedPage, next) {
  this.driver.getTitle().then(actualPage => {
    assert.equal(actualPage, expectedPage, 'Expected page (' + expectedPage + '). Actual page (' + actualPage + ').').then(next, next)
  })
})

Then('Confirmation status should be {string}', function (expectedStatus, next) {
  this.driver.findElement({ xpath: `//div[@class='govuk-panel govuk-panel--confirmation']/h1` }).getText().then(actualStatus => {
    assert.equal(actualStatus, expectedStatus, `Confirmation status should be ${expectedStatus}. Actual status ${actualStatus}.`).then(next, next)
  })
})

When('YesNoField {string} is {string}', function (identifier, value, next) {
  this.driver.findElement({ xpath: `//input[@name='${identifier}' and @id=(//label[contains(.,'${value}')]/@for)]` }).click().then(next)
})

When('Button {string} is clicked', function (identifier, next) {
  this.driver.findElement({ xpath: `//button[contains(.,'${identifier}')]` }).click().then(next)
})

When('SelectField {string} is {string}', function (identifier, value, next) {
  this.driver.findElement({ xpath: `//select[@id=(//label[contains(.,'${identifier}')]/@for)]` }).sendKeys(value).then(next)
})

When('TextField {string} is {string}', function (identifier, value, next) {
  this.driver.findElement({ xpath: `//input[@id=(//label[contains(.,'${identifier}')]/@for)]` }).sendKeys(value).then(next)
})

When('UkAddressField {string} is {string}', function (identifier, value, next) {
  this.driver.findElement({ xpath: `//input[@id=(//label[contains(.,'${identifier}')]/@for)]` }).sendKeys(value).then(next)
})

When('TelephoneNumberField {string} is {string}', function (identifier, value, next) {
  this.driver.findElement({ xpath: `//input[@id=(//label[contains(.,'${identifier}')]/@for)]` }).sendKeys(value).then(next)
})

When('EmailAddressField {string} is {string}', function (identifier, value, next) {
  this.driver.findElement({ xpath: `//input[@id=(//label[contains(.,'${identifier}')]/@for)]` }).sendKeys(value).then(next)
})

When('CheckboxesField {string} is {string}', function (identifier, value, next) {
  let checkbox = this.driver.findElement({ xpath: `//input[@id=(//label[contains(.,'${identifier}')]/@for)]` })
  checkbox.isSelected().then(selected => {
    if (value == 'Checked' && !selected) {
      checkbox.click().then(next)
    } else if (value == 'Unchecked' && selected) {
      checkbox.click().then(next)
    }
  })
})

Then('Summary item {string} should be {string}', function (identifier, expectedValue, next) {
  this.driver.findElement({ xpath: `//dt[contains(., '${identifier}')]/following-sibling::dd` }).getText().then(actualValue => {
    assert.equal(actualValue, expectedValue, `Summary item ${identifier} should be ${expectedValue}. Actual value ${actualValue}`).then(next, next)
  })
})