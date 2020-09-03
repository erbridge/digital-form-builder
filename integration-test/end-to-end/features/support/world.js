const {setWorldConstructor, setDefaultTimeout} = require('cucumber');
const {timeout, baseURL} = require('../../config');

class CustomWorld {
  constructor() {
    this.formToUrl = function (form) {
      return `${baseURL}/${form}`
    }
  }
}

setDefaultTimeout(timeout);
setWorldConstructor(CustomWorld);