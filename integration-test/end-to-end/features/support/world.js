const {setWorldConstructor, setDefaultTimeout} = require('cucumber');
const {timeout, baseURL} = require('../../config');

function CustomWorld({attach, parameters}) {
  this.attach = attach
  this.parameters = parameters
  this.formToUrl = function (form) {
    return `${baseURL}/${form}`
  }
  setDefaultTimeout(timeout)
}

setWorldConstructor(CustomWorld)