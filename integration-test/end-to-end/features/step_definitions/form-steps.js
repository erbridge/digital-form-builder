const assert = require('cucumber-assert')
const { Given, When, Then } = require('cucumber')

Given('Form {string} is loaded', function (form, next) {
  this.driver.get(this.formToUrl(form)).then(next)
})

Then('Page {string} is loaded', function (expectedPage, next) {
  this.driver.getTitle().then(function (actualPage) {
    assert.equal(actualPage, expectedPage, 'Expected page (' + expectedPage + '). Actual page (' + actualPage + ').').then(next, next)
  })
})

When('YesNoField {string} is {string}', function (identifier, value, next) {
  this.driver.findElement({ xpath: `//input[@name='${identifier}' and @id=(//label[contains(.,'${value}')]/@for)]` }).click().then(next)
  //if (value == 'Yes') {
  //  this.driver.findElement({ id: identifier }).click().then(next)
  //} else if (value == 'No') {
  //  this.driver.findElement({ id: identifier + '-2' }).click().then(next)
  //}
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

When('CheckBox {string} is {string}', function (identifier, value, next) {
  let checkbox = this.driver.findElement({ id: identifier })
  checkbox.isSelected().then(selected => {
    if (value == 'Checked' && !selected) {
      checkbox.click().then(next)
    } else if (value == 'Unchecked' && selected) {
      checkbox.click().then(next)
    }
  })
})